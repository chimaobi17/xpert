<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAgent;
use Illuminate\Http\Request;

class UserAgentController extends Controller
{
    public function index(Request $request)
    {
        $agents = $request->user()->agents()->get();

        return response()->json($agents);
    }

    public function store(Request $request, AiAgent $agent)
    {
        $user = $request->user();

        if ($user->agents()->where('ai_agents.id', $agent->id)->exists()) {
            return response()->json([
                'error' => 'agent_already_added',
                'message' => 'This agent is already in your workspace.',
                'retry' => false,
                'upgrade' => false,
            ], 409);
        }

        if ($user->plan_level === 'free' && $user->agents()->count() >= 3) {
            return response()->json([
                'error' => 'agent_limit_reached',
                'message' => 'Free plan users can have up to 3 agents. Upgrade your plan to add more.',
                'retry' => false,
                'upgrade' => true,
            ], 402);
        }

        if ($agent->is_premium_only && $user->plan_level === 'free') {
            return response()->json([
                'error' => 'premium_required',
                'message' => "The {$agent->name} agent requires a premium plan.",
                'retry' => false,
                'upgrade' => true,
            ], 402);
        }

        $user->agents()->attach($agent->id);

        return response()->json(['message' => 'Agent added to workspace'], 201);
    }

    public function destroy(Request $request, AiAgent $agent)
    {
        $request->user()->agents()->detach($agent->id);

        return response()->json(['message' => 'Agent removed from workspace']);
    }
}
