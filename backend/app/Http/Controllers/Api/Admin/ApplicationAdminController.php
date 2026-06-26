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
        try {
            // Kita panggil service utama Anda
            $applications = $this->applicationService->getApplications($request->all());
            
            // Jika service mengembalikan data mentah kosong atau error tersembunyi, 
            // pastikan response distruktur dengan baik agar React tidak membaca data undefined.
            return response()->json($applications, 200);
            
        } catch (\Throwable $e) {
            // Log error asli ke storage/logs/laravel.log agar Anda bisa melacak baris mana yang rusak di Service
            Log::error('Error fetching admin applications: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            // Kembalikan detail error ke React Network Tab agar Anda langsung tahu masalahnya tanpa menebak-nebak
            return response()->json([
                'message' => 'Terjadi kesalahan saat memuat data pendaftar.',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Show application detail.
     */
    public function show($id)
    {
        try {
            $application = Application::with([
                'user',
                'job.stages', // 🚀 Pastikan stages dari job di-eager load juga
                'documents',
                'answers.formField',
                'histories',
                'stageResults.stage'
            ])->findOrFail($id);

            // 🚀 Solusi Aman: Pastikan properti job tidak null sebelum memproses stages
            $activeStage = null;
            if ($application->job && isset($application->job->stages)) {
                $activeStage = collect($application->job->stages)->first(function($stage) {
                    return $stage->start_date && $stage->end_date && now()->between($stage->start_date, $stage->end_date);
                });
            }

            // Jika tidak ada yang aktif (misal semua tanggal sudah lewat), fallback ke stage terakhir yang diikuti pelamar
            if (!$activeStage && $application->stageResults && $application->stageResults->isNotEmpty()) {
                $lastResult = $application->stageResults->sortByDesc('created_at')->first();
                $activeStage = $lastResult ? $lastResult->stage : null;
            }

            // Ubah model menjadi array agar kita bisa menyisipkan field tambahan untuk React
            $responseData = $application->toArray();

            // 🚀 Sisipkan data tanggal tahapan yang paling update ke level teratas JSON
            $responseData['current_stage_start_date'] = $activeStage ? $activeStage->start_date : null;
            $responseData['current_stage_end_date'] = $activeStage ? $activeStage->end_date : null;

            return response()->json($responseData);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
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