<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoryController extends Controller
{
    // ── Public index — approved stories ──────────────────────────────────────
    public function index(Request $request)
    {
        $query = Story::with('author:id,firstname,lastname')
            ->approved()
            ->latest('approved_at');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('title', 'like', "%$s%")
                ->orWhere('synopsis', 'like', "%$s%")
                ->orWhereHas('author', fn($q) => $q->where('firstname', 'like', "%$s%")
                    ->orWhere('lastname', 'like', "%$s%")));
        }

        if ($request->filled('genre')) {
            $query->where('genre', $request->genre);
        }

        $stories = $query->paginate(12)->withQueryString()->through(fn($s) => $this->formatStory($s));

        $genres = Story::approved()->distinct()->pluck('genre')->filter()->values();

        return Inertia::render('Ebooks/Index', [
            'stories' => $stories,
            'genres'  => $genres,
            'filters' => $request->only(['search', 'genre']),
        ]);
    }

    // ── Read a single story ───────────────────────────────────────────────────
    public function show(Story $story)
    {
        abort_if($story->status !== 'approved', 403);
        $story->increment('views');
        $story->load('author:id,firstname,lastname');

        return Inertia::render('Ebooks/Read', [
            'story' => $this->formatStory($story, true),
        ]);
    }

    // ── My Stories ────────────────────────────────────────────────────────────
    public function myStories(Request $request)
    {
        $stories = Story::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn($s) => $this->formatStory($s));

        return Inertia::render('Ebooks/MyStories', [
            'stories' => $stories,
        ]);
    }

    // ── Create form ───────────────────────────────────────────────────────────
    public function create()
    {
        return Inertia::render('Ebooks/Write');
    }

    // ── Store ────────────────────────────────────────────────────────────────
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:200',
            'genre'       => 'nullable|string|max:60',
            'synopsis'    => 'nullable|string|max:500',
            'content'     => 'required|string|min:100',
            'cover_image' => 'nullable|image|max:2048',
            'submit'      => 'nullable|boolean',
        ]);

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('story-covers', 'supabase');
        }

        $story = Story::create([
            'user_id'   => $request->user()->id,
            'title'     => $validated['title'],
            'slug'      => Story::generateSlug($validated['title']),
            'genre'     => $validated['genre'] ?? null,
            'synopsis'  => $validated['synopsis'] ?? null,
            'content'   => $validated['content'],
            'cover_image' => $coverPath,
            'status'    => $request->boolean('submit') ? 'pending' : 'draft',
            'read_time' => Story::estimateReadTime($validated['content']),
        ]);

        $msg = $request->boolean('submit')
            ? 'Story submitted for review!'
            : 'Story saved as draft.';

        return redirect()->route('ebooks.my-stories')->with('success', $msg);
    }

    // ── Edit form ─────────────────────────────────────────────────────────────
    public function edit(Story $story)
    {
        abort_if($story->user_id !== auth()->id(), 403);
        abort_if(in_array($story->status, ['approved']), 403, 'Approved stories cannot be edited.');

        return Inertia::render('Ebooks/Write', [
            'story' => $this->formatStory($story, true),
        ]);
    }

    // ── Update ────────────────────────────────────────────────────────────────
    public function update(Request $request, Story $story)
    {
        abort_if($story->user_id !== auth()->id(), 403);
        abort_if($story->status === 'approved', 403);

        $validated = $request->validate([
            'title'       => 'required|string|max:200',
            'genre'       => 'nullable|string|max:60',
            'synopsis'    => 'nullable|string|max:500',
            'content'     => 'required|string|min:100',
            'cover_image' => 'nullable|image|max:2048',
            'submit'      => 'nullable|boolean',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($story->cover_image) Storage::disk('supabase')->delete($story->cover_image);
            $story->cover_image = $request->file('cover_image')->store('story-covers', 'supabase');
        }

        $story->title     = $validated['title'];
        $story->slug      = Story::generateSlug($validated['title']);
        $story->genre     = $validated['genre'] ?? null;
        $story->synopsis  = $validated['synopsis'] ?? null;
        $story->content   = $validated['content'];
        $story->read_time = Story::estimateReadTime($validated['content']);

        if ($request->boolean('submit')) {
            $story->status           = 'pending';
            $story->rejection_reason = null;
        }

        $story->save();

        return redirect()->route('ebooks.my-stories')->with('success', 'Story updated!');
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    public function destroy(Story $story)
    {
        abort_if($story->user_id !== auth()->id(), 403);
        if ($story->cover_image) Storage::disk('supabase')->delete($story->cover_image);
        $story->delete();
        return back()->with('success', 'Story deleted.');
    }

    // ── Format helper ─────────────────────────────────────────────────────────
    private function formatStory(Story $s, bool $withContent = false): array
    {
        $data = [
            'id'               => $s->id,
            'title'            => $s->title,
            'slug'             => $s->slug,
            'genre'            => $s->genre,
            'synopsis'         => $s->synopsis,
            'cover_url'        => $s->cover_url,
            'status'           => $s->status,
            'rejection_reason' => $s->rejection_reason,
            'views'            => $s->views,
            'read_time'        => $s->read_time,
            'approved_at'      => $s->approved_at?->toDateString(),
            'created_at'       => $s->created_at->toDateString(),
            'author'           => $s->author ? [
                'id'   => $s->author->id,
                'name' => trim(($s->author->firstname ?? '') . ' ' . ($s->author->lastname ?? '')),
            ] : null,
        ];

        if ($withContent) $data['content'] = $s->content;

        return $data;
    }
}
