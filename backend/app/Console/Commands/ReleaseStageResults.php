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
        // released_at nya null (belum dirilis),
        // dan end_date stage nya sudah berlalu atau sekarang (<= now)
        $unreleasedResults = ApplicationStageResult::where('status', '!=', 'pending')
            ->whereNull('released_at')
            ->whereHas('stage', function ($query) use ($now) {
                $query->whereNotNull('end_date')
                      ->where('end_date', '<=', $now);
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
