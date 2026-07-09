<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Announcement;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ApplicationsExport;
use Illuminate\Http\Request;
use App\Services\ReportService;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * List jobs that have passed their deadline (closed) and final stage.
     */
    public function closedJobs()
    {
        $jobs = $this->reportService->getEligibleJobs();

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
        $pdf = $this->reportService->generateApplicationsPdf($job, $request->has('passed_only'));

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

        try {
            $announcement = $this->reportService->createAnnouncement($job, $request->all());
            return response()->json(['message' => 'Pengumuman berhasil diterbitkan', 'data' => $announcement], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Auto-generate and publish the passed participants PDF as an announcement.
     */
    public function publishPassedResults(Request $request, $job_id)
    {
        $job = Job::with(['stages', 'announcements'])->findOrFail($job_id);

        try {
            $announcement = $this->reportService->publishPassedResults($job);
            return response()->json(['message' => 'Pengumuman hasil seleksi berhasil diterbitkan secara otomatis.', 'data' => $announcement], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
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
     * Mark selection process as completed.
     */
    public function completeSelection($job_id)
    {
        $job = Job::with('stages')->findOrFail($job_id);

        try {
            $updatedJob = $this->reportService->completeSelection($job);
            return response()->json([
                'message' => 'Proses seleksi berhasil dinyatakan selesai.',
                'data' => $updatedJob
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}

