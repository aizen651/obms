<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_image',
        'title',
        'isbn',
        'category_id',
        'author',
        'publisher',
        'published_year',
        'edition',
        'language',
        'pages',
        'description',
        'total_copies',
        'available_copies',
        'shelf_location',
        'status',
    ];

    protected $casts = [
        'published_year' => 'integer',
        'pages' => 'integer',
        'total_copies' => 'integer',
        'available_copies' => 'integer',
    ];
    
    protected $appends = ['image_url', 'display_status'];

    // Boot method to add automatic status update
    protected static function boot()
    {
        parent::boot();

        // Automatically update status when available_copies changes
        static::saving(function ($book) {
            // If book is not archived, auto-manage status based on available copies
            if ($book->status !== 'archived') {
                if ($book->available_copies <= 0) {
                    $book->status = 'unavailable';
                } else {
                    $book->status = 'available';
                }
            }
        });
    }

    public function getImageUrlAttribute()
{
    if (!$this->book_image) return null;
    
    return 'https://soptnwjadaotqwhnblvv.supabase.co/storage/v1/object/public/' . $this->book_image;
}

    // Computed status that always reflects actual availability
    public function getDisplayStatusAttribute()
    {
        // If archived, show archived
        if ($this->status === 'archived') {
            return 'archived';
        }
        
        // Otherwise, base on available copies
        return $this->available_copies > 0 ? 'available' : 'unavailable';
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function borrows()
    {
        return $this->transactions();
    }

    public function getBorrowedCountAttribute()
    {
        return $this->total_copies - $this->available_copies;
    }

    public function isAvailable(): bool
    {
        return $this->status !== 'archived' && $this->available_copies > 0;
    }

    public function getStatusColorAttribute(): string
    {
        $displayStatus = $this->display_status;
        return match($displayStatus) {
            'available' => 'green',
            'unavailable' => 'red',
            'archived' => 'gray',
            default => 'gray',
        };
    }
    
    public function scopeStatus($query, $status)
{
    if ($status === 'available') {
        return $query->where('available_copies', '>', 0)->where('status', '!=', 'archived');
    } elseif ($status === 'unavailable') {
        return $query->where('available_copies', 0)->where('status', '!=', 'archived');
    } elseif ($status === 'archived') {
        return $query->where('status', 'archived');
    }
    return $query;
}
}