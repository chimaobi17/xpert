<?php

namespace App\Exceptions;

use Exception;

class InvalidApiKeyException extends Exception
{
    public function render()
    {
        return response()->json([
            'error' => 'server_error',
            'message' => 'An internal error occurred. Our team has been notified.',
            'retry' => false,
            'upgrade' => false,
        ], 500);
    }
}
