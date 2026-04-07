<?php

namespace App\Services;

use App\Models\UploadedFile;
use Illuminate\Http\UploadedFile as HttpUploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordFactory;
use PhpOffice\PhpSpreadsheet\IOFactory as SpreadsheetFactory;

class FileProcessorService
{
    protected array $supportedMimes = [
        // Document types — fully parsed to text
        'application/pdf' => 'parsePdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'parseDocx',
        'application/msword' => 'parseDocx',  // .doc (older Word)
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'parseXlsx',
        'application/vnd.ms-excel' => 'parseXlsx',
        'text/plain' => 'parseText',
        'text/csv' => 'parseText',
        'text/markdown' => 'parseText',
        'text/html' => 'parseHtml',
        'text/xml' => 'parseText',
        'application/xml' => 'parseText',
        'application/json' => 'parseText',
        'application/rtf' => 'parseText',
        'text/rtf' => 'parseText',
        // Presentation
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'parsePptx',
        'application/vnd.ms-powerpoint' => 'storeOnly', // .ppt (older PowerPoint)
        // Media — stored, metadata extracted
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
        'image/gif' => 'storeOnly',
        'image/svg+xml' => 'parseText',
        // Catch-all for Office variants
        'application/octet-stream' => 'storeOnly',
    ];

    public function process(HttpUploadedFile $file, int $userId): UploadedFile
    {
        $mime = $file->getMimeType();
        $method = $this->supportedMimes[$mime] ?? null;

        // Accept any file — unknown types are stored without parsing
        if (! $method) {
            Log::warning('file_unknown_mime', ['mime' => $mime, 'name' => $file->getClientOriginalName()]);
            $method = 'storeOnly';
        }

        $path = $file->store("uploads/{$userId}", 'local');

        $parsedContent = null;

        if ($method !== 'storeOnly') {
            try {
                $parsedContent = $this->{$method}(Storage::disk('local')->path($path));
            } catch (\Throwable $e) {
                // Parse failed — log it but don't block the upload.
                // The controller will fall back to a file description.
                Log::warning('file_parse_failed', [
                    'mime' => $mime,
                    'name' => $file->getClientOriginalName(),
                    'error' => $e->getMessage(),
                ]);
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

    protected function parseXlsx(string $filePath): string
    {
        $spreadsheet = SpreadsheetFactory::load($filePath);
        $text = '';

        foreach ($spreadsheet->getAllSheets() as $sheet) {
            $sheetName = $sheet->getTitle();
            $text .= "--- Sheet: {$sheetName} ---\n";

            foreach ($sheet->toArray(null, true, true, true) as $rowIndex => $row) {
                $cells = array_map(fn($v) => $v !== null ? (string) $v : '', $row);
                $line = implode(' | ', $cells);
                if (trim($line, ' |') !== '') {
                    $text .= $line . "\n";
                }
            }
            $text .= "\n";
        }

        if (empty(trim($text))) {
            throw new FileParseException('The spreadsheet appears to contain no data.');
        }

        return $text;
    }

    protected function parsePptx(string $filePath): string
    {
        $zip = new \ZipArchive();
        if ($zip->open($filePath) !== true) {
            throw new FileParseException('Could not open the presentation file.');
        }

        $text = '';
        $slideIndex = 1;

        while (($xml = $zip->getFromName("ppt/slides/slide{$slideIndex}.xml")) !== false) {
            $dom = new \DOMDocument();
            @$dom->loadXML($xml);
            $paragraphs = $dom->getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 't');
            $slideText = '';
            foreach ($paragraphs as $p) {
                $slideText .= $p->textContent . ' ';
            }
            if (trim($slideText) !== '') {
                $text .= "--- Slide {$slideIndex} ---\n" . trim($slideText) . "\n\n";
            }
            $slideIndex++;
        }

        $zip->close();

        if (empty(trim($text))) {
            throw new FileParseException('The presentation appears to contain no extractable text.');
        }

        return $text;
    }

    protected function parseHtml(string $filePath): string
    {
        $html = file_get_contents($filePath);
        if ($html === false) {
            throw new FileParseException('The file appears to be empty or unreadable.');
        }

        $text = strip_tags($html);
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);

        if (empty($text)) {
            throw new FileParseException('The HTML file appears to contain no text.');
        }

        return $text;
    }

    protected function parseText(string $filePath): string
    {
        $text = file_get_contents($filePath);

        if ($text === false || empty(trim($text))) {
            throw new FileParseException('The file appears to be empty or unreadable.');
        }

        return $text;
    }

    /**
     * For storeOnly files (images, audio, video), build a text description
     * so text-based agents can still reference the uploaded file.
     */
    public function getFileDescription(UploadedFile $file): string
    {
        $name = basename($file->file_path);
        $sizeMb = round($file->size_bytes / (1024 * 1024), 2);
        $mime = $file->mime_type;

        $desc = "[Uploaded file: {$name} ({$mime}, {$sizeMb} MB)]";

        if ($this->isImageMime($mime)) {
            $path = Storage::disk('local')->path($file->file_path);
            $imageSize = @getimagesize($path);
            if ($imageSize) {
                $desc .= " — Image dimensions: {$imageSize[0]}x{$imageSize[1]}px";
            }
        }

        return $desc;
    }

    public function getExtractedText(UploadedFile $file): ?string
    {
        return $file->parsed_content;
    }

    public function isImageMime(string $mimeType): bool
    {
        return str_starts_with($mimeType, 'image/');
    }

    public function getImageBase64(UploadedFile $file): ?string
    {
        if ($this->isImageMime($file->mime_type)) {
            $content = Storage::disk('local')->get($file->file_path);
            return $content ? base64_encode($content) : null;
        }
        return null;
    }
}
