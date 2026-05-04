<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/category/{category}', [JobController::class, 'byCategory']);


Route::middleware('auth:sanctum')->group(function () {

    // logout
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/apply', [ApplicationController::class, 'apply']);
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);

});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/admin/applications', [ApplicationController::class, 'allApplications']);
    Route::put('/admin/applications/{id}', [ApplicationController::class, 'updateStatus']);

});