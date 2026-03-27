<?php

namespace App\Exceptions;

use Exception;

class AiTimeoutException extends Exception
{
    public function render()
    {
        return response()->json([
            'error' => 'ai_timeout',
            'message' => 'The AI took too long to respond. Please try again.',
            'retry' => true,
            'upgrade' => false,
        ], 504);
    }
}
