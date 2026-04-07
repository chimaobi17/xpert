<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAgent;
use App\Models\PromptLog;
use App\Services\CacheService;
use App\Services\FileProcessorService;
use App\Services\HuggingFaceService;
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
        protected QuotaService $quotaService,
        protected CacheService $cacheService,
        protected FileProcessorService $fileProcessor,
    ) {}

    public function index(Request $request)
    {
        $request->validate([
            'q' => ['sometimes', 'string', 'max:255'],
            'domain' => ['sometimes', 'string', 'in:Technology,Creative,Business,Research,Language'],
            'tier' => ['sometimes', 'string', 'in:free,premium,all'],
        ]);

        // Use cached agent list when no filters are applied
        $hasFilters = $request->filled('q') || $request->filled('domain') || $request->filled('tier');

        if (!$hasFilters) {
            $agents = Cache::remember('agents_list', 300, function () {
                return AiAgent::with('latestTemplate')->get();
            });

            $userAgentIds = $request->user()->agents()->pluck('ai_agents.id')->toArray();
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

        if ($request->filled('domain')) {
            $query->where('domain', $request->domain);
        }

        if ($request->filled('tier') && $request->tier !== 'all') {
            if ($request->tier === 'premium') {
                $query->whereRaw('is_premium_only');
            } else {
                $query->whereRaw('NOT is_premium_only');
            }
        }

        $agents = $query->get();

        // Add is_added flag for authenticated user
        $userAgentIds = $request->user()->agents()->pluck('ai_agents.id')->toArray();

        $agentsArray = $agents->map(function ($agent) use ($userAgentIds) {
            $arr = $agent->toArray();
            $arr['is_added'] = in_array($agent->id, $userAgentIds);
            return $arr;
        });

        return response()->json($agentsArray);
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
        $agent->load('latestTemplate');

        return response()->json($agent);
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
            $request->user()->plan_level
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

        // Check premium access
        if ($agent->is_premium_only && $user->plan_level === 'free') {
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

        if ($modelType === 'image') {
            $imageBase64 = $this->huggingFace->generateImage(
                $agent->category,
                $promptText,
                $user->id,
                $referenceImageBase64
            );

            if ($imageBase64) {
                $aiResponse = $imageBase64;
            }
        } else {
            $aiResponse = $this->huggingFace->generate($agent->category, $promptText, $user->id);
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
                'message' => 'Your request has been queued and will be processed shortly.',
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
