<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->dateTime('borrowed_at');
            $table->date('due_date');
            $table->dateTime('returned_at')->nullable();
            $table->enum('status', ['borrowed', 'returned', 'overdue', 'lost', 'cancelled'])->default('borrowed');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index('user_id');
            $table->index('book_id');
            $table->index('status');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrows');
    }
};
