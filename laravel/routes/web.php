<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return response()->json([
        'status' => false,
        'message' => 'You are logged out.',
    ]);
})->name('login');
