<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'utilisateurs'; // Spécifiez le nom de la table

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'image',
        'status',
        'last_login',
    ];

    protected $hidden = [
        'password',
    ];
}