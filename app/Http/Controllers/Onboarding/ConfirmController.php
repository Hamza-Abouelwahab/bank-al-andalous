<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\BankAccount; 

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
        
        $accountNumber = $this->generateAccountNumber();
        $rip = $this->generateRip();

        $request->user()->bankAccount()->create([
            'account_number' => $accountNumber,
            'rip'            => $rip,
            'account_type'   => session('onboarding.account_type'),
            'balance'        => 0.00,
        ]);

        session()->forget('onboarding');

        return redirect()->route('dashboard');
    }

    // 👇👇 PUT THEM HERE (inside class, after methods or before — both OK)

    private function generateAccountNumber()
    {
        do {
            $number = 'MA' . rand(10, 99) . rand(1000, 9999) . rand(1000, 9999);
        } while (BankAccount::where('account_number', $number)->exists());

        return $number;
    }

    private function generateRip()
    {
        do {
            $rip = 'RIP' . rand(100000000, 999999999);
        } while (BankAccount::where('rip', $rip)->exists());

        return $rip;
    }
}