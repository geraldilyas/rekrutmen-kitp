<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use App\Services\JobService;

class JobController extends Controller
{
    protected $jobService;

    public function __construct(JobService $jobService)
    {
        $this->jobService = $jobService;
    }

    /**
     * GET ALL JOBS.
     */
    public function index(Request $request)
    {
        $jobs = $this->jobService->getJobs($request->all());
        return response()->json($jobs);
    }

    /**
     * STORE JOB + FORM DINAMIS.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'category'       => 'required|in:tenaga_pendukung,konsultan_individu',
            'description'    => 'required|string',
            'qualification'  => 'nullable|string|max:500',
            'location'       => 'nullable|string|max:255',
            'unit_kerja'     => 'nullable|string|max:255',
            'duration'       => 'nullable|string|max:100',
            'recruiter_name' => 'nullable|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'required|date|after_or_equal:start_date',
            'deadline'       => 'nullable|date',
            'requirements'   => 'nullable|string',
            'form_fields'    => 'nullable|array',
            'form_fields.*'  => 'exists:form_fields,id',
            'stages'         => 'required|array|min:1',
            'stages.*.name'       => 'required|string|max:255',
            'stages.*.stage_order' => 'required|integer|min:1',
            'stages.*.start_date' => 'nullable|date',
            'stages.*.end_date'   => 'nullable|date',
            'stages.*.weight'     => 'required|numeric|min:0|max:100',
            'stages.*.test_link'  => 'nullable|max:255',
        ]);

        $totalWeight = collect($validated['stages'])->sum('weight');
        if ($totalWeight != 100) {
            return response()->json([
                'message' => 'Total bobot semua tahapan harus 100%',
                'current_total' => $totalWeight
            ], 422);
        }

        $job = $this->jobService->createJob($validated);

        return response()->json([
            'message' => 'Lowongan berhasil dibuat',
            'data' => $job
        ], 201);
    }

    /**
     * GET SINGLE JOB DETAIL.
     */
    public function show($id)
    {
        $job = Job::with(['formFields', 'stages', 'announcements'])->findOrFail($id);

        return response()->json([
            'message' => 'Job detail retrieved successfully',
            'data' => $job
        ]);
    }

    /**
     * UPDATE JOB.
     */
    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'category'       => 'required|in:tenaga_pendukung,konsultan_individu',
            'description'    => 'required|string',
            'qualification'  => 'nullable|string|max:500',
            'location'       => 'nullable|string|max:255',
            'unit_kerja'     => 'nullable|string|max:255',
            'duration'       => 'nullable|string|max:100',
            'recruiter_name' => 'nullable|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'required|date|after_or_equal:start_date',
            'deadline'       => 'nullable|date',
            'requirements'   => 'nullable|string',
            'form_fields'    => 'nullable|array',
            'form_fields.*'  => 'exists:form_fields,id',
        ]);

        $job = $this->jobService->updateJob($job, $validated);

        return response()->json([
            'message' => 'Lowongan berhasil diupdate',
            'data' => $job
        ]);
    }

    /**
     * DELETE JOB.
     */
    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $this->jobService->deleteJob($job);

        return response()->json([
            'message' => 'Lowongan berhasil dihapus'
        ]);
    }

    /**
     * GET FORM FOR APPLICANTS.
     */
    public function getForm($id)
    {
        $job = Job::with('formFields')->findOrFail($id);

        return response()->json([
            'job' => $job->title,
            'form' => $job->formFields
        ]);
    }
}