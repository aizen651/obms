<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Story extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'slug', 'genre', 'cover_image',
        'synopsis', 'content', 'status', 'rejection_reason',
        'views', 'read_time', 'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'views'       => 'integer',
        'read_time'   => 'integer',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────
    public function author() { return $this->belongsTo(User::class, 'user_id'); }

    // ── Scopes ────────────────────────────────────────────────────────────────
    public function scopeApproved($q) { return $q->where('status', 'approved'); }
    public function scopePending($q)  { return $q->where('status', 'pending');  }

    // ── Accessors ─────────────────────────────────────────────────────────────
    public function getCoverUrlAttribute(): ?string
    {
        if (!$this->cover_image) return null;
        if (str_starts_with($this->cover_image, 'http')) return $this->cover_image;
        return env('SUPABASE_URL') . '/storage/v1/object/public/story-covers/' . basename($this->cover_image);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    public static function generateSlug(string $title): string
    {
        $slug  = Str::slug($title);
        $count = static::where('slug', 'like', "{$slug}%")->count();
        return $count ? "{$slug}-{$count}" : $slug;
    }

    public static function estimateReadTime(string $content): int
    {
        $words = str_word_count(strip_tags($content));
        return max(1, (int) ceil($words / 200));
    }
}