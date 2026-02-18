<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/table', function () {
    return Inertia::render('Table');
})->name('table');

// Guest routes
Route::middleware('guest')->group( function () {
  Route::get('books', [BookController::class, 'index'])->name('books');
  Route::get('books/{book}', [BookController::class, 'show'])->name('book.show');
});
