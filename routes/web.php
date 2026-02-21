<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Inertia\Inertia;

// ── Home ──────────────────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// ── Public: Books ─────────────────────────────────────────────────────────────
Route::get('books',        [BookController::class, 'index'])->name('books');
Route::get('books/{book}', [BookController::class, 'show'])->name('books.show');


// ── Guest ─────────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('login',     [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login',    [AuthenticatedSessionController::class, 'store']);
    Route::get('register',  [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);
});

// ── Authenticated Users ───────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile',           [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile',          [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('/profile/image',  [ProfileController::class, 'removeImage'])->name('profile.image.remove');

    // Transactions / Borrow
    Route::get('/transactions',        [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transaction/{book}', [TransactionController::class, 'store']);

    

    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
