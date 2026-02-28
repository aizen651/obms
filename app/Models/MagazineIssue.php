<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function setHeroImageAttribute(?string $value): void
    {
        $this->attributes['hero_image'] = $value ? self::normalizeImagePath($value) : null;
    }

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

    public function getHeroImageUrlAttribute(): ?string
    {
        if (!$this->hero_image) return null;
        if (str_starts_with($this->hero_image, 'http')) return $this->hero_image;
        return env('SUPABASE_URL') . '/storage/v1/object/public/magazine/' . basename($this->hero_image);
    }

    private static function normalizeImagePath(string $url): string
    {
        $url = strtok($url, '?');
        // Already a Supabase URL — extract just the filename
        if (preg_match('#/storage/v1/object/public/magazine/(.+)$#', $url, $m)) {
            return $m[1];
        }
        // Remove /storage/ prefix
        $url = preg_replace('#^/storage/#', '', $url);
        // Remove full origin
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