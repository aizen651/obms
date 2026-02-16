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
    
    // Add accessor for image URL - IMPORTANT: This makes image_url available in JSON
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->book_image) {
            return Storage::url($this->book_image);
        }
        return null;
    }

    /**
     * Relationship: Book belongs to a category
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relationship: Book has many transactions
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Keep for backward compatibility
     */
    public function borrows()
    {
        return $this->transactions();
    }

    /**
     * Get currently borrowed count
     */
    public function getBorrowedCountAttribute()
    {
        return $this->total_copies - $this->available_copies;
    }

    /**
     * Check if book is available for borrowing
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available' && $this->available_copies > 0;
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'available' => 'green',
            'unavailable' => 'red',
            'archived' => 'gray',
            default => 'gray',
        };
    }
}