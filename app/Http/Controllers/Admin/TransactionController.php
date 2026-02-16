<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Transaction::query();

        // Eager load relationships
        $query->with(['book', 'borrower']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ref_nbr', 'like', "%{$search}%")
                    ->orWhereHas('book', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%");
                    })
                    ->orWhereHas('borrower', function ($q) use ($search) {
                        $q->where('firstname', 'like', "%{$search}%")
                          ->orWhere('lastname', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by is_lost
        if ($request->filled('is_lost')) {
            $query->where('is_lost', $request->is_lost == '1');
        }

        // Sorting
        $sortColumn = $request->get('sort', 'transaction_date');
        $sortDirection = $request->get('direction', 'desc');
        
        $query->orderBy($sortColumn, $sortDirection);

        // Paginate
        $transactions = $query->paginate(15)->withQueryString();

        // Append calculated fees to each transaction
        $transactions->getCollection()->transform(function ($transaction) {
            $transaction->calculated_fees = $transaction->getCurrentFee();
            return $transaction;
        });

        // Get books and users for the create modal
        $books = Book::where('status', 'available')
            ->where('available_copies', '>', 0)
            ->select('id', 'title', 'author', 'available_copies')
            ->get();
        
        $users = User::whereIn('role', ['student', 'teacher'])
            ->select('id', 'firstname', 'lastname', 'role', 'student_id', 'teacher_id')
            ->get();

        // Get late fee config for display
        $lateFeeConfig = \App\Models\Transaction\Setting::getLateFeeConfig();

        return Inertia::render('Admin/Transactions', [
            'transactions' => $transactions,
            'books' => $books,
            'users' => $users,
            'lateFeeConfig' => $lateFeeConfig,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'is_lost' => $request->is_lost,
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'book_id' => ['required', 'exists:books,id'],
            'borrower_id' => ['required', 'exists:users,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'date_borrowed' => ['required', 'date'],
            'expected_return_date' => ['required', 'date', 'after_or_equal:date_borrowed'],
            'fees' => ['nullable', 'numeric', 'min:0'],
        ]);

        // Check if book has enough copies
        $book = Book::findOrFail($validated['book_id']);
        if ($book->available_copies < $validated['quantity']) {
            return back()->withErrors([
                'quantity' => 'Not enough copies available. Only ' . $book->available_copies . ' copies available.'
            ]);
        }

        // Generate unique reference number
        $refNbr = $this->generateRefNumber();

        // Create transaction
        $transaction = Transaction::create([
            'ref_nbr' => $refNbr,
            'book_id' => $validated['book_id'],
            'borrower_id' => $validated['borrower_id'],
            'quantity' => $validated['quantity'],
            'date_borrowed' => $validated['date_borrowed'],
            'expected_return_date' => $validated['expected_return_date'],
            'fees' => $validated['fees'] ?? null, // null means auto-calculate
            'status' => 'borrowed',
            'is_lost' => false,
            'transaction_date' => now(),
        ]);

        // Update book available copies
        $book->decrement('available_copies', $validated['quantity']);

        return redirect()->route('admin.transactions.index')
            ->with('success', "Transaction created successfully! Reference: {$refNbr}")
            ->with('refNumber', $refNbr);
    }

    public function show(Transaction $transaction): Response
    {
        $transaction->load(['book', 'borrower']);
        
        // Add calculated fee
        $transaction->calculated_fees = $transaction->getCurrentFee();
        
        // Get late fee config
        $lateFeeConfig = \App\Models\Transaction\Setting::getLateFeeConfig();
        
        return Inertia::render('Admin/TransactionShow', [
            'transaction' => $transaction,
            'lateFeeConfig' => $lateFeeConfig,
        ]);
    }

    public function update(Request $request, Transaction $transaction): RedirectResponse
{
    $validated = $request->validate([
        'status' => 'required|in:borrowed,returned,overdue,canceled',
        'date_returned' => 'nullable|date',
        'date_canceled' => 'nullable|date',
        'fees' => 'nullable|numeric|min:0',
        'is_lost' => 'boolean',
    ]);

    $oldStatus = $transaction->status;

    // Update transaction - fees will be null for auto-calc, or a number for manual
    $transaction->update($validated);

    // Restore book copies if status changed to returned/canceled
    if (in_array($oldStatus, ['borrowed', 'overdue']) && in_array($validated['status'], ['returned', 'canceled'])) {
        $transaction->book->increment('available_copies', $transaction->quantity);
    }

    return back()->with('success', 'Transaction updated successfully!');
}

    public function destroy(Transaction $transaction): RedirectResponse
    {
        // If transaction is still borrowed, return the books
        if ($transaction->status === 'borrowed') {
            $transaction->book->increment('available_copies', $transaction->quantity);
        }

        $transaction->delete();

        return back()->with('success', 'Transaction deleted successfully!');
    }

    /**
     * Generate a unique reference number in format CTU-XXXXXX
     */
    private function generateRefNumber(): string
    {
        // Get the last transaction
        $lastTransaction = Transaction::orderBy('id', 'desc')->first();
        
        if ($lastTransaction && $lastTransaction->ref_nbr) {
            // Extract number from last ref_nbr (CTU-000001 -> 1)
            $lastNumber = (int) substr($lastTransaction->ref_nbr, 4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        // Format with leading zeros (CTU-000001)
        $refNbr = 'CTU-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

        // Check if ref_nbr already exists (safety check)
        while (Transaction::where('ref_nbr', $refNbr)->exists()) {
            $nextNumber++;
            $refNbr = 'CTU-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
        }

        return $refNbr;
    }
    
    public function print(Request $request): Response
{
    $query = Transaction::query();

    // Eager load relationships
    $query->with(['book', 'borrower']);

    // Date range filter
    if ($request->filled('start_date')) {
        $query->whereDate('transaction_date', '>=', $request->start_date);
    }

    if ($request->filled('end_date')) {
        $query->whereDate('transaction_date', '<=', $request->end_date);
    }

    // Status filter
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Borrower filter
    if ($request->filled('borrower_id')) {
        $query->where('borrower_id', $request->borrower_id);
    }

    // Book filter
    if ($request->filled('book_id')) {
        $query->where('book_id', $request->book_id);
    }

    // Sort by transaction date
    $query->orderBy('transaction_date', 'desc');

    // Get all transactions (no pagination for print)
    $transactions = $query->get();

    // Append calculated fees
    $transactions->transform(function ($transaction) {
        $transaction->calculated_fees = $transaction->getCurrentFee();
        return $transaction;
    });

    // Calculate summary statistics
    $summary = [
        'total' => $transactions->count(),
        'borrowed' => $transactions->where('status', 'borrowed')->count(),
        'returned' => $transactions->where('status', 'returned')->count(),
        'overdue' => $transactions->where('status', 'overdue')->count(),
        'total_fees' => $transactions->sum(function ($t) {
            return $t->calculated_fees ?? $t->fees ?? 0;
        }),
    ];

    // Get all users and books for filters
    $users = User::whereIn('role', ['student', 'teacher'])
        ->select('id', 'firstname', 'lastname')
        ->orderBy('firstname')
        ->get();

    $books = Book::select('id', 'title')
        ->orderBy('title')
        ->get();

    return Inertia::render('Admin/Transaction/PrintTransactions', [
        'transactions' => $transactions,
        'summary' => $summary,
        'users' => $users,
        'books' => $books,
        'filters' => [
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status,
            'borrower_id' => $request->borrower_id,
            'book_id' => $request->book_id,
        ],
    ]);
}
}
