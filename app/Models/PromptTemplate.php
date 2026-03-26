<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromptTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'template_body',
        'field_schema',
        'version',
    ];

    protected function casts(): array
    {
        return [
            'field_schema' => 'array',
            'version' => 'integer',
        ];
    }

    public function agent()
    {
        return $this->belongsTo(AiAgent::class, 'agent_id');
    }
}
