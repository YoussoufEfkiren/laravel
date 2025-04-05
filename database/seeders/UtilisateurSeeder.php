<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        // Clear the table first
    Utilisateur::truncate();
        Utilisateur::create([
            'name' => 'Admin ',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'image' => 'no_image.jpg',
            'status' => 1,
            'last_login' => now(),
        ]);

        Utilisateur::create([
            'name' => 'Manager ',
            'username' => 'manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'image' => 'no_image.jpg',
            'status' => 1,
            'last_login' => now(),
        ]);

        Utilisateur::create([
            'name' => ' User',
            'username' => 'user',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'image' => 'no_image.jpg',
            'status' => 1,
            'last_login' => now(),
        ]);
    }
}




// also the login page ok make it login add also a forgort passwoord and remmeber me