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


    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/admin/applications', [ApplicationAdminController::class, 'index']);
    Route::get('/admin/applications/{id}', [ApplicationAdminController::class, 'show']);
    Route::put('/admin/applications/{id}', [ApplicationAdminController::class, 'updateStatus']);
    Route::post('/form-fields', [FormFieldController::class, 'store']);
    Route::get('/form-fields', [FormFieldController::class, 'index']);
    Route::post('/apply', [ApplicationController::class, 'apply']);
