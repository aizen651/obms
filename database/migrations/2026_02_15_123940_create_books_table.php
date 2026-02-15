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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('book_image')->nullable();
            $table->string('title');
    $table->string('isbn')->unique();
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->string('author');
    $table->string('publisher');
    $table->year('published_year')->nullable();
    $table->string('edition', 100)->nullable();
    $table->string('language', 50)->nullable();
    $table->integer('pages')->nullable();
    $table->text('description')->nullable();
    $table->integer('total_copies');
    $table->integer('available_copies');
    $table->string('shelf_location', 100)->nullable();
    $table->enum('status', ['available', 'unavailable', 'archived'])->default('available');
    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
