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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->string('type')->default('general');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default late fee configuration
        DB::table('settings')->insert([
            'key' => 'late_fee_config',
            'value' => json_encode([
                'enabled' => false,
                'rate' => 5.00,
                'interval' => 'day',
            ]),
            'type' => 'fees',
            'description' => 'Late fee configuration for overdue books',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
