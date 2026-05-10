<?php

namespace App\Http\Controllers;

use App\Services\RiskScoreService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiskCenterController extends Controller
{
    public function index(Request $request, RiskScoreService $riskScoreService)
    {
        $riskScore = $riskScoreService->calculate($request->user());

        return Inertia::render('RiskCenter/Index', [
            'riskScore' => $riskScore,
        ]);
    }

    public function recalculate(Request $request, RiskScoreService $riskScoreService)
    {
        $riskScore = $riskScoreService->calculate($request->user());

        return back()->with('success', 'Aman Score recalculated successfully.');
    }
}