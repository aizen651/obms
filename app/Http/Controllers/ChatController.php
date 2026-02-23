<?php

namespace App\Http\Controllers;

use App\Events\GlobalMessageSent;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        return Inertia::render('Chat/Index');
    }

    public function store(Request $request)
    {
        $request->validate(['message' => ['required', 'string', 'min:1', 'max:500']]);

        $user = $request->user();
        $chat = ChatMessage::create([
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        broadcast(new GlobalMessageSent(
            id:        (string) $chat->id,
            username:  $user->name ?? $user->email ?? 'Anonymous',
            message:   $chat->message,
            timestamp: $chat->created_at->toISOString(),
        ));

        return back();
    }
}
