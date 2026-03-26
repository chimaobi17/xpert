<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAgent;
use App\Models\PromptLog;
use App\Models\PromptLibrary;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index()
    {
        $agents = AiAgent::all();

        return response()->json($agents);
    }

    public function show(AiAgent $agent)
    {
        $agent->load('latestTemplate');

        return response()->json($agent);
    }

    public function generate(Request $request, AiAgent $agent)
    {
        $request->validate([
            'prompt_text' => ['required', 'string'],
        ]);

        $tokensEstimated = (int) ceil(str_word_count($request->prompt_text) * 1.3);

        PromptLog::create([
            'user_id' => $request->user()->id,
            'agent_id' => $agent->id,
            'prompt_type' => $agent->category ?? 'general',
            'prompt_text' => $request->prompt_text,
            'tokens_estimated' => $tokensEstimated,
        ]);

        return response()->json([
            'response' => 'This is a mock AI response. Connect to Hugging Face API for real responses.',
            'tokens_used' => $tokensEstimated,
        ]);
    }
}
