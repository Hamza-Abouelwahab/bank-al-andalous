<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('Onboarding/Profile', [
            'profile' => $request->user()->profile,
        ]);
    }

    public function store(Request $request)
    {
        $profile = $request->user()->profile;
        $request->validate(
            [
                'cin' => [
                    'required',
                    'string',
                    'regex:/^[A-Z]{2}[0-9]{6}$/',
                    Rule::unique('profiles', 'cin')->ignore($profile?->id),
                ],
                'date_of_birth' => [
                    'required',
                    'date',
                    'before:' . now()->subYears(18)->format('Y-m-d'),
                    'after:' . now()->subYears(60)->format('Y-m-d'),
                ],
                'phone' => [
                    'required',
                    'string',
                    'max:20',
                    Rule::unique('profiles', 'phone')->ignore($profile?->id),
                ],
                'address'       => 'required|string',

            ],
            [
                'date_of_birth.before' => 'You must be between 18 and 60 years old.',
                'date_of_birth.after'  => 'You must be between 18 and 60 years old.',
                'date_of_birth.required' => 'Date of birth is required.',
            ],
        );

        $request->user()->profile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'cin'           => $request->cin,
                'date_of_birth' => $request->date_of_birth,
                'phone'         => $request->phone,
                'address'       => $request->address,
            ]
        );

        return redirect()->route('onboarding.bank');
    }
}
