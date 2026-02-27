<?php

namespace App\Http\Controllers;

use App\Models\MagazineIssue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MagazineController extends Controller
{
    public function index()
    {
        $issue = MagazineIssue::current();
        return Inertia::render('Magazine/Index', [
            'issue' => $issue ? $this->format($issue) : null,
        ]);
    }

    public function data()
    {
        $issue = MagazineIssue::current();
        return response()->json($issue ? $this->format($issue) : null);
    }

    public function editor()
    {
        $this->adminOnly();
        $issue = MagazineIssue::latest_or_create();
        return Inertia::render('Magazine/Editor', [
            'issue' => $this->format($issue),
        ]);
    }

    public function save(Request $request)
    {
        $this->adminOnly();
        $issue = MagazineIssue::latest_or_create();

        $data = $request->validate([
            'issue_number'    => 'nullable|string|max:10',
            'season'          => 'nullable|string|max:50',
            'hero_image'      => 'nullable|string',
            'hero_category'   => 'nullable|string|max:100',
            'hero_title'      => 'nullable|string|max:255',
            'hero_subtitle'   => 'nullable|string|max:255',
            'hero_excerpt'    => 'nullable|string|max:1000',
            'quote_text'      => 'nullable|string|max:500',
            'quote_highlight' => 'nullable|string|max:100',
            'features'        => 'nullable|array',
            'curations'       => 'nullable|array',
            'book_picks'      => 'nullable|array',
            'is_published'    => 'boolean',
        ]);

        $issue->update($data);

        return redirect()->route('admin.magazine');
    }

    public function uploadImage(Request $request)
    {
        $this->adminOnly();
        $request->validate(['image' => 'required|image|max:5120']);

        $path = $request->file('image')->store('magazine', 'supabase');

        // Return the full public URL — the model mutator will normalize it on save
        return response()->json([
            'url' => Storage::url($path),
        ]);
    }

    public function togglePublish()
    {
        $this->adminOnly();
        $issue = MagazineIssue::latest_or_create();
        $issue->update(['is_published' => !$issue->is_published]);
        return redirect()->route('admin.magazine');
    }

    private function format(MagazineIssue $i): array
    {
        // Cache-bust timestamp so browsers reload changed images
        $ts = $i->updated_at->timestamp;

        return [
            'id'              => $i->id,
            'updated_at'      => $i->updated_at->toISOString(),
            'issue_number'    => $i->issue_number,
            'season'          => $i->season,
            'is_published'    => (bool) $i->is_published,
            'hero_image'      => $i->hero_image_url ? $i->hero_image_url . '?v=' . $ts : null,
            'hero_category'   => $i->hero_category,
            'hero_title'      => $i->hero_title,
            'hero_subtitle'   => $i->hero_subtitle,
            'hero_excerpt'    => $i->hero_excerpt,
            'quote_text'      => $i->quote_text,
            'quote_highlight' => $i->quote_highlight,
            'features'        => $this->formatFeatures($i->features ?? [], $ts),
            'curations'       => $i->curations  ?? [],
            'book_picks'      => $i->book_picks ?? [],
        ];
    }

    // Add cache-busting to feature images on read (not stored in DB)
    private function formatFeatures(array $features, int $ts): array
    {
        return array_map(function ($f) use ($ts) {
            if (!empty($f['image'])) {
                // image is stored as bare path, build full URL + cache bust
                $f['image'] = Storage::url($f['image']) . '?v=' . $ts;
            }
            return $f;
        }, $features);
    }

    private function adminOnly(): void
    {
        abort_unless(Auth::user()?->role === 'admin', 403);
    }
}
