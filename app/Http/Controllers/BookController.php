<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category');

        $this->applyFilters($query, $request);
        $this->applySorting($query, $request);

        $books = $query->paginate(10)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Books', [
            'books'      => $books,
            'categories' => $categories,
            'filters'    => $request->only(['search', 'category', 'status', 'sort', 'direction']),
        ]);
    }

    private function applyFilters($query, Request $request)
    {
        $query->when($request->filled('search'), function ($q) use ($request) {
            $search = $request->search;
            $q->where(function ($q) use ($search) {
                $q->where('title',     'like', "%{$search}%")
                  ->orWhere('author',    'like', "%{$search}%")
                  ->orWhere('isbn',      'like', "%{$search}%")
                  ->orWhere('publisher', 'like', "%{$search}%");
            });
        });

        $query->when($request->filled('category'), function ($q) use ($request) {
            $q->whereHas('category', function ($q) use ($request) {
                $q->where('id', $request->category);
            });
        });

        $query->when($request->filled('status'), function ($q) use ($request) {
            $q->status($request->status);
        });
    }

    private function applySorting($query, Request $request)
    {
        $allowedColumns = [
            'title', 'author', 'category.name',
            'published_year', 'available_copies', 'display_status',
        ];

        $sortColumn = $request->get('sort', 'title');
        $sortDirection = in_array(strtolower($request->get('direction', 'asc')), ['asc', 'desc'])
            ? strtolower($request->get('direction', 'asc'))
            : 'asc';

        if (!in_array($sortColumn, $allowedColumns)) {
            $sortColumn = 'title';
        }

        $dir = strtoupper($sortDirection); // ASC or DESC — safe for raw use

        // Detect the database driver to use the correct case-sensitive collation
        $driver = DB::getDriverName(); // 'sqlite' or 'mysql'

        if ($sortColumn === 'category.name') {
            $query->join('categories', 'books.category_id', '=', 'categories.id')
                  ->select('books.*');

            if ($driver === 'sqlite') {
                // SQLite: COLLATE BINARY for case-sensitive sort (A-Z before a-z)
                $query->orderByRaw("categories.name COLLATE BINARY $dir");
            } else {
                // MySQL: use BINARY keyword
                $query->orderByRaw("BINARY categories.name $dir");
            }

        } elseif ($sortColumn === 'published_year') {
            // Numeric sort — lowest to highest on first click (asc)
            if ($driver === 'sqlite') {
                $query->orderByRaw("CAST(published_year AS INTEGER) $dir");
            } else {
                $query->orderByRaw("CAST(published_year AS UNSIGNED) $dir");
            }

        } elseif ($sortColumn === 'available_copies') {
            $query->orderBy('available_copies', $sortDirection);

        } elseif ($sortColumn === 'display_status') {
            // Sort by computed display status: available → unavailable → archived
            $query->orderByRaw("
                CASE
                    WHEN status = 'archived'   THEN 3
                    WHEN available_copies > 0  THEN 1
                    ELSE                            2
                END $dir
            ");

        } else {
            // title, author — case-sensitive sort
            if ($driver === 'sqlite') {
                $query->orderByRaw("{$sortColumn} COLLATE BINARY $dir");
            } else {
                $query->orderByRaw("BINARY `{$sortColumn}` $dir");
            }
        }
    }

    public function show(Book $book)
    {
        $book->load([
            'category',
            'transactions' => function ($query) {
                $query->with('borrower')
                      ->orderBy('created_at', 'desc');
            },
        ]);

        return Inertia::render('BookShow', [
            'book' => $book,
        ]);
    }
}