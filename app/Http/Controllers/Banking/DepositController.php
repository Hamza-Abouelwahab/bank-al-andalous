<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepositController extends Controller
{
    public function create()
    {
        $account = Auth::user()->bankAccount;

        return Inertia::render('Banking/Deposit', [
            'balance'        => $account->balance,
            'account_number' => $account->account_number,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount'      => 'required|numeric|min:100|max:100000',
            'source'      => 'required|string',
            'description' => 'nullable|string|max:100',
        ]);

        $account    = Auth::user()->bankAccount;
        $newBalance = $account->balance + $request->amount;

        $account->update(['balance' => $newBalance]);

        Transaction::create([
            'bank_account_id' => $account->id,
            'type'            => 'credit',
            'category'        => 'deposit',
            'amount'          => $request->amount,
            'balance_after'   => $newBalance,
            'description'     => $request->description ?? 'Cash Deposit via ' . $request->source,
            'reference'       => Transaction::generateReference('DEP'),
            'status'          => 'completed',
        ]);

        return back();
    }
}