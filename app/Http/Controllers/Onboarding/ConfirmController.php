<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConfirmController extends Controller
{
    public function create()
{
    $user = Auth::user()->load(['profile', 'financialProfile']);

    return Inertia::render('Onboarding/Confirm', [
        'profile' => [
            'date_of_birth' => $user->profile?->date_of_birth,
            'phone'         => $user->profile?->phone,
            'address'       => $user->profile?->address,
        ],
        'bank' => [
            'account_type'      => session('onboarding.account_type'),
            'employment_status' => $user->financialProfile?->employment_status,
            'occupation'        => $user->financialProfile?->occupation,
            'monthly_income'    => $user->financialProfile?->monthly_income,
            'source_of_funds'   => $user->financialProfile?->source_of_funds,
        ],
    ]);
}

public function store(Request $request)
{
     $accountNumber = 'MA' . rand(10, 99) . rand(1000, 9999) . rand(1000, 9999);

    $request->user()->bankAccount()->firstOrCreate(
        ['user_id' => $request->user()->id],
        [
            'account_number' => $accountNumber,
            'account_type'   => session('onboarding.account_type'),
            'balance'        => 0.00,
        ]
    );

    session()->forget('onboarding');

    return redirect()->route('dashboard');
}
}
