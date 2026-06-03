<?php

namespace App\Services;

use App\Models\Application;
use App\Models\ApplicationStageResult;
use App\Models\ApplicationStatusHistory;
use App\Models\JobStage;
use App\Notifications\ApplicationStatusUpdated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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

        return $query->latest()->get();
    }

    /**
     * Submit a new application.
     */
    public function apply(array $data, int $userId)
    {
        $job = Job::with('formFields')->findOrFail($data['job_id']);

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

        return DB::transaction(function () use ($data, $job, $userId) {
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
            $firstStage = JobStage::where('job_id', $job->id)
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
    }

    /**
     * Get applications for a specific user.
     */
    public function getMyApplications(int $userId)
    {
        return Application::with(['job', 'stageResults.stage'])
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

            try {
                if ($application->user) {
                    $application->user->notify(new ApplicationStatusUpdated($application));
                }
            } catch (\Exception $e) {
                Log::error("Failed to send notification: " . $e->getMessage());
            }

            return $application;
        });
    }

    /**
     * Initialize the first stage of selection for an application.
     */
    public function initializeFirstStage(Application $application)
    {
        $existing = ApplicationStageResult::where('application_id', $application->id)
            ->where('status', 'pending')
            ->orderByDesc('id')
            ->first();

        if ($existing) {
            return $existing;
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
            $currentStage = JobStage::findOrFail($stageResult->job_stage_id);
            $application = Application::findOrFail($stageResult->application_id);

            // Date validation
            $today = Carbon::today();
            $startDate = $currentStage->start_date ? Carbon::parse($currentStage->start_date) : null;
            $endDate = $currentStage->end_date ? Carbon::parse($currentStage->end_date) : null;

            if ($startDate && $today->lt($startDate)) {
                throw new \Exception('Tahap "' . $currentStage->name . '" belum dapat dinilai. Penilaian dibuka mulai ' . $startDate->format('d/m/Y'), 403);
            }

            if ($endDate && $today->gt($endDate)) {
                throw new \Exception('Masa penilaian untuk tahap "' . $currentStage->name . '" sudah berakhir pada ' . $endDate->format('d/m/Y'), 403);
            }

            // Update stage result
            $stageResult->update([
                'status' => $data['status'],
                'score' => $data['score'],
                'notes' => strip_tags($data['notes'] ?? ''),
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id()
            ]);

            // Handle Failure
            if ($data['status'] === 'tidak_lulus') {
                $this->handleStageFailure($application, $currentStage, $data['notes'] ?? '');
                return $stageResult;
            }

            // Handle Success
            if ($data['status'] === 'lulus') {
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
    }

    protected function handleStageSuccess(Application $application, JobStage $currentStage)
    {
        $nextStage = JobStage::where('job_id', $application->job_id)
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
    }

    protected function finalizeApplication(Application $application)
    {
        $application->load(['stageResults', 'job.stages']);
        $finalScore = $application->calculated_final_score;

        $application->update([
            'status' => 'Lulus',
            'final_score' => $finalScore
        ]);

        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => 'Lulus',
            'notes' => 'Pelamar diterima dengan skor akhir: ' . $finalScore,
            'created_at' => now(),
        ]);
    }

    /**
     * Delete an application.
     */
    public function deleteApplication(Application $application)
    {
        return $application->delete();
    }
}
