<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Story;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Story::with('author:id,firstname,lastname')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('title', 'like', "%$s%")
                ->orWhereHas('author', fn($q) => $q->where('firstname', 'like', "%$s%")
                    ->orWhere('lastname', 'like', "%$s%")));
        }

        $stories = $query->paginate(15)->withQueryString()->through(fn($s) => [
            'id'               => $s->id,
            'title'            => $s->title,
            'slug'             => $s->slug,
            'genre'            => $s->genre,
            'cover_url'        => $s->cover_url,
            'synopsis'         => $s->synopsis,
            'status'           => $s->status,
            'views'            => $s->views,
            'read_time'        => $s->read_time,
            'created_at'       => $s->created_at->toDateString(),
            'approved_at'      => $s->approved_at?->toDateString(),
            'rejection_reason' => $s->rejection_reason,
            'author'           => $s->author ? [
                'id'   => $s->author->id,
                'name' => trim(($s->author->firstname ?? '') . ' ' . ($s->author->lastname ?? '')),
            ] : null,
        ]);

        $counts = [
            'all'      => Story::count(),
            'pending'  => Story::pending()->count(),
            'approved' => Story::approved()->count(),
            'rejected' => Story::where('status', 'rejected')->count(),
            'draft'    => Story::where('status', 'draft')->count(),
        ];

        return Inertia::render('Admin/Ebooks/Index', [
            'stories' => $stories,
            'counts'  => $counts,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Story $story)
    {
        $story->load('author:id,firstname,lastname');
        return Inertia::render('Admin/Ebooks/Review', [
            'story' => [
                'id'               => $story->id,
                'title'            => $story->title,
                'genre'            => $story->genre,
                'cover_url'        => $story->cover_url,
                'synopsis'         => $story->synopsis,
                'content'          => $story->content,
                'status'           => $story->status,
                'rejection_reason' => $story->rejection_reason,
                'views'            => $story->views,
                'read_time'        => $story->read_time,
                'created_at'       => $story->created_at->toDateString(),
                'approved_at'      => $story->approved_at?->toDateString(),
                'author'           => $story->author ? [
                    'id'   => $story->author->id,
                    'name' => trim(($story->author->firstname ?? '') . ' ' . ($story->author->lastname ?? '')),
                ] : null,
            ],
        ]);
    }

    public function approve(Story $story)
    {
        abort_if($story->status === 'approved', 422, 'Already approved.');

        $story->update([
            'status'           => 'approved',
            'rejection_reason' => null,
            'approved_at'      => now(),
        ]);

        return back()->with('success', "\"{$story->title}\" has been approved and published.");
    }

    public function reject(Request $request, Story $story)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $story->update([
            'status'           => 'rejected',
            'rejection_reason' => $request->reason,
            'approved_at'      => null,
        ]);

        return back()->with('success', "\"{$story->title}\" has been rejected.");
    }

    public function destroy(Story $story)
    {
        $story->delete();
        return back()->with('success', 'Story deleted.');
    }
}
