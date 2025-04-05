<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SuppliersSeeder extends Seeder
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
        DB::table('suppliers')->truncate();
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $suppliers = [
            [
                'name' => 'TechSupplies A',
                'email' => 'techsuppliesA@example.com',
                'contact' => '123-456-7890',
                'address' => '123 Tech St',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'TechSupplies B',
                'email' => 'techsuppliesB@example.com',
                'contact' => '098-765-4321',
                'address' => '456 IT Ave',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'TechSupplies C',
                'email' => 'techsuppliesC@example.com',
                'contact' => '567-890-1234',
                'address' => '789 Gadget Blvd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'TechSupplies D',
                'email' => 'techsuppliesD@example.com',
                'contact' => '678-901-2345',
                'address' => '101 Digital Rd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'TechSupplies E',
                'email' => 'techsuppliesE@example.com',
                'contact' => '789-012-3456',
                'address' => '202 Silicon St',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('suppliers')->insert($suppliers);
    }
}