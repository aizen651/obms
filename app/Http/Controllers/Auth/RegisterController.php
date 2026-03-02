<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'firstname'  => 'required|string|max:255',
            'lastname'   => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'contact'    => 'nullable|string|max:20',
            'gender'     => 'required|in:male,female,other',
            'role'       => 'required|in:student,teacher',
            'password'   => 'required|string|min:8|confirmed',
            'user_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Use same disk + same URL format as ProfileController
        $imagePath = null;
        if ($request->hasFile('user_image')) {
            $file      = $request->file('user_image');
            $filename  = time() . '_' . $file->getClientOriginalName();
            Storage::disk('supabase_profiles')->putFileAs('', $file, $filename);
            $imagePath = env('SUPABASE_URL') . '/storage/v1/object/public/profile-images/' . $filename;
        }

        $user = User::create([
            'firstname'  => $request->firstname,
            'lastname'   => $request->lastname,
            'email'      => $request->email,
            'contact'    => $request->contact,
            'gender'     => $request->gender,
            'role'       => $request->role,
            'password'   => Hash::make($request->password),
            'user_image' => $imagePath,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return match($user->role) {
            'student', 'teacher' => redirect()->route('books'),
            default              => redirect()->route('home'),
        };
    }
}
