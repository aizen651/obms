<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GlobalMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $id,
        public readonly string $username,
        public readonly string $message,
        public readonly string $timestamp,
    ) {}

    public function broadcastOn(): array
    {
        return [new Channel('global-chat')];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
