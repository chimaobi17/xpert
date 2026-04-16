<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Validate that API requests originate from authorized frontend domains.
 * Blocks requests from unknown origins and logs suspicious activity.
 */
class ValidateOrigin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Skip origin check for health endpoint and local development
        if ($request->is('api/health') || config('app.env') === 'local') {
            return $next($request);
        }

        $origin = $request->header('Origin');
        $referer = $request->header('Referer');

        $allowedOrigins = array_values(array_unique(array_filter([
            ...explode(',', config('app.frontend_url', '')),
            ...explode(',', config('app.admin_url', '')),
            parse_url(config('app.url'), PHP_URL_HOST) ? config('app.url') : null,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://xpert.test',
        ])));

        // Check Origin header first, then Referer
        $requestOrigin = $origin;
        if (! $requestOrigin && $referer) {
            $parsed = parse_url($referer);
            $requestOrigin = ($parsed['scheme'] ?? 'https') . '://' . ($parsed['host'] ?? '');
            if (isset($parsed['port'])) {
                $requestOrigin .= ':' . $parsed['port'];
            }
        }

        // Allow requests with no origin (server-to-server, mobile apps, Postman in dev)
        if (! $requestOrigin) {
            return $next($request);
        }

        // Check against allowed origins
        foreach ($allowedOrigins as $allowed) {
            if ($allowed && str_starts_with($requestOrigin, $allowed)) {
                return $next($request);
            }
        }

        // Log blocked request to security channel
        Log::channel('security')->warning('blocked_origin', [
            'origin' => $requestOrigin,
            'ip' => $request->ip(),
            'path' => $request->path(),
            'method' => $request->method(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'error' => 'forbidden',
            'message' => 'Request origin not authorized.',
        ], 403);
    }
}
