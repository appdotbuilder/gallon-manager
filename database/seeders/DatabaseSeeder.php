<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user for PT Tirta Investama
        User::factory()->create([
            'name' => 'Admin PT Tirta Investama',
            'email' => 'admin@tirta-investama.com',
            'password' => Hash::make('admin123'),
        ]);

        // Create sample employees
        Employee::factory()->createMany([
            [
                'employee_id' => 'TI001',
                'name' => 'Ahmad Sudirman',
                'remaining_quota' => 8,
            ],
            [
                'employee_id' => 'TI002', 
                'name' => 'Siti Nurhaliza',
                'remaining_quota' => 5,
            ],
            [
                'employee_id' => 'TI003',
                'name' => 'Budi Santoso',
                'remaining_quota' => 10,
            ],
            [
                'employee_id' => 'TI004',
                'name' => 'Maya Sari',
                'remaining_quota' => 3,
            ],
            [
                'employee_id' => 'TI005',
                'name' => 'Rizki Pratama',
                'remaining_quota' => 7,
            ],
        ]);

        // Create additional random employees
        Employee::factory(15)->create();
    }
}
