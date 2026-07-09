<?php

namespace App\Console\Commands;

use App\Models\ApplicationStageResult;
use App\Services\ApplicationService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ReleaseStageResults extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:release-stage-results';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rilis hasil penilaian tahapan seleksi secara otomatis ke pelamar dan kirim email notifikasi ketika tanggal tahapan telah berakhir.';

    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        parent::__construct();
        $this->applicationService = $applicationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memulai pengecekan dan rilis hasil tahapan seleksi...');

        $now = Carbon::now();

        // Cari semua stage result yang statusnya bukan pending (berarti sudah dinilai),
        // released_at nya null (belum dirilis), dan masa penilaian tahapannya sudah
        // berakhir (grading_end_date, fallback end_date jika grading_end_date kosong) —
        // definisi deadline yang sama persis dengan yang dipakai untuk menerbitkan
        // pengumuman PDF per-tahapan (lihat ReportService::isStageGradingClosed),
        // sehingga email hasil tahapan terkirim serentak ke semua pelamar begitu
        // tahapan tersebut resmi ditutup.
        $unreleasedResults = ApplicationStageResult::where('status', '!=', 'pending')
            ->whereNull('released_at')
            ->whereHas('stage', function ($query) use ($now) {
                $query->where(function ($q) use ($now) {
                    $q->where('grading_end_date', '<=', $now)
                      ->orWhere(function ($sq) use ($now) {
                          $sq->whereNull('grading_end_date')
                             ->whereNotNull('end_date')
                             ->where('end_date', '<=', $now);
                      });
                });
            })
            ->get();

        if ($unreleasedResults->isEmpty()) {
            $this->info('Tidak ada hasil tahapan baru yang perlu dirilis.');
            return Command::SUCCESS;
        }

        $count = 0;
        foreach ($unreleasedResults as $result) {
            try {
                $this->applicationService->releaseResultsForStage($result);
                $count++;
            } catch (\Exception $e) {
                Log::error("Gagal merilis hasil tahapan untuk application #{$result->application_id}, stage #{$result->job_stage_id}: " . $e->getMessage());
                $this->error("Gagal merilis hasil ID: {$result->id}");
            }
        }

        $this->info("Berhasil merilis {$count} hasil tahapan seleksi ke pelamar.");
        return Command::SUCCESS;
    }
}
