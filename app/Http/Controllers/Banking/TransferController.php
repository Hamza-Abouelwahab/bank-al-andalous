<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function create()
    {
        $account = Auth::user()->bankAccount;

        return Inertia::render('Banking/Transfer', [
            'balance'        => $account->balance,
            'account_number' => $account->account_number,
        ]);
    }

    public function store(Request $request)
    {

        
        $request->validate([
            'recipient_account' => 'required|string',
            'amount'            => 'required|numeric|min:10|max:100000',
            'description'       => 'nullable|string|max:100',
        ]);
        // dd($request->recipient_account, BankAccount::all()->pluck('account_number'));

        $sender = Auth::user()->bankAccount;

        // Cannot transfer to yourself
        if ($request->recipient_account === $sender->account_number) {
            return back()->withErrors([
                'recipient_account' => 'You cannot transfer to your own account.',
            ]);
        }

        // Find recipient
        $recipient = BankAccount::where('account_number', trim($request->recipient_account))->first();
        if (!$recipient) {
            return back()->withErrors([
                'recipient_account' => 'Account not found. Please check the account number.',
            ]);
        }

        // Check balance
        if ($request->amount > $sender->balance) {
            return back()->withErrors([
                'amount' => 'Insufficient balance. Available: ' . number_format($sender->balance, 2) . ' MAD.',
            ]);
        }

        $ref            = Transaction::generateReference('TRF');
        $senderBalance  = $sender->balance - $request->amount;
        $recipientBalance = $recipient->balance + $request->amount;
        $desc           = $request->description ?? 'Bank Transfer';

        // Deduct from sender
        $sender->update(['balance' => $senderBalance]);
        Transaction::create([
            'bank_account_id'   => $sender->id,
            'type'              => 'debit',
            'category'          => 'transfer_out',
            'amount'            => $request->amount,
            'balance_after'     => $senderBalance,
            'description'       => 'Transfer to ' . $request->recipient_account . ' — ' . $desc,
            'reference'         => $ref . '-OUT',
            'recipient_account' => $request->recipient_account,
            'status'            => 'completed',
        ]);

        // Add to recipient
        $recipient->update(['balance' => $recipientBalance]);
        Transaction::create([
            'bank_account_id'   => $recipient->id,
            'type'              => 'credit',
            'category'          => 'transfer_in',
            'amount'            => $request->amount,
            'balance_after'     => $recipientBalance,
            'description'       => 'Transfer from ' . $sender->account_number . ' — ' . $desc,
            'reference'         => $ref . '-IN',
            'recipient_account' => $sender->account_number,
            'status'            => 'completed',
        ]);

        return redirect()->route('dashboard')->with('success', 'Transfer completed successfully.');
    }
}