<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('Onboarding/Bank', [
            'bank' => $request->user()->financialProfile,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'account_type'      => 'required|in:savings,current',
            'employment_status' => 'required|in:employed,self_employed,business_owner,student,unemployed,retired',
            'occupation'        => 'required|string|max:100',
            'monthly_income'    => 'required|numeric|min:0',
            'source_of_funds' => 'required|in:salary,business,family_support,savings,investments,freelance,other',
        ]);

        $request->user()->financialProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'account_type'      => $request->account_type,
                'employment_status' => $request->employment_status,
                'occupation'        => $request->occupation,
                'monthly_income'    => $request->monthly_income,
                'source_of_funds'   => $request->source_of_funds,
            ]
        );

        session(['onboarding.account_type' => $request->account_type]);

        return redirect()->route('onboarding.confirm');
    }
}
