<?php

namespace App\Console\Commands;

use App\Models\Announcement;
use App\Models\JobStage;
use App\Services\ReportService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PublishStageAnnouncements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:publish-stage-announcements';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Terbitkan otomatis pengumuman PDF hasil setiap tahapan seleksi (berisi NIK, skor, dan status peserta, diurutkan skor tertinggi) begitu masa penilaian tahapan tersebut berakhir.';

    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        parent::__construct();
        $this->reportService = $reportService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();

        $publishedStageIds = Announcement::whereNotNull('job_stage_id')->pluck('job_stage_id');

        $dueStages = JobStage::whereNotIn('id', $publishedStageIds)
            ->where(function ($q) use ($now) {
                $q->where('grading_end_date', '<=', $now)
                  ->orWhere(function ($sq) use ($now) {
                      $sq->whereNull('grading_end_date')
                         ->where('end_date', '<=', $now);
                  });
            })
            ->get();

        if ($dueStages->isEmpty()) {
            $this->info('Tidak ada tahapan yang perlu diumumkan.');
            return Command::SUCCESS;
        }

        $count = 0;
        foreach ($dueStages as $stage) {
            try {
                $this->reportService->publishStageAnnouncement($stage);
                $count++;
            } catch (\Exception $e) {
                Log::error("Gagal menerbitkan pengumuman tahapan #{$stage->id} ({$stage->name}): " . $e->getMessage());
                $this->error("Gagal menerbitkan pengumuman tahapan ID: {$stage->id}");
            }
        }

        $this->info("Berhasil menerbitkan {$count} pengumuman hasil tahapan seleksi.");
        return Command::SUCCESS;
    }
}
