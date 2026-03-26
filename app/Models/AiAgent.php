<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiAgent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
        'category',
        'system_prompt',
        'is_premium_only',
    ];

    protected function casts(): array
    {
        return [
            'is_premium_only' => 'boolean',
        ];
    }

    public function promptTemplates()
    {
        return $this->hasMany(PromptTemplate::class, 'agent_id');
    }

    public function latestTemplate()
    {
        return $this->hasOne(PromptTemplate::class, 'agent_id')->latestOfMany('version');
    }

    public function promptLogs()
    {
        return $this->hasMany(PromptLog::class, 'agent_id');
    }

    public function promptLibrary()
    {
        return $this->hasMany(PromptLibrary::class, 'agent_id');
    }

    public function promptCache()
    {
        return $this->hasMany(PromptCache::class, 'agent_id');
    }
}
