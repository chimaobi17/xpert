<?php

namespace App\Exceptions;

use Exception;

class TemplateNotFoundException extends Exception
{
    public function render()
    {
        return response()->json([
            'error' => 'template_not_found',
            'message' => 'This agent is temporarily unavailable. Please try another agent.',
            'retry' => false,
            'upgrade' => false,
        ], 500);
    }
}
