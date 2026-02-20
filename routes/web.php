<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

 // Public access books
  Route::get('books', [BookController::class, 'index'])->name('books');
  Route::get('books/{book}', [BookController::class, 'show'])->name('books.show');

// Guest routes
Route::middleware('guest')->group( function () {
  // Login
  Route::get('login',  [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
  // Register
  Route::get('register',  [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);
   
});
 // Authenticated routes
Route::middleware('auth')->group(function () {
  // Dashboard
  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
  // Profile
    Route::get('/profile',          [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile',         [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password',[ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('/profile/image', [ProfileController::class, 'removeImage'])->name('profile.image.remove');
  // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
