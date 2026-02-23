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
    ];
    
    protected $appends = ['member_id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
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
            $randomNumber = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            $studentId = 'STD-' . $randomNumber;
            $exists = self::where('student_id', $studentId)->exists();
        } while ($exists);
        return $studentId;
    }

    private static function generateTeacherId(): string
    {
        do {
            $randomNumber = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            $teacherId = 'INST-' . $randomNumber;
            $exists = self::where('teacher_id', $teacherId)->exists();
        } while ($exists);
        return $teacherId;
    }

    // FIXED RELATIONSHIPS - Using Transaction model
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'borrower_id');
    }

    public function borrowedBooks()
    {
        return $this->hasMany(Transaction::class, 'borrower_id')
                    ->where('status', 'borrowed')
                    ->with('book');
    }

    public function overdueBooks()
    {
        return $this->hasMany(Transaction::class, 'borrower_id')
                    ->where('status', 'overdue')
                    ->with('book');
    }

    public function borrowHistory()
    {
        return $this->hasMany(Transaction::class, 'borrower_id')
                    ->where('status', 'returned')
                    ->with('book');
    }

    // Keep these for backward compatibility if needed
    public function borrows()
    {
        return $this->transactions();
    }

    public function currentlyBorrowedBooks()
    {
        return $this->borrowedBooks();
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->firstname} {$this->lastname}";
    }

    public function getMemberIdAttribute(): ?string
    {
        if ($this->role === 'student') {
            return $this->student_id;
        } elseif ($this->role === 'teacher') {
            return $this->teacher_id;
        }
        return null;
    }
    
    public function journals()
     {
       return $this->hasMany(Journal::class);
     }

}