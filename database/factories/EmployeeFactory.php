<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => 'EMP' . str_pad((string) $this->faker->unique()->numberBetween(1000, 9999), 4, '0', STR_PAD_LEFT),
            'name' => $this->faker->name(),
            'remaining_quota' => $this->faker->numberBetween(0, 10),
            'quota_last_reset' => now()->startOfMonth(),
        ];
    }
}