<?php

namespace App\Http\Controllers;

use App\Events\GlobalMessageDeleted;
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
            userId:    $user->id,
            username:  $user->full_name,
            avatar:    $user->avatar_url,
            message:   $chat->message,
            timestamp: $chat->created_at->toISOString(),
        ));

        return back();
    }

    public function deleteMessage(Request $request, ChatMessage $message)
    {
        if ($message->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->delete();
        broadcast(new GlobalMessageDeleted(id: (string) $message->id));

        return response()->json(['ok' => true]);
    }

    public function updateStatus(Request $request)
    {
        $request->validate(['status' => ['required', 'in:online,offline']]);

        $user = $request->user();
        $user->update([
            'is_online'    => $request->status === 'online',
            'last_seen_at' => $request->status === 'offline' ? now() : $user->last_seen_at,
        ]);

        return response()->json(['ok' => true]);
    }
}
