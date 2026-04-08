<?php

use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UsageController;
use App\Http\Controllers\Api\UserAgentController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\MfaController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Middleware\AiTimeout;
use Illuminate\Support\Facades\Route;

// Public routes (no auth required)
Route::get('/health', function () {
    $checks = ['status' => 'ok', 'timestamp' => now()->toISOString()];

    // Verify database is reachable
    try {
        \DB::connection()->getPdo();
        $checks['database'] = 'connected';
    } catch (\Throwable $e) {
        $checks['database'] = 'unreachable';
        $checks['status'] = 'degraded';
    }

    $code = $checks['status'] === 'ok' ? 200 : 503;

    return response()->json($checks, $code);
});

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/mfa/verify-login', [MfaController::class, 'verifyLogin']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/avatar', [AuthController::class, 'updateAvatar']);
    Route::patch('/user/onboarded', [AuthController::class, 'markOnboarded']);

    // MFA
    Route::post('/mfa/enable', [MfaController::class, 'enable']);
    Route::post('/mfa/verify', [MfaController::class, 'verify']);
    Route::post('/mfa/disable', [MfaController::class, 'disable']);

    // User's agents (workspace)
    Route::get('/user/agents', [UserAgentController::class, 'index']);
    Route::post('/user/agents/{agent}', [UserAgentController::class, 'store']);
    Route::delete('/user/agents/{agent}', [UserAgentController::class, 'destroy']);

    // All agents (discovery)
    Route::get('/agents', [AgentController::class, 'index']);
    Route::get('/agents/search', [AgentController::class, 'search']);
    Route::get('/agents/{agent}', [AgentController::class, 'show']);
    Route::post('/agents/{agent}/generate', [AgentController::class, 'generate']);
    Route::post('/agents/{agent}/submit', [AgentController::class, 'submit'])->middleware(AiTimeout::class);

    // Library
    Route::get('/library', [LibraryController::class, 'index']);
    Route::post('/library', [LibraryController::class, 'store']);
    Route::delete('/library/{library}', [LibraryController::class, 'destroy']);

    // Usage
    Route::get('/usage', [UsageController::class, 'index']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Feedback
    Route::get('/feedback', [FeedbackController::class, 'index']);
    Route::post('/feedback', [FeedbackController::class, 'store']);

    // Feature flags
    Route::get('/config/features', fn () => response()->json([
        'payments_enabled' => ! empty(config('services.paystack.secret_key')),
    ]));

    // Chatbot Knowledge Base
    Route::get('/chatbot/knowledge', [\App\Http\Controllers\ChatbotKnowledgeController::class, 'index']);

    // File upload (standalone for voice notes and media)
    Route::post('/files/upload', [\App\Http\Controllers\Api\FileUploadController::class, 'store']);

    // Admin routes (admin + super_admin)
    Route::middleware('can:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{user}', [AdminController::class, 'showUser']);
        Route::patch('/users/{user}', [AdminController::class, 'updateUser']);
        Route::put('/users/{user}/block', [AdminController::class, 'blockUser']);
        Route::put('/users/{user}/unblock', [AdminController::class, 'unblockUser']);
        Route::get('/agents', [AdminController::class, 'agents']);
        Route::post('/agents', [AdminController::class, 'createAgent']);
        Route::patch('/agents/{agent}', [AdminController::class, 'updateAgent']);
        Route::get('/logs', [AdminController::class, 'logs']);
        Route::get('/feedback', [FeedbackController::class, 'adminIndex']);
        Route::post('/announcements', [NotificationController::class, 'broadcast']);

        // Chatbot Knowledge CRUD
        Route::get('/chatbot/knowledge', [\App\Http\Controllers\ChatbotKnowledgeController::class, 'index']);
        Route::post('/chatbot/knowledge', [\App\Http\Controllers\ChatbotKnowledgeController::class, 'store']);
        Route::patch('/chatbot/knowledge/{knowledge}', [\App\Http\Controllers\ChatbotKnowledgeController::class, 'update']);
        Route::delete('/chatbot/knowledge/{knowledge}', [\App\Http\Controllers\ChatbotKnowledgeController::class, 'destroy']);
    });

    // Super admin only routes
    Route::middleware('can:super_admin')->prefix('admin')->group(function () {
        Route::put('/users/{user}/promote', [AdminController::class, 'promoteUser']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    });
});
