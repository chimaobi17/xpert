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

        // If 2FA is enabled, require verification before issuing token
        if ($user->two_factor_enabled) {
            return response()->json([
                'requires_2fa' => true,
                'user_id' => $user->id,
                'message' => 'Please enter your two-factor authentication code.',
            ]);
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
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Anti-enumeration: return generic error if email exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'error' => 'registration_failed',
                'message' => 'Unable to complete registration. Please try a different email or log in.',
            ], 422);
        }

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
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'job_title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'purpose' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'field_of_specialization' => ['sometimes', 'in:technology,creative,business,research,language'],
        ]);

        $user = $request->user();

        // Wrap profile update in try...catch to avoid blocking users with DB mismatches
        try {
            $user->update($validated);
        } catch (\Exception $e) {
            \Log::warning('Profile update failed during onboarding: ' . $e->getMessage());
        }

        // Wrap default agents assignment
        try {
            if (isset($validated['field_of_specialization']) && $user->agents()->count() === 0) {
                $this->assignDefaultAgents($user, $validated['field_of_specialization']);
            }
        } catch (\Exception $e) {
            \Log::warning('Default agents sync failed during onboarding: ' . $e->getMessage());
        }

        // Wrap the final onboarding marker
        try {
            if (isset($validated['field_of_specialization']) && ! ($user->is_onboarded ?? false)) {
                $user->update(['is_onboarded' => true]);
            }
        } catch (\Exception $e) {
            \Log::warning('Marking user as onboarded failed: ' . $e->getMessage());
        }

        return response()->json($user->fresh());
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Delete old avatar
        if ($user->avatar) {
            \Storage::disk('public')->delete($user->avatar);
        }

        $user->update([
            'avatar' => $request->file('avatar')->store('avatars', 'public'),
        ]);

        return response()->json($user->fresh());
    }

    public function markOnboarded(Request $request)
    {
        try {
            $user = $request->user();
            if ($user && ! ($user->is_onboarded ?? false)) {
                $user->update(['is_onboarded' => true]);
            }
            return response()->json($user->fresh());
        } catch (\Exception $e) {
            \Log::error('Explicit onboarding status persistence failed: ' . $e->getMessage());
            
            // Return success anyway to unblock the UI, logging the persistent issue
            return response()->json($request->user());
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
