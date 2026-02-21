<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MagazineIssue extends Model
{
    protected $fillable = [
        'issue_number', 'season', 'is_published',
        'hero_image', 'hero_category', 'hero_title', 'hero_subtitle', 'hero_excerpt',
        'quote_text', 'quote_highlight',
        'features', 'curations', 'book_picks',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'features'     => 'array',
        'curations'    => 'array',
        'book_picks'   => 'array',
    ];

    // Normalize hero_image before saving:
    // Always store just the bare path (e.g. "magazine/file.jpg")
    // Strip full URLs, /storage/ prefixes, and ?v= query strings
    public function setHeroImageAttribute(?string $value): void
    {
        $this->attributes['hero_image'] = $value ? self::normalizeImagePath($value) : null;
    }

    // Normalize feature images before saving
    public function setFeaturesAttribute(?array $value): void
    {
        if ($value) {
            $value = array_map(function ($f) {
                if (!empty($f['image'])) {
                    $f['image'] = self::normalizeImagePath($f['image']);
                }
                return $f;
            }, $value);
        }
        $this->attributes['features'] = json_encode($value);
    }

    // Always returns a clean public URL with cache-busting
    public function getHeroImageUrlAttribute(): ?string
    {
        if (!$this->hero_image) return null;
        // Already a full external URL (e.g. Unsplash)
        if (str_starts_with($this->hero_image, 'http')) return $this->hero_image;
        // Stored as bare path like "magazine/file.jpg"
        return Storage::url($this->hero_image);
    }

    // Strip /storage/ prefix, full origin, and ?v= query string
    // so we always store the bare relative path: "magazine/file.jpg"
    private static function normalizeImagePath(string $url): string
    {
        // Remove query string
        $url = strtok($url, '?');
        // Remove leading /storage/
        $url = preg_replace('#^/storage/#', '', $url);
        // Remove full origin like http://127.0.0.1:8000/storage/
        $url = preg_replace('#^https?://[^/]+/storage/#', '', $url);
        return $url;
    }

    public static function current(): ?self
    {
        return static::where('is_published', true)->latest()->first();
    }

    public static function latest_or_create(): self
    {
        return static::firstOrCreate([], [
            'issue_number'  => '01',
            'hero_category' => 'Editorial Feature',
            'hero_title'    => 'Your Title Here',
            'hero_excerpt'  => 'Write a short description here.',
            'features'      => [
                ['title' => 'Feature One',   'category' => 'Typography', 'icon' => 'feather'],
                ['title' => 'Feature Two',   'category' => 'Interface',  'icon' => 'globe'],
                ['title' => 'Feature Three', 'category' => 'Medium',     'icon' => 'book'],
            ],
            'curations' => [
                ['title' => 'The influence of Brutalist shadows.'],
                ['title' => 'On whitespace as a design language.'],
                ['title' => 'When the grid breaks: a case study.'],
            ],
            'book_picks' => [],
        ]);
    }
}
