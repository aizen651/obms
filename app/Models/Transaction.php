<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_nbr', 'book_id', 'borrower_id', 'quantity',
        'date_borrowed', 'expected_return_date', 'date_returned', 'date_canceled',
        'fees', 'status', 'is_lost', 'transaction_date',
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

    public function book() { return $this->belongsTo(Book::class); }
    public function borrower() { return $this->belongsTo(User::class, 'borrower_id'); }
    
    public function scopeBorrowed($query) { return $query->where('status', 'borrowed'); }
    public function scopeReturned($query) { return $query->where('status', 'returned'); }
    public function scopeOverdue($query) { return $query->where('status', 'overdue')->orWhere(fn($q) => $q->where('status', 'borrowed')->where('expected_return_date', '<', now())); }
    public function scopeLost($query) { return $query->where('is_lost', true); }

    public function isOverdue(): bool { return $this->status === 'borrowed' && $this->expected_return_date < now(); }
    public function daysOverdue(): int { return $this->isOverdue() ? now()->diffInDays($this->expected_return_date) : 0; }

    public function calculateLateFee($asOf = null): float
    {
        return \App\Models\Transaction\Setting::calculateLateFee(
            $this->expected_return_date,
            $asOf ?? $this->date_returned
        );
    }

    public function getCurrentFee(): float
    {
        // Get late fee config
        $config = \App\Models\Transaction\Setting::getLateFeeConfig();
        
        // If manually set fees, always use that
        if ($this->fees !== null && $this->fees > 0) {
            return (float) $this->fees;
        }

        // Only auto-calculate if enabled AND fees is null
        if (!$config || !$config['enabled'] || $this->fees !== null) {
            return (float) ($this->fees ?? 0);
        }

        // Auto-calculate based on status
        if ($this->date_returned) {
            return $this->calculateLateFee($this->date_returned);
        }

        if ($this->status === 'borrowed' && $this->isOverdue()) {
            return $this->calculateLateFee(now());
        }

        return 0;
    }

    public function getCalculatedFeesAttribute(): float
    {
        return $this->getCurrentFee();
    }
}