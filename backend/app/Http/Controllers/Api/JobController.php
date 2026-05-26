<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobStage;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // GET ALL JOBS
    public function index(Request $request)
    {
        $now = now();
        $upcomingThreshold = now()->addDays(7);

        $query = Job::with(['formFields', 'stages', 'announcements'])->withCount(['applications', 'applications as accepted_count' => function($q) {
            $q->where('status', 'Lulus');
        }]);

        // Pelamar can see: Active jobs OR Upcoming jobs starting within 7 days
        // Unless they ask for 'finished' jobs for Pengumuman
        if ($request->has('finished')) {
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

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return $query->latest()->get();
    }

    // STORE JOB + FORM DINAMIS
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

        $job = Job::create([
            'title'          => strip_tags($validated['title']),
            'category'       => $validated['category'],
            'description'    => strip_tags($validated['description'], '<b><i><u><ul><li><ol><p><br>'),
            'qualification'  => $validated['qualification'] ?? null,
            'location'       => $validated['location'] ?? null,
            'unit_kerja'     => $validated['unit_kerja'] ?? null,
            'duration'       => $validated['duration'] ?? null,
            'recruiter_name' => $validated['recruiter_name'] ?? null,
            'requirements'   => strip_tags($validated['requirements'] ?? '', '<b><i><u><ul><li><ol><p><br>'),
            'start_date'     => $validated['start_date'],
            'end_date'       => $validated['end_date'],
            'deadline'       => $validated['deadline'] ?? $validated['end_date'],
            'created_by'     => auth()->id(),
        ]);

        if (!empty($validated['form_fields'])) {
            $job->formFields()->attach($validated['form_fields']);
        }

        foreach ($validated['stages'] as $stage) {
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

        return response()->json([
            'message' => 'Lowongan berhasil dibuat',
            'data' => $job->load(['stages'])
        ], 201);
    }

    public function show($id)
    {
        $job = \App\Models\Job::with([
            'formFields',
            'stages',
            'announcements',
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Job detail retrieved successfully',
            'data' => $job
        ]);
    }

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

        $job->update([
            'title'          => strip_tags($validated['title']),
            'category'       => $validated['category'],
            'description'    => strip_tags($validated['description'], '<b><i><u><ul><li><ol><p><br>'),
            'qualification'  => $validated['qualification'] ?? null,
            'location'       => $validated['location'] ?? null,
            'unit_kerja'     => $validated['unit_kerja'] ?? null,
            'duration'       => $validated['duration'] ?? null,
            'recruiter_name' => $validated['recruiter_name'] ?? null,
            'requirements'   => strip_tags($validated['requirements'] ?? '', '<b><i><u><ul><li><ol><p><br>'),
            'start_date'     => $validated['start_date'],
            'end_date'       => $validated['end_date'],
            'deadline'       => $validated['deadline'] ?? $validated['end_date'],
        ]);

        if (isset($validated['form_fields'])) {
            $job->formFields()->sync($validated['form_fields']);
        }

        return response()->json([
            'message' => 'Lowongan berhasil diupdate',
            'data' => $job->load('stages')
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