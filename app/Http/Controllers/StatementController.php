<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class StatementController extends Controller
{
    public function download()
    {
        $user = Auth::user()->load(['profile', 'bankAccount']);

        $account = $user->bankAccount;

        if (!$account) {
            return redirect()->route('dashboard')
                ->with('error', 'No bank account found.');
        }

        $transactions = $account->transactions()
            ->latest()
            ->take(50)
            ->get();

        $totalDeposits = $transactions
            ->where('type', 'deposit')
            ->sum('amount');

        $totalWithdrawals = $transactions
            ->whereIn('type', ['withdraw', 'withdrawal'])
            ->sum('amount');

        $pdf = Pdf::loadView('pdf.account-statement', [
            'user' => $user,
            'profile' => $user->profile,
            'account' => $account,
            'transactions' => $transactions,
            'totalDeposits' => $totalDeposits,
            'totalWithdrawals' => $totalWithdrawals,
            'generatedAt' => now(),
        ])->setPaper('a4');

        return $pdf->download('bank-al-andalous-statement.pdf');
    }
}