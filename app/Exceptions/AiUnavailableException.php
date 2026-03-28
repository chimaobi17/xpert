<?php

namespace App\Exceptions;

use Exception;

class AiUnavailableException extends Exception
{
    public function render()
    {
        return response()->json([
            'error' => 'ai_unavailable',
            'message' => $this->getMessage() ?: 'Your request has been queued and will be processed shortly.',
            'retry' => true,
            'upgrade' => false,
        ], 503);
    }
}
