<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\ApplicationStageResult;
use App\Services\ApplicationService;
use Illuminate\Support\Facades\Log;

class ApplicationAdminController extends Controller
{
    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * GET all applications with filters.
     */
    public function index(Request $request)
    {
        $applications = $this->applicationService->getApplications($request->all());
        return response()->json($applications);
    }

    /**
     * Show application detail.
     */
    public function show($id)
    {
        $application = Application::with([
            'user',
            'job',
            'documents',
            'answers.formField',
            'histories',
            'stageResults.stage'
        ])->findOrFail($id);

        return response()->json($application);
    }

    /**
     * Update application overall status.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,seleksi,Lulus,Tidak Lulus',
            'notes' => 'nullable|string|max:1000'
        ]);

        $application = Application::findOrFail($id);
        $result = $this->applicationService->updateApplicationStatus($application, $validated);

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'data' => $result
        ]);
    }

    /**
     * Initialize the selection stage for an application.
     */
    public function initStage($id)
    {
        try {
            $application = Application::with('job.stages')->findOrFail($id);
            $result = $this->applicationService->initializeFirstStage($application);

            return response()->json(['message' => 'Seleksi dimulai', 'data' => $result]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Get stages for an application.
     */
    public function applicationStages($id)
    {
        $application = Application::with(['job.stages', 'stageResults.stage'])->find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        $stages = $this->applicationService->getApplicationStages($application);

        return response()->json([
            'message' => 'Application stages retrieved successfully',
            'application_id' => $application->id,
            'applicant' => $application->user->name ?? null,
            'job' => $application->job->title ?? null,
            'stages' => $stages
        ]);
    }

    /**
     * Update the result of a selection stage.
     */
    public function updateStageResult(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,lulus,tidak_lulus',
            'score' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            $stageResult = ApplicationStageResult::findOrFail($id);
            $result = $this->applicationService->updateStageResult($stageResult, $validated);

            $message = $validated['status'] === 'tidak_lulus' 
                ? 'Pelamar dinyatakan Tidak Lulus' 
                : 'Status tahapan berhasil diperbarui';

            return response()->json([
                'message' => $message,
                'data' => $result->load('stage')
            ]);
        } catch (\Exception $e) {
            $code = $e->getCode() ?: 500;
            
            Log::error('Error updating stage result: ' . $e->getMessage(), [
                'id' => $id,
                'status' => $request->status,
                'score' => $request->score,
            ]);

            return response()->json([
                'message' => $code == 500 ? 'Terjadi kesalahan' : $e->getMessage(),
                'error' => $e->getMessage()
            ], is_numeric($code) && $code >= 100 && $code < 600 ? $code : 500);
        }
    }

    /**
     * Delete an application.
     */
    public function destroy($id)
    {
        $application = Application::findOrFail($id);
        $this->applicationService->deleteApplication($application);

        return response()->json(['message' => 'Lamaran berhasil dihapus']);
    }
}