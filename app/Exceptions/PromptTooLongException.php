<?php

namespace App\Exceptions;

use Exception;

class PromptTooLongException extends Exception
{
    public function render()
    {
        return response()->json([
            'error' => 'prompt_too_long',
            'message' => 'Your prompt exceeds the maximum length for your plan. Upgrade for longer prompts.',
            'retry' => false,
            'upgrade' => true,
        ], 422);
    }
}
