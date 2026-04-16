<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\MfaCodeMail;
use App\Mail\VerifyEmailOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
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

        // If 2FA is enabled, send code via email and require verification
        if ($user->two_factor_enabled) {
            $secret = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->update([
                'two_factor_secret' => Hash::make($secret),
            ]);

            try {
                Mail::to($user->email)->send(new MfaCodeMail(
                    otpCode: $secret,
                    userName: $user->name,
                ));
            } catch (\Exception $e) {
                \Log::warning('MFA login email failed: ' . $e->getMessage());
            }

            return response()->json([
                'requires_2fa' => true,
                'user_id' => $user->id,
                'message' => 'A verification code has been sent to your email.',
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
            'job_title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'purpose' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'field_of_specialization' => ['sometimes', 'nullable', 'in:technology,creative,business,research,language'],
            'language_preference' => ['sometimes', 'nullable', 'string', 'max:10'],
        ]);

        // Anti-enumeration: return generic error if email exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'error' => 'registration_failed',
                'message' => 'Unable to complete registration. Please try a different email or log in.',
            ], 422);
        }

        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'job_title' => $request->job_title,
            'purpose' => $request->purpose,
            'field_of_specialization' => $request->field_of_specialization,
            'language_preference' => $request->language_preference ?? 'en',
            'is_onboarded' => $request->filled('field_of_specialization'),
            'is_verified' => false,
            'otp_code' => $otpCode,
            'otp_expires_at' => now()->addMinutes(15),
        ]);

        // Automatically assign default agents if specialization info is provided
        if ($request->filled('field_of_specialization')) {
            try {
                $this->assignDefaultAgents($user, $request->field_of_specialization);
            } catch (\Exception $e) {
                \Log::warning('Initial agent assignment failed: ' . $e->getMessage());
            }
        }

        // Send verification email
        try {
            Mail::to($user->email)->send(new VerifyEmailOtp(
                otpCode: $otpCode,
                userName: $user->name,
            ));
        } catch (\Exception $e) {
            \Log::warning('Verification email failed: ' . $e->getMessage());
        }

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user->fresh(),
            'token' => $token,
            'requires_verification' => true,
        ], 201);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if ($user->is_verified) {
            return response()->json(['message' => 'Email already verified.']);
        }

        if (! $user->otp_code || $user->otp_code !== $request->code) {
            return response()->json(['error' => 'invalid_code', 'message' => 'Invalid verification code.'], 422);
        }

        if ($user->otp_expires_at && $user->otp_expires_at->isPast()) {
            return response()->json(['error' => 'expired_code', 'message' => 'Code has expired. Please request a new one.'], 422);
        }

        $user->update([
            'is_verified' => true,
            'email_verified_at' => now(),
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        return response()->json(['message' => 'Email verified successfully.', 'user' => $user->fresh()]);
    }

    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->is_verified) {
            return response()->json(['message' => 'Email already verified.']);
        }

        // Rate limit: 3 resends per 5 minutes
        $key = 'verify-resend:' . $user->id;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json(['message' => 'Too many requests. Please wait before trying again.'], 429);
        }
        RateLimiter::hit($key, 300);

        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'otp_code' => $otpCode,
            'otp_expires_at' => now()->addMinutes(15),
        ]);

        try {
            Mail::to($user->email)->send(new VerifyEmailOtp(
                otpCode: $otpCode,
                userName: $user->name,
            ));
        } catch (\Exception $e) {
            \Log::warning('Resend verification email failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Verification code sent to your email.']);
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
            'language_preference' => ['sometimes', 'string', 'max:10'],
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

        $file = $request->file('avatar');
        $mime = $file->getMimeType();
        $base64 = base64_encode(file_get_contents($file->getRealPath()));

        $request->user()->update([
            'avatar' => "data:{$mime};base64,{$base64}",
        ]);

        return response()->json($request->user()->fresh());
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

        $limit = ($user->plan_level === 'free' || ! $user->plan_level) ? 2 : 5;
        $agentIds = \App\Models\AiAgent::whereIn('domain', $domains)
            ->where('is_premium_only', false)
            ->limit($limit)
            ->pluck('id');

        $user->agents()->syncWithoutDetaching($agentIds);
    }
}
