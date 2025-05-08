<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::factory()->create([
            'name' => 'Food & Dining'
        ]);

        Category::factory()->create([
            'name' => 'Shopping',
            'user_id' => null,
        ]);

        Category::factory()->create([
            'name' => 'Transportation',
            'user_id' => null,
        ]);

        Category::factory()->create([
            'name' => 'Entertainment',
            'user_id' => null,
        ]);

        Category::factory()->create([
            'name' => 'Bills & Utilities',
            'user_id' => null,
        ]);

        Category::factory()->create([
            'name' => 'Healthcare',
            'user_id' => null,
        ]);

        Category::factory()->create([
            'name' => 'Other',
            'user_id' => null,

        ]);
    }
}
