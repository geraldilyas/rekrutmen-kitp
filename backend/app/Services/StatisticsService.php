<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use App\Models\ApplicationStageResult;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticsService
{
    /**
     * Get dashboard summary statistics.
     */
    public function getDashboardSummary(string $period = 'daily')
    {
        $trendStats = $this->getTrendStats($period);

        return [
            'total_jobs' => Job::count(),
            'total_applications' => Application::count(),
            'total_applicants' => User::where('role', 'user')->count(),
            'applications_by_status' => Application::select('status', DB::raw('count(*) as total'))
                ->groupBy('status')->get(),
            'applications_by_category' => Job::select('category', DB::raw('count(*) as total'))
                ->groupBy('category')->get(),
            'trend_stats' => $trendStats,
        ];
    }

    protected function getTrendStats(string $period)
    {
        if ($period === 'monthly') {
            return Application::select(
                    DB::getDriverName() === 'mysql'
                        ? DB::raw('DATE_FORMAT(created_at, "%b %Y") as date')
                        : DB::raw('strftime("%m-%Y", created_at) as date'),
                    DB::raw('COUNT(*) as applicants'),
                    DB::raw('SUM(CASE WHEN status = "Lulus" THEN 1 ELSE 0 END) as accepted')
                )
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupBy('date')
                ->orderBy(DB::raw('MIN(created_at)'))
                ->get();
        }

        return Application::select(
                DB::getDriverName() === 'mysql'
                    ? DB::raw('DATE(created_at) as date')
                    : DB::raw('date(created_at) as date'),
                DB::raw('COUNT(*) as applicants'),
                DB::raw('SUM(CASE WHEN status = "Lulus" THEN 1 ELSE 0 END) as accepted')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    /**
     * Get applications count per job.
     */
    public function getApplicationsPerJob()
    {
        return Job::withCount(['applications' => function ($q) {
            $q->withoutGlobalScopes();
        }])->get();
    }

    /**
     * Get statistics per selection stage.
     */
    public function getStageStatistics()
    {
        return ApplicationStageResult::select(
                'job_stage_id',
                'status',
                DB::raw('count(*) as total')
            )
            ->with('stage:id,name')
            ->groupBy('job_stage_id', 'status')
            ->get();
    }

    /**
     * Get applications count per month.
     */
    public function getApplicationsPerMonth()
    {
        return Application::select(
                DB::getDriverName() === 'mysql'
                    ? DB::raw('MONTH(created_at) as month')
                    : DB::raw('strftime("%m", created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Get list of applications pending grading.
     */
    public function getPendingGrading()
    {
        $today = Carbon::today()->toDateString();

        return ApplicationStageResult::with([
                'application.user',
                'application.job',
                'stage'
            ])
            ->where('status', 'pending')
            ->whereHas('stage', function ($q) use ($today) {
                $q->whereNotNull('start_date')
                  ->where('start_date', '<=', $today);
            })
            ->get()
            ->map(function ($result) {
                return [
                    'application_id' => $result->application_id,
                    'user_name'      => $result->application->user->name ?? '-',
                    'job_title'      => $result->application->job->title ?? '-',
                    'job_id'         => $result->application->job_id,
                    'stage_name'     => $result->stage->name ?? '-',
                    'stage_start_date' => $result->stage->start_date,
                ];
            });
    }
}
