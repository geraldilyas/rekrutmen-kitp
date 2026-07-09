<?php

namespace App\Services;

use App\Models\Application;
use App\Models\ApplicationStageResult;
use App\Models\ApplicationStatusHistory;
use App\Models\JobStage;
use App\Notifications\ApplicationStatusUpdated;
use App\Notifications\ApplicationSubmitted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\Job; 

class ApplicationService
{
    /**
     * Get applications with filters.
     */
    public function getApplications(array $filters)
    {
        $query = Application::with(['user', 'job', 'stageResults.stage', 'stageResults.reviewer']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category'])) {
            $query->whereHas('job', function ($q) use ($filters) {
                $q->where('category', $filters['category']);
            });
        }

        if (!empty($filters['job_id'])) {
            $query->where('job_id', $filters['job_id']);
        }

        if (!empty($filters['search'])) {
            $query->whereHas('user', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        $applications = $query->latest()->get();

        // Group every application per user so each row can show what other
        // jobs the same applicant has applied to (matched by user_id, so it
        // still works even if the user later changes their email/profile).
        // Jobs that finished more than 7 days ago are dropped from that list.
        $byUser = $applications->groupBy('user_id');
        foreach ($applications as $app) {
            $app->other_applications = $byUser->get($app->user_id, collect())
                ->where('id', '!=', $app->id)
                ->filter(fn ($other) => $this->isJobStillRelevant($other->job))
                ->map(fn ($other) => [
                    'id' => $other->id,
                    'job_id' => $other->job_id,
                    'job_title' => $other->job->title ?? null,
                    'status' => $other->status,
                ])
                ->values();
        }

        return $applications;
    }

    /**
     * A job stays "relevant" for the other-applications badge until 7 days
     * after its deadline has passed.
     */
    private function isJobStillRelevant($job): bool
    {
        if (!$job || !$job->deadline) {
            return true;
        }

        return Carbon::parse($job->deadline)->addDays(7)->isFuture();
    }

    /**
     * Submit a new application.
     */
    public function apply(array $data, int $userId)
    {
        // 🚀 FIX 1: Paksa pemanggilan Job secara Absolute path agar tidak tersesat ke Services
        $job = \App\Models\Job::with('formFields')->findOrFail($data['job_id']);

        // Check if job is currently open
        $now = now();
        if (($job->start_date && $now->lt($job->start_date)) || ($job->deadline && $now->gt($job->deadline))) {
            throw new \Exception('Pendaftaran untuk lowongan ini sedang ditutup.', 422);
        }

        // Prevent duplicate applications
        $existing = Application::where('user_id', $userId)
            ->where('job_id', $job->id)
            ->first();
        if ($existing) {
            throw new \Exception('Anda sudah pernah melamar lowongan ini.', 422);
        }

        // Validation: Check if all required fields are present
        $requiredFieldIds = $job->formFields->where('is_required', true)->pluck('id')->toArray();
        $submittedFieldIds = collect($data['answers'] ?? [])->pluck('field_id')->toArray();

        $missingFields = array_diff($requiredFieldIds, $submittedFieldIds);

        if (!empty($missingFields)) {
            throw new \Exception('Beberapa field wajib belum diisi.', 422);
        }

        $application = DB::transaction(function () use ($data, $job, $userId) {
            $application = Application::create([
                'user_id' => $userId,
                'job_id' => $job->id,
                'status' => 'pending',
                'applied_at' => now()
            ]);

            // Save Answers
            if (!empty($data['answers'])) {
                foreach ($data['answers'] as $answer) {
                    \App\Models\ApplicationAnswer::create([
                        'application_id' => $application->id,
                        'form_field_id' => $answer['field_id'],
                        'answer' => strip_tags($answer['value'])
                    ]);
                }
            }

            // Auto-create stage result for first stage
            // 🚀 FIX 2: Paksa pemanggilan JobStage secara Absolute path juga demi keamanan database relasi
            $firstStage = \App\Models\JobStage::where('job_id', $job->id)
                ->orderBy('stage_order')
                ->first();

            if ($firstStage) {
                ApplicationStageResult::create([
                    'application_id' => $application->id,
                    'job_stage_id'   => $firstStage->id,
                    'status'         => 'pending',
                ]);
            }

            return $application->load(['answers']);
        });

        // Kirim email notifikasi "Lamaran Berhasil Dikirim" setelah data tersimpan.
        $this->sendSubmittedNotification($application);

        return $application;
    }

    /**
     * Kirim email notifikasi ketika pelamar berhasil mengirim lamaran.
     */
    protected function sendSubmittedNotification(Application $application)
    {
        try {
            $application->loadMissing(['user', 'job']);

            if ($application->user) {
                $application->user->notify(new ApplicationSubmitted($application));
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email lamaran diterima: ' . $e->getMessage());
        }
    }

    /**
     * Kirim email notifikasi perubahan status lamaran (lolos/gugur tahap,
     * lulus akhir, atau perubahan status manual oleh admin).
     */
    protected function sendStatusNotification(Application $application, ?string $message = null)
    {
        try {
            $application->loadMissing(['user', 'job']);

            if ($application->user) {
                $application->user->notify(new ApplicationStatusUpdated($application, $message));
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email update status lamaran: ' . $e->getMessage());
        }
    }

    /**
     * Get applications for a specific user.
     */
    public function getMyApplications(int $userId)
    {
        // 🚀 SOLUSI EMAS: Tambahkan 'withoutGlobalScopes()' biar ga disembunyikan scope Laravel
        return \App\Models\Application::withoutGlobalScopes()
            ->with(['job.stages', 'stageResults.stage']) // Eager load stages sekalian biar accessor ga crash
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    /**
     * Update the overall status of an application.
     */
    public function updateApplicationStatus(Application $application, array $data)
    {
        return DB::transaction(function () use ($application, $data) {
            $application->update([
                'status' => $data['status']
            ]);

            ApplicationStatusHistory::create([
                'application_id' => $application->id,
                'status' => $data['status'],
                'notes' => strip_tags($data['notes'] ?? ''),
                'created_at' => now()
            ]);

            $this->sendStatusNotification($application, $data['notes'] ?? null);

            return $application;
        });
    }

    /**
     * Initialize the first stage of selection for an application.
     */
    public function initializeFirstStage(Application $application)
    {
        // Tolak jika status aplikasi sudah final — tidak ada tahapan yang perlu dinilai lagi
        $finalStatuses = ['Lulus', 'Tidak Lulus', 'pending_keputusan'];
        if (in_array($application->status, $finalStatuses)) {
            throw new \Exception('Semua tahapan seleksi untuk pelamar ini sudah selesai. Tidak ada tahap yang perlu dinilai.', 422);
        }

        $existing = ApplicationStageResult::where('application_id', $application->id)
            ->where('status', 'pending')
            ->orderByDesc('id')
            ->first();

        if ($existing) {
            return $existing;
        }

        // Jika tidak ada pending result, cek apakah semua tahap sudah punya hasil
        $totalStages = $application->job->stages->count();
        $completedResults = ApplicationStageResult::where('application_id', $application->id)
            ->where('status', '!=', 'pending')
            ->count();

        if ($totalStages > 0 && $completedResults >= $totalStages) {
            throw new \Exception('Semua tahapan seleksi sudah selesai dinilai. Tidak ada tahap yang perlu dinilai lagi.', 422);
        }

        $firstStage = $application->job->stages->sortBy('stage_order')->first();

        if (!$firstStage) {
            throw new \Exception('Lowongan tidak memiliki tahap seleksi');
        }

        return ApplicationStageResult::create([
            'application_id' => $application->id,
            'job_stage_id'   => $firstStage->id,
            'status'         => 'pending',
        ]);
    }

    /**
     * Get stages and results for an application.
     */
    public function getApplicationStages(Application $application)
    {
        return $application->job->stages->map(function ($stage) use ($application) {
            $result = $application->stageResults->where('job_stage_id', $stage->id)->first();

            return [
                'stage_id' => $stage->id,
                'stage_name' => $stage->name,
                'stage_order' => $stage->stage_order,
                'start_date' => $stage->start_date,
                'end_date' => $stage->end_date,
                'result_id' => $result ? $result->id : null,
                'result' => $result ? $result->status : 'pending',
                'score' => $result ? $result->score : null,
                'notes' => $result ? $result->notes : null,
                'updated_at' => $result ? $result->updated_at : null,
            ];
        });
    }

    /**
     * Update the result of a specific selection stage.
     */
    public function updateStageResult(ApplicationStageResult $stageResult, array $data)
    {
        return DB::transaction(function () use ($stageResult, $data) {
            // 🚀 FIX 1: Paksa panggil secara Absolute Path agar tidak kesasar ke App\Services\Job
            $currentStage = \App\Models\JobStage::findOrFail($stageResult->job_stage_id);
            $application = Application::findOrFail($stageResult->application_id);

            // Date validation
            $now = Carbon::now();
            $startDate = $currentStage->start_date ? Carbon::parse($currentStage->start_date) : null;
            $gradingEndDate = $currentStage->grading_end_date
                ? Carbon::parse($currentStage->grading_end_date)
                : ($currentStage->end_date ? Carbon::parse($currentStage->end_date) : null);

            if ($startDate && $now->lt($startDate)) {
                throw new \Exception('Tahap "' . $currentStage->name . '" belum dapat dinilai. Penilaian dibuka mulai ' . $startDate->format('d/m/Y H:i'), 403);
            }

            if ($gradingEndDate && $now->gt($gradingEndDate)) {
                throw new \Exception('Masa penilaian untuk tahap "' . $currentStage->name . '" sudah berakhir pada ' . $gradingEndDate->format('d/m/Y H:i'), 403);
            }

            // Update stage result
            $stageResult->update([
                'status' => $data['status'],
                'score' => $data['score'],
                'notes' => strip_tags($data['notes'] ?? ''),
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id()
            ]);

            // Langsung rilis hasil dan perbarui status pelamar setelah penilaian disimpan.
            // Penyeleksi yang menyimpan nilai berarti sudah membuat keputusan definitif,
            // sehingga tidak perlu menunggu end_date untuk merilis hasil dan mengirim notifikasi.
            $this->releaseResultsForStage($stageResult);

            return $stageResult;
        });
    }

    /**
     * Rilis hasil penilaian satu tahapan (transisi status aplikasi & kirim email).
     * Dipanggil otomatis ketika end_date sudah lewat atau lewat cron job/command.
     */
    public function releaseResultsForStage(ApplicationStageResult $stageResult)
    {
        return DB::transaction(function () use ($stageResult) {
            // Hanya rilis jika sudah dinilai dan belum dirilis sebelumnya
            if ($stageResult->status === 'pending' || $stageResult->released_at !== null) {
                return $stageResult;
            }

            $currentStage = \App\Models\JobStage::findOrFail($stageResult->job_stage_id);
            $application = Application::findOrFail($stageResult->application_id);

            // Update status rilis
            $stageResult->update([
                'released_at' => now(),
            ]);

            // Jalankan transisi status & kirim email
            if ($stageResult->status === 'tidak_lulus') {
                $this->handleStageFailure($application, $currentStage, $stageResult->notes ?? '');
            } elseif ($stageResult->status === 'lulus') {
                $this->handleStageSuccess($application, $currentStage);
            }

            return $stageResult;
        });
    }

    protected function handleStageFailure(Application $application, JobStage $currentStage, string $notes)
    {
        $application->update(['status' => 'Tidak Lulus']);

        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => 'Tidak Lulus',
            'notes' => 'Gagal pada tahap: ' . $currentStage->name . '. ' . $notes,
            'created_at' => now(),
        ]);

        $message = 'Anda dinyatakan tidak lulus pada tahap seleksi **' . $currentStage->name . '**.'
            . ($notes ? ' Catatan dari panitia: ' . $notes : '');

        $this->sendStatusNotification($application, $message);
    }

    protected function handleStageSuccess(Application $application, JobStage $currentStage)
    {
        // 🚀 FIX 2: Paksa panggil JobStage secara Absolute Path juga di sini demi keamanan relasi DB
        $nextStage = \App\Models\JobStage::where('job_id', $application->job_id)
            ->where('stage_order', '>', $currentStage->stage_order)
            ->orderBy('stage_order')
            ->first();

        if ($nextStage) {
            $this->moveToNextStage($application, $nextStage, $currentStage->name);
        } else {
            $this->finalizeApplication($application);
        }
    }

    protected function moveToNextStage(Application $application, JobStage $nextStage, string $currentStageName)
    {
        $existingNextStage = ApplicationStageResult::where('application_id', $application->id)
            ->where('job_stage_id', $nextStage->id)
            ->first();

        if (!$existingNextStage) {
            ApplicationStageResult::create([
                'application_id' => $application->id,
                'job_stage_id' => $nextStage->id,
                'status' => 'pending',
            ]);
        }

        $application->update(['status' => 'seleksi']);

        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => 'seleksi',
            'notes' => 'Lolos tahap ' . $currentStageName . '. Lanjut ke tahap berikutnya.',
            'created_at' => now(),
        ]);

        $message = 'Anda dinyatakan **lolos** pada tahap **' . $currentStageName . '** dan akan melanjutkan ke tahap **'
            . $nextStage->name . '**. Pantau jadwal dan pengumuman tahap berikutnya secara berkala.';

        $this->sendStatusNotification($application, $message);
    }

    protected function finalizeApplication(Application $application)
    {
        // Hitung dan simpan final score terlebih dahulu
        $application->load(['stageResults', 'job.stages']);
        $finalScore = $application->calculated_final_score;

        // Set status sementara "menunggu keputusan" — belum tentu lulus, tergantung kuota
        $application->update([
            'status'      => 'pending_keputusan',
            'final_score' => $finalScore,
        ]);

        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status'         => 'pending_keputusan',
            'notes'          => 'Pelamar telah menyelesaikan seluruh tahap seleksi. Menunggu penentuan keputusan final berdasarkan kuota.',
            'created_at'     => now(),
        ]);

        $message = 'Anda telah menyelesaikan seluruh tahapan seleksi. Status Anda saat ini adalah menunggu keputusan akhir dari panitia rekrutmen.';
        $this->sendStatusNotification($application, $message);
    }

    /**
     * Tentukan siapa yang Lulus/Tidak Lulus berdasarkan kuota lowongan.
     * Dipanggil ketika pengumuman diterbitkan.
     * Hanya akan eksekusi ranking jika SEMUA pelamar di tahap terakhir sudah selesai dinilai.
     */
    public function resolveJobQuota(int $jobId)
    {
        $job = \App\Models\Job::with('stages')->find($jobId);
        if (!$job) return;

        // Ambil tahap terakhir
        $lastStage = $job->stages->sortBy('stage_order')->last();
        if (!$lastStage) return;

        // Cek apakah masih ada pelamar di tahap terakhir yang belum selesai dinilai (status pending)
        $pendingInLastStage = ApplicationStageResult::where('job_stage_id', $lastStage->id)
            ->where('status', 'pending')
            ->exists();

        if ($pendingInLastStage) {
            // Masih ada yang belum dinilai — tunggu dulu, jangan putuskan sekarang
            Log::info("resolveJobQuota: Job #{$jobId} masih ada pelamar pending di tahap terakhir. Menunggu.");
            return;
        }

        // Semua sudah dinilai di tahap terakhir.
        // Ambil semua pelamar yang statusnya pending_keputusan untuk lowongan ini
        // (withoutGlobalScopes() diperlukan agar tidak terkena filter ApplicationDataScope
        // yang membatasi berdasarkan admin level — proses ini berjalan server-side tanpa konteks admin)
        $finalists = Application::withoutGlobalScopes()
            ->where('job_id', $jobId)
            ->where('status', 'pending_keputusan')
            ->with(['stageResults', 'job.stages'])
            ->get();

        if ($finalists->isEmpty()) return;

        $this->rankAndAssignQuota($job, $finalists);
    }

    /**
     * Lakukan ranking dan tetapkan status Lulus/Tidak Lulus berdasarkan kuota.
     * Tiebreaker: jika final_score sama, bandingkan skor di tahap dengan bobot tertinggi.
     */
    protected function rankAndAssignQuota(\App\Models\Job $job, $finalists)
    {
        $kuota = $job->kuota ?? null;

        // Jika kuota tidak diisi, semua yang selesai seluruh tahap dinyatakan Lulus
        if (is_null($kuota) || $kuota <= 0) {
            foreach ($finalists as $app) {
                $this->setFinalStatus($app, 'Lulus', 'Pelamar diterima. Selamat bergabung!');
            }
            return;
        }

        // Temukan tahap dengan bobot tertinggi (untuk tiebreaker)
        $highestWeightStage = $job->stages->sortByDesc('weight')->first();

        // Sort: final_score DESC, lalu score di tahap bobot tertinggi DESC sebagai tiebreaker
        $ranked = $finalists->sortByDesc(function ($app) use ($highestWeightStage) {
            $tiebreaker = 0;
            if ($highestWeightStage) {
                $result = $app->stageResults->where('job_stage_id', $highestWeightStage->id)->first();
                $tiebreaker = $result ? ($result->score ?? 0) : 0;
            }
            // Primary sort: final_score (×1000 agar presisi, tiebreaker di belakang koma)
            return ($app->final_score * 1000) + ($tiebreaker / 1000);
        })->values();

        foreach ($ranked as $index => $app) {
            $rank = $index + 1;
            if ($rank <= $kuota) {
                $this->setFinalStatus(
                    $app,
                    'Lulus',
                    'Selamat! Anda dinyatakan **lulus** dan masuk dalam kuota penerimaan (peringkat #' . $rank . ' dari ' . $finalists->count() . ' pelamar). Skor akhir: ' . $app->final_score
                );
            } else {
                $this->setFinalStatus(
                    $app,
                    'Tidak Lulus',
                    'Anda telah menyelesaikan seluruh tahap seleksi dengan skor akhir **' . $app->final_score . '**, namun tidak masuk dalam kuota penerimaan (peringkat #' . $rank . ' dari ' . $finalists->count() . ' pelamar). Terima kasih atas partisipasi Anda.'
                );
            }
        }
    }

    /**
     * Tetapkan status final (Lulus/Tidak Lulus) pada satu aplikasi dan kirim notifikasi.
     */
    protected function setFinalStatus(Application $app, string $status, string $message)
    {
        $app->update(['status' => $status]);

        ApplicationStatusHistory::create([
            'application_id' => $app->id,
            'status'         => $status,
            'notes'          => strip_tags($message),
            'created_at'     => now(),
        ]);

        $this->sendStatusNotification($app, $message);
    }

    /**
     * Delete an application.
     */
    public function deleteApplication(Application $application)
    {
        return $application->delete();
    }
}