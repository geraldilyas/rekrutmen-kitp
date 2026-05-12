<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobStage;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // GET ALL JOBS
    public function index()
    {
        return Job::with('formFields')->get();
    }

    // STORE JOB + FORM DINAMIS
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'category' => 'required|in:tenaga_pendukung,konsultan_individu',
            'description' => 'required',
            'deadline' => 'required|date',
            'requirements' => 'nullable|string',
            'form_fields' => 'required|array',
            'form_fields.*' => 'exists:form_fields,id',
            'stages' => 'required|array',
            'stages.*.name' => 'required|string',
            'stages.*.stage_order' => 'required|integer',
            'stages.*.start_date' => 'nullable|date',
            'stages.*.end_date' => 'nullable|date',
        ]);

        // simpan job
        $job = Job::create([
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'requirements' => $request->requirements,
            'deadline' => $request->deadline,
        ]);

        // attach form fields
        if ($request->has('form_fields')) {
            $syncData = [];

            foreach ($request->form_fields as $index => $fieldId) {
                $syncData[$fieldId] = ['order' => $index];
            }

            $job->formFields()->sync($syncData);
        }

        if ($request->has('stages')) {
            foreach ($request->stages as $stage) {
                JobStage::create([
                    'job_id' => $job->id,
                    'name' => $stage['name'],
                    'stage_order' => $stage['stage_order'],
                    'start_date' => $stage['start_date'] ?? null,
                    'end_date' => $stage['end_date'] ?? null,
                ]);
            }
        }

        return response()->json([
            'message' => 'Lowongan berhasil dibuat',
            'data' => $job->load(['formFields', 'stages'])
        ]);
    }

    public function show($id)
    {
        $job = \App\Models\Job::with([
            'formFields',
            'stages',
        ])->find($id);

        if (!$job) {
            return response()->json([
                'message' => 'Job not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Job detail retrieved successfully',
            'data' => $job
        ]);
    }

    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        $request->validate([
            'title' => 'required',
            'category' => 'required',
            'description' => 'required',
            'deadline' => 'required|date',
        ]);

        $job->update([
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'requirements' => $request->requirements,
        ]);

        // update dynamic form
        if ($request->has('form_fields')) {
            $job->formFields()->sync($request->form_fields);
        }

        return response()->json([
            'message' => 'Lowongan berhasil diupdate',
            'data' => $job->load('formFields')
        ]);
    }

    //HAPUS LOWONGAN
    public function destroy($id)
    {
        $job = Job::findOrFail($id);

        $job->delete();

        return response()->json([
            'message' => 'Lowongan berhasil dihapus'
        ]);
    }

    // FILTER BY CATEGORY
    public function byCategory($category)
    {
        return Job::where('category', $category)
            ->with('formFields')
            ->get();
    }

    // AMBIL FORM UNTUK PELAMAR
    public function getForm($id)
    {
        $job = Job::with('formFields')->findOrFail($id);

        return response()->json([
            'job' => $job->title,
            'form' => $job->formFields
        ]);
    }
}