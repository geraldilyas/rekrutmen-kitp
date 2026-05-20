<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// CONTROLLERS
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\FormFieldController;
use App\Http\Controllers\Api\Admin\ApplicationAdminController;
use App\Http\Controllers\Api\Admin\StatisticsController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\DocumentController;
use App\Http\Controllers\Api\Admin\BulkOperationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- PUBLIC ROUTES ---

// Authentication
Route::prefix('auth')->middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('throttle:api')->group(function () {
    // Jobs (Public access)
    Route::prefix('jobs')->group(function () {
        Route::get('/', [JobController::class, 'index']); 
        Route::get('/{id}', [JobController::class, 'show']);
        Route::get('/{id}/form', [JobController::class, 'getForm']);
    });


    // --- AUTHENTICATED ROUTES ---

    Route::middleware('auth:sanctum')->group(function () {

        // User Profile & Logout
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', function (Request $request) {
                return response()->json([
                    'user' => $request->user(),
                    'token' => $request->bearerToken()
                ]);
            });
        });

        // Applicant Applications
        Route::prefix('applications')->group(function () {
            Route::get('/my', [ApplicationController::class, 'myApplications']);
            Route::post('/', [ApplicationController::class, 'apply']);
        });

        // Admin Specific Endpoints
        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::apiResource('jobs', JobController::class)->only(['store', 'update', 'destroy']);

            // Bulk Operations
            Route::prefix('bulk')->group(function () {
                Route::post('/applications/status', [BulkOperationController::class, 'updateApplicationStatus']);
                Route::post('/applications/delete', [BulkOperationController::class, 'deleteApplications']);
                Route::post('/jobs/delete', [BulkOperationController::class, 'deleteJobs']);
                Route::post('/users/delete', [BulkOperationController::class, 'deleteUsers']);
            });

            Route::prefix('applications')->group(function () {                Route::get('/', [ApplicationAdminController::class, 'index']);
                Route::get('/{id}', [ApplicationAdminController::class, 'show']);
                Route::put('/{id}/status', [ApplicationAdminController::class, 'updateStatus']);
                Route::get('/{id}/stages', [ApplicationAdminController::class, 'applicationStages']);
                Route::put('/stages/{id}', [ApplicationAdminController::class, 'updateStageResult']);
            });

            Route::prefix('statistics')->group(function () {
                Route::get('/dashboard', [StatisticsController::class, 'dashboard']);
                Route::get('/jobs', [StatisticsController::class, 'applicationsPerJob']);
                Route::get('/stages', [StatisticsController::class, 'stageStatistics']);
                Route::get('/monthly', [StatisticsController::class, 'applicationsPerMonth']);
            });

            Route::prefix('reports')->group(function () {
                Route::get('/closed-jobs', [ReportController::class, 'closedJobs']);
                Route::get('/export/{job_id}', [ReportController::class, 'exportApplications']);
            });

            Route::get('/documents/{id}/download', [DocumentController::class, 'download']);

            Route::apiResource('users', AdminUserController::class)->only(['index', 'store']);

            Route::apiResource('form-fields', FormFieldController::class)->only(['index', 'store']);
        });
    });
});
