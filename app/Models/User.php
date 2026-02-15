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

    /**
     * Boot method to auto-generate IDs on create and update
     */
    protected static function boot()
    {
        parent::boot();

        // Generate IDs when creating a new user
        static::creating(function ($user) {
            if ($user->role === 'student' && !$user->student_id) {
                $user->student_id = self::generateStudentId();
            } elseif ($user->role === 'teacher' && !$user->teacher_id) {
                $user->teacher_id = self::generateTeacherId();
            }
        });

        // Handle role changes when updating
        static::updating(function ($user) {
            // Check if role is being changed
            if ($user->isDirty('role')) {
                $newRole = $user->role;
                $oldRole = $user->getOriginal('role');

                // If changing TO student and don't have student_id
                if ($newRole === 'student' && !$user->student_id) {
                    $user->student_id = self::generateStudentId();
                }

                // If changing TO teacher and don't have teacher_id
                if ($newRole === 'teacher' && !$user->teacher_id) {
                    $user->teacher_id = self::generateTeacherId();
                }

                // Optional: Clear IDs when changing away from role
                // Uncomment if you want to remove IDs when role changes
                
                if ($oldRole === 'student' && $newRole !== 'student') {
                    $user->student_id = null;
                }
                if ($oldRole === 'teacher' && $newRole !== 'teacher') {
                    $user->teacher_id = null;
                }
                
            }
        });
    }

    /**
     * Generate unique Student ID: STD-123456 (random 6 digits)
     */
    private static function generateStudentId(): string
    {
        do {
            $randomNumber = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            $studentId = 'STD-' . $randomNumber;
            
            $exists = self::where('student_id', $studentId)->exists();
        } while ($exists);

        return $studentId;
    }

    /**
     * Generate unique Teacher ID: INST-123456 (random 6 digits)
     */
    private static function generateTeacherId(): string
    {
        do {
            $randomNumber = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            $teacherId = 'INST-' . $randomNumber;
            
            $exists = self::where('teacher_id', $teacherId)->exists();
        } while ($exists);

        return $teacherId;
    }

    /**
     * Relationship: User has many borrows
     */
    public function borrows()
    {
        return $this->hasMany(Borrow::class);
    }

    /**
     * Get currently borrowed books
     */
    public function currentlyBorrowedBooks()
    {
        return $this->borrows()->where('status', 'borrowed');
    }

    /**
     * Get overdue books
     */
    public function overdueBooks()
    {
        return $this->borrows()->where('status', 'overdue');
    }

    /**
     * Get borrow history
     */
    public function borrowHistory()
    {
        return $this->borrows()->where('status', 'returned');
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
}
