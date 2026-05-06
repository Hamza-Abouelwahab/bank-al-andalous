<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
        $validated = $request->validate([
            'recipient_account' => 'required|string',
            'amount'            => 'required|numeric|min:10|max:100000',
            'description'       => 'nullable|string|max:100',
        ]);

        $sender = Auth::user()->bankAccount;

        if (!$sender) {
            return back()->withErrors([
                'recipient_account' => 'Sender account not found.',
            ]);
        }

        $recipientAccount = strtoupper(preg_replace('/\s+/', '', $validated['recipient_account']));
        $amount = (float) $validated['amount'];
        $fee = 2;
        $total = $amount + $fee;

        if ($recipientAccount === $sender->account_number) {
            return back()->withErrors([
                'recipient_account' => 'You cannot transfer to your own account.',
            ]);
        }

        $recipient = BankAccount::whereRaw('UPPER(TRIM(account_number)) = ?', [$recipientAccount])->first();

        if (!$recipient) {
            return back()->withErrors([
                'recipient_account' => 'Account not found. Please check the account number.',
            ]);
        }

        if ($total > $sender->balance) {
            return back()->withErrors([
                'amount' => 'Insufficient balance. Available: ' . number_format($sender->balance, 2) . ' MAD.',
            ]);
        }

        DB::transaction(function () use ($sender, $recipient, $amount, $fee, $total, $recipientAccount, $validated) {
            $ref = Transaction::generateReference('TRF');
            $desc = $validated['description'] ?? 'Bank Transfer';

            $senderBalance = $sender->balance - $total;
            $recipientBalance = $recipient->balance + $amount;

            $sender->update(['balance' => $senderBalance]);

            Transaction::create([
                'bank_account_id'   => $sender->id,
                'type'              => 'debit',
                'category'          => 'transfer_out',
                'amount'            => $amount,
                'balance_after'     => $senderBalance,
                'description'       => 'Transfer to ' . $recipientAccount . ' — ' . $desc . ' — Fee: ' . $fee . ' MAD',
                'reference'         => $ref . '-OUT',
                'recipient_account' => $recipientAccount,
                'status'            => 'completed',
            ]);

            $recipient->update(['balance' => $recipientBalance]);

            Transaction::create([
                'bank_account_id'   => $recipient->id,
                'type'              => 'credit',
                'category'          => 'transfer_in',
                'amount'            => $amount,
                'balance_after'     => $recipientBalance,
                'description'       => 'Transfer from ' . $sender->account_number . ' — ' . $desc,
                'reference'         => $ref . '-IN',
                'recipient_account' => $sender->account_number,
                'status'            => 'completed',
            ]);
        });
        return redirect()->route('dashboard')->with('success', 'Transfer completed successfully.');
    }
}
