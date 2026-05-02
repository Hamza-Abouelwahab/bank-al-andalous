<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\BankAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

            'transactions' => Auth::user()->bankAccount->transactions()
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }


    public function destroy(User $user)
{
    if ($user->id === Auth::id()) {
        return back()->withErrors([
            'user' => 'You cannot delete your own account.',
        ]);
    }

    DB::transaction(function () use ($user) {

        if ($user->bankAccount) {
            $user->bankAccount->transactions()->delete();
            $user->bankAccount->delete();
        }

        $user->profile()?->delete();
        $user->financialProfile()?->delete();

        $user->delete(); // 
    });

    return back()->with('success', 'User deleted successfully.');
}
}
