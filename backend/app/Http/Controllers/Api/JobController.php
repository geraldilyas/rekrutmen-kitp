<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index()
    {
        return Job::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'category' => 'required|in:tenaga_pendukung,konsultan_individu',
            'description' => 'required',
            'requirements' => 'required',
            'deadline' => 'required|date'
        ]);

        $job = Job::create($request->all());

        return response()->json([
            'message' => 'Lowongan berhasil dibuat',
            'data' => $job
        ]);
    }

    public function byCategory($category)
    {
        return Job::where('category', $category)->get();
    }
}