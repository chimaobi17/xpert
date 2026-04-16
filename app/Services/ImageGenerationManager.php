<?php

namespace App\Services;

use App\Exceptions\AiUnavailableException;
use App\Exceptions\InvalidApiKeyException;
use App\Exceptions\RateLimitException;
use Illuminate\Support\Facades\Log;

class ImageGenerationManager
{
    protected GeminiService $gemini;

    protected HuggingFaceService $huggingFace;

    /**
     * Track provider failures to implement cooldown logic.
     * Key = provider name, value = timestamp of last failure.
     */
    protected static array $providerCooldowns = [];

    protected const COOLDOWN_SECONDS = 600; // 10 minutes

    public function __construct(GeminiService $gemini, HuggingFaceService $huggingFace)
    {
        $this->gemini = $gemini;
        $this->huggingFace = $huggingFace;
    }

    public function generate(string $category, string $prompt, ?int $userId = null, ?string $referenceImageBase64 = null): ?string
    {
        $startTime = microtime(true);
        $lastException = null;

        // 1. Primary: FLUX / HuggingFace (free tier, no quota issues)
        if ($this->isProviderAvailable('huggingface') && config('services.huggingface.api_key')) {
            try {
                $result = $this->huggingFace->generateImage($category, $prompt, $userId, $referenceImageBase64);

                if ($result) {
                    $latency = (int) ((microtime(true) - $startTime) * 1000);
                    Log::info('image_gen_success', [
                        'user_id' => $userId,
                        'category' => $category,
                        'provider' => 'flux',
                        'latency_ms' => $latency,
                    ]);

                    return $result;
                }
            } catch (\Throwable $e) {
                $lastException = $e;
                Log::warning('flux_failed_switching_to_gemini', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                ]);
                // Only cooldown HF if it's a persistent error (not just model loading)
                $msg = strtolower($e->getMessage());
                if (str_contains($msg, 'key') || str_contains($msg, 'credits')) {
                    $this->markProviderFailed('huggingface');
                }
            }
        }

        // 2. Fallback: Gemini (has daily free quota)
        if ($this->isProviderAvailable('gemini') && config('services.gemini.api_key')) {
            try {
                $result = $this->gemini->generateImage($prompt, $userId);

                if ($result) {
                    $latency = (int) ((microtime(true) - $startTime) * 1000);
                    Log::info('image_gen_success', [
                        'user_id' => $userId,
                        'category' => $category,
                        'provider' => 'gemini',
                        'latency_ms' => $latency,
                    ]);
                    return $result;
                }
            } catch (\Throwable $e) {
                $lastException = $e;
                Log::error('gemini_fallback_failed', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                ]);
                $this->markProviderFailed('gemini');
            }
        }

        // All providers failed
        Log::error('all_image_providers_failed', [
            'user_id' => $userId,
            'category' => $category,
            'error' => $lastException?->getMessage(),
        ]);

        if ($lastException) {
            throw $lastException;
        }

        return null;
    }

    protected function isProviderAvailable(string $provider): bool
    {
        $cooldownKey = "ai_provider_cooldown_{$provider}";
        return ! \Illuminate\Support\Facades\Cache::has($cooldownKey);
    }

    protected function markProviderFailed(string $provider): void
    {
        $cooldownKey = "ai_provider_cooldown_{$provider}";
        // Cooldown for 10 minutes if provider fails
        \Illuminate\Support\Facades\Cache::put($cooldownKey, true, now()->addMinutes(10));
    }
}
