<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $stats = [
            'currently_borrowing' => $user->transactions()
                ->whereIn('status', ['borrowed', 'overdue'])
                ->count(),

            'overdue' => $user->transactions()
                ->where('status', 'overdue')
                ->count(),

            'total_returned' => $user->transactions()
                ->where('status', 'returned')
                ->count(),

            'total_borrowed' => $user->transactions()
                ->count(),
        ];

        $currentBorrows = $user->transactions()
            ->with('book:id,title,author,book_image')
            ->whereIn('status', ['borrowed', 'overdue'])
            ->latest()
            ->take(5)
            ->get();

        $recentHistory = $user->transactions()
            ->with('book:id,title,author,book_image')
            ->where('status', 'returned')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('User/Dashboard', [
            'stats'         => $stats,
            'currentBorrows'=> $currentBorrows,
            'recentHistory' => $recentHistory,
        ]);
    }
}