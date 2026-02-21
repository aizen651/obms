<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\Transaction;
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

        $books      = $query->paginate(10)->withQueryString();
        $categories = Category::orderBy('name')->get();

        // IDs of books the current user has actively borrowed
        $borrowedBookIds = auth()->check()
            ? Transaction::where('borrower_id', auth()->id())
                ->whereIn('status', ['borrowed', 'overdue'])
                ->pluck('book_id')
                ->toArray()
            : [];

        return Inertia::render('Books', [
            'books'           => $books,
            'categories'      => $categories,
            'filters'         => $request->only(['search', 'category', 'status', 'sort', 'direction']),
            'borrowedBookIds' => $borrowedBookIds,
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
        $sortColumn = $request->get('sort', 'title');
        $direction  = in_array($request->get('direction'), ['asc', 'desc'])
            ? $request->get('direction')
            : 'asc';

        switch ($sortColumn) {
            case 'category.name':
                $query->join('categories', 'books.category_id', '=', 'categories.id')
                      ->select('books.*')
                      ->orderBy(DB::raw('LOWER(categories.name)'), $direction);
                break;
            case 'published_year':
                $query->orderBy('published_year', $direction);
                break;
            case 'available_copies':
                $query->orderBy('available_copies', $direction);
                break;
            case 'display_status':
                $query->orderByRaw("
                    CASE
                        WHEN status = 'archived' THEN 3
                        WHEN available_copies > 0 THEN 1
                        ELSE 2
                    END {$direction}
                ");
                break;
            case 'title':
            case 'author':
                $query->orderBy(DB::raw("LOWER({$sortColumn})"), $direction);
                break;
            default:
                $query->orderBy(DB::raw('LOWER(title)'), 'asc');
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