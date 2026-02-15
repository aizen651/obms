<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
    'total_users' => User::count(),
    'total_admins' => User::where('role', 'admin')->count(),
    'total_teachers' => User::where('role', 'teacher')->count(),
    'total_students' => User::where('role', 'student')->count(),
   // 'total_books' => Book::count(),
    //'total_borrowed' => Borrow::where('status', 'borrowed')->count(),
   // 'total_returned' => Borrow::where('status', 'returned')->count(),
    //'total_cancelled' => Borrow::where('status', 'cancelled')->count(),
    //'total_overdue' => Borrow::where('due_date', '<', now())->where('status', 'borrowed')->count(),
   // 'total_lost' => Borrow::where('status', 'lost')->count(),
    ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}