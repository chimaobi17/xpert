<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromptLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'agent_id',
        'prompt_type',
        'prompt_text',
        'tokens_estimated',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'tokens_estimated' => 'integer',
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
