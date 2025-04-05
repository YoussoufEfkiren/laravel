<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;

class StatistiqueController extends Controller
{
    public function getRoleStatistics()
    {
        // Ensure only admin can access these statistics
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $statistics = [
            'total_users' => Utilisateur::count(),
            'admin_count' => Utilisateur::where('role', 'admin')->count(),
            'manager_count' => Utilisateur::where('role', 'manager')->count(),
            'user_count' => Utilisateur::where('role', 'user')->count(),
            
        ];

        return response()->json($statistics);
    }
}