<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'plan_level',
        'language_preference',
        'avatar',
        'job_title',
        'purpose',
        'field_of_specialization',
        'banned_until',
        'ban_reason',
        'is_onboarded',
        'two_factor_secret',
        'two_factor_enabled',
        'is_verified',
        'otp_code',
        'otp_expires_at',
        'reset_token',
        'reset_token_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'otp_code',
        'reset_token',
    ];

    protected $appends = ['onboarding_complete', 'avatar_url'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'banned_until' => 'datetime',
            'is_onboarded' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'is_verified' => 'boolean',
            'otp_expires_at' => 'datetime',
            'reset_token_expires_at' => 'datetime',
        ];
    }

    public function getOnboardingCompleteAttribute(): bool
    {
        return (bool) ($this->attributes['is_onboarded'] ?? false);
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return ($this->attributes['avatar'] ?? null) ?: null;
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function agents()
    {
        return $this->belongsToMany(AiAgent::class, 'user_agents');
    }

    public function promptLogs()
    {
        return $this->hasMany(PromptLog::class);
    }

    public function promptLibrary()
    {
        return $this->hasMany(PromptLibrary::class);
    }

    public function tokenUsageLogs()
    {
        return $this->hasMany(TokenUsageLog::class);
    }

    public function uploadedFiles()
    {
        return $this->hasMany(UploadedFile::class);
    }
}
