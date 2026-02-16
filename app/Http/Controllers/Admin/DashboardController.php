<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Book;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // User Statistics
        $totalUsers = User::count();
        $totalStudents = User::where('role', 'student')->count();
        $totalTeachers = User::where('role', 'teacher')->count();
        $totalAdmins = User::where('role', 'admin')->count();

        // Book Statistics
        $totalBooks = Book::sum('copies');
        $totalBorrowed = Transaction::where('status', 'borrowed')->count();
        $totalReturned = Transaction::where('status', 'returned')->count();
        $totalCancelled = Transaction::where('status', 'canceled')->count();
        $totalOverdue = Transaction::where('status', 'overdue')
            ->orWhere(function($q) {
                $q->where('status', 'borrowed')
                  ->where('expected_return_date', '<', now());
            })->count();
        $totalLost = Transaction::where('is_lost', true)->count();

        // Borrowing Trend - Last 6 Months
        $currentMonth = Carbon::now();
        $monthsToShow = 6;
        
        $borrowingTrend = collect();
        for ($i = $monthsToShow - 1; $i >= 0; $i--) {
            $month = $currentMonth->copy()->subMonths($i);
            $monthName = $month->format('M');
            $year = $month->format('Y');
            
            $borrowed = Transaction::whereMonth('date_borrowed', $month->month)
                ->whereYear('date_borrowed', $month->year)
                ->count();
            
            $returned = Transaction::whereMonth('date_returned', $month->month)
                ->whereYear('date_returned', $month->year)
                ->where('status', 'returned')
                ->count();
            
            $borrowingTrend->push([
                'month' => $monthName . ' ' . $year,
                'borrowed' => $borrowed,
                'returned' => $returned
            ]);
        }

        // Category Distribution - Fixed for SQLite
        $categoryDistribution = Category::select('categories.*')
            ->selectRaw('(SELECT COUNT(*) FROM books WHERE categories.id = books.category_id) as books_count')
            ->get()
            ->filter(function($category) {
                return $category->books_count > 0;
            })
            ->sortByDesc('books_count')
            ->values()
            ->map(function($category) {
                return [
                    'category' => $category->name,
                    'count' => $category->books_count,
                ];
            });

        // If no categories exist
        if ($categoryDistribution->isEmpty()) {
            $categoryDistribution = collect([
                ['category' => 'No Categories', 'count' => 0]
            ]);
        }

        // Recent Transactions
        $recentTransactions = Transaction::with(['book', 'borrower'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_admins' => $totalAdmins,
                'total_books' => $totalBooks,
                'total_borrowed' => $totalBorrowed,
                'total_returned' => $totalReturned,
                'total_cancelled' => $totalCancelled,
                'total_overdue' => $totalOverdue,
                'total_lost' => $totalLost,
            ],
            'borrowingTrend' => $borrowingTrend,
            'categoryDistribution' => $categoryDistribution,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}