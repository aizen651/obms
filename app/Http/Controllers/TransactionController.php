<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Show the authenticated user's borrow history.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Transaction::with('book:id,title,author,book_image')
            ->where('borrower_id', $user->id)
            ->orderBy('created_at', 'desc');

        // Apply status filter — lost uses is_lost flag, others use status column
        if ($request->filled('status')) {
            if ($request->status === 'lost') {
                $query->where('is_lost', true);
            } else {
                $query->where('status', $request->status);
            }
        }

        $transactions = $query->paginate(10)
            ->withQueryString()
            ->through(fn ($t) => [
                'id'                   => $t->id,
                'ref_nbr'              => $t->ref_nbr,
                'status'               => $t->is_lost ? 'lost' : $t->status, // override if lost
                'is_lost'              => $t->is_lost,
                'date_borrowed'        => $t->date_borrowed?->toDateString(),
                'expected_return_date' => $t->expected_return_date?->toDateString(),
                'date_returned'        => $t->date_returned?->toDateString(),
                'fees'                 => $t->calculated_fees,
                'is_overdue'           => $t->isOverdue(),
                'days_overdue'         => $t->daysOverdue(),
                'book' => $t->book ? [
                    'id'        => $t->book->id,
                    'title'     => $t->book->title,
                    'author'    => $t->book->author,
                    'image_url' => $t->book->image_url,
                ] : null,
            ]);

        $stats = [
            'total'    => Transaction::where('borrower_id', $user->id)->count(),
            'active'   => Transaction::where('borrower_id', $user->id)->whereIn('status', ['borrowed', 'overdue'])->count(),
            'overdue'  => Transaction::where('borrower_id', $user->id)->where('status', 'overdue')->count(),
            'returned' => Transaction::where('borrower_id', $user->id)->where('status', 'returned')->count(),
            'lost'     => Transaction::where('borrower_id', $user->id)->where('is_lost', true)->count(),
        ];

        return Inertia::render('User/Transactions', [
            'transactions' => $transactions,
            'stats'        => $stats,
            'filters'      => ['status' => $request->status ?? ''],
        ]);
    }

    /**
     * Store a new borrow transaction.
     */
    public function store(Request $request, Book $book)
    {
        $request->validate([
            'due_date' => 'required|date|after:today|before:' . now()->addDays(60)->toDateString(),
            'notes'    => 'nullable|string|max:500',
        ]);

        if (!$book->isAvailable()) {
            return back()->withErrors(['book' => 'This book is no longer available.']);
        }

        $alreadyBorrowed = Transaction::where('book_id', $book->id)
            ->where('borrower_id', $request->user()->id)
            ->whereIn('status', ['borrowed', 'overdue'])
            ->exists();

        if ($alreadyBorrowed) {
            return back()->withErrors(['book' => 'You already have an active borrow for this book.']);
        }

        Transaction::create([
            'ref_nbr'              => 'CTU-' . strtoupper(Str::random(8)),
            'book_id'              => $book->id,
            'borrower_id'          => $request->user()->id,
            'quantity'             => 1,
            'date_borrowed'        => now(),
            'expected_return_date' => $request->due_date,
            'transaction_date'     => now(),
            'status'               => 'borrowed',
            'fees'                 => 0,
            'notes'                => $request->notes,
        ]);

        $book->decrement('available_copies');

        return back();
    }
}
