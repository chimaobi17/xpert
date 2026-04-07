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
        'job_title',
        'purpose',
        'field_of_specialization',
        'banned_until',
        'ban_reason',
        'is_onboarded',
        'two_factor_secret',
        'two_factor_enabled',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected $appends = ['onboarding_complete'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'banned_until' => 'datetime',
            'is_onboarded' => 'boolean',
            'two_factor_enabled' => 'boolean',
        ];
    }

    public function getOnboardingCompleteAttribute(): bool
    {
        return (bool) $this->is_onboarded;
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
