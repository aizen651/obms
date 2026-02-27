<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                  ->orWhere('lastname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('teacher_id', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Sorting
        $sortColumn = $request->get('sort', 'firstname');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortColumn, $sortDirection);

        // Load borrowed books with book details
        $users = $query->withCount('borrowedBooks')
                       ->with(['borrowedBooks.book'])
                       ->paginate(10)
                       ->withQueryString();

        // Transform to ensure image_url is included
        $users->through(function ($user) {
            // Map borrowed books to include the image_url accessor
            $user->borrowed_books = $user->borrowedBooks->map(function($transaction) {
                return [
                    'id' => $transaction->id,
                    'date_borrowed' => $transaction->date_borrowed,
                    'expected_return_date' => $transaction->expected_return_date,
                    'date_returned' => $transaction->date_returned,
                    'status' => $transaction->status,
                    'book' => $transaction->book ? [
                        'id' => $transaction->book->id,
                        'title' => $transaction->book->title,
                        'author' => $transaction->book->author,
                        'book_image' => $transaction->book->book_image,
                        'image_url' => $transaction->book->image_url, // This is the key - add the accessor
                    ] : null,
                ];
            });
            
            // Remove the original relationship to avoid duplication
            unset($user->borrowedBooks);
            
            return $user;
        });

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'sort', 'direction'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'contact' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female,other',
            'role' => 'required|in:admin,teacher,student',
            'student_id' => 'nullable|string|unique:users,student_id',
            'teacher_id' => 'nullable|string|unique:users,teacher_id',
        ]);

        if ($request->hasFile('user_image')) {
            $validated['user_image'] = $request->file('user_image')->store('users', 'supabase');
        }

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'user_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'contact' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female,other',
            'role' => 'required|in:admin,teacher,student',
            'student_id' => 'nullable|string|unique:users,student_id,' . $user->id,
            'teacher_id' => 'nullable|string|unique:users,teacher_id,' . $user->id,
        ]);

        if ($request->hasFile('user_image')) {
            if ($user->user_image) {
                \Storage::disk('supabase')->delete($user->user_image);
            }
            $validated['user_image'] = $request->file('user_image')->store('users', 'supabase');
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully!');
    }

    public function destroy(User $user)
    {
        if ($user->user_image) {
            \Storage::disk('supabase')->delete($user->user_image);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully!');
    }
}