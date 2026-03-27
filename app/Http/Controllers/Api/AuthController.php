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

        $request->session()->regenerate();

        return response()->json(Auth::user());
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

        return response()->json($user, 201);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

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

        return response()->json($user->fresh());
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

        $agentIds = \App\Models\AiAgent::whereIn('domain', $domains)
            ->where('is_premium_only', false)
            ->limit(5)
            ->pluck('id');

        $user->agents()->syncWithoutDetaching($agentIds);
    }
}
