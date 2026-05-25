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
            Route::put('/update-profile', [AuthController::class, 'updateProfile']);
            Route::put('/change-password', [AuthController::class, 'changePassword']);
            Route::get('/me', function (Request $request) {
                return response()->json([
                    'user'  => $request->user(),
                    'token' => $request->bearerToken(),
                ]);
            });
        });

        // Applicant Applications
        Route::prefix('applications')->group(function () {
            Route::get('/my', [ApplicationController::class, 'myApplications']);
            Route::post('/', [ApplicationController::class, 'apply']);
        });

        // User Master Documents
        Route::prefix('user-documents')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\UserDocumentController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Api\UserDocumentController::class, 'store']);
            Route::delete('/{id}', [\App\Http\Controllers\Api\UserDocumentController::class, 'destroy']);
        });

        // --- STAFF ROUTES (admin + penyeleksi) ---
        Route::prefix('admin')->middleware('staff')->group(function () {
            // View all registered users (role = user)
            Route::get('/users/registered', [AdminUserController::class, 'users']);

            // Applications — read & grade (penyeleksi needs these)
            Route::prefix('applications')->group(function () {
                Route::get('/', [ApplicationAdminController::class, 'index']);
                Route::post('/{id}/init-stage', [ApplicationAdminController::class, 'initStage']);
                Route::get('/{id}/stages', [ApplicationAdminController::class, 'applicationStages']);
                Route::put('/stages/{id}', [ApplicationAdminController::class, 'updateStageResult']);
                Route::get('/{id}', [ApplicationAdminController::class, 'show']);
            });

            // Pending grading notification (accessible by admin & penyeleksi)
            Route::get('/statistics/pending-grading', [StatisticsController::class, 'pendingGrading']);
        });

        // --- ADMIN-ONLY ROUTES ---
        Route::prefix('admin')->middleware('admin')->group(function () {

            // Jobs CRUD
            Route::apiResource('jobs', JobController::class)->only(['store', 'update', 'destroy']);

            // Bulk Operations
            Route::prefix('bulk')->group(function () {
                Route::post('/applications/status', [BulkOperationController::class, 'updateApplicationStatus']);
                Route::post('/applications/delete', [BulkOperationController::class, 'deleteApplications']);
                Route::post('/jobs/delete', [BulkOperationController::class, 'deleteJobs']);
                Route::post('/users/delete', [BulkOperationController::class, 'deleteUsers']);
            });

            // Applications — admin-only actions
            Route::put('/applications/{id}/status', [ApplicationAdminController::class, 'updateStatus']);

            // Statistics
            Route::prefix('statistics')->group(function () {
                Route::get('/dashboard', [StatisticsController::class, 'dashboard']);
                Route::get('/jobs', [StatisticsController::class, 'applicationsPerJob']);
                Route::get('/stages', [StatisticsController::class, 'stageStatistics']);
                Route::get('/monthly', [StatisticsController::class, 'applicationsPerMonth']);
            });

            // Reports
            Route::prefix('reports')->group(function () {
                Route::get('/closed-jobs', [ReportController::class, 'closedJobs']);
                Route::get('/export/{job_id}', [ReportController::class, 'exportApplications']);
            });

            // Documents
            Route::get('/documents/{id}/download', [DocumentController::class, 'download']);

            // Admin hierarchy management (admin users only, not regular users)
            Route::apiResource('users', AdminUserController::class)->only(['index', 'store', 'update']);

            // Registered users management (role = user)
            Route::put('/users/registered/{id}', [AdminUserController::class, 'updateUser']);
            Route::post('/users/registered/{id}/toggle-verification', [AdminUserController::class, 'toggleVerification']);

            // Form Fields
            Route::apiResource('form-fields', FormFieldController::class)->only(['index', 'store']);
        });
    });
});