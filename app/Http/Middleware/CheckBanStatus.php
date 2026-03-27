<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBanStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $isBanned = false;

        if ($user->ban_reason && is_null($user->banned_until)) {
            // Permanent ban (ban_reason set, banned_until null)
            $isBanned = true;
        } elseif ($user->banned_until && $user->banned_until->isFuture()) {
            // Timed ban still active
            $isBanned = true;
        } elseif ($user->banned_until && $user->banned_until->isPast()) {
            // Ban expired — auto-clear
            $user->update(['banned_until' => null, 'ban_reason' => null]);

            return $next($request);
        }

        if ($isBanned) {
            return response()->json([
                'error' => 'account_blocked',
                'message' => $user->ban_reason ?? 'Your account has been suspended.',
                'retry' => false,
                'upgrade' => false,
                'banned_until' => $user->banned_until?->toISOString(),
            ], 403);
        }

        return $next($request);
    }
}
