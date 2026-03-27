<?php

namespace App\Services;

use App\Exceptions\FileParseException;
use App\Models\UploadedFile;
use Illuminate\Http\UploadedFile as HttpUploadedFile;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordFactory;

class FileProcessorService
{
    protected array $supportedMimes = [
        'application/pdf' => 'parsePdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'parseDocx',
        'text/plain' => 'parseText',
        'audio/mpeg' => 'storeOnly',
        'audio/wav' => 'storeOnly',
        'audio/x-wav' => 'storeOnly',
        'audio/aac' => 'storeOnly',
        'audio/webm' => 'storeOnly',
        'video/mp4' => 'storeOnly',
        'video/quicktime' => 'storeOnly',
        'image/jpeg' => 'storeOnly',
        'image/png' => 'storeOnly',
        'image/webp' => 'storeOnly',
    ];

    public function process(HttpUploadedFile $file, int $userId): UploadedFile
    {
        $mime = $file->getMimeType();
        $method = $this->supportedMimes[$mime] ?? null;

        if (! $method) {
            throw new FileParseException("Unsupported file type: {$mime}");
        }

        $path = $file->store("uploads/{$userId}", 'local');

        $parsedContent = null;

        if ($method !== 'storeOnly') {
            try {
                $parsedContent = $this->{$method}(Storage::disk('local')->path($path));
            } catch (\Throwable $e) {
                throw new FileParseException("Failed to parse file: {$e->getMessage()}");
            }
        }

        return UploadedFile::create([
            'user_id' => $userId,
            'file_path' => $path,
            'mime_type' => $mime,
            'size_bytes' => $file->getSize(),
            'parsed_content' => $parsedContent,
        ]);
    }

    protected function parsePdf(string $filePath): string
    {
        $parser = new PdfParser();
        $pdf = $parser->parseFile($filePath);
        $text = $pdf->getText();

        if (empty(trim($text))) {
            throw new FileParseException('The PDF appears to contain no extractable text.');
        }

        return $text;
    }

    protected function parseDocx(string $filePath): string
    {
        $phpWord = WordFactory::load($filePath);
        $text = '';

        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $element) {
                if (method_exists($element, 'getText')) {
                    $text .= $element->getText() . "\n";
                } elseif (method_exists($element, 'getElements')) {
                    foreach ($element->getElements() as $child) {
                        if (method_exists($child, 'getText')) {
                            $text .= $child->getText() . "\n";
                        }
                    }
                }
            }
        }

        if (empty(trim($text))) {
            throw new FileParseException('The DOCX appears to contain no extractable text.');
        }

        return $text;
    }

    protected function parseText(string $filePath): string
    {
        $text = file_get_contents($filePath);

        if ($text === false || empty(trim($text))) {
            throw new FileParseException('The text file appears to be empty or unreadable.');
        }

        return $text;
    }

    public function getExtractedText(UploadedFile $file): ?string
    {
        return $file->parsed_content;
    }
}
