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
        $application = Application::create([
            'user_id' => auth()->id(),
            'job_id' => $request->job_id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        foreach ($request->answers as $item) {
            $application->answers()->create([
                'form_field_id' => $item['field_id'],
                'answer' => $item['value']
            ]);
        }

        return response()->json(['message' => 'Berhasil melamar']);
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