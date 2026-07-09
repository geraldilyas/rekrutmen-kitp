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
        $allApplications = Application::with(['user', 'stageResults', 'job.stages'])
            ->where('job_id', $job->id)
            ->get()
            ->sortByDesc('calculated_final_score')
            ->values();

        if ($passedOnly) {
            $applications = $allApplications->filter(function($app) {
                return strtolower($app->status) === 'lulus';
            })->values();
            $title = "DAFTAR PESERTA LULUS SELEKSI AKHIR";
        } else {
            $applications = $allApplications;
            $title = "LAPORAN HASIL SELEKSI REKRUTMEN";
        }

        // Gunakan template khusus untuk laporan seleksi akhir (combine per-tahapan + rekap akhir)
        $view = $passedOnly ? 'reports.seleksi-akhir-pdf' : 'reports.applications-pdf';

        return Pdf::loadView($view, [
            'job' => $job,
            'applications' => $applications,
            'all_applications' => $allApplications,
            'report_title' => $title
        ])->setPaper('a4', 'portrait');
    }

    /**
     * Create a manual announcement.
     */
    public function createAnnouncement(Job $job, array $data)
    {
        if ($job->announcements->count() > 0) {
            throw new \Exception('Pengumuman untuk lowongan ini sudah diterbitkan dan tidak dapat diubah.', 422);
        }

        if ($job->selection_status !== 'selesai') {
            throw new \Exception('Pengumuman hanya dapat diterbitkan setelah proses seleksi dinyatakan selesai oleh Admin (klik tombol Selesai terlebih dahulu).', 422);
        }

        $path = $data['file']->store('announcements', 'public');

        $announcement = Announcement::create([
            'job_id' => $job->id,
            'title' => $data['title'],
            'file_path' => $path,
            'published_at' => now()
        ]);

        // 🚀 Pemicu Penentuan Kelulusan Akhir & Notifikasi Email ke Semua Pelamar
        $applicationService = app(\App\Services\ApplicationService::class);
        $applicationService->resolveJobQuota($job->id);

        return $announcement;
    }

    /**
     * Auto-publish passed results as an announcement.
     */
    public function publishPassedResults(Job $job)
    {
        if ($job->announcements->count() > 0) {
            throw new \Exception('Pengumuman untuk lowongan ini sudah diterbitkan dan tidak dapat diubah.', 422);
        }

        if ($job->selection_status !== 'selesai') {
            throw new \Exception('Pengumuman hanya dapat diterbitkan setelah proses seleksi dinyatakan selesai oleh Admin (klik tombol Selesai terlebih dahulu).', 422);
        }

        // Jalankan penentuan kelulusan kuota & kirim email terlebih dahulu agar status terupdate menjadi Lulus sebelum PDF di-generate
        $applicationService = app(\App\Services\ApplicationService::class);
        $applicationService->resolveJobQuota($job->id);

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
     * Mark selection process as complete for a job.
     */
    public function completeSelection(Job $job)
    {
        if ($job->selection_status === 'selesai') {
            throw new \Exception('Proses seleksi lowongan ini sudah dinyatakan selesai sebelumnya.', 422);
        }

        if (!$job->selection_ready) {
            throw new \Exception('Proses seleksi belum dapat diselesaikan karena masih ada pelamar yang belum dinilai pada tahapan seleksi.', 422);
        }

        $job->update([
            'selection_status' => 'selesai'
        ]);

        return $job;
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
