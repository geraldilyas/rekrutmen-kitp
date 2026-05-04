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
            'job_id' => 'required|exists:jobs,id'
        ]);

        $user = $request->user();

        $exists = Application::where('user_id', $user->id)
            ->where('job_id', $request->job_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Anda sudah melamar pada lowongan ini'
            ], 400);
        }

        $application = Application::create([
            'user_id' => $user->id,
            'job_id' => $request->job_id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        return response()->json([
            'message' => 'Berhasil melamar',
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