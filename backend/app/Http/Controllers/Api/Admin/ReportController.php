<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Application;
use App\Models\Announcement;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ApplicationsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * List jobs that have passed their deadline (closed) and final stage.
     */
    public function closedJobs()
    {
        $now = now();
        $jobs = Job::with(['stages'])
            ->withCount('applications')
            ->get()
            ->filter(function($job) use ($now) {
                // Must be past deadline
                $isPastDeadline = $job->deadline && $job->deadline->isPast();
                
                // Must be past final stage end date
                $lastStage = $job->stages->sortByDesc('stage_order')->first();
                $isPastFinalStage = $lastStage && $lastStage->end_date && $lastStage->end_date->isPast();

                return $isPastDeadline && $isPastFinalStage;
            })->values();

        return response()->json([
            'message' => 'Jobs eligible for announcement retrieved successfully',
            'data' => $jobs
        ]);
    }

    /**
     * Export applications for a specific job as Excel.
     */
    public function exportExcel(Request $request, $job_id)
    {
        $job = Job::findOrFail($job_id);
        $status = $request->has('passed_only') ? 'Lulus' : null;
        $suffix = $status ? '-lulus' : '';
        
        $filename = 'pelamar-' . str_replace(' ', '-', strtolower($job->title)) . '-' . date('Y-m-d') . $suffix . '.xlsx';

        return Excel::download(new ApplicationsExport($job_id, $status), $filename);
    }

    /**
     * Export applications for a specific job as PDF.
     */
    public function exportPdf(Request $request, $job_id)
    {
        $job = Job::with('stages')->findOrFail($job_id);
        $query = Application::with(['user', 'stageResults'])->where('job_id', $job_id);

        if ($request->has('passed_only')) {
            $query->where('status', 'Lulus');
            $title = "DAFTAR PESERTA LULUS SELEKSI AKHIR";
        } else {
            $title = "LAPORAN HASIL SELEKSI REKRUTMEN";
        }

        $applications = $query->get()->map(function($app) use ($job) {
            $totalScore = 0;
            foreach ($job->stages as $stage) {
                $result = $app->stageResults->where('job_stage_id', $stage->id)->first();
                $score = $result ? ($result->score ?? 0) : 0;
                $totalScore += ($score * $stage->weight) / 100;
            }
            $app->calculated_final_score = round($totalScore, 2);
            return $app;
        })->sortByDesc('calculated_final_score')->values();

        $pdf = Pdf::loadView('reports.applications-pdf', [
            'job' => $job,
            'applications' => $applications,
            'report_title' => $title
        ]);

        $filename = 'laporan-pelamar-' . str_replace(' ', '-', strtolower($job->title)) . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Create an announcement manually (Upload file).
     */
    public function createAnnouncement(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,xlsx,xls,doc,docx|max:5120',
        ]);

        $job = Job::with(['stages', 'announcements'])->findOrFail($request->job_id);
        
        if ($job->announcements->count() > 0) {
            return response()->json([
                'message' => 'Pengumuman untuk lowongan ini sudah diterbitkan dan tidak dapat diubah.'
            ], 422);
        }

        if (!$this->isJobEligible($job)) {
            return response()->json([
                'message' => 'Pengumuman hanya dapat diterbitkan setelah lowongan melewati deadline dan seluruh tahapan seleksi berakhir.'
            ], 422);
        }

        $path = $request->file('file')->store('announcements', 'public');

        $announcement = Announcement::create([
            'job_id' => $request->job_id,
            'title' => $request->title,
            'file_path' => $path,
            'published_at' => now()
        ]);

        return response()->json(['message' => 'Pengumuman berhasil diterbitkan', 'data' => $announcement], 201);
    }

    /**
     * Auto-generate and publish the passed participants PDF as an announcement.
     */
    public function publishPassedResults(Request $request, $job_id)
    {
        $job = Job::with(['stages', 'announcements'])->findOrFail($job_id);
        
        if ($job->announcements->count() > 0) {
            return response()->json([
                'message' => 'Pengumuman untuk lowongan ini sudah diterbitkan dan tidak dapat diubah.'
            ], 422);
        }

        if (!$this->isJobEligible($job)) {
            return response()->json([
                'message' => 'Pengumuman hanya dapat diterbitkan setelah lowongan melewati deadline dan seluruh tahapan seleksi berakhir.'
            ], 422);
        }

        // Generate PDF Content (Passed only, Ranked)
        $applications = Application::with(['user', 'stageResults'])
            ->where('job_id', $job_id)
            ->where('status', 'Lulus')
            ->get()
            ->map(function($app) use ($job) {
                $totalScore = 0;
                foreach ($job->stages as $stage) {
                    $result = $app->stageResults->where('job_stage_id', $stage->id)->first();
                    $score = $result ? ($result->score ?? 0) : 0;
                    $totalScore += ($score * $stage->weight) / 100;
                }
                $app->calculated_final_score = round($totalScore, 2);
                return $app;
            })->sortByDesc('calculated_final_score')->values();

        $pdf = Pdf::loadView('reports.applications-pdf', [
            'job' => $job,
            'applications' => $applications,
            'report_title' => "DAFTAR PESERTA LULUS SELEKSI AKHIR"
        ]);

        $filename = 'hasil-seleksi-' . str_replace(' ', '-', strtolower($job->title)) . '-' . time() . '.pdf';
        $path = 'announcements/' . $filename;
        Storage::disk('public')->put($path, $pdf->output());

        $announcement = Announcement::create([
            'job_id' => $job_id,
            'title' => 'Hasil Akhir Seleksi - ' . $job->title,
            'file_path' => $path,
            'published_at' => now()
        ]);

        return response()->json(['message' => 'Pengumuman hasil seleksi berhasil diterbitkan secara otomatis.', 'data' => $announcement], 201);
    }

    /**
     * Get announcements for a job.
     */
    public function getAnnouncements($job_id)
    {
        $announcements = Announcement::where('job_id', $job_id)->get();
        return response()->json(['data' => $announcements]);
    }

    /**
     * Helper: Check if job is past deadline and final stage.
     */
    private function isJobEligible($job)
    {
        $isPastDeadline = $job->deadline && $job->deadline->isPast();
        $lastStage = $job->stages->sortByDesc('stage_order')->first();
        $isPastFinalStage = $lastStage && $lastStage->end_date && $lastStage->end_date->isPast();
        return $isPastDeadline && $isPastFinalStage;
    }
}
