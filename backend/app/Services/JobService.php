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
    public function getJobs(array $filters)
    {
        $now = now();
        $upcomingThreshold = now()->addDays(7);

        $query = Job::with(['formFields', 'stages', 'announcements'])->withCount(['applications', 'applications as accepted_count' => function($q) {
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
                'created_by'     => auth()->id(),
            ]);

            if (!empty($data['form_fields'])) {
                $job->formFields()->attach($data['form_fields']);
            }

            foreach ($data['stages'] as $stage) {
                JobStage::create([
                    'job_id'      => $job->id,
                    'name'        => strip_tags($stage['name']),
                    'stage_order' => $stage['stage_order'],
                    'start_date'  => $stage['start_date'],
                    'end_date'    => $stage['end_date'],
                    'weight'      => $stage['weight'],
                    'test_link'   => $stage['test_link'] ?? null,
                ]);
            }

            return $job->load(['stages']);
        });
    }

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
            ]);

            if (isset($data['form_fields'])) {
                $job->formFields()->sync($data['form_fields']);
            }

            return $job->load('stages');
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
