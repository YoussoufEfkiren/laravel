<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'USB-C Cable U1',
                'quantity' => '200',
                'buy_price' => 10.00,
                'sale_price' => 20.00,
                'categorie_id' => 6, // Accessories
                'date' => now(),
                'file_name' => 'usb_c_cable_u1.jpg',
                'supplier_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Router Model R1',
                'quantity' => '50',
                'buy_price' => 30.00,
                'sale_price' => 60.00,
                'categorie_id' => 7, // Networking
                'date' => now(),
                'file_name' => 'router_model_r1.jpg',
                'supplier_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'WiFi Extender W1',
                'quantity' => '100',
                'buy_price' => 20.00,
                'sale_price' => 40.00,
                'categorie_id' => 7, // Networking
                'date' => now(),
                'file_name' => 'wifi_extender_w1.jpg',
                'supplier_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Laptop Stand S1',
                'quantity' => '150',
                'buy_price' => 15.00,
                'sale_price' => 30.00,
                'categorie_id' => 6, // Accessories
                'date' => now(),
                'file_name' => 'laptop_stand_s1.jpg',
                'supplier_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'External Hard Drive H1',
                'quantity' => '80',
                'buy_price' => 80.00,
                'sale_price' => 160.00,
                'categorie_id' => 6, // Accessories
                'date' => now(),
                'file_name' => 'external_hard_drive_h1.jpg',
                'supplier_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
 