<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;
use App\Models\LoanSimulation;
use Illuminate\Support\Facades\Auth;

class LoanSimulationController extends Controller
{

    public function index()
    {
        $loans = auth()->user()->loans()->latest()->get();

        return \Inertia\Inertia::render('Simulation/History', [
            'loans' => $loans
        ]);
    }

    public function simulate(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000',
            'months' => 'required|integer|min:1',
            'rate'   => 'required|numeric|min:0',
        ]);

        // ✅ DEFINE VARIABLES FIRST
        $P = $request->amount;
        $r = $request->rate / 100 / 12;
        $n = $request->months;

        // ✅ HANDLE ZERO INTEREST (VERY IMPORTANT)
        if ($r == 0) {
            $monthly = $P / $n;
        } else {
            $monthly = $P * ($r * pow(1 + $r, $n)) / (pow(1 + $r, $n) - 1);
        }

        $total = $monthly * $n;
        $interest = $total - $P;

        // ✅ NOW SAVE (AFTER CALCULATION)
        LoanSimulation::create([
            'user_id' => Auth::id(),
            'amount' => $P,
            'months' => $n,
            'interest_rate' => $request->rate,
            'monthly_payment' => $monthly,
            'total_payment' => $total,
            'total_interest' => $interest,
        ]);

        return response()->json([
            'monthly' => round($monthly, 2),
            'total' => round($total, 2),
            'interest' => round($interest, 2),
        ]);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000',
            'months' => 'required|integer|min:1',
            'rate'   => 'required|numeric|min:0',
        ]);

        $P = $request->amount;
        $r = $request->rate / 100 / 12;
        $n = $request->months;

        $monthly = $r == 0
            ? $P / $n
            : $P * ($r * pow(1 + $r, $n)) / (pow(1 + $r, $n) - 1);

        $total = $monthly * $n;
        $interest = $total - $P;

        $loan = Loan::create([
            'user_id' => auth()->id(), // cleaner
            'amount' => $P,
            'months' => $n,
            'interest_rate' => $request->rate,
            'monthly_payment' => $monthly,
            'total_payment' => $total,
            'total_interest' => $interest,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Loan request submitted',
            'loan' => $loan
        ]);
    }
}
