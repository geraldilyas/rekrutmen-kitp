<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicFileController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/storage/{path}', [PublicFileController::class, 'show'])
    ->where('path', '.*')
    ->name('storage.show');