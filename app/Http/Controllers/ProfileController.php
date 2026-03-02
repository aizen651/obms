<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('User/Profile', [
            'user' => $user,
            'stats' => [
                'total_borrowed'      => $user->transactions()->count(),
                'currently_borrowing' => $user->borrowedBooks()->count(),
                'total_returned'      => $user->borrowHistory()->count(),
                'overdue'             => $user->overdueBooks()->count(),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'firstname'  => 'required|string|max:255',
            'lastname'   => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'contact'    => 'nullable|string|max:20',
            'gender'     => 'required|in:male,female,other',
            'user_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('user_image')) {
            // Delete old image
            if ($user->user_image) {
                try {
                    Storage::disk('supabase_profiles')->delete(basename($user->user_image));
                } catch (\Exception $e) {}
            }

            $file     = $request->file('user_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            Storage::disk('supabase_profiles')->putFileAs('', $file, $filename);
            $user->user_image = env('SUPABASE_URL') . '/storage/v1/object/public/profile-images/' . $filename;
        }

        $user->firstname = $request->firstname;
        $user->lastname  = $request->lastname;
        $user->email     = $request->email;
        $user->contact   = $request->contact;
        $user->gender    = $request->gender;
        $user->save();

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Password updated successfully.');
    }

    public function removeImage()
    {
        $user = Auth::user();

        if ($user->user_image) {
            try {
                Storage::disk('supabase_profiles')->delete(basename($user->user_image));
            } catch (\Exception $e) {}
            $user->user_image = null;
            $user->save();
        }

        return back()->with('success', 'Profile image removed.');
    }
}