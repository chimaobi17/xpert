<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TokenUsageLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'date',
        'tokens_used',
        'request_count',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'tokens_used' => 'integer',
            'request_count' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
