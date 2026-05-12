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


// PUBLIC ROUTES

Route::prefix('auth')->group(function () {

    Route::post('/register', [
        AuthController::class,
        'register'
    ]);

    Route::post('/login', [
        AuthController::class,
        'login'
    ]);
});


// JOB PUBLIC ROUTES

Route::prefix('jobs')->group(function () {

    // semua lowongan
    Route::get('/', [
        JobController::class,
        'index'
    ]);

    // detail lowongan
    Route::get('/{id}', [
        JobController::class,
        'show'
    ]);

    // lowongan berdasarkan kategori
    Route::get('/category/{category}', [
        JobController::class,
        'byCategory'
    ]);

    // form fields lowongan
    Route::get('/{id}/form', [
        JobController::class,
        'getForm'
    ]);
});


// AUTHENTICATED USER ROUTES

Route::middleware('auth:sanctum')->group(function () {

    //  USER

    Route::prefix('auth')->group(function () {

        Route::post('/logout', [
            AuthController::class,
            'logout'
        ]);

        Route::get('/me', function (Request $request) {

            $token = $request->bearerToken();

            return response()->json([
                'user' => $request->user(),
                'token' => $token
            ]);
        });
    });


    // APPLICATIONS (USER)

    Route::prefix('applications')->group(function () {

        // apply lamaran
        Route::post('/', [
            ApplicationController::class,
            'apply'
        ]);

        // riwayat lamaran user
        Route::get('/my', [
            ApplicationController::class,
            'myApplications'
        ]);
    });
});



// ADMIN ROUTES

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // JOB MANAGEMENT

    Route::prefix('jobs')->group(function () {

        // create lowongan
        Route::post('/', [
            JobController::class,
            'store'
        ]);

        // update lowongan
        Route::put('/{id}', [
            JobController::class,
            'update'
        ]);

        // delete lowongan
        Route::delete('/{id}', [
            JobController::class,
            'destroy'
        ]);
    });


    // APPLICATION MANAGEMENT
    
    Route::prefix('applications')->group(function () {

        // semua lamaran
        Route::get('/', [
            ApplicationAdminController::class,
            'index'
        ]);

        // search lamaran
        Route::get('/search', [
            ApplicationAdminController::class,
            'search'
        ]);

        // detail lamaran
        Route::get('/{id}', [
            ApplicationAdminController::class,
            'show'
        ]);

        // update status lamaran
        Route::put('/{id}', [
            ApplicationAdminController::class,
            'updateStatus'
        ]);

        // seluruh stage milik application
        Route::get('/{id}/stages', [
            ApplicationAdminController::class,
            'applicationStages'
        ]);
    });


    // STAGE RESULTS

    Route::prefix('stage-results')->group(function () {

        // semua hasil stage
        Route::get('/', [
            ApplicationAdminController::class,
            'allStageResults'
        ]);

        // update hasil stage
        Route::put('/{id}', [
            ApplicationAdminController::class,
            'updateStageResult'
        ]);
    });


    // FORM FIELDS

    Route::prefix('form-fields')->group(function () {

        // create field
        Route::post('/', [
            FormFieldController::class,
            'store'
        ]);

        // semua fields
        Route::get('/', [
            FormFieldController::class,
            'index'
        ]);
    });


    // REPORTS & EXPORT

    Route::prefix('reports')->group(function () {

        // statistik umum
        Route::get('/statistics', [
            ReportController::class,
            'statistics'
        ]);

        // export applications
        Route::get('/export/applications', [
            ReportController::class,
            'exportApplications'
        ]);
    });


    // STATISTICS
    
    Route::prefix('statistics')->group(function () {

        // dashboard
        Route::get('/dashboard', [
            StatisticsController::class,
            'dashboard'
        ]);

        // jumlah pelamar per lowongan
        Route::get('/applications-per-job', [
            StatisticsController::class,
            'applicationsPerJob'
        ]);

        // statistik tahapan
        Route::get('/stages', [
            StatisticsController::class,
            'stageStatistics'
        ]);

        // statistik bulanan
        Route::get('/applications-per-month', [
            StatisticsController::class,
            'applicationsPerMonth'
        ]);
    });
});