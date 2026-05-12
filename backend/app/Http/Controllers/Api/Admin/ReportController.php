<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ApplicationsExport;

class ReportController extends Controller
{
    public function statistics()
    {
        return response()->json([
            'total_jobs' => Job::count(),
            'total_applications' => Application::count(),
            'total_users' => User::count(),

            'accepted' => Application::where('status', 'diterima')->count(),

            'rejected' => Application::where('status', 'ditolak')->count(),
        ]);
    }

    public function exportApplications()
    {
        return Excel::download(
            new ApplicationsExport,
            'applications.xlsx'
        );
    }
}