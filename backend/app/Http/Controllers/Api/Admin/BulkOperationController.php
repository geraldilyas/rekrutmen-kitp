<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use App\Models\ApplicationStatusHistory;
use Illuminate\Support\Facades\DB;

class BulkOperationController extends Controller
{
    /**
     * Bulk update application status.
     */
    public function updateApplicationStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:applications,id',
            'status' => 'required|in:pending,seleksi,Lulus,Tidak Lulus',
            'notes' => 'nullable|string|max:1000'
        ]);

        return DB::transaction(function () use ($validated) {
            $applications = Application::whereIn('id', $validated['ids'])->get();
            $count = 0;

            foreach ($applications as $application) {
                $application->update(['status' => $validated['status']]);
                
                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => $validated['status'],
                    'notes' => strip_tags($validated['notes'] ?? 'Bulk update status'),
                    'created_at' => now()
                ]);
                $count++;
            }

            return response()->json([
                'message' => "$count lamaran berhasil diperbarui",
                'updated_count' => $count
            ]);
        });
    }

    /**
     * Bulk soft delete applications.
     */
    public function deleteApplications(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:applications,id'
        ]);

        $count = Application::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'message' => "$count lamaran berhasil dihapus (soft delete)",
            'deleted_count' => $count
        ]);
    }

    /**
     * Bulk soft delete jobs.
     */
    public function deleteJobs(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:jobs,id'
        ]);

        $count = Job::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'message' => "$count lowongan berhasil dihapus (soft delete)",
            'deleted_count' => $count
        ]);
    }

    /**
     * Bulk soft delete users.
     */
    public function deleteUsers(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        // Prevents deleting self
        $ids = array_diff($validated['ids'], [auth()->id()]);
        
        $count = User::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => "$count user berhasil dihapus (soft delete)",
            'deleted_count' => $count
        ]);
    }
}
