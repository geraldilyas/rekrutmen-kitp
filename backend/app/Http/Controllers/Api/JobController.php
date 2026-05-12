<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
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
            'form_fields.*' => 'exists:form_fields,id'
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

        return response()->json([
            'message' => 'Lowongan berhasil dibuat',
            'data' => $job->load('formFields')
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