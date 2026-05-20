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
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }
}