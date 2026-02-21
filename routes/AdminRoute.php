<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\Transaction\SettingController;
use App\Http\Controllers\MagazineController;
use Illuminate\Support\Facades\Route;

Route::get('/magazine', [MagazineController::class, 'index'])->name('magazine');
Route::get('/magazine/data', [MagazineController::class, 'data'])->name('magazine.data');


Route::prefix('admin')->name('admin.')->group(function () {

    // ── Guest ─────────────────────────────────────────────────────────────────
    Route::middleware('guest')->group(function () {
        Route::get('/login',  [AuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AuthController::class, 'login']);
    });

    // ── Authenticated Admin ───────────────────────────────────────────────────
    Route::middleware('admin')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Profile
        Route::get('/profile',             [ProfileController::class, 'show'])->name('profile');
        Route::post('/profile/update',     [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password',    [ProfileController::class, 'updatePassword'])->name('profile.password');

        // Users
        Route::get('/users',               [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create',        [UserController::class, 'create'])->name('users.create');
        Route::post('/users',              [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit',   [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}',        [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}',     [UserController::class, 'destroy'])->name('users.destroy');

        // Categories
        Route::resource('categories', CategoryController::class)->only(['index','store','update','destroy']);

        // Books
        Route::resource('books', BookController::class);

        // Transactions
        Route::resource('transactions', TransactionController::class);
        Route::get('/transactions/print/report', [TransactionController::class, 'print'])->name('transactions.print');

        // Settings
        Route::get('/settings',            [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings/late-fees', [SettingController::class, 'updateLateFees'])->name('settings.late-fees');

        // Export
        Route::get('/export',              [ExportController::class, 'index'])->name('export');
        Route::get('/export/users',        [ExportController::class, 'exportUsers'])->name('export.users');
        Route::get('/export/books',        [ExportController::class, 'exportBooks'])->name('export.books');
        Route::get('/export/transactions', [ExportController::class, 'exportTransactions'])->name('export.transactions');
        Route::get('/export/all',          [ExportController::class, 'exportAll'])->name('export.all');

        // ── Magazine Admin ────────────────────────────────────────────────────
        Route::get('/magazine',              [MagazineController::class, 'editor'])->name('magazine');
Route::get('/magazine/save',         fn() => redirect()->route('admin.magazine'))->name('magazine.save.get'); // mobile browser fallback
Route::post('/magazine/save',        [MagazineController::class, 'save'])->name('magazine.save');
Route::post('/magazine/image',       [MagazineController::class, 'uploadImage'])->name('magazine.image');
Route::post('/magazine/publish',     [MagazineController::class, 'togglePublish'])->name('magazine.publish');

        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    });
});
