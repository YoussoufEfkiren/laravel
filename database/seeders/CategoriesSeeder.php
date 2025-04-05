<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    
    // Clear tables in correct order
    DB::table('products')->truncate();
    DB::table('categories')->truncate();
    
    // Re-enable foreign key checks
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = [
            [
                'name' => 'Laptops',
                'description' => 'Various types of laptops including gaming, business, and personal laptops',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Printers',
                'description' => 'Printers for home and office use, including laser and inkjet printers',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Keyboards',
                'description' => 'Mechanical and membrane keyboards for desktop and laptop use',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mice',
                'description' => 'Wired and wireless computer mice for different usage',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Monitors',
                'description' => 'Computer monitors including LED, LCD, and 4K models',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Accessories',
                'description' => 'Various computer accessories including laptop bags, cables, etc.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Networking',
                'description' => 'Networking devices including routers, switches, and modems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}