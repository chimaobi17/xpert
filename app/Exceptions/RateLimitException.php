<?php

namespace App\Exceptions;

use Exception;

class RateLimitException extends Exception
{
    protected int $retryAfter;

    public function __construct(int $retryAfter = 60, string $message = '')
    {
        parent::__construct($message);
        $this->retryAfter = $retryAfter;
    }

    public function render()
    {
        return response()->json([
            'error' => 'rate_limited',
            'message' => "Rate limited. Try again in {$this->retryAfter} seconds.",
            'retry' => true,
            'upgrade' => false,
            'retry_after' => $this->retryAfter,
        ], 429)->header('Retry-After', $this->retryAfter);
    }
}
