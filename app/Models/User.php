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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
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
