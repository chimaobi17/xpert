<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiAgent;
use App\Models\PromptLog;
use App\Models\User;
use Carbon\Carbon;
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
        $validated = $request->validate([
            'plan_level' => ['sometimes', 'in:free,standard,premium'],
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function blockUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'duration' => ['required', 'in:24h,7d,30d,permanent'],
            'reason' => ['required', 'string', 'min:10'],
        ]);

        $bannedUntil = match ($validated['duration']) {
            '24h' => Carbon::now()->addDay(),
            '7d' => Carbon::now()->addWeek(),
            '30d' => Carbon::now()->addMonth(),
            'permanent' => null,
        };

        $user->update([
            'banned_until' => $bannedUntil,
            'ban_reason' => $validated['reason'],
        ]);

        return response()->json($user);
    }

    public function unblockUser(User $user)
    {
        $user->update([
            'banned_until' => null,
            'ban_reason' => null,
        ]);

        return response()->json($user);
    }

    public function promoteUser(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['error' => 'You cannot modify your own role.'], 403);
        }

        if ($user->role === 'super_admin') {
            return response()->json(['error' => 'Cannot modify a super admin.'], 403);
        }

        $validated = $request->validate([
            'role' => ['required', 'in:user,admin'],
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json($user);
    }

    public function deleteUser(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['error' => 'You cannot delete your own account.'], 403);
        }

        if ($user->role === 'super_admin') {
            return response()->json(['error' => 'Cannot delete a super admin.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function agents()
    {
        return response()->json(AiAgent::with('latestTemplate')->get());
    }

    public function createAgent(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'domain' => ['required', 'string', 'in:Technology,Creative,Business,Research,Language'],
            'category' => ['required', 'string', 'max:100'],
            'system_prompt' => ['required', 'string', 'max:50000'],
            'is_premium_only' => ['sometimes', 'boolean'],
        ]);

        $agent = AiAgent::create($validated);

        return response()->json($agent, 201);
    }

    public function updateAgent(Request $request, AiAgent $agent)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'system_prompt' => ['sometimes', 'string', 'max:50000'],
            'is_premium_only' => ['sometimes', 'boolean'],
        ]);

        $agent->update($validated);

        return response()->json($agent);
    }

    public function logs()
    {
        $logs = PromptLog::with(['user:id,name,email', 'agent:id,name'])
            ->latest()
            ->limit(100)
            ->get();

        return response()->json($logs);
    }
}
