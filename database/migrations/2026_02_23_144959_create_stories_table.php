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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('genre')->nullable();
            $table->string('cover_image')->nullable();
            $table->text('synopsis')->nullable();
            $table->longText('content');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft');
            $table->text('rejection_reason')->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('read_time')->default(0); // minutes
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
