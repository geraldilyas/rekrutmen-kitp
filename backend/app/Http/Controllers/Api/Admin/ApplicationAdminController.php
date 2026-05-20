<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use App\Models\JobStage;
use App\Models\ApplicationStageResult;
use App\Notifications\ApplicationStatusUpdated;

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

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->latest()->get());
    }

    public function search(Request $request)
    {
        $keyword = $request->keyword;

        $applications = Application::with(['user', 'job'])
            ->whereHas('user', function ($query) use ($keyword) {
                $query->where('name', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%");
            })
            ->get();

        return response()->json($applications);
    }

    //  DETAIL lamaran
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

    //  VALIDASI lamaran
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,seleksi,Lulus,Tidak Lulus',
            'notes' => 'nullable|string|max:1000'
        ]);

        $application = Application::findOrFail($id);

        // update status
        $application->update([
            'status' => $validated['status']
        ]);

        // simpan histori
        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => $validated['status'],
            'notes' => strip_tags($validated['notes'] ?? ''),
            'created_at' => now()
        ]);

        // Send notification if exists
        try {
            if ($application->user) {
                $application->user->notify(new ApplicationStatusUpdated($application));
            }
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Illuminate\Support\Facades\Log::error("Failed to send notification: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'data' => $application
        ]);
    }

    public function applicationStages($id)
    {
        $application = \App\Models\Application::with([
            'job.stages',
            'stageResults.stage'
        ])->find($id);

        if (!$application) {
            return response()->json([
                'message' => 'Application not found'
            ], 404);
        }

        $stages = $application->job->stages->map(function ($stage) use ($application) {

            $result = $application->stageResults
                ->where('job_stage_id', $stage->id)
                ->first();

            return [
                'stage_id' => $stage->id,
                'stage_name' => $stage->stage_name,
                'stage_order' => $stage->stage_order,
                'start_date' => $stage->start_date,
                'end_date' => $stage->end_date,

                'result' => $result ? $result->result : 'pending',
                'score' => $result ? $result->score : null,
                'notes' => $result ? $result->notes : null,
                'updated_at' => $result ? $result->updated_at : null,
            ];
        });

        return response()->json([
            'message' => 'Application stages retrieved successfully',
            'application_id' => $application->id,
            'applicant' => $application->user->name ?? null,
            'job' => $application->job->title ?? null,
            'stages' => $stages
        ]);
    }

    public function updateStageResult(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,lulus,tidak_lulus',
            'score' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string|max:1000'
        ]);

        DB::beginTransaction();

        try {

            $stageResult = ApplicationStageResult::findOrFail($id);

            $application = Application::findOrFail(
                $stageResult->application_id
            );

            $stageResult->update([
                'status' => $validated['status'],
                'score' => $validated['score'],
                'notes' => strip_tags($validated['notes'] ?? ''),
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id()
            ]);

            $currentStage = JobStage::findOrFail(
                $stageResult->job_stage_id
            );

            if ($validated['status'] === 'tidak_lulus') {

                $application->update([
                    'status' => 'Tidak Lulus'
                ]);

                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => 'Tidak Lulus',
                    'notes' => 'Gagal pada tahap: ' . $currentStage->name . '. ' . ($validated['notes'] ?? ''),
                    'created_at' => now(),
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Pelamar dinyatakan Tidak Lulus',
                    'data' => $stageResult
                ]);
            }

            $nextStage = JobStage::where('job_id', $application->job_id)
                ->where('stage_order', '>', $currentStage->stage_order)
                ->orderBy('stage_order')
                ->first();


            if ($validated['status'] === 'lulus' && $nextStage) {

                $existingNextStage = ApplicationStageResult::where(
                    'application_id',
                    $application->id
                )
                ->where('job_stage_id', $nextStage->id)
                ->first();

                if (!$existingNextStage) {

                    ApplicationStageResult::create([
                        'application_id' => $application->id,
                        'job_stage_id' => $nextStage->id,
                        'status' => 'pending',
                    ]);
                }

                $application->update([
                    'status' => 'seleksi'
                ]);

                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => 'seleksi',
                    'notes' => 'Lolos tahap ' . $currentStage->name . '. Lanjut ke tahap berikutnya.',
                    'created_at' => now(),
                ]);
            }


            if ($validated['status'] === 'lulus' && !$nextStage) {
                // Kalkulasi Skor Akhir jika ini tahap terakhir
                $allResults = ApplicationStageResult::where('application_id', $application->id)->get();
                $finalScore = 0;
                
                foreach ($allResults as $res) {
                    $stage = JobStage::find($res->job_stage_id);
                    $weight = $stage ? $stage->weight : 0;
                    $finalScore += ($res->score * ($weight / 100));
                }

                $application->update([
                    'status' => 'Lulus',
                    'final_score' => $finalScore
                ]);

                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => 'Lulus',
                    'notes' => 'Pelamar diterima dengan skor akhir: ' . $finalScore,
                    'created_at' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Status tahapan berhasil diperbarui',
                'data' => $stageResult->load('stage')
            ]);

        } catch (\Exception $e) {

            DB::rollBack();
            
            \Log::error('Error updating stage result: ' . $e->getMessage(), [
                'id' => $id,
                'status' => $request->status,
                'score' => $request->score,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}