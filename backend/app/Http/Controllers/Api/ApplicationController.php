<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;

class ApplicationController extends Controller
{
    // POST /apply
    public function apply(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'documents' => 'nullable|array',
        ]);
        
        $application = Application::create([
            'user_id' => auth()->id(),
            'job_id' => $request->job_id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        if ($request->has('documents') && is_array($request->documents)) {
            foreach ($request->documents as $doc) {
                \App\Models\ApplicationDocument::create([
                    'application_id' => $application->id,
                    'type' => $doc['type'] ?? null,
                    'file_path' => $doc['file_path'] ?? null,
                    'uploaded_at' => now()
                ]);
            }
        }

        return response()->json([
            'message' => 'Lamaran berhasil dikirim',
            'data' => $application
        ]);
    }


    public function allApplications()
    {
        return Application::with(['user', 'job'])->get();
    }

    // GET myApplications
    public function myApplications(Request $request)
    {
        return Application::with(['job'])
            ->where('user_id', $request->user()->id)
            ->get();
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,diterima,ditolak'
        ]);

        $application = Application::findOrFail($id);

        $application->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Status berhasil diupdate',
            'data' => $application
        ]);
    }
}