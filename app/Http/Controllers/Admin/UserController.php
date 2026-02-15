<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query();

        // Add borrowed books count (when you create the Borrow model later)
        // For now, we'll add a placeholder
        $query->withCount(['borrows as borrowed_books_count' => function ($q) {
            $q->where('status', 'borrowed'); // Only count currently borrowed books
        }]);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                    ->orWhere('lastname', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('contact', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%")
                    ->orWhere('teacher_id', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Sorting
        $sortColumn = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $query->orderBy($sortColumn, $sortDirection);

        // Paginate
        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/UserCreate');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_image' => ['nullable', 'image', 'max:2048'],
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'contact' => ['nullable', 'string', 'max:20'],
            'gender' => ['nullable', 'in:male,female,other'],
            'role' => ['required', 'in:admin,teacher,student'],
        ]);

        // Handle image upload
        if ($request->hasFile('user_image')) {
            $validated['user_image'] = $request->file('user_image')->store('profile-images', 'public');
        }

        // Hash password
        $validated['password'] = bcrypt($validated['password']);

        // Create user (ID auto-generates via model)
        $user = User::create($validated);

        // Get the generated ID for the success message
        $memberId = '';
        if ($user->role === 'student') {
            $memberId = $user->student_id;
        } elseif ($user->role === 'teacher') {
            $memberId = $user->teacher_id;
        }

        $message = $memberId 
            ? "User created successfully! Member ID: {$memberId}"
            : "User created successfully!";

        return redirect()->route('admin.users.index')->with('success', $message);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/UserEdit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'user_image' => ['nullable', 'image', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $user->id],
            'contact' => ['nullable', 'string', 'max:20'],
            'gender' => ['nullable', 'in:male,female,other'],
            'role' => ['required', 'in:admin,teacher,student'],
        ]);

        // Handle image removal
        if ($request->boolean('remove_image')) {
            if ($user->user_image) {
                Storage::disk('public')->delete($user->user_image);
            }
            $validated['user_image'] = null;
        }
        // Handle image upload
        elseif ($request->hasFile('user_image')) {
            if ($user->user_image) {
                Storage::disk('public')->delete($user->user_image);
            }
            $validated['user_image'] = $request->file('user_image')->store('profile-images', 'public');
        }

        $user->update($validated);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully!');
    }

    public function destroy(User $user): RedirectResponse
    {
        // Don't allow deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Delete user image if exists
        if ($user->user_image) {
            Storage::disk('public')->delete($user->user_image);
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully!');
    }
}
