<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ApplicationsExport;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * List jobs that have passed their deadline (closed).
     */
    public function closedJobs()
    {
        $jobs = Job::where('deadline', '<', Carbon::now())
            ->withCount('applications')
            ->get();

        return response()->json([
            'message' => 'Closed jobs retrieved successfully',
            'data' => $jobs
        ]);
    }

    /**
     * Export applications for a specific job.
     */
    public function exportApplications($job_id)
    {
        $job = Job::findOrFail($job_id);
        
        $filename = 'pelamar-' . str_replace(' ', '-', strtolower($job->title)) . '-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new ApplicationsExport($job_id),
            $filename
        );
    }
}
