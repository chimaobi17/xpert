<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Detect and log suspicious request patterns:
 * - Brute-force login attempts
 * - Rapid 404 scanning
 * - Repeated 401/403 unauthorized access
 */
class ThreatDetection
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $ip = $request->ip();
        $status = $response->getStatusCode();
        $path = $request->path();

        // Track failed auth attempts (401/403)
        if (in_array($status, [401, 403])) {
            $key = "threat:auth_fail:{$ip}";
            $count = Cache::increment($key);
            if ($count === 1) {
                Cache::put($key, 1, now()->addMinutes(15));
            }

            if ($count >= 10) {
                Log::channel('security')->critical('brute_force_detected', [
                    'ip' => $ip,
                    'path' => $path,
                    'attempts' => $count,
                    'user_agent' => $request->userAgent(),
                    'timestamp' => now()->toISOString(),
                    'attack_type' => 'brute_force',
                ]);
            }
        }

        // Track 404 scanning
        if ($status === 404) {
            $key = "threat:scan:{$ip}";
            $count = Cache::increment($key);
            if ($count === 1) {
                Cache::put($key, 1, now()->addMinutes(10));
            }

            if ($count >= 20) {
                Log::channel('security')->warning('path_scanning_detected', [
                    'ip' => $ip,
                    'path' => $path,
                    'scan_count' => $count,
                    'user_agent' => $request->userAgent(),
                    'timestamp' => now()->toISOString(),
                    'attack_type' => 'path_scan',
                ]);
            }
        }

        // Track rate limit hits (429)
        if ($status === 429) {
            Log::channel('security')->warning('rate_limit_hit', [
                'ip' => $ip,
                'path' => $path,
                'user_agent' => $request->userAgent(),
                'timestamp' => now()->toISOString(),
                'attack_type' => 'rate_limit_abuse',
            ]);
        }

        return $response;
    }
}
