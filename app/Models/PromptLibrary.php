<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromptLibrary extends Model
{
    public $timestamps = false;

    protected $table = 'prompt_library';

    protected $fillable = [
        'user_id',
        'agent_id',
        'original_input',
        'final_prompt',
        'ai_response',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agent()
    {
        return $this->belongsTo(AiAgent::class, 'agent_id');
    }
}
