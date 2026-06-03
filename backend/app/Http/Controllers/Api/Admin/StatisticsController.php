<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\StatisticsService;

class StatisticsController extends Controller
{
    protected $statisticsService;

    public function __construct(StatisticsService $statisticsService)
    {
        $this->statisticsService = $statisticsService;
    }

    /**
     * DASHBOARD SUMMARY.
     */
    public function dashboard(Request $request)
    {
        $summary = $this->statisticsService->getDashboardSummary($request->query('period', 'daily'));
        return response()->json($summary);
    }

    /**
     * APPLICANTS PER JOB.
     */
    public function applicationsPerJob()
    {
        $jobs = $this->statisticsService->getApplicationsPerJob();
        return response()->json($jobs);
    }

    /**
     * STAGE STATISTICS.
     */
    public function stageStatistics()
    {
        $stats = $this->statisticsService->getStageStatistics();
        return response()->json($stats);
    }

    /**
     * APPLICANTS PER MONTH.
     */
    public function applicationsPerMonth()
    {
        $data = $this->statisticsService->getApplicationsPerMonth();
        return response()->json($data);
    }

    /**
     * APPLICATIONS PENDING GRADING.
     */
    public function pendingGrading()
    {
        $items = $this->statisticsService->getPendingGrading();

        return response()->json([
            'count' => $items->count(),
            'items' => $items,
        ]);
    }
}