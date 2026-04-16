<?php

use App\Http\Middleware\CheckBanStatus;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\ThreatDetection;
use App\Http\Middleware\ValidateOrigin;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\ThrottleRequestsException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(SecurityHeaders::class);
        $middleware->append(ThreatDetection::class);
        $middleware->appendToGroup('api', [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            CheckBanStatus::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (ValidationException $e) {
            $errors = $e->errors();

            return response()->json([
                'error' => 'validation_failed',
                'message' => 'Some fields are invalid.',
                'retry' => false,
                'upgrade' => false,
                'errors' => $errors,
                'details' => $errors,
            ], 422);
        });

        $exceptions->renderable(function (AuthenticationException $e) {
            return response()->json([
                'error' => 'auth_required',
                'message' => 'You must be logged in to access this resource.',
                'retry' => false,
                'upgrade' => false,
            ], 401);
        });

        $exceptions->renderable(function (AuthorizationException $e) {
            return response()->json([
                'error' => 'forbidden',
                'message' => 'You do not have permission to perform this action.',
                'retry' => false,
                'upgrade' => false,
            ], 403);
        });

        $exceptions->renderable(function (ModelNotFoundException $e) {
            $model = class_basename($e->getModel());

            return response()->json([
                'error' => strtolower($model) . '_not_found',
                'message' => "{$model} not found.",
                'retry' => false,
                'upgrade' => false,
            ], 404);
        });

        $exceptions->renderable(function (ThrottleRequestsException $e) {
            $retryAfter = $e->getHeaders()['Retry-After'] ?? 60;

            return response()->json([
                'error' => 'rate_limited',
                'message' => "Too many requests. Try again in {$retryAfter} seconds.",
                'retry' => true,
                'upgrade' => false,
                'retry_after' => (int) $retryAfter,
            ], 429);
        });
    })->create();
