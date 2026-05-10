<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class BillController extends Controller
{
    public function create()
    {
        $account = Auth::user()->bankAccount;

        if (!$account) {
            return redirect()->route('onboarding.bank');
        }
        return Inertia::render('Banking/Bills', [
            'balance'        => $account->balance,
            'account_number' => $account->account_number,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'bill_type'  => 'required|in:electricity,water,internet,phone,insurance,tax',
        'reference'  => 'required|string|max:50',
        'amount'     => 'required|numeric|min:10|max:50000',
    ]);

    $account = Auth::user()->bankAccount;

    if (!$account) {
        return redirect()->route('onboarding.bank');
    }

    if ($request->amount > $account->balance) {
        return back()->withErrors([
            'amount' => 'Insufficient balance. Available: ' . number_format($account->balance, 2) . ' MAD.',
        ]);
    }

    $labels = [
        'electricity' => 'Electricity (ONEE)',
        'water'       => 'Water (ONEE)',
        'internet'    => 'Internet Bill',
        'phone'       => 'Phone Top-up',
        'insurance'   => 'Insurance Premium',
        'tax'         => 'Tax Payment',
    ];

    DB::transaction(function () use ($account, $request, $labels) {
        $newBalance = $account->balance - $request->amount;

        $account->update([
            'balance' => $newBalance,
        ]);

        Transaction::create([
            'bank_account_id' => $account->id,
            'type'            => 'debit',
            'category'        => 'bill_payment',
            'amount'          => $request->amount,
            'balance_after'   => $newBalance,
            'description'     => ($labels[$request->bill_type] ?? $request->bill_type) . ' — Ref: ' . $request->reference,
            'reference'       => Transaction::generateReference('BILL'),
            'status'          => 'completed',
        ]);
    });

    // Notify user about bill payment
    NotificationService::create(
        userId: Auth::id(),
        title: 'Bill Payment Completed',
        message: 'Your ' . strtolower($labels[$request->bill_type] ?? $request->bill_type) . ' payment of ' . number_format($request->amount, 2) . ' MAD was successful.',
        type: 'bill',
        icon: 'check-circle',
        actionUrl: '/transactions'
    );

        return back();
    }
}
