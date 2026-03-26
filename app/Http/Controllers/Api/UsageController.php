<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TokenUsageLog;
use App\Models\PromptLibrary;
use Illuminate\Http\Request;

class UsageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $todayUsage = TokenUsageLog::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        $quotas = config('ai_models.quotas.' . $user->plan_level, config('ai_models.quotas.free'));
        $rateLimits = config('ai_models.rate_limits.' . $user->plan_level, config('ai_models.rate_limits.free'));

        $savedCount = PromptLibrary::where('user_id', $user->id)->count();

        return response()->json([
            'tokens_used' => $todayUsage?->tokens_used ?? 0,
            'requests_today' => $todayUsage?->request_count ?? 0,
            'token_quota' => $quotas['daily_tokens'],
            'request_limit' => $rateLimits['daily_requests'],
            'saved_prompts' => $savedCount,
            'plan_level' => $user->plan_level,
        ]);
    }
}
