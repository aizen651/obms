<?php

namespace App\Providers;

use App\Models\ChatMessage;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configureDefaults();
        $this->shareChatMessages();
    }

    protected function shareChatMessages(): void
    {
        Inertia::share('chatMessages', function () {
            if (!Auth::check()) return [];

            return ChatMessage::with('user')
                ->latest()
                ->take(60)
                ->get()
                ->reverse()
                ->values()
                ->map(fn ($m) => [
                    'id'        => (string) $m->id,
                    'username'  => $m->user->name ?? $m->user->email ?? 'Anonymous',
                    'message'   => $m->message,
                    'timestamp' => $m->created_at->toISOString(),
                ]);
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
