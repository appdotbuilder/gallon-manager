<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GallonTransaction>
 */
class GallonTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 5);
        $remainingAfter = $this->faker->numberBetween(0, 10);

        return [
            'employee_id' => Employee::factory(),
            'quantity' => $quantity,
            'remaining_quota_after' => $remainingAfter,
            'taken_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}