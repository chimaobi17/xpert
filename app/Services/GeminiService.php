<?php

namespace App\Services;

use App\Exceptions\AiTimeoutException;
use App\Exceptions\AiUnavailableException;
use App\Exceptions\InvalidApiKeyException;
use App\Exceptions\RateLimitException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/';

    /**
     * Gemini image-capable models in order of preference.
     * gemini-2.5-flash-image is the dedicated image generation model.
     */
    protected array $imageModels = [
        'gemini-2.5-flash-image',
        'gemini-2.0-flash-exp',
    ];

    public function generateImage(string $prompt, ?int $userId = null, int $timeout = 90): ?string
    {
        $apiKey = config('services.gemini.api_key');

        if (empty($apiKey)) {
            throw new InvalidApiKeyException('Gemini API key not configured.');
        }

        // Use configured model first, then fall through to known image models
        $configuredModel = config('services.gemini.image_model', 'gemini-2.5-flash-image');
        $models = array_unique(array_merge([$configuredModel], $this->imageModels));

        $lastException = null;

        foreach ($models as $model) {
            try {
                return $this->attemptGeneration($model, $prompt, $apiKey, $userId, $timeout);
            } catch (InvalidApiKeyException $e) {
                throw $e; // Never retry on bad key
            } catch (RateLimitException $e) {
                $lastException = $e;
                Log::warning('gemini_model_rate_limited', [
                    'model' => $model,
                    'user_id' => $userId,
                ]);
                continue; // Try next model
            } catch (\Throwable $e) {
                $lastException = $e;
                Log::warning('gemini_model_failed', [
                    'model' => $model,
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                ]);
                continue; // Try next model
            }
        }

        throw $lastException ?? new AiUnavailableException('All Gemini image models failed.');
    }

    protected function attemptGeneration(string $model, string $prompt, string $apiKey, ?int $userId, int $timeout): string
    {
        $url = $this->baseUrl . $model . ':generateContent?key=' . $apiKey;

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => "Generate an image: {$prompt}",
                        ],
                    ],
                ],
            ],
            'generationConfig' => [
                'responseModalities' => ['TEXT', 'IMAGE'],
            ],
        ];

        try {
            $response = Http::timeout($timeout)
                ->post($url, $payload);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            throw new AiTimeoutException("Gemini connection timeout after {$timeout}s");
        }

        if ($response->status() === 401 || $response->status() === 403) {
            throw new InvalidApiKeyException('Invalid Gemini API key');
        }

        if ($response->status() === 429) {
            $data = $response->json();
            $retryAfter = 60;
            // Parse retry delay from Gemini's error details
            foreach (($data['error']['details'] ?? []) as $detail) {
                if (isset($detail['retryDelay'])) {
                    $retryAfter = (int) filter_var($detail['retryDelay'], FILTER_SANITIZE_NUMBER_INT);
                    break;
                }
            }
            throw new RateLimitException($retryAfter, 'Gemini rate limit exceeded');
        }

        // 400 = model doesn't support image modalities — skip to next
        if ($response->status() === 400) {
            $data = $response->json();
            $errorMsg = $data['error']['message'] ?? "Bad request to Gemini model {$model}";
            throw new AiUnavailableException("Gemini {$model}: {$errorMsg}");
        }

        if ($response->serverError()) {
            throw new AiUnavailableException("Gemini server error: {$response->status()}");
        }

        if ($response->successful()) {
            $data = $response->json();

            // Extract image from Gemini response
            $candidates = $data['candidates'] ?? [];
            foreach ($candidates as $candidate) {
                $parts = $candidate['content']['parts'] ?? [];
                foreach ($parts as $part) {
                    if (isset($part['inlineData'])) {
                        $imageData = $part['inlineData']['data'] ?? null;
                        if ($imageData) {
                            Log::info('gemini_image_success', [
                                'user_id' => $userId,
                                'model' => $model,
                            ]);
                            return $imageData; // Already base64 encoded
                        }
                    }
                }
            }

            // Gemini responded but no image in output
            Log::warning('gemini_no_image_in_response', [
                'user_id' => $userId,
                'model' => $model,
                'response_keys' => array_keys($data),
            ]);
            throw new AiUnavailableException("Gemini {$model} did not return an image.");
        }

        throw new AiUnavailableException("Unexpected Gemini response: {$response->status()}");
    }
}
