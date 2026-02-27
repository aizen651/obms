<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Book;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    /**
     * Display a listing of books with optional filters.
     */
    public function index(Request $request)
    {
        $query = Book::query()->with('category');

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
        }

        if ($category = $request->input('category')) {
            $query->where('category_id', $category);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $books = $query->orderBy($request->input('sort', 'title'), $request->input('direction', 'asc'))
                       ->paginate(10)
                       ->withQueryString();

        return inertia('Admin/Books', [
            'books' => $books,
            'categories' => \App\Models\Category::all(),
            'filters' => $request->only(['search', 'category', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Store a newly created book in Supabase and database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'isbn'           => 'nullable|string|max:50',
            'category_id'    => 'nullable|exists:categories,id',
            'author'         => 'required|string|max:255',
            'publisher'      => 'nullable|string|max:255',
            'published_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'edition'        => 'nullable|string|max:50',
            'language'       => 'nullable|string|max:50',
            'pages'          => 'nullable|integer|min:1',
            'description'    => 'nullable|string',
            'book_image'     => 'nullable|image|max:2048', // 2MB
            'total_copies'   => 'required|integer|min:1',
            'shelf_location' => 'nullable|string|max:50',
            'status'         => ['required', Rule::in(['available','unavailable','archived'])],
        ]);

        // Upload image to Supabase
        if ($request->hasFile('book_image')) {
    $file = $request->file('book_image');
    $filename = time() . '_' . $file->getClientOriginalName();
    $path = Storage::disk('supabase')->putFileAs('books', $file, $filename);
    $imageUrl = env('SUPABASE_URL') . '/storage/v1/object/public/books/' . $filename;
}

        // Save book to database
        $book = Book::create([
            'title'          => $validated['title'],
            'isbn'           => $validated['isbn'] ?? null,
            'category_id'    => $validated['category_id'] ?? null,
            'author'         => $validated['author'],
            'publisher'      => $validated['publisher'] ?? null,
            'published_year' => $validated['published_year'] ?? null,
            'edition'        => $validated['edition'] ?? null,
            'language'       => $validated['language'] ?? null,
            'pages'          => $validated['pages'] ?? null,
            'description'    => $validated['description'] ?? null,
            'book_image'     => $imageUrl,
            'total_copies'   => $validated['total_copies'],
            'available_copies' => $validated['total_copies'], // start with all copies available
            'shelf_location' => $validated['shelf_location'] ?? null,
            'status'         => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Book added successfully!');
    }

    /**
     * Delete a book and optionally remove the image from Supabase.
     */
    public function destroy(Book $book)
    {
        // Remove image from Supabase if exists
        if ($book->book_image) {
            $parsed = parse_url($book->book_image);
            $path = ltrim($parsed['path'], '/'); // remove leading slash
            Storage::disk('supabase')->delete($path);
        }

        $book->delete();

        return response()->json(['success' => true]);
    }
}