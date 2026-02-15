<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Borrow extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'borrowed_at',
        'due_date',
        'returned_at',
        'status',
        'notes',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'due_date' => 'date',
        'returned_at' => 'datetime',
    ];

    /**
     * Relationship: Borrow belongs to User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Borrow belongs to Book
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Check if the book is overdue
     */
    public function isOverdue(): bool
    {
        if ($this->status === 'returned' || $this->status === 'cancelled') {
            return false;
        }

        return Carbon::now()->isAfter($this->due_date) && $this->status === 'borrowed';
    }

    /**
     * Get days until due (negative if overdue)
     */
    public function getDaysUntilDueAttribute(): int
    {
        if ($this->status === 'returned' || $this->status === 'cancelled') {
            return 0;
        }

        return Carbon::now()->diffInDays($this->due_date, false);
    }

    /**
     * Get days overdue (0 if not overdue)
     */
    public function getDaysOverdueAttribute(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        return Carbon::now()->diffInDays($this->due_date);
    }

    /**
     * Automatically update status to overdue
     * Call this in a scheduled task
     */
    public static function updateOverdueStatuses(): int
    {
        return self::where('status', 'borrowed')
            ->where('due_date', '<', Carbon::now())
            ->update(['status' => 'overdue']);
    }

    /**
     * Scope: Get currently borrowed books
     */
    public function scopeBorrowed($query)
    {
        return $query->where('status', 'borrowed');
    }

    /**
     * Scope: Get returned books
     */
    public function scopeReturned($query)
    {
        return $query->where('status', 'returned');
    }

    /**
     * Scope: Get overdue books
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    /**
     * Scope: Get lost books
     */
    public function scopeLost($query)
    {
        return $query->where('status', 'lost');
    }

    /**
     * Scope: Get books for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Mark as returned
     */
    public function markAsReturned(): bool
    {
        $this->returned_at = Carbon::now();
        $this->status = 'returned';
        return $this->save();
    }

    /**
     * Mark as lost
     */
    public function markAsLost(): bool
    {
        $this->status = 'lost';
        return $this->save();
    }

    /**
     * Cancel the borrow
     */
    public function cancel(): bool
    {
        $this->status = 'cancelled';
        return $this->save();
    }
}