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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('ref_nbr')->unique(); // CTU-000001
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            $table->foreignId('borrower_id')->constrained('users')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->date('date_borrowed');
            $table->date('expected_return_date');
            $table->date('date_returned')->nullable();
            $table->date('date_canceled')->nullable();
            $table->decimal('fees', 10, 2)->nullable()->default(0);
            $table->enum('status', ['borrowed', 'returned', 'overdue', 'canceled'])->default('borrowed');
            $table->boolean('is_lost')->default(false);
            $table->timestamp('transaction_date');
            $table->timestamps();

            // Indexes for performance
            $table->index('ref_nbr');
            $table->index('status');
            $table->index('date_borrowed');
            $table->index('expected_return_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
