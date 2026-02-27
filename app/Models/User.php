<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_image',
        'firstname',
        'lastname',
        'email',
        'password',
        'contact',
        'gender',
        'role',
        'student_id',
        'teacher_id',
        'is_online',
        'last_seen_at',
    ];

    protected $appends = ['member_id', 'full_name', 'avatar_url'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_seen_at'      => 'datetime',
            'password'          => 'hashed',
            'is_online'         => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if ($user->role === 'student' && !$user->student_id) {
                $user->student_id = self::generateStudentId();
            } elseif ($user->role === 'teacher' && !$user->teacher_id) {
                $user->teacher_id = self::generateTeacherId();
            }
        });

        static::updating(function ($user) {
            if ($user->isDirty('role')) {
                $newRole = $user->role;
                $oldRole = $user->getOriginal('role');

                if ($newRole === 'student' && !$user->student_id) {
                    $user->student_id = self::generateStudentId();
                }
                if ($newRole === 'teacher' && !$user->teacher_id) {
                    $user->teacher_id = self::generateTeacherId();
                }
                if ($oldRole === 'student' && $newRole !== 'student') {
                    $user->student_id = null;
                }
                if ($oldRole === 'teacher' && $newRole !== 'teacher') {
                    $user->teacher_id = null;
                }
            }
        });
    }

    private static function generateStudentId(): string
    {
        do {
            $id = 'STD-' . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('student_id', $id)->exists());
        return $id;
    }

    private static function generateTeacherId(): string
    {
        do {
            $id = 'INST-' . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('teacher_id', $id)->exists());
        return $id;
    }

    // ── Relationships ─────────────────────────────────────────────────────────
    public function transactions()      { return $this->hasMany(Transaction::class, 'borrower_id'); }
    public function borrowedBooks()     { return $this->hasMany(Transaction::class, 'borrower_id')->where('status', 'borrowed')->with('book'); }
    public function overdueBooks()      { return $this->hasMany(Transaction::class, 'borrower_id')->where('status', 'overdue')->with('book'); }
    public function borrowHistory()     { return $this->hasMany(Transaction::class, 'borrower_id')->where('status', 'returned')->with('book'); }
    public function borrows()           { return $this->transactions(); }
    public function currentlyBorrowedBooks() { return $this->borrowedBooks(); }
    public function journals()          { return $this->hasMany(Journal::class); }
    public function chatMessages()      { return $this->hasMany(ChatMessage::class); }

    // ── Helpers ───────────────────────────────────────────────────────────────
    public function isAdmin(): bool    { return $this->role === 'admin'; }
    public function isTeacher(): bool  { return $this->role === 'teacher'; }
    public function isStudent(): bool  { return $this->role === 'student'; }

    // ── Accessors ─────────────────────────────────────────────────────────────
    public function getFullNameAttribute(): string
    {
        return trim("{$this->firstname} {$this->lastname}");
    }

    public function getMemberIdAttribute(): ?string
    {
        return match ($this->role) {
            'student' => $this->student_id,
            'teacher' => $this->teacher_id,
            default   => null,
        };
    }

    public function getAvatarUrlAttribute(): ?string
{
    if (!$this->user_image) return null;
    
    // If already a full URL
    if (str_starts_with($this->user_image, 'http')) {
        return $this->user_image;
    }
    
    // Build Supabase URL
    return env('SUPABASE_URL') . '/storage/v1/object/public/profiles/' . basename($this->user_image);
}
}
