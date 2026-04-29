<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function create()
    {
        return Inertia::render('Onboarding/Profile');
    }

    public function store(Request $request)
    {
        $request->validate([
            'date_of_birth' => 'required|date',
            'phone'         => 'required|string|max:20',
            'address'       => 'required|string',
        ]);

        $request->user()->profile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'date_of_birth' => $request->date_of_birth,
                'phone'         => $request->phone,
                'address'       => $request->address,
            ]
        );

        return redirect()->route('onboarding.bank');
    }
}
