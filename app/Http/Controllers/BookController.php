<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%")
                  ->orWhere('publisher', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('status')) {
    $query->status($request->status);
      }

        $sortColumn = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortColumn, $sortDirection);

        $books = $query->paginate(10)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Books', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status', 'sort', 'direction'])
        ]);
    }
    
    public function show(Book $book)
    {
        $book->load([
            'category',
            'transactions' => function($query) {
                $query->with('borrower')
                      ->orderBy('created_at', 'desc');
            }
        ]);

        return Inertia::render('BookShow', [
            'book' => $book
        ]);
    }
}
