<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;

class ApplicationAdminController extends Controller
{
    //  GET semua lamaran + filter
    public function index(Request $request)
    {
        $query = Application::with(['user', 'job']);

        // filter status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // filter kategori job
        if ($request->category) {
            $query->whereHas('job', function ($q) use ($request) {
                $q->where('category', $request->category);
            });
        }

        if ($request->has('job_id')) {
            $query->where('job_id', $request->job_id);
        }

        return response()->json($query->latest()->get());
    }

    //  DETAIL lamaran
    public function show($id)
    {
        $application = Application::with([
            'user',
            'job',
            'documents',
            'histories'
        ])->findOrFail($id);

        return response()->json($application);
    }

    //  VALIDASI lamaran
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,seleksi,diterima,ditolak',
            'notes' => 'nullable|string'
        ]);

        $application = Application::findOrFail($id);

        // update status
        $application->update([
            'status' => $request->status
        ]);

        // simpan histori
        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => $request->status,
            'notes' => $request->notes,
            'created_at' => now()
        ]);

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'data' => $application
        ]);
    }
}