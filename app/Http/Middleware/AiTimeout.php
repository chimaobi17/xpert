<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Enforce strict PHP execution timeout on AI endpoints.
 * Prevents stalled HuggingFace calls from exhausting the server container.
 */
class AiTimeout
{
    public function handle(Request $request, Closure $next): Response
    {
        // Set strict 30-second execution limit for AI requests
        set_time_limit(30);

        // Set memory limit to prevent runaway processes
        ini_set('memory_limit', '128M');

        return $next($request);
    }
}
