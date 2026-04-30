<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WithdrawController extends Controller
{
    public function create()
    {
        $account = Auth::user()->bankAccount;

        return Inertia::render('Banking/Withdraw', [
            'balance'        => $account->balance,
            'account_number' => $account->account_number,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount'      => 'required|numeric|min:100|max:50000',
            'description' => 'nullable|string|max:100',
        ]);

        $account = Auth::user()->bankAccount;

        if ($request->amount > $account->balance) {
            return back()->withErrors([
                'amount' => 'Insufficient balance. Available: ' . number_format($account->balance, 2) . ' MAD.',
            ]);
        }

        $newBalance = $account->balance - $request->amount;

        $account->update(['balance' => $newBalance]);

        Transaction::create([
            'bank_account_id' => $account->id,
            'type'            => 'debit',
            'category'        => 'withdrawal',
            'amount'          => $request->amount,
            'balance_after'   => $newBalance,
            'description'     => $request->description ?? 'Cash Withdrawal',
            'reference'       => Transaction::generateReference('WDR'),
            'status'          => 'completed',
        ]);

        return redirect()->route('dashboard')->with('success', 'Withdrawal successful.');
    }
}