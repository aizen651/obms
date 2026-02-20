<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $total = fake()->numberBetween(1, 10);
    $available = fake()->numberBetween(0, $total);

    return [
        'title' => fake()->sentence(3),
        'isbn' => fake()->unique()->isbn13(),
        'category_id' => \App\Models\Category::inRandomOrder()->value('id'),
        'author' => fake()->name(),
        'publisher' => fake()->company(),
        'published_year' => fake()->numberBetween(1990, 2024),
        'pages' => fake()->numberBetween(100, 700),
        'total_copies' => $total,
        'available_copies' => $available,
        'status' => 'available',
    ];
}
}
