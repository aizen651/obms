<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Book::with('category');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortColumn = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $query->orderBy($sortColumn, $sortDirection);

        // Paginate
        $books = $query->paginate(15)->withQueryString();

        // Get all categories for filter dropdown
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Books', [
            'books' => $books,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'status' => $request->status,
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
        ]);
    }

    public function show(Book $book): Response
    {
        $book->load('category', 'borrows.user');
        
        return Inertia::render('Admin/BookShow', [
            'book' => $book,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'isbn' => ['required', 'string', 'max:50', 'unique:books,isbn'],
            'category_id' => ['required', 'exists:categories,id'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['required', 'string', 'max:255'],
            'published_year' => ['nullable', 'integer', 'min:1000', 'max:' . date('Y')],
            'edition' => ['nullable', 'string', 'max:100'],
            'language' => ['nullable', 'string', 'max:50'],
            'pages' => ['nullable', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
            'book_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'total_copies' => ['required', 'integer', 'min:1'],
            'shelf_location' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:available,unavailable,archived'],
        ]);

        // Handle image upload
        if ($request->hasFile('book_image')) {
            $validated['book_image'] = $request->file('book_image')->store('books', 'public');
        }

        // Set available_copies to total_copies initially
        $validated['available_copies'] = $validated['total_copies'];

        Book::create($validated);

        return redirect()->route('admin.books.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Book added successfully!'
            ]);
    }

    public function edit(Book $book): Response
    {
        $book->load('category');
        
        // Get all categories for dropdown
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/BookEdit', [
            'book' => $book,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'isbn' => ['required', 'string', 'max:50', 'unique:books,isbn,' . $book->id],
            'category_id' => ['required', 'exists:categories,id'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['required', 'string', 'max:255'],
            'published_year' => ['nullable', 'integer', 'min:1000', 'max:' . date('Y')],
            'edition' => ['nullable', 'string', 'max:100'],
            'language' => ['nullable', 'string', 'max:50'],
            'pages' => ['nullable', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
            'book_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'total_copies' => ['required', 'integer', 'min:1'],
            'shelf_location' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:available,unavailable,archived'],
        ]);

        // Handle image upload
        if ($request->hasFile('book_image')) {
            // Delete old image if exists
            if ($book->book_image) {
                Storage::disk('public')->delete($book->book_image);
            }
            $validated['book_image'] = $request->file('book_image')->store('books', 'public');
        }

        // Update available_copies if total_copies changed
        $borrowed = $book->total_copies - $book->available_copies;
        if ($validated['total_copies'] != $book->total_copies) {
            $validated['available_copies'] = max(0, $validated['total_copies'] - $borrowed);
        }

        $book->update($validated);

        return redirect()->route('admin.books.show', $book->id)
            ->with('toast', [
                'type' => 'success',
                'message' => 'Book updated successfully!'
            ]);
    }

    public function destroy(Book $book): RedirectResponse
    {
        // Check if book has active borrows
        if ($book->borrows()->whereIn('status', ['borrowed', 'overdue'])->count() > 0) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Cannot delete book with active borrows.'
            ]);
        }

        // Delete image if exists
        if ($book->book_image) {
            Storage::disk('public')->delete($book->book_image);
        }

        $bookTitle = $book->title;
        $book->delete();

        return redirect()->route('admin.books.index')
            ->with('toast', [
                'type' => 'success',
                'message' => "Book '{$bookTitle}' deleted successfully!"
            ]);
    }
}
