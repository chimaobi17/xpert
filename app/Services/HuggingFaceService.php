<?php

namespace App\Services;

use App\Exceptions\AiTimeoutException;
use App\Exceptions\AiUnavailableException;
use App\Exceptions\InvalidApiKeyException;
use App\Exceptions\RateLimitException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HuggingFaceService
{
    /**
     * New HuggingFace Inference API endpoint (OpenAI-compatible).
     * The old api-inference.huggingface.co was deprecated (returns 410).
     */
    protected string $baseUrl = 'https://router.huggingface.co/v1/chat/completions';

    protected string $imageBaseUrl = 'https://router.huggingface.co/hf-inference/models/';

    public function generate(string $category, string $prompt, ?int $userId = null): ?string
    {
        $models = config("ai_models.{$category}");

        if (! $models) {
            Log::error('ai_unknown_category', ['category' => $category]);
            throw new AiUnavailableException("Unknown agent category: {$category}");
        }

        $startTime = microtime(true);

        // 1. Try primary model with retries
        try {
            $response = $this->callChatApi(
                $models['primary'],
                $prompt,
                $models['max_tokens'] ?? 2048,
                $models['timeout'] ?? 30,
                retries: 2
            );

            $latency = (int) ((microtime(true) - $startTime) * 1000);
            Log::info('ai_call', [
                'user_id' => $userId,
                'category' => $category,
                'model' => $models['primary'],
                'tokens' => (int) ceil(str_word_count($prompt) * 1.3),
                'latency_ms' => $latency,
                'status' => 'success',
                'cached' => false,
            ]);

            return $response;
        } catch (InvalidApiKeyException $e) {
            Log::critical('ai_invalid_key', [
                'model' => $models['primary'],
                'action' => 'alert_sent',
            ]);
            throw $e;
        } catch (RateLimitException | AiTimeoutException $e) {
            Log::warning('ai_primary_failed', [
                'user_id' => $userId,
                'category' => $category,
                'model' => $models['primary'],
                'reason' => $e->getMessage(),
            ]);
        }

        // 2. Try fallback model
        if (! empty($models['fallback'])) {
            try {
                $response = $this->callChatApi(
                    $models['fallback'],
                    $prompt,
                    $models['max_tokens'] ?? 2048,
                    $models['timeout'] ?? 30,
                    retries: 1
                );

                $latency = (int) ((microtime(true) - $startTime) * 1000);
                Log::warning('ai_fallback', [
                    'user_id' => $userId,
                    'primary' => $models['primary'],
                    'fallback' => $models['fallback'],
                    'latency_ms' => $latency,
                    'reason' => 'primary_failed',
                ]);

                return $response;
            } catch (\Throwable $e) {
                Log::error('ai_fallback_failed', [
                    'user_id' => $userId,
                    'category' => $category,
                    'fallback' => $models['fallback'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // 3. All models failed
        Log::error('ai_queue_deferred', [
            'user_id' => $userId,
            'category' => $category,
            'reason' => 'all_models_failed',
        ]);

        return null;
    }

    public function generateImage(string $category, string $prompt, ?int $userId = null): ?string
    {
        $models = config("ai_models.{$category}");

        if (! $models) {
            throw new AiUnavailableException("Unknown image category: {$category}");
        }

        try {
            $response = Http::withToken(config('services.huggingface.api_key'))
                ->timeout($models['timeout'] ?? 60)
                ->post($this->imageBaseUrl . $models['primary'], [
                    'inputs' => $prompt,
                ]);

            if ($response->status() === 401 || $response->status() === 403) {
                throw new InvalidApiKeyException('Invalid HuggingFace API key');
            }

            if ($response->status() === 402) {
                throw new RateLimitException(3600, 'HuggingFace free credits depleted. Credits reset monthly.');
            }

            if ($response->status() === 429) {
                throw new RateLimitException(60, 'HF rate limit hit');
            }

            if ($response->successful() && $response->header('content-type') && str_contains($response->header('content-type'), 'image')) {
                return base64_encode($response->body());
            }

            return null;
        } catch (InvalidApiKeyException | RateLimitException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ai_image_failed', [
                'user_id' => $userId,
                'category' => $category,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Call HuggingFace's OpenAI-compatible chat completions endpoint.
     */
    protected function callChatApi(string $model, string $prompt, int $maxTokens, int $timeout, int $retries): string
    {
        $apiKey = config('services.huggingface.api_key');

        $lastException = null;
        $backoff = 1;

        for ($attempt = 0; $attempt <= $retries; $attempt++) {
            if ($attempt > 0) {
                usleep($backoff * 1000000);
                $backoff *= 2;
            }

            try {
                $response = Http::withToken($apiKey)
                    ->timeout($timeout)
                    ->post($this->baseUrl, [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'user', 'content' => $prompt],
                        ],
                        'max_tokens' => $maxTokens,
                        'temperature' => 0.7,
                    ]);

                if ($response->status() === 401 || $response->status() === 403) {
                    throw new InvalidApiKeyException('Invalid or expired HuggingFace API key.');
                }

                if ($response->status() === 402) {
                    throw new RateLimitException(3600, 'HuggingFace free credits depleted for this month. Credits reset monthly.');
                }

                if ($response->status() === 429) {
                    throw new RateLimitException(
                        (int) ($response->header('Retry-After') ?? 60),
                        'HuggingFace rate limit exceeded'
                    );
                }

                if ($response->status() === 503) {
                    $errorData = $response->json();
                    $errorMsg = $errorData['error'] ?? 'Your request has been queued and will be processed shortly.';
                    if (isset($errorData['estimated_time'])) {
                        $errorMsg .= ' Estimated loading time: ' . round($errorData['estimated_time']) . 's';
                    }
                    throw new AiUnavailableException($errorMsg);
                }

                if ($response->serverError()) {
                    throw new AiUnavailableException("HF server error: {$response->status()}");
                }

                if ($response->successful()) {
                    $data = $response->json();

                    // OpenAI-compatible format: choices[0].message.content
                    if (isset($data['choices'][0]['message']['content'])) {
                        return $data['choices'][0]['message']['content'];
                    }

                    // Legacy format fallbacks (in case some endpoints still use old format)
                    if (is_array($data) && isset($data[0]['generated_text'])) {
                        return $data[0]['generated_text'];
                    }

                    if (is_array($data) && isset($data[0]['summary_text'])) {
                        return $data[0]['summary_text'];
                    }

                    if (is_string($data)) {
                        return $data;
                    }

                    return json_encode($data);
                }

                // Handle 400 errors (model not supported)
                if ($response->status() === 400) {
                    $errorData = $response->json();
                    $errorMsg = $errorData['error']['message'] ?? $errorData['error'] ?? "Bad request: {$response->status()}";
                    throw new AiUnavailableException($errorMsg);
                }

                $lastException = new AiUnavailableException("Unexpected response: {$response->status()}");
            } catch (InvalidApiKeyException $e) {
                throw $e; // Never retry on bad key
            } catch (RateLimitException $e) {
                if ($attempt === $retries) {
                    throw $e;
                }
                $lastException = $e;
            } catch (\Illuminate\Http\Client\ConnectionException $e) {
                $lastException = new AiTimeoutException("Connection timeout after {$timeout}s");
                if ($attempt === $retries) {
                    throw $lastException;
                }
            } catch (AiUnavailableException | AiTimeoutException $e) {
                if ($attempt === $retries) {
                    throw $e;
                }
                $lastException = $e;
            }
        }

        throw $lastException ?? new AiUnavailableException('All retry attempts failed');
    }
}
