<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromptLibrary;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $items = PromptLibrary::where('user_id', $request->user()->id)
            ->with('aiAgent:id,name')
            ->latest()
            ->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'agent_id' => ['required', 'exists:ai_agents,id'],
            'original_input' => ['required', 'string'],
            'final_prompt' => ['required', 'string'],
            'ai_response' => ['nullable', 'string'],
        ]);

        $item = PromptLibrary::create([
            'user_id' => $request->user()->id,
            'agent_id' => $request->agent_id,
            'original_input' => $request->original_input,
            'final_prompt' => $request->final_prompt,
            'ai_response' => $request->ai_response,
        ]);

        return response()->json($item, 201);
    }

    public function destroy(Request $request, PromptLibrary $library)
    {
        if ($library->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $library->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
