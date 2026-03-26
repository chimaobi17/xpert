<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiAgent;
use App\Models\PromptLog;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_prompts_today' => PromptLog::whereDate('created_at', today())->count(),
            'active_agents' => AiAgent::count(),
        ]);
    }

    public function users()
    {
        return response()->json(User::latest()->get());
    }

    public function showUser(User $user)
    {
        return response()->json($user);
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'plan_level' => ['sometimes', 'in:free,standard,premium'],
            'role' => ['sometimes', 'in:user,admin'],
        ]);

        $user->update($request->only(['plan_level', 'role']));

        return response()->json($user);
    }

    public function agents()
    {
        return response()->json(AiAgent::all());
    }

    public function updateAgent(Request $request, AiAgent $agent)
    {
        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'system_prompt' => ['sometimes', 'string'],
            'is_premium_only' => ['sometimes', 'boolean'],
        ]);

        $agent->update($request->only(['name', 'system_prompt', 'is_premium_only']));

        return response()->json($agent);
    }

    public function logs()
    {
        $logs = PromptLog::with(['user:id,name,email', 'aiAgent:id,name'])
            ->latest()
            ->limit(100)
            ->get();

        return response()->json($logs);
    }
}
