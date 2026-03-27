<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileProcessorService;
use Illuminate\Http\Request;

class FileUploadController extends Controller
{
    public function __construct(
        protected FileProcessorService $fileProcessor,
    ) {}

    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:204800'],
        ]);

        $user = $request->user();
        $fileLimitMb = config('ai_models.file_limits.' . $user->plan_level, 25);
        $fileLimitBytes = $fileLimitMb * 1024 * 1024;

        if ($request->file('file')->getSize() > $fileLimitBytes) {
            return response()->json([
                'error' => 'file_too_large',
                'message' => "File exceeds the {$fileLimitMb}MB limit for your {$user->plan_level} plan.",
                'retry' => false,
                'upgrade' => true,
            ], 413);
        }

        $uploaded = $this->fileProcessor->process($request->file('file'), $user->id);

        return response()->json([
            'id' => $uploaded->id,
            'file_path' => $uploaded->file_path,
            'mime_type' => $uploaded->mime_type,
            'size_bytes' => $uploaded->size_bytes,
            'has_text' => ! empty($uploaded->parsed_content),
        ], 201);
    }
}
