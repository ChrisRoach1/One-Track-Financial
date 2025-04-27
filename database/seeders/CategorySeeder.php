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
            'name' => 'Shopping'
        ]);

        Category::factory()->create([
            'name' => 'Transportation'
        ]);

        Category::factory()->create([
            'name' => 'Entertainment'
        ]);

        Category::factory()->create([
            'name' => 'Bills & Utilities'
        ]);

        Category::factory()->create([
            'name' => 'Healthcare'
        ]);

        Category::factory()->create([
            'name' => 'Other'
        ]);
    }
}
