<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%")
                  ->orWhere('publisher', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortColumn = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortColumn, $sortDirection);

        $books = $query->paginate(10)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Books', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status', 'sort', 'direction'])
        ]);
    }

    public function show(Book $book)
    {
        // Load the book with its relationships
        $book->load([
            'category',
            'transactions' => function($query) {
                $query->with('borrower')
                      ->orderBy('created_at', 'desc');
            }
        ]);

        return Inertia::render('Admin/BookShow', [
            'book' => $book
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/BookCreate', [
            'categories' => $categories
        ]);
    }

    public function edit(Book $book)
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/BookEdit', [
            'book' => $book,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books,isbn',
            'category_id' => 'required|exists:categories,id',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'edition' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:255',
            'pages' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'total_copies' => 'required|integer|min:1',
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:available,unavailable,archived',
        ]);

        // Handle image upload
        if ($request->hasFile('book_image')) {
            $validated['book_image'] = $request->file('book_image')->store('books', 'public');
        }

        // Set available copies to total copies for new books
        $validated['available_copies'] = $validated['total_copies'];

        Book::create($validated);

        return redirect()->route('admin.books.index')->with('success', 'Book added successfully!');
    }

    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'book_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books,isbn,' . $book->id,
            'category_id' => 'required|exists:categories,id',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'edition' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:255',
            'pages' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'total_copies' => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0',
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:available,unavailable,archived',
        ]);

        // Handle image upload
        if ($request->hasFile('book_image')) {
            // Delete old image if exists
            if ($book->book_image) {
                Storage::disk('public')->delete($book->book_image);
            }
            $validated['book_image'] = $request->file('book_image')->store('books', 'public');
        }

        $book->update($validated);

        return redirect()->route('admin.books.show', $book)->with('success', 'Book updated successfully!');
    }

    public function destroy(Book $book)
    {
        // Check if book has active borrows
        if ($book->transactions()->whereIn('status', ['borrowed', 'overdue'])->exists()) {
            return back()->withErrors(['error' => 'Cannot delete book with active borrows.']);
        }

        // Delete image if exists
        if ($book->book_image) {
            Storage::disk('public')->delete($book->book_image);
        }

        $book->delete();

        return redirect()->route('admin.books.index')->with('success', 'Book deleted successfully!');
    }
}