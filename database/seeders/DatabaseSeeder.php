<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UtilisateurSeeder::class);
        $this->call(CategoriesSeeder::class);
        $this->call(SuppliersSeeder::class);
        $this->call(ProductsSeeder::class);
    }
}
