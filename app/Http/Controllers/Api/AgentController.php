<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAgent;
use App\Models\PromptLog;
use App\Services\CacheService;
use App\Services\FileProcessorService;
use App\Services\HuggingFaceService;
use App\Services\ImageGenerationManager;
use App\Services\PromptEngineService;
use App\Services\QuotaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AgentController extends Controller
{
    public function __construct(
        protected PromptEngineService $promptEngine,
        protected HuggingFaceService $huggingFace,
        protected ImageGenerationManager $imageManager,
        protected QuotaService $quotaService,
        protected CacheService $cacheService,
        protected FileProcessorService $fileProcessor,
    ) {}

    public function index(Request $request)
    {
        try {
            $request->validate([
                'q' => ['sometimes', 'string', 'max:255', 'nullable'],
                'domain' => ['sometimes', 'string', 'in:Technology,Creative,Business,Research,Language', 'nullable'],
                'tier' => ['sometimes', 'string', 'in:free,premium,all', 'nullable'],
            ]);

            $userAgentIds = $request->user() 
                ? \Illuminate\Support\Facades\DB::table('user_agents')
                    ->where('user_id', $request->user()->id)
                    ->pluck('ai_agent_id')
                    ->toArray() 
                : [];

            $hasFilters = $request->filled('q') || $request->filled('domain') || ($request->filled('tier') && $request->tier !== 'all');

            if (!$hasFilters) {
                $agents = Cache::remember('agents_list', 300, function () {
                    return AiAgent::with('latestTemplate')->get();
                });

                $agentsArray = $agents->map(function ($agent) use ($userAgentIds) {
                    $arr = $agent->toArray();
                    $arr['is_added'] = in_array($agent->id, $userAgentIds);
                    return $arr;
                });

                return response()->json($agentsArray);
            }

            $query = AiAgent::with('latestTemplate');

            if ($request->filled('q')) {
                $search = '%' . $request->q . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                      ->orWhere('domain', 'like', $search)
                      ->orWhere('category', 'like', $search);
                });
            }

            if ($request->filled('domain') && $request->domain !== 'All') {
                $query->where('domain', $request->domain);
            }

            if ($request->filled('tier') && $request->tier !== 'all') {
                $driver = $query->getConnection()->getDriverName();
                if ($request->tier === 'premium') {
                    if ($driver === 'pgsql') {
                        $query->whereRaw('is_premium_only IS TRUE');
                    } else {
                        $query->where('is_premium_only', true);
                    }
                } else {
                    if ($driver === 'pgsql') {
                        $query->whereRaw('is_premium_only IS NOT TRUE');
                    } else {
                        $query->where(function ($q) {
                            $q->where('is_premium_only', false)
                              ->orWhereNull('is_premium_only');
                        });
                    }
                }
            }

            $agents = $query->get();
            $agentsArray = $agents->map(function ($agent) use ($userAgentIds) {
                $arr = $agent->toArray();
                $arr['is_added'] = in_array($agent->id, $userAgentIds);
                return $arr;
            });

            return response()->json($agentsArray);
        } catch (\Throwable $e) {
            Log::error('agent_index_failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'server_error',
                'message' => 'Query error: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * @deprecated Use index() with query params instead. Kept for backwards compatibility.
     */
    public function search(Request $request)
    {
        return $this->index($request);
    }

    public function show(AiAgent $agent)
    {
        try {
            $agent->load('latestTemplate');
            return response()->json($agent);
        } catch (\Throwable $e) {
             return response()->json([
                'error' => 'load_failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Step 1: Generate a prompt from agent template + user inputs.
     * Does NOT call AI — returns the assembled prompt for user review.
     */
    public function generate(Request $request, AiAgent $agent)
    {
        $request->validate([
            'fields' => ['required', 'array'],
            'fields.*' => ['sometimes'],
            'file' => ['sometimes', 'file', 'max:204800'], // 200MB max
        ]);

        $fileContent = null;
        $uploadedFileId = null;

        if ($request->hasFile('file')) {
            $user = $request->user();
            $fileLimitMb = config('ai_models.file_limits.' . $user->plan_level, 25);
            $fileLimitBytes = $fileLimitMb * 1024 * 1024;

            if ($request->file('file')->getSize() > $fileLimitBytes) {
                return response()->json([
                    'error' => 'file_too_large',
                    'message' => "File exceeds the {$fileLimitMb}MB limit for your {$user->plan_level} plan.",
                    'retry' => false,
                    'upgrade' => true,
                ], 413);
            }

            try {
                $uploaded = $this->fileProcessor->process($request->file('file'), $user->id);
                $uploadedFileId = $uploaded->id;

                // Use parsed text content if available; otherwise build a file description
                // so text agents still know a file was uploaded
                $fileContent = $uploaded->parsed_content
                    ?? $this->fileProcessor->getFileDescription($uploaded);
            } catch (\Throwable $e) {
                Log::warning('file_upload_error', [
                    'user_id' => $user->id,
                    'file' => $request->file('file')->getClientOriginalName(),
                    'error' => $e->getMessage(),
                ]);
                // Don't block the request — proceed without file content
                $fileContent = '[File was uploaded but could not be processed: '
                    . $request->file('file')->getClientOriginalName() . ']';
            }
        }

        $generatedPrompt = $this->promptEngine->generate(
            $agent,
            $request->fields,
            $fileContent,
            $request->user()->plan_level,
            $request->user()->language_preference
        );

        return response()->json([
            'prompt' => $generatedPrompt,
            'agent_id' => $agent->id,
            'agent_name' => $agent->name,
            'tokens_estimated' => $this->promptEngine->estimateTokens($generatedPrompt),
            'uploaded_file_id' => $uploadedFileId,
        ]);
    }

    /**
     * Step 2: Submit a prompt (generated, custom, or edited) to AI.
     * This is the actual AI call.
     */
    public function submit(Request $request, AiAgent $agent)
    {
        $request->validate([
            'prompt_text' => ['required', 'string', 'max:50000'],
            'prompt_type' => ['required', 'string', 'in:generated,custom,edited'],
        ]);

        $user = $request->user();

        // Check premium access (null plan_level defaults to free)
        if ($agent->is_premium_only && ($user->plan_level === 'free' || !$user->plan_level)) {
            return response()->json([
                'error' => 'premium_required',
                'message' => "The {$agent->name} agent requires a Standard or Premium plan.",
                'retry' => false,
                'upgrade' => true,
            ], 402);
        }

        // Check quota
        $this->quotaService->checkQuota($user);

        $promptText = $request->prompt_text;
        
        // Final check: Force language directive if not already present in the prompt
        $langCode = $user->language_preference ?? 'en';
        if ($langCode !== 'en') {
            $langName = $this->promptEngine->getLanguageName($langCode);
            $directive = "[Language Directive]\nYou MUST respond entirely in {$langName}.";
            if (!str_contains($promptText, $directive)) {
                $promptText .= "\n\n" . $directive;
            }
        }

        $tokensEstimated = $this->promptEngine->estimateTokens($promptText);

        // Determine type before checking cache so frontend knows how to render cached result
        $modelType = config("ai_models.{$agent->category}.type", 'text');

        // Check cache
        $cacheKey = $this->cacheService->generateKey($agent->id, $promptText);
        $cachedResponse = $this->cacheService->get($cacheKey);

        if ($cachedResponse) {
            Log::info('ai_call', [
                'user_id' => $user->id,
                'category' => $agent->category,
                'cached' => true,
            ]);

            // Log prompt even on cache hit
            PromptLog::create([
                'user_id' => $user->id,
                'agent_id' => $agent->id,
                'prompt_type' => $request->prompt_type,
                'prompt_text' => $promptText,
                'tokens_estimated' => $tokensEstimated,
            ]);

            $this->quotaService->recordUsage($user, $tokensEstimated);

            return response()->json([
                'response' => $cachedResponse,
                'tokens_used' => $tokensEstimated,
                'cached' => true,
                'type' => $modelType,
            ]);
        }

        $aiResponse = null;

        // Load reference image if uploaded and this is an image generation agent
        $referenceImageBase64 = null;
        if ($request->filled('uploaded_file_id') && $modelType === 'image') {
            $uploadedFile = \App\Models\UploadedFile::where('id', $request->uploaded_file_id)
                ->where('user_id', $user->id)
                ->first();

            if ($uploadedFile && $this->fileProcessor->isImageMime($uploadedFile->mime_type)) {
                $referenceImageBase64 = $this->fileProcessor->getImageBase64($uploadedFile);
            }
        }

        try {
            if ($modelType === 'image') {
                $aiResponse = $this->imageManager->generate(
                    $agent->category,
                    $promptText,
                    $user->id,
                    $referenceImageBase64
                );
            } else {
                $aiResponse = $this->huggingFace->generate($agent->category, $promptText, $user->id);
            }
        } catch (\App\Exceptions\AiUnavailableException $e) {
            return response()->json([
                'error' => 'ai_unavailable',
                'message' => $e->getMessage(),
                'retry' => true,
                'upgrade' => false,
            ], 503);
        } catch (\App\Exceptions\RateLimitException $e) {
            return response()->json([
                'error' => 'rate_limited',
                'message' => $e->getMessage(),
                'retry' => true,
                'upgrade' => (str_contains($e->getMessage(), 'credits depleted')),
            ], 429);
        } catch (\Throwable $e) {
            Log::error('ai_submit_failed', [
                'user_id' => $user->id,
                'category' => $agent->category,
                'error' => $e->getMessage(),
            ]);
        }

        // Log the prompt
        PromptLog::create([
            'user_id' => $user->id,
            'agent_id' => $agent->id,
            'prompt_type' => $request->prompt_type,
            'prompt_text' => $promptText,
            'tokens_estimated' => $tokensEstimated,
        ]);

        $this->quotaService->recordUsage($user, $tokensEstimated);

        if (! $aiResponse) {
            return response()->json([
                'error' => 'ai_unavailable',
                'message' => 'The AI system is temporarily busy. Please try again in a few moments.',
                'retry' => true,
                'upgrade' => false,
            ], 503);
        }

        // Cache the response
        $this->cacheService->put($cacheKey, $agent->id, $promptText, $aiResponse);

        return response()->json([
            'response' => $aiResponse,
            'tokens_used' => $tokensEstimated,
            'cached' => false,
            'type' => $modelType,
        ]);
    }
}
