<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // For SPA cookie auth, regenerate session; for cross-origin, issue token
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        // Revoke token if using token auth
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        // Also clear session if present
        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'job_title' => ['sometimes', 'string', 'max:255'],
            'purpose' => ['sometimes', 'string', 'max:1000'],
            'field_of_specialization' => ['sometimes', 'in:technology,creative,business,research,language'],
        ]);

        $user = $request->user();
        $user->update($validated);

        // Auto-assign default agents based on specialization
        if (isset($validated['field_of_specialization']) && $user->agents()->count() === 0) {
            $this->assignDefaultAgents($user, $validated['field_of_specialization']);
        }

        // Mark as onboarded when specialization is set (completing onboarding)
        if (isset($validated['field_of_specialization']) && ! $user->is_onboarded) {
            $user->update(['is_onboarded' => true]);
        }

        return response()->json($user->fresh());
    }

    public function markOnboarded(Request $request)
    {
        $request->user()->update(['is_onboarded' => true]);

        return response()->json($request->user()->fresh());
    }

    private function assignDefaultAgents(User $user, string $specialization): void
    {
        $domainMap = [
            'technology' => ['Technology', 'Research'],
            'creative' => ['Creative'],
            'business' => ['Business', 'Creative'],
            'research' => ['Research', 'Language'],
            'language' => ['Language', 'Creative', 'Research'],
        ];

        $domains = $domainMap[$specialization] ?? ['Technology'];

        $limit = ($user->plan_level === 'free' || ! $user->plan_level) ? 3 : 5;
        $agentIds = \App\Models\AiAgent::whereIn('domain', $domains)
            ->where('is_premium_only', false)
            ->limit($limit)
            ->pluck('id');

        $user->agents()->syncWithoutDetaching($agentIds);
    }
}
