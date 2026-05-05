<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Support/Index');
    }

    public function security(): Response
    {
        return Inertia::render('Support/Security');
    }

    public function locked(): Response
    {
        return Inertia::render('Support/Locked');
    }

    public function unlock(): Response
    {
        return Inertia::render('Support/Unlock');
    }

    public function unlocked(): Response
    {
        return Inertia::render('Support/Unlocked');
    }

    public function report(Request $request)
    {
        // later you can save report in database here

        return redirect()->route('support.locked');
    }

    public function verify(Request $request)
    {
        // later you can validate sms/email/security answers here

        return redirect()->route('support.unlocked');
    }
}