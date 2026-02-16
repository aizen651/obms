<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_nbr',
        'book_id',
        'borrower_id',
        'quantity',
        'date_borrowed',
        'expected_return_date',
        'date_returned',
        'date_canceled',
        'fees',
        'status',
        'is_lost',
        'transaction_date',
    ];

    protected $casts = [
        'date_borrowed' => 'date',
        'expected_return_date' => 'date',
        'date_returned' => 'date',
        'date_canceled' => 'date',
        'transaction_date' => 'datetime',
        'fees' => 'decimal:2',
        'is_lost' => 'boolean',
        'quantity' => 'integer',
    ];

    /**
     * Get the book associated with this transaction
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the borrower (user) associated with this transaction
     */
    public function borrower()
    {
        return $this->belongsTo(User::class, 'borrower_id');
    }

    /**
     * Scope to get only borrowed transactions
     */
    public function scopeBorrowed($query)
    {
        return $query->where('status', 'borrowed');
    }

    /**
     * Scope to get only returned transactions
     */
    public function scopeReturned($query)
    {
        return $query->where('status', 'returned');
    }

    /**
     * Scope to get overdue transactions
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue')
                     ->orWhere(function ($q) {
                         $q->where('status', 'borrowed')
                           ->where('expected_return_date', '<', now());
                     });
    }

    /**
     * Scope to get lost books
     */
    public function scopeLost($query)
    {
        return $query->where('is_lost', true);
    }

    /**
     * Check if transaction is overdue
     */
    public function isOverdue(): bool
    {
        return $this->status === 'borrowed' 
            && $this->expected_return_date < now();
    }

    /**
     * Calculate days overdue
     */
    public function daysOverdue(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        return now()->diffInDays($this->expected_return_date);
    }

    /**
     * Calculate late fee for this transaction
     */
    public function calculateLateFee($asOf = null): float
    {
        return \App\Models\Transaction\Setting::calculateLateFee(
            $this->expected_return_date,
            $asOf ?? $this->date_returned
        );
    }

    /**
     * Get the current fee (auto-calculated if applicable)
     */
    public function getCurrentFee(): float
    {
        // If manually set, use that
        if ($this->fees !== null && $this->fees > 0) {
            return (float) $this->fees;
        }

        // If returned, calculate based on return date
        if ($this->date_returned) {
            return $this->calculateLateFee($this->date_returned);
        }

        // If still borrowed and overdue, calculate based on now
        if ($this->status === 'borrowed' && $this->isOverdue()) {
            return $this->calculateLateFee(now());
        }

        return 0;
    }

    /**
     * Accessor for fees that returns calculated fee if not manually set
     */
    public function getCalculatedFeesAttribute(): float
    {
        return $this->getCurrentFee();
    }
}
