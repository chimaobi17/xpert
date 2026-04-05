<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'agent_id' => ['nullable', 'exists:ai_agents,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $feedback = Feedback::create([
            'user_id' => $request->user()->id,
            'agent_id' => $request->agent_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json($feedback, 201);
    }

    public function index(Request $request)
    {
        $feedback = Feedback::where('user_id', $request->user()->id)
            ->with('agent:id,name')
            ->latest()
            ->limit(50)
            ->get();

        return response()->json($feedback);
    }

    public function adminIndex(Request $request)
    {
        $feedback = Feedback::with(['user:id,name,email', 'agent:id,name'])
            ->latest()
            ->paginate(50);

        return response()->json($feedback);
    }
}
