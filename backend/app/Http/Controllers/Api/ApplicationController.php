<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Job;
use App\Models\JobStage;
use App\Models\ApplicationDocument;
use App\Models\ApplicationAnswer;
use App\Models\ApplicationStageResult;
use Illuminate\Support\Facades\DB;

class ApplicationController extends Controller
{
    /**
     * Submit a new application.
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'answers' => 'nullable|array',
            'answers.*.field_id' => 'required|exists:form_fields,id',
            'answers.*.value' => 'required|string|max:1000',
            'documents' => 'nullable|array',
            'documents.*.type' => 'required|string|max:50',
            'documents.*.file_path' => 'required|string|max:255',
        ]);

        $job = Job::with('formFields')->findOrFail($validated['job_id']);

        // Check if job is currently open
        $now = now();
        if (($job->start_date && $now->lt($job->start_date)) || ($job->deadline && $now->gt($job->deadline))) {
            return response()->json([
                'message' => 'Pendaftaran untuk lowongan ini sedang ditutup.'
            ], 422);
        }

        // Prevent duplicate applications
        $existing = Application::where('user_id', auth()->id())
            ->where('job_id', $job->id)
            ->first();
        if ($existing) {
            return response()->json([
                'message' => 'Anda sudah pernah melamar lowongan ini.'
            ], 422);
        }

        // Validation: Check if all required fields are present
        $requiredFieldIds = $job->formFields->where('is_required', true)->pluck('id')->toArray();
        $submittedFieldIds = collect($validated['answers'] ?? [])->pluck('field_id')->toArray();

        $missingFields = array_diff($requiredFieldIds, $submittedFieldIds);

        if (!empty($missingFields)) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => ['answers' => ['Beberapa field wajib belum diisi.']]
            ], 422);
        }

        return DB::transaction(function () use ($validated, $job) {
            $application = Application::create([
                'user_id' => auth()->id(),
                'job_id' => $job->id,
                'status' => 'pending',
                'applied_at' => now()
            ]);

            // Save Answers
            if (!empty($validated['answers'])) {
                foreach ($validated['answers'] as $answer) {
                    ApplicationAnswer::create([
                        'application_id' => $application->id,
                        'form_field_id' => $answer['field_id'],
                        'answer' => strip_tags($answer['value'])
                    ]);
                }
            }

            // Save Documents
            if (!empty($validated['documents'])) {
                foreach ($validated['documents'] as $doc) {
                    ApplicationDocument::create([
                        'application_id' => $application->id,
                        'type' => strip_tags($doc['type']),
                        'file_path' => strip_tags($doc['file_path']),
                        'uploaded_at' => now()
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

            return response()->json([
                'message' => 'Lamaran berhasil dikirim',
                'data' => $application->load(['answers', 'documents'])
            ]);
        });
    }

    /**
     * Get applications for the authenticated user.
     */
    public function myApplications(Request $request)
    {
        return Application::with(['job', 'stageResults.stage'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }
}
