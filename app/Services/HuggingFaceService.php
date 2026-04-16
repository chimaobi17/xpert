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
                $models['timeout'] ?? 60,
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

    public function generateImage(string $category, string $prompt, ?int $userId = null, ?string $referenceImageBase64 = null): ?string
    {
        $models = config("ai_models.{$category}");

        if (! $models) {
            throw new AiUnavailableException("Unknown image category: {$category}");
        }

        $startTime = microtime(true);

        // Build ordered model chain: primary → fallback → recovery → safety → last_resort
        $modelChain = array_filter([
            $models['primary'] ?? null,
            $models['fallback'] ?? null,
            $models['recovery'] ?? null,
            $models['safety'] ?? null,
            $models['last_resort'] ?? null,
        ]);

        $lastException = null;

        foreach ($modelChain as $modelIndex => $model) {
            // Check model circuit breaker (skips model if it failed recently)
            $cooldownKey = "ai_model_cooldown_" . str_replace('/', '_', $model);
            if (\Illuminate\Support\Facades\Cache::has($cooldownKey)) {
                Log::warning('ai_image_model_skipped', ['model' => $model, 'reason' => 'cooldown_active']);
                continue;
            }

            $retries = $modelIndex === 0 ? 2 : 1; // More retries on primary
            $backoff = 1;

            for ($attempt = 0; $attempt <= $retries; $attempt++) {
                if ($attempt > 0) {
                    usleep($backoff * 1_000_000);
                    $backoff = min($backoff * 2, 8);
                }

                try {
                    $result = $this->callImageApi($model, $prompt, $models['timeout'] ?? 60, $referenceImageBase64);

                    $latency = (int) ((microtime(true) - $startTime) * 1000);
                    Log::info('ai_image_call', [
                        'user_id' => $userId,
                        'category' => $category,
                        'model' => $model,
                        'latency_ms' => $latency,
                        'status' => 'success',
                        'was_fallback' => $modelIndex > 0,
                    ]);

                    return $result;
                } catch (InvalidApiKeyException $e) {
                    throw $e; // Never retry on bad key
                } catch (RateLimitException $e) {
                    if ($attempt === $retries && $modelIndex === count($modelChain) - 1) {
                        throw $e;
                    }
                    $lastException = $e;
                    break; // Skip remaining retries, move to next model
                } catch (AiUnavailableException | AiTimeoutException $e) {
                    $lastException = $e;
                    Log::warning('ai_image_attempt_failed', [
                        'user_id' => $userId,
                        'model' => $model,
                        'attempt' => $attempt + 1,
                        'reason' => $e->getMessage(),
                    ]);

                    // If it's a "Loading", "Out of Memory", or 404/410 error, trigger model cooldown
                    $errorMsg = strtolower($e->getMessage());
                    if (str_contains($errorMsg, 'loading') || str_contains($errorMsg, 'memory') || str_contains($errorMsg, '404') || str_contains($errorMsg, '410')) {
                        $cooldownKey = "ai_model_cooldown_" . str_replace('/', '_', $model);
                        \Illuminate\Support\Facades\Cache::put($cooldownKey, true, now()->addMinutes(5));
                        break; // Skip remaining retries for this specific model
                    }
                } catch (\Throwable $e) {
                    $lastException = new AiUnavailableException($e->getMessage());
                    Log::warning('ai_image_attempt_failed', [
                        'user_id' => $userId,
                        'model' => $model,
                        'attempt' => $attempt + 1,
                        'reason' => $e->getMessage(),
                    ]);
                }
            }

            // Log fallback transition
            if ($modelIndex < count($modelChain) - 1) {
                Log::warning('ai_image_fallback', [
                    'user_id' => $userId,
                    'failed_model' => $model,
                    'next_model' => $modelChain[$modelIndex + 1],
                    'reason' => $lastException?->getMessage(),
                ]);
            }
        }

        // All models exhausted
        Log::error('ai_image_all_failed', [
            'user_id' => $userId,
            'category' => $category,
            'models_tried' => $modelChain,
        ]);

        if ($lastException instanceof RateLimitException || $lastException instanceof AiUnavailableException) {
            throw $lastException;
        }

        return null;
    }

    /**
     * Call a single HuggingFace image generation model.
     */
    protected function callImageApi(string $model, string $prompt, int $timeout, ?string $referenceImageBase64 = null): string
    {
        $apiKey = config('services.huggingface.api_key');

        if (empty($apiKey)) {
            throw new InvalidApiKeyException('HuggingFace API key not configured.');
        }

        $payload = ['inputs' => $prompt];

        // FLUX.1-schnell and some other fast models do not support the 'image' parameter
        // for image-to-image on the free Inference API. We only include it for models
        // known to support it or if it's explicitly allowed.
        $supportsImg2Img = !str_contains(strtolower($model), 'schnell');

        if ($referenceImageBase64 && $supportsImg2Img) {
            $payload['image'] = "data:image/png;base64,{$referenceImageBase64}";
        }

        $response = Http::withToken($apiKey)
            ->timeout($timeout)
            ->post($this->imageBaseUrl . $model, $payload);

        if ($response->status() === 401 || $response->status() === 403) {
            throw new InvalidApiKeyException('Invalid HuggingFace API key');
        }

        if ($response->status() === 402) {
            throw new RateLimitException(3600, 'HuggingFace free credits depleted. Credits reset monthly.');
        }

        // Model deprecated or removed — skip to next in chain
        if ($response->status() === 404 || $response->status() === 410) {
            throw new AiUnavailableException("Model {$model} is no longer available (HTTP {$response->status()}).");
        }

        if ($response->status() === 429) {
            throw new RateLimitException(
                (int) ($response->header('Retry-After') ?? 60),
                'HuggingFace rate limit exceeded'
            );
        }

        if ($response->status() === 503) {
            $errorData = $response->json();
            $wait = isset($errorData['estimated_time']) ? round($errorData['estimated_time']) : null;
            throw new AiUnavailableException(
                "Model {$model} is loading." . ($wait ? " Estimated wait: {$wait}s." : '')
            );
        }

        // 400 = bad request — often unsupported parameters; retry without extras
        if ($response->status() === 400) {
            $errorData = $response->json();
            $errorMsg = $errorData['error'] ?? "Bad request to model {$model}";
            Log::warning('ai_image_bad_request', ['model' => $model, 'error' => $errorMsg]);

            // Retry once with a clean payload (inputs only, no image/parameters)
            $retryResponse = Http::withToken($apiKey)
                ->timeout($timeout)
                ->post($this->imageBaseUrl . $model, ['inputs' => $prompt]);

            if ($retryResponse->successful() && str_contains($retryResponse->header('content-type') ?? '', 'image')) {
                return base64_encode($retryResponse->body());
            }

            throw new AiUnavailableException("Image model rejected the request: {$errorMsg}");
        }

        if ($response->serverError()) {
            throw new AiUnavailableException("Image model server error: {$response->status()}");
        }

        if ($response->successful() && $response->header('content-type') && str_contains($response->header('content-type'), 'image')) {
            return base64_encode($response->body());
        }

        throw new AiUnavailableException("Unexpected response from image model {$model}: {$response->status()}");
    }

    /**
     * Call HuggingFace's OpenAI-compatible chat completions endpoint.
     */
    protected function callChatApi(string $model, string $prompt, int $maxTokens, int $timeout, int $retries): string
    {
        $apiKey = config('services.huggingface.api_key');

        if (empty($apiKey)) {
            Log::critical('ai_missing_key', ['action' => 'HUGGINGFACE_API_KEY env var not set']);
            throw new InvalidApiKeyException('HuggingFace API key not configured.');
        }

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

                // Model deprecated or removed — trigger fallback
                if ($response->status() === 404 || $response->status() === 410) {
                    throw new AiUnavailableException("Model {$model} is no longer available (HTTP {$response->status()}).");
                }

                if ($response->status() === 429) {
                    throw new RateLimitException(
                        (int) ($response->header('Retry-After') ?? 60),
                        'HuggingFace rate limit exceeded'
                    );
                }

                if ($response->status() === 503) {
                    $errorData = $response->json();
                    $errorMsg = "Your request has been queued. Processing shortly.";
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

        throw $lastException ?? new AiUnavailableException("The AI system is temporarily busy. Please try again in a few moments. Retrying may help.");
    }
}
