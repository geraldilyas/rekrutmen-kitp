<?php

namespace App\Services;

use App\Models\Job;
use App\Models\Application;
use App\Models\Announcement;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReportService
{
    /**
     * Get jobs eligible for announcements.
     */
    public function getEligibleJobs()
    {
        $now = now();
        return Job::with(['stages'])
            ->withCount('applications')
            ->get()
            ->filter(function($job) use ($now) {
                return $this->isJobEligible($job);
            })->values();
    }

    /**
     * Generate PDF for applications.
     */
    public function generateApplicationsPdf(Job $job, bool $passedOnly = false)
    {
        $query = Application::with(['user', 'stageResults', 'job.stages'])->where('job_id', $job->id);

        if ($passedOnly) {
            $query->where('status', 'Lulus');
            $title = "DAFTAR PESERTA LULUS SELEKSI AKHIR";
        } else {
            $title = "LAPORAN HASIL SELEKSI REKRUTMEN";
        }

        $applications = $query->get()->sortByDesc('calculated_final_score')->values();

        return Pdf::loadView('reports.applications-pdf', [
            'job' => $job,
            'applications' => $applications,
            'report_title' => $title
        ]);
    }

    /**
     * Create a manual announcement.
     */
    public function createAnnouncement(Job $job, array $data)
    {
        if ($job->announcements->count() > 0) {
            throw new \Exception('Pengumuman untuk lowongan ini sudah diterbitkan dan tidak dapat diubah.', 422);
        }

        if (!$this->isJobEligible($job)) {
            throw new \Exception('Pengumuman hanya dapat diterbitkan setelah lowongan melewati deadline dan seluruh tahapan seleksi berakhir.', 422);
        }

        $path = $data['file']->store('announcements', 'public');

        return Announcement::create([
            'job_id' => $job->id,
            'title' => $data['title'],
            'file_path' => $path,
            'published_at' => now()
        ]);
    }

    /**
     * Auto-publish passed results as an announcement.
     */
    public function publishPassedResults(Job $job)
    {
        if ($job->announcements->count() > 0) {
            throw new \Exception('Pengumuman untuk lowongan ini sudah diterbitkan dan tidak dapat diubah.', 422);
        }

        if (!$this->isJobEligible($job)) {
            throw new \Exception('Pengumuman hanya dapat diterbitkan setelah lowongan melewati deadline dan seluruh tahapan seleksi berakhir.', 422);
        }

        $pdf = $this->generateApplicationsPdf($job, true);

        $filename = 'hasil-seleksi-' . str_replace(' ', '-', strtolower($job->title)) . '-' . time() . '.pdf';
        $path = 'announcements/' . $filename;
        Storage::disk('public')->put($path, $pdf->output());

        return Announcement::create([
            'job_id' => $job->id,
            'title' => 'Hasil Akhir Seleksi - ' . $job->title,
            'file_path' => $path,
            'published_at' => now()
        ]);
    }

    /**
     * Check if job is past deadline and final stage.
     */
    public function isJobEligible(Job $job)
    {
        $isPastDeadline = $job->deadline && $job->deadline->isPast();
        $lastStage = $job->stages->sortByDesc('stage_order')->first();
        $isPastFinalStage = $lastStage && $lastStage->end_date && $lastStage->end_date->isPast();
        return $isPastDeadline && $isPastFinalStage;
    }
}
