<?php

namespace App\Services;

use App\Exceptions\QuotaExceededException;
use App\Models\TokenUsageLog;
use App\Models\User;

class QuotaService
{
    public function checkQuota(User $user): void
    {
        $today = now()->toDateString();

        $todayUsage = TokenUsageLog::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        $tokenQuota = config('ai_models.quotas.' . $user->plan_level, 25000);
        $requestLimit = config('ai_models.rate_limits.' . $user->plan_level, 50);

        $tokensUsed = $todayUsage?->tokens_used ?? 0;
        $requestsToday = $todayUsage?->request_count ?? 0;

        if ($tokensUsed >= $tokenQuota) {
            throw new QuotaExceededException('Daily token quota exceeded.');
        }

        // 0 = unlimited (premium)
        if ($requestLimit > 0 && $requestsToday >= $requestLimit) {
            throw new QuotaExceededException('Daily request limit exceeded.');
        }
    }

    public function recordUsage(User $user, int $tokensUsed): void
    {
        $today = now()->toDateString();

        $log = TokenUsageLog::firstOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            ['tokens_used' => 0, 'request_count' => 0]
        );

        $log->increment('tokens_used', $tokensUsed);
        $log->increment('request_count');
    }
}
