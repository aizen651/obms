<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index(Request $request)
{
    $user = Auth::user();
    $filter = $request->get('filter', 'all');

    $journals = Journal::with(['user', 'book:id,title'])
        ->where(function ($q) use ($user, $filter) {
            if ($filter === 'public') {
                $q->where('is_public', true);
            } elseif ($filter === 'mine' && $user) {
                $q->where('user_id', $user->id);
            } else {
                // 'all' — public + own private
                $q->where('is_public', true);
                if ($user) $q->orWhere('user_id', $user->id);
            }
        })
        ->latest()
        ->paginate(6)
        ->withQueryString(); // ← keeps ?filter= in pagination links

    return Inertia::render('Journal', [
        'journals' => $journals,
        'books'    => Book::select('id', 'title')->where('status', '!=', 'archived')->orderBy('title')->get(),
        'filter'   => $filter,
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'title'     => 'nullable|string|max:255',
            'content'   => 'required|string|max:5000',
            'is_public' => 'boolean',
            'book_id'   => 'nullable|exists:books,id',
        ]);

        Auth::user()->journals()->create([
            'title'     => $request->title,
            'content'   => $request->content,
            'is_public' => $request->boolean('is_public'),
            'book_id'   => $request->book_id ?: null,
        ]);

        return back()->with('success', 'Journal entry created.');
    }

    public function update(Request $request, Journal $journal)
    {
        // Only the owner can update — abort with 403 if not
        abort_if($journal->user_id !== Auth::id(), 403, 'Unauthorized.');

        $request->validate([
            'title'     => 'nullable|string|max:255',
            'content'   => 'required|string|max:5000',
            'is_public' => 'boolean',
            'book_id'   => 'nullable|exists:books,id',
        ]);

        $journal->update([
            'title'     => $request->title,
            'content'   => $request->content,
            'is_public' => $request->boolean('is_public'),
            'book_id'   => $request->book_id ?: null,
        ]);

        return back()->with('success', 'Journal entry updated.');
    }

    public function destroy(Journal $journal)
    {
        // Only the owner can delete — abort with 403 if not
        abort_if($journal->user_id !== Auth::id(), 403, 'Unauthorized.');

        $journal->delete();

        return back()->with('success', 'Journal entry deleted.');
    }
}
