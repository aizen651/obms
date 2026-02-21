<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('magazine_issues', function (Blueprint $table) {
            $table->id();
            $table->string('issue_number')->default('01');
            $table->string('season')->nullable();
            $table->boolean('is_published')->default(false);

            // Hero
            $table->string('hero_image')->nullable();
            $table->string('hero_category')->nullable()->default('Editorial Feature');
            $table->string('hero_title')->nullable()->default('Your Title Here');
            $table->string('hero_subtitle')->nullable();
            $table->text('hero_excerpt')->nullable()->default('Write a short description here.');

            // Quote
            $table->text('quote_text')->nullable();
            $table->string('quote_highlight')->nullable();

            // Features (3 cards) as JSON: [{title, category, icon, body}]
            $table->json('features')->nullable();

            // Curations as JSON: [{title}]
            $table->json('curations')->nullable();

            // Book picks as JSON: [{title, author}]
            $table->json('book_picks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magazine_issues');
    }
};
