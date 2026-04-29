<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\BankAccount;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        
        if ($user->role === 'admin') {
            return Inertia::render('Admin/Dashboard', [
                'auth' => [
                    'user' => $user,
                ],
                'users' => User::with(['bankAccount', 'profile'])->get(),
                'stats' => [
                    'total_users' => User::count(),
                    'total_accounts' => BankAccount::count(),
                    'total_balance' => BankAccount::sum('balance'),
                ],
            ]);
        }

        
        return Inertia::render('dashboard', [
            'auth' => [
                'user' => $user->load([
                    'profile',
                    'bankAccount',
                    'financialProfile'
                ]),
            ],
        ]);
    }
}