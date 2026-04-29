<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('bankAccount');

        return Inertia::render('Account/Show', [
            'account' => $user->bankAccount,
        ]);
    }
}