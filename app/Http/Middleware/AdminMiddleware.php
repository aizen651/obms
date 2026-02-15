<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is not authenticated
        if (!auth()->check()) {
            return redirect()->route('admin.login');
        }
        
        // Check if authenticated user is not an admin
        if (!auth()->user()->isAdmin()) {
            auth()->logout();
            return redirect()->route('admin.login')
                ->withErrors(['error' => 'You do not have admin access.']);
        }

        return $next($request);
    }
}