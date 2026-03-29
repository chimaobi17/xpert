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

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
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

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        if ($request->user()?->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
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
        try {
            if (isset($validated['field_of_specialization']) && ! ($user->is_onboarded ?? false)) {
                $user->update(['is_onboarded' => true]);
            }
        } catch (\Exception $e) {
            \Log::warning('Silent onboarding update failed during profile update: ' . $e->getMessage());
        }

        return response()->json($user->fresh());
    }

    public function markOnboarded(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                $user->is_onboarded = true;
                $user->save();
                return response()->json($user->fresh());
            }
            return response()->json(['error' => 'auth_required'], 401);
        } catch (\Exception $e) {
            \Log::error('CRITICAL: Onboarding status persistence failed. This usually indicates a missing "is_onboarded" column in the users table. Error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'server_error',
                'message' => 'Failed to persist onboarding status. Please contact support or try again later.',
                'details' => config('app.debug') ? $e->getMessage() : 'Database column mismatch or connection error.',
            ], 500);
        }
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
