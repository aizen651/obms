<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\JournalController;
use Inertia\Inertia;

// ── Home ──────────────────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// ── Public: Books ─────────────────────────────────────────────────────────────
Route::get('books',        [BookController::class, 'index'])->name('books');
Route::get('books/{book}', [BookController::class, 'show'])->name('books.show');

// Journal
Route::get('/journal', [JournalController::class, 'index'])->name('journals.index');



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
    
    // Chats
    Route::post('/chat/messages',             [ChatController::class, 'store'])->name('chat.store');
    Route::delete('/chat/messages/{message}', [ChatController::class, 'deleteMessage'])->name('chat.delete');
    Route::post('/chat/status',               [ChatController::class, 'updateStatus'])->name('chat.status');



    // Transactions / Borrow
    Route::get('/transactions',        [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transaction/{book}', [TransactionController::class, 'store']);

    // Journal
    Route::post('/journal',           [JournalController::class, 'store'])->name('journals.store');
    Route::put('/journal/{journal}',  [JournalController::class, 'update'])->name('journals.update');
    Route::delete('/journal/{journal}', [JournalController::class, 'destroy'])->name('journals.destroy');
    // E-books
    Route::get('/ebooks',              [StoryController::class, 'index'])->name('ebooks.index');
    Route::get('/ebooks/create',       [StoryController::class, 'create'])->name('ebooks.create');
    Route::post('/ebooks',             [StoryController::class, 'store'])->name('ebooks.store');
    Route::get('/ebooks/my-stories',   [StoryController::class, 'myStories'])->name('ebooks.my-stories');
    Route::get('/ebooks/{story:slug}', [StoryController::class, 'show'])->name('ebooks.show');
    Route::get('/ebooks/{story}/edit', [StoryController::class, 'edit'])->name('ebooks.edit');
    Route::put('/ebooks/{story}',      [StoryController::class, 'update'])->name('ebooks.update');
    Route::delete('/ebooks/{story}',   [StoryController::class, 'destroy'])->name('ebooks.destroy');

    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
