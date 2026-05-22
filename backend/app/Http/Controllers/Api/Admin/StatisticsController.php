<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use App\Models\ApplicationStageResult;
use App\Models\JobStage;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    // DASHBOARD SUMMARY
    public function dashboard()
    {
        return response()->json([
            'total_jobs' => Job::count(),

            'total_applications' => Application::count(),

            'total_applicants' => User::where('role', 'user')->count(),

            'applications_by_status' => Application::select(
                    'status',
                    DB::raw('count(*) as total')
                )
                ->groupBy('status')
                ->get(),

            'applications_by_category' => Job::select(
                    'category',
                    DB::raw('count(*) as total')
                )
                ->groupBy('category')
                ->get(),
            
            'monthly_stats' => Application::select(
                    DB::getDriverName() === 'mysql'
                        ? DB::raw('DATE_FORMAT(created_at, "%b") as month')
                        : DB::raw('strftime("%m", created_at) as month'),
                    DB::raw('COUNT(*) as applicants'),
                    DB::raw('SUM(CASE WHEN status = "Lulus" THEN 1 ELSE 0 END) as accepted')
                )
                ->groupBy('month')
                ->orderBy(DB::raw('MIN(created_at)'))
                ->get(),
            ]);
            }

            // PELAMAR PER LOWONGAN
            public function applicationsPerJob()
            {
            $jobs = Job::withCount('applications')->get();

            return response()->json($jobs);
            }

            // STATISTIK TAHAPAN
            public function stageStatistics()
            {
            $stats = ApplicationStageResult::select(
                'job_stage_id',
                'status',
                DB::raw('count(*) as total')
            )
            ->with('stage:id,name')
            ->groupBy('job_stage_id', 'status')
            ->get();

            return response()->json($stats);
            }

            // PELAMAR PER BULAN
            public function applicationsPerMonth()
            {
            $data = Application::select(
                DB::getDriverName() === 'mysql'
                    ? DB::raw('MONTH(created_at) as month')
                    : DB::raw('strftime("%m", created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

            return response()->json($data);
            }

            // LAMARAN YANG BELUM DINILAI (tahap sudah dimulai)
            public function pendingGrading()
            {
                $today = \Carbon\Carbon::today()->toDateString();

                $results = ApplicationStageResult::with([
                        'application.user',
                        'application.job',
                        'stage'
                    ])
                    ->where('status', 'pending')
                    ->whereHas('stage', function ($q) use ($today) {
                        $q->whereNotNull('start_date')
                          ->where('start_date', '<=', $today);
                    })
                    ->get();

                $items = $results->map(function ($result) {
                    return [
                        'application_id' => $result->application_id,
                        'user_name'      => $result->application->user->name ?? '-',
                        'job_title'      => $result->application->job->title ?? '-',
                        'job_id'         => $result->application->job_id,
                        'stage_name'     => $result->stage->name ?? '-',
                        'stage_start_date' => $result->stage->start_date,
                    ];
                });

                return response()->json([
                    'count' => $items->count(),
                    'items' => $items,
                ]);
            }
            }