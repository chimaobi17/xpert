<?php

namespace App\Exceptions;

use Exception;

class FileParseException extends Exception
{
    public function render()
    {
        return response()->json([
            'error' => 'file_parse_failed',
            'message' => 'Could not read the uploaded file. Try a different format.',
            'retry' => false,
            'upgrade' => false,
        ], 422);
    }
}
