<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;

class AuthController extends Controller
{
    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout successful']);
    }

    /**
     * Display the dashboard based on the user's role.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        switch ($user->role) {
            case 'admin':
                return response()->json([
                    'message' => 'Welcome, Admin!',
                   
                ]);
            case 'manager':
                return response()->json([
                    'message' => 'Welcome, Manager!',
                    
                ]);
            default:
                return response()->json([
                    'message' => 'Welcome, User!',
                    
                ]);
        }
    }

    /**
 * Get authenticated user profile.
 */
public function profile(Request $request)
{
    return response()->json($request->user());
}
// In your AuthController or UserController
public function updateProfile(Request $request)
{
    $user = $request->user();
    
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,'.$user->id,
        'password' => 'nullable|string|min:6',
    ]);

    if (!empty($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    } else {
        unset($data['password']);
    }

    $user->update($data);

    return response()->json($user);
}
}