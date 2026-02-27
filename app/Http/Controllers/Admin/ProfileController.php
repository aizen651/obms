<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Admin/Profile');
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'user_image' => ['nullable', 'image', 'max:2048'],
            'firstname'  => ['required', 'string', 'max:255'],
            'lastname'   => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'unique:users,email,' . $user->id],
            'contact'    => ['nullable', 'string', 'max:20'],
            'gender'     => ['nullable', 'in:male,female,other,prefer_not_to_say'],
        ]);

        // Handle image upload to Supabase
        if ($request->hasFile('user_image')) {
            // Delete old image from Supabase
            if ($user->user_image) {
                try {
                    $oldFilename = basename($user->user_image);
                    Storage::disk('supabase_profiles')->delete($oldFilename);
                } catch (\Exception $e) {
                    // ignore
                }
            }

            $file = $request->file('user_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            Storage::disk('supabase_profiles')->putFileAs('', $file, $filename);
            $validated['user_image'] = env('SUPABASE_URL') . '/storage/v1/object/public/profiles/' . $filename;
        } else {
            unset($validated['user_image']);
        }

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully!');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Password::defaults()],
        ]);

        Auth::user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password changed successfully!');
    }
}