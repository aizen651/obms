<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query()->with('category');

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
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
            'books'      => $books,
            'categories' => Category::all(),
            'filters'    => $request->only(['search', 'category', 'status', 'sort', 'direction']),
        ]);
    }

    public function show(Book $book)
    {
        return inertia('Admin/BookShow', [
            'book' => $book->load('category'),
        ]);
    }

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
            'book_image'     => 'nullable|image|max:2048',
            'total_copies'   => 'required|integer|min:1',
            'shelf_location' => 'nullable|string|max:50',
            'status'         => ['required', Rule::in(['available', 'unavailable', 'archived'])],
        ]);

        $imageUrl = null;
        if ($request->hasFile('book_image')) {
            $file     = $request->file('book_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            Storage::disk('supabase')->putFileAs('', $file, $filename);
            $imageUrl = env('SUPABASE_URL') . '/storage/v1/object/public/books/' . $filename;
        }

        Book::create([
            'title'            => $validated['title'],
            'isbn'             => $validated['isbn'] ?? null,
            'category_id'      => $validated['category_id'] ?? null,
            'author'           => $validated['author'],
            'publisher'        => $validated['publisher'] ?? null,
            'published_year'   => $validated['published_year'] ?? null,
            'edition'          => $validated['edition'] ?? null,
            'language'         => $validated['language'] ?? null,
            'pages'            => $validated['pages'] ?? null,
            'description'      => $validated['description'] ?? null,
            'book_image'       => $imageUrl,
            'total_copies'     => $validated['total_copies'],
            'available_copies' => $validated['total_copies'],
            'shelf_location'   => $validated['shelf_location'] ?? null,
            'status'           => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Book added successfully!');
    }

    public function edit(Book $book)
    {
        return inertia('Admin/BookEdit', [
            'book'       => $book->load('category'),
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Book $book)
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
            'book_image'     => 'nullable|image|max:2048',
            'total_copies'   => 'required|integer|min:1',
            'shelf_location' => 'nullable|string|max:50',
            'status'         => ['required', Rule::in(['available', 'unavailable', 'archived'])],
        ]);

        $imageUrl = $book->book_image;
        if ($request->hasFile('book_image')) {
            // Delete old image from Supabase
            if ($book->book_image) {
                $oldFilename = basename($book->book_image);
                Storage::disk('supabase')->delete($oldFilename);
            }
            // Upload new image
            $file     = $request->file('book_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            Storage::disk('supabase')->putFileAs('', $file, $filename);
            $imageUrl = env('SUPABASE_URL') . '/storage/v1/object/public/books/' . $filename;
        }

        $book->update([
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
            'shelf_location' => $validated['shelf_location'] ?? null,
            'status'         => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Book updated successfully!');
    }

    public function destroy(Book $book)
{
    if ($book->book_image) {
        // Handle both old format "books/filename.jpg" and new full URLs
        if (str_starts_with($book->book_image, 'http')) {
            // Extract path after /public/books/
            $filename = basename($book->book_image);
        } else {
            // Old format stored as "books/filename.jpg"
            $filename = $book->book_image; // use full path as stored
        }
        
        try {
            Storage::disk('supabase')->delete($filename);
        } catch (\Exception $e) {
            // Log but don't block deletion
            \Log::warning('Could not delete image: ' . $e->getMessage());
        }
    }

    $book->delete();

    return response()->json(['success' => true]);
}
}