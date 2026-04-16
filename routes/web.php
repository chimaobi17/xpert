<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| API Root (JSON health check)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return response()->json([
        'app' => 'Xpert API',
        'status' => 'online',
        'version' => '1.0.0',
    ]);
});

/*
|--------------------------------------------------------------------------
| SPA Catch-All Routes (Laravel Cloud fullstack deployment)
|--------------------------------------------------------------------------
| When the React SPAs are built into public/app/ and public/admin/,
| these routes serve index.html for all non-file client-side routes
| so that react-router can handle them.
|
| In local dev (ports 5173/5174), these routes are never hit because
| Vite dev servers handle all requests directly.
|--------------------------------------------------------------------------
*/

// User app — /app, /app/login, /app/workspace, etc.
Route::get('/app/{any?}', function () {
    $indexPath = public_path('app/index.html');

    if (! File::exists($indexPath)) {
        return response()->json([
            'error' => 'not_built',
            'message' => 'User app not built. Run: npm run build --prefix xpert-app',
        ], 503);
    }

    return response()->file($indexPath, [
        'Content-Type' => 'text/html',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
    ]);
})->where('any', '.*');

// Admin dashboard — /admin, /admin/users, /admin/agents, etc.
Route::get('/admin/{any?}', function () {
    $indexPath = public_path('admin/index.html');

    if (! File::exists($indexPath)) {
        return response()->json([
            'error' => 'not_built',
            'message' => 'Admin app not built. Run: npm run build --prefix xpert-admin-dashboard',
        ], 503);
    }

    return response()->file($indexPath, [
        'Content-Type' => 'text/html',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
    ]);
})->where('any', '.*');
