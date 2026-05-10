<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\RiskScoreService;
use Inertia\Inertia;

class RiskController extends Controller
{
    public function index(RiskScoreService $riskScoreService)
    {
        $users = User::query()
            ->with(['profile', 'bankAccount', 'riskScore'])
            ->latest()
            ->get();

        foreach ($users as $user) {
            if (!$user->riskScore) {
                $riskScoreService->calculate($user);
            }
        }

        $users = User::query()
            ->with(['profile', 'bankAccount', 'riskScore'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Risk/Index', [
            'users' => $users,
        ]);
    }
}