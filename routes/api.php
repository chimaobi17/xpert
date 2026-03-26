<?php

use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UsageController;
use App\Http\Controllers\Api\Admin\AdminController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Agents
    Route::get('/agents', [AgentController::class, 'index']);
    Route::get('/agents/{agent}', [AgentController::class, 'show']);
    Route::post('/agents/{agent}/generate', [AgentController::class, 'generate']);

    // Library
    Route::get('/library', [LibraryController::class, 'index']);
    Route::post('/library', [LibraryController::class, 'store']);
    Route::delete('/library/{library}', [LibraryController::class, 'destroy']);

    // Usage
    Route::get('/usage', [UsageController::class, 'index']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);

    // Admin routes
    Route::middleware('can:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{user}', [AdminController::class, 'showUser']);
        Route::patch('/users/{user}', [AdminController::class, 'updateUser']);
        Route::get('/agents', [AdminController::class, 'agents']);
        Route::patch('/agents/{agent}', [AdminController::class, 'updateAgent']);
        Route::get('/logs', [AdminController::class, 'logs']);
    });
});
