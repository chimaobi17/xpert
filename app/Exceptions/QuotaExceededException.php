<?php

namespace App\Exceptions;

use Exception;

class QuotaExceededException extends Exception
{
    public function render()
    {
        return response()->json([
            'error' => 'quota_exceeded',
            'message' => 'You have exceeded your daily token quota. Upgrade your plan for more.',
            'retry' => false,
            'upgrade' => true,
        ], 402);
    }
}
