<?php

namespace App\Services;

use App\Models\PromptCache;

class CacheService
{
    protected int $ttlHours = 24;

    public function get(string $cacheKey): ?string
    {
        $cached = PromptCache::where('cache_key', $cacheKey)
            ->where('created_at', '>=', now()->subHours($this->ttlHours))
            ->first();

        return $cached?->response_text;
    }

    public function put(string $cacheKey, int $agentId, string $promptText, string $responseText): void
    {
        PromptCache::updateOrCreate(
            ['cache_key' => $cacheKey],
            [
                'agent_id' => $agentId,
                'prompt_text' => $promptText,
                'response_text' => $responseText,
                'created_at' => now(),
            ]
        );
    }

    public function generateKey(int $agentId, string $promptText): string
    {
        return hash('sha256', $agentId . '|' . $promptText);
    }
}
