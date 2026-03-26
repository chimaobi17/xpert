<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromptCache extends Model
{
    public $timestamps = false;

    protected $table = 'prompt_cache';

    protected $fillable = [
        'cache_key',
        'agent_id',
        'prompt_text',
        'response_text',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function agent()
    {
        return $this->belongsTo(AiAgent::class, 'agent_id');
    }
}
