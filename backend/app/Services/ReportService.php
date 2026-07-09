<?php

namespace App\Services;

use App\Models\Job;
use App\Models\JobStage;
use App\Models\Application;
use App\Models\Announcement;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\SimpleType\JcTable;
use PhpOffice\PhpWord\Style\Font;

class ReportService
{
    /**
     * Get jobs eligible for announcements.
     */
    public function getEligibleJobs()
    {
        $now = now();
        return Job::with(['stages'])
            ->withCount(['applications' => function ($q) {
                $q->withoutGlobalScopes();
            }])
            ->get()
            ->filter(function($job) use ($now) {
                return $this->isJobEligible($job);
            })->values();
    }

    /**
     * Build an editable Word (.docx) document listing every applicant for a job —
     * name, NIK, email, score per stage, weighted final score, and final status —
     * sorted by highest final score first. Intended as a downloadable draft that
     * an admin edits outside the system before uploading the final version as the
     * job's official final-results announcement.
     */
    public function generateFinalAnnouncementWord(Job $job): PhpWord
    {
        $job->loadMissing('stages');
        $stages = $job->stages->sortBy('stage_order')->values();

        $applications = Application::with(['user', 'stageResults', 'job.stages'])
            ->where('job_id', $job->id)
            ->get()
            ->sortByDesc('calculated_final_score')
            ->values();

        $phpWord = new PhpWord();
        $phpWord->setDefaultFontName('Arial');
        $phpWord->setDefaultFontSize(10);

        $section = $phpWord->addSection();

        $section->addText('LAPORAN HASIL AKHIR SELEKSI REKRUTMEN', ['bold' => true, 'size' => 14, 'color' => '0D278D'], ['alignment' => 'center']);
        $section->addText($job->title, ['bold' => true, 'size' => 12], ['alignment' => 'center', 'spaceAfter' => 0]);
        $section->addText('Unit Kerja: ' . ($job->unit_kerja ?? '-'), ['size' => 9, 'color' => '6b7280'], ['alignment' => 'center']);
        $section->addTextBreak(1);

        $tableStyle = [
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 80,
            'alignment' => JcTable::CENTER,
        ];
        $headerCellStyle = ['bgColor' => '0D278D'];
        $headerFontStyle = ['bold' => true, 'color' => 'FFFFFF', 'size' => 8];
        $cellFontStyle = ['size' => 9];

        $phpWord->addTableStyle('ApplicantsTable', $tableStyle);
        $table = $section->addTable('ApplicantsTable');

        $table->addRow();
        $table->addCell(400, $headerCellStyle)->addText('No', $headerFontStyle);
        $table->addCell(2200, $headerCellStyle)->addText('Nama Pelamar', $headerFontStyle);
        $table->addCell(1800, $headerCellStyle)->addText('NIK', $headerFontStyle);
        $table->addCell(2400, $headerCellStyle)->addText('Email', $headerFontStyle);
        foreach ($stages as $stage) {
            $table->addCell(1000, $headerCellStyle)->addText($stage->name, $headerFontStyle);
        }
        $table->addCell(1000, $headerCellStyle)->addText('Skor Akhir', $headerFontStyle);
        $table->addCell(1200, $headerCellStyle)->addText('Status', $headerFontStyle);

        foreach ($applications as $i => $app) {
            $table->addRow();
            $table->addCell(400)->addText((string) ($i + 1), $cellFontStyle);
            $table->addCell(2200)->addText($app->user->name ?? '-', $cellFontStyle);
            $table->addCell(1800)->addText($app->user->nik ?? '-', $cellFontStyle);
            $table->addCell(2400)->addText($app->user->email ?? '-', $cellFontStyle);
            foreach ($stages as $stage) {
                $result = $app->stageResults->firstWhere('job_stage_id', $stage->id);
                $table->addCell(1000)->addText($result ? ($result->score ?? '-') : '-', $cellFontStyle);
            }
            $table->addCell(1000)->addText((string) ($app->calculated_final_score ?? '-'), $cellFontStyle);
            $table->addCell(1200)->addText(ucfirst($app->status), $cellFontStyle);
        }

        $section->addTextBreak(2);
        $section->addText(
            'Dokumen ini adalah draf yang digenerate otomatis oleh sistem rekrutmen KITP untuk diedit oleh admin '
            . 'sebelum diunggah kembali sebagai pengumuman hasil akhir resmi.',
            ['italic' => true, 'size' => 8, 'color' => '6b7280']
        );

        $section->addTextBreak(2);
        $section->addText('Bandar Lampung, ' . now()->translatedFormat('d F Y'), ['size' => 9], ['alignment' => 'right']);
        $section->addText('Perekrut / Ketua Tim Seleksi', ['size' => 9], ['alignment' => 'right']);
        $section->addTextBreak(2);
        $section->addText($job->recruiter_name ?? '( ................................ )', ['bold' => true, 'size' => 9, 'underline' => Font::UNDERLINE_SINGLE], ['alignment' => 'right']);

        return $phpWord;
    }

    /**
     * Create a manual announcement.
     */
    public function createAnnouncement(Job $job, array $data)
    {
        if ($job->announcements->count() > 0) {
            throw new \Exception('Pengumuman untuk lowongan ini sudah diterbitkan dan tidak dapat diubah.', 422);
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
     * Generate a PDF listing everyone who reached a given stage, their NIK,
     * their score for that stage, and their status — sorted by highest score first.
     */
    public function generateStagePdf(JobStage $stage)
    {
        $applications = Application::with(['user', 'stageResults' => function ($q) use ($stage) {
                $q->where('job_stage_id', $stage->id);
            }])
            ->where('job_id', $stage->job_id)
            ->get()
            ->filter(function ($app) use ($stage) {
                return $app->stageResults->contains('job_stage_id', $stage->id);
            })
            ->sortByDesc(function ($app) use ($stage) {
                $result = $app->stageResults->firstWhere('job_stage_id', $stage->id);
                return $result ? ($result->score ?? 0) : 0;
            })
            ->values();

        return Pdf::loadView('reports.stage-pdf', [
            'job' => $stage->job,
            'stage' => $stage,
            'applications' => $applications,
            'report_title' => 'HASIL TAHAPAN ' . strtoupper($stage->name),
        ])->setPaper('a4', 'portrait');
    }

    /**
     * A stage's grading window has closed once its grading_end_date
     * (or end_date as fallback) has passed.
     */
    public function isStageGradingClosed(JobStage $stage): bool
    {
        $deadline = $stage->grading_end_date ?? $stage->end_date;
        return $deadline && $deadline->isPast();
    }

    /**
     * Auto-publish a per-stage results announcement once grading for that
     * stage has closed. Idempotent: does nothing if already published.
     */
    public function publishStageAnnouncement(JobStage $stage)
    {
        if (Announcement::where('job_stage_id', $stage->id)->exists()) {
            throw new \Exception('Pengumuman untuk tahapan ini sudah diterbitkan.', 422);
        }

        if (!$this->isStageGradingClosed($stage)) {
            throw new \Exception('Pengumuman tahapan hanya dapat diterbitkan setelah masa penilaian tahapan berakhir.', 422);
        }

        $pdf = $this->generateStagePdf($stage);

        $job = $stage->job;
        $filename = 'hasil-tahap-' . str_replace(' ', '-', strtolower($stage->name)) . '-'
            . str_replace(' ', '-', strtolower($job->title)) . '-' . time() . '.pdf';
        $path = 'announcements/' . $filename;
        Storage::disk('public')->put($path, $pdf->output());

        return Announcement::create([
            'job_id' => $job->id,
            'job_stage_id' => $stage->id,
            'title' => 'Hasil Tahapan ' . $stage->name . ' - ' . $job->title,
            'file_path' => $path,
            'published_at' => now(),
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
