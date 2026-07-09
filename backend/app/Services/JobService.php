<?php

namespace App\Services;

use App\Models\Job;
use App\Models\JobStage;
use Illuminate\Support\Facades\DB;

class JobService
{
    /**
     * Get all jobs with filters and counts.
     */
    /**
     * Get all jobs with filters and counts.
     */
    public function getJobs(array $filters)
    {
        $now = now();
        $upcomingThreshold = now()->addDays(7);

        // 🚀 FIX: Mengubah Job:: menjadi \App\Models\Job:: secara absolute
        // Ini memaksa Laravel mencari murni ke folder Models, anti-bentrok dengan folder Services!
        $query = \App\Models\Job::with(['formFields', 'stages', 'announcements'])->withCount(['applications', 'applications as accepted_count' => function($q) {
            $q->where('status', 'Lulus');
        }]);

        if (!empty($filters['finished'])) {
            $query->where('deadline', '<', $now);
        } else if (auth()->check() && auth()->user()->role === 'user' || !auth()->check()) {
            $query->where(function ($q) use ($now, $upcomingThreshold) {
                // Active jobs
                $q->where('start_date', '<=', $now)
                  ->where('deadline', '>=', $now);
                
                // OR Upcoming jobs
                $q->orWhere(function ($sq) use ($now, $upcomingThreshold) {
                    $sq->where('start_date', '>', $now)
                       ->where('start_date', '<=', $upcomingThreshold);
                });
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->latest()->get();
    }

    /**
     * Create a new job with its stages and form fields.
     */
    public function createJob(array $data)
    {
        return DB::transaction(function () use ($data) {
            $job = Job::create([
                'title'          => strip_tags($data['title']),
                'category'       => $data['category'],
                'description'    => strip_tags($data['description'], '<b><i><u><ul><li><ol><p><br>'),
                'qualification'  => $data['qualification'] ?? null,
                'location'       => $data['location'] ?? null,
                'unit_kerja'     => $data['unit_kerja'] ?? null,
                'duration'       => $data['duration'] ?? null,
                'recruiter_name' => $data['recruiter_name'] ?? null,
                'requirements'   => strip_tags($data['requirements'] ?? '', '<b><i><u><ul><li><ol><p><br>'),
                'start_date'     => $data['start_date'],
                'end_date'       => $data['end_date'],
                'deadline'       => $data['deadline'] ?? $data['end_date'],
                'kuota'          => $data['kuota'] ?? null,
                'created_by'     => auth()->id(),
            ]);

            if (!empty($data['form_fields'])) {
                $job->formFields()->attach($data['form_fields']);
            }

            foreach ($data['stages'] as $stage) {
                $jobStage = JobStage::create([
                    'job_id'      => $job->id,
                    'name'        => strip_tags($stage['name']),
                    'stage_order' => $stage['stage_order'],
                    'start_date'  => $stage['start_date'],
                    'end_date'    => $stage['end_date'],
                    'grading_end_date' => $stage['grading_end_date'] ?? null,
                    'weight'      => $stage['weight'],
                    'test_link'   => $stage['test_link'] ?? null,
                ]);

                if (!empty($stage['documents'])) {
                    $jobStage->documents()->sync(collect($stage['documents'])->mapWithKeys(
                        fn ($doc) => [$doc['form_field_id'] => ['weight' => $doc['weight'] ?? 0]]
                    ));
                }
            }

            if (!empty($data['penyeleksi_ids'])) {
                $job->penyeleksi()->sync($data['penyeleksi_ids']);
            }

            return $job->load(['stages.documents']);
        });
    }

    /**
     * Update an existing job.
     */
    /**
     * Update an existing job.
     */
    public function updateJob(Job $job, array $data)
    {
        return DB::transaction(function () use ($job, $data) {
            $job->update([
                'title'          => strip_tags($data['title']),
                'category'       => $data['category'],
                'description'    => strip_tags($data['description'], '<b><i><u><ul><li><ol><p><br>'),
                'qualification'  => $data['qualification'] ?? null,
                'location'       => $data['location'] ?? null,
                'unit_kerja'     => $data['unit_kerja'] ?? null,
                'duration'       => $data['duration'] ?? null,
                'recruiter_name' => $data['recruiter_name'] ?? null,
                'requirements'   => strip_tags($data['requirements'] ?? '', '<b><i><u><ul><li><ol><p><br>'),
                'start_date'     => $data['start_date'],
                'end_date'       => $data['end_date'],
                'deadline'       => $data['deadline'] ?? $data['end_date'],
                'kuota'          => $data['kuota'] ?? null, // 🚀 FIX BACKEND: Tambahkan baris ini agar pas di-update tidak ke-reset jadi null!
            ]);

            if (isset($data['form_fields'])) {
                $job->formFields()->sync($data['form_fields']);
            }

            if (isset($data['stages'])) {
                $existingIds = $job->stages()->pluck('id')->toArray();
                $keepIds = [];

                foreach ($data['stages'] as $stage) {
                    $stagePayload = [
                        'job_id'           => $job->id,
                        'name'             => strip_tags($stage['name']),
                        'stage_order'      => $stage['stage_order'],
                        'start_date'       => $stage['start_date'] ?? null,
                        'end_date'         => $stage['end_date'] ?? null,
                        'grading_end_date' => $stage['grading_end_date'] ?? null,
                        'weight'           => $stage['weight'],
                        'test_link'        => $stage['test_link'] ?? null,
                    ];

                    $stageId = $stage['id'] ?? null;

                    if ($stageId && in_array($stageId, $existingIds)) {
                        $jobStage = JobStage::find($stageId);
                        $jobStage->update($stagePayload);
                    } else {
                        $jobStage = JobStage::create($stagePayload);
                    }

                    $keepIds[] = $jobStage->id;

                    if (!empty($stage['documents'])) {
                        $jobStage->documents()->sync(collect($stage['documents'])->mapWithKeys(
                            fn ($doc) => [$doc['form_field_id'] => ['weight' => $doc['weight'] ?? 0]]
                        ));
                    } else {
                        $jobStage->documents()->sync([]);
                    }
                }

                if (isset($data['penyeleksi_ids'])) {
                    $job->penyeleksi()->sync($data['penyeleksi_ids']);
                }
                
                $toDelete = array_diff($existingIds, $keepIds);
                if (!empty($toDelete)) {
                    JobStage::whereIn('id', $toDelete)->delete();
                }
            }

            return $job->load(['stages.documents']);
        });
    }

    /**
     * Delete a job.
     */
    public function deleteJob(Job $job)
    {
        return $job->delete();
    }
}