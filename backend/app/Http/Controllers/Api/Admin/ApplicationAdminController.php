<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use App\Notifications\ApplicationStatusUpdated;
use App\Models\JobStage;
use App\Models\ApplicationStageResult;

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

        $application->user->notify(
            new ApplicationStatusUpdated($application)
        );
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
        $request->validate([
            'status' => 'required|in:pending,passed,failed',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {

            $stageResult = ApplicationStageResult::findOrFail($id);

            $application = Application::findOrFail(
                $stageResult->application_id
            );

            $stageResult->update([
                'status' => $request->status,
                'notes' => $request->notes,
                'processed_at' => now(),
            ]);

            $currentStage = JobStage::findOrFail(
                $stageResult->job_stage_id
            );

            if ($request->status === 'failed') {

                $application->update([
                    'status' => 'rejected'
                ]);

                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => 'rejected',
                    'notes' => $request->notes,
                    'changed_by' => auth()->id(),
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Pelamar gagal pada tahap ini',
                    'data' => $stageResult
                ]);
            }

            $nextStage = JobStage::where('job_id', $application->job_id)
                ->where('stage_order', '>', $currentStage->stage_order)
                ->orderBy('stage_order')
                ->first();


            if ($request->status === 'passed' && $nextStage) {

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
                    'status' => 'in_progress'
                ]);

                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => 'in_progress',
                    'notes' => 'Lolos ke tahap berikutnya',
                    'changed_by' => auth()->id(),
                ]);
            }


            if ($request->status === 'passed' && !$nextStage) {

                $application->update([
                    'status' => 'accepted'
                ]);

                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => 'accepted',
                    'notes' => 'Pelamar diterima',
                    'changed_by' => auth()->id(),
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Stage berhasil diupdate',
                'data' => $stageResult
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}