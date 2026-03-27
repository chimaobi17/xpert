<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatbotKnowledge;

class ChatbotKnowledgeController extends Controller
{
    public function index()
    {
        $knowledge = ChatbotKnowledge::orderBy('sort_order', 'asc')->get();

        return response()->json($knowledge);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string', 'max:5000'],
            'keywords' => ['required', 'string', 'max:500'],
            'action_type' => ['nullable', 'string', 'in:navigate,modal'],
            'action_target' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:general,agents,prompts,billing,navigation,getting_started'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        $entry = ChatbotKnowledge::create($validated);

        return response()->json($entry, 201);
    }

    public function update(Request $request, ChatbotKnowledge $knowledge)
    {
        $validated = $request->validate([
            'question' => ['sometimes', 'string', 'max:500'],
            'answer' => ['sometimes', 'string', 'max:5000'],
            'keywords' => ['sometimes', 'string', 'max:500'],
            'action_type' => ['nullable', 'string', 'in:navigate,modal'],
            'action_target' => ['nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'in:general,agents,prompts,billing,navigation,getting_started'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        $knowledge->update($validated);

        return response()->json($knowledge);
    }

    public function destroy(ChatbotKnowledge $knowledge)
    {
        $knowledge->delete();

        return response()->json(['message' => 'Entry deleted']);
    }
}
