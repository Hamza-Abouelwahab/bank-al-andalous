<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WithdrawController extends Controller
{
    public function create()
    {
        $user = Auth::user();
        $account = $user->bankAccount;

        if (!$account) {
            return redirect()->route('onboarding.bank');
        }

        return Inertia::render('Banking/Withdraw', [
            'balance'        => $account->balance,
            'account_number' => $account->account_number,
            'email'          => $user->email,
            'requests'       => WithdrawalRequest::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount'      => 'required|numeric|min:100|max:50000',
            'description' => 'nullable|string|max:100',
        ]);

        $user = Auth::user();
        $account = $user->bankAccount;

        if (!$account) {
            return back()->withErrors([
                'amount' => 'No bank account found.',
            ]);
        }

        if (!$user->email) {
            return back()->withErrors([
                'amount' => 'Email address is required to receive the withdrawal PIN code.',
            ]);
        }


        if ($request->amount > $account->balance) {
            return back()->withErrors([
                'amount' => 'Insufficient balance. Available: ' . number_format($account->balance, 2) . ' MAD.',
            ]);
        }

        DB::transaction(function () use ($request, $user, $account) {
            $pinCode = (string) random_int(100000, 999999);
            $reference = WithdrawalRequest::generateReference();
            $newBalance = $account->balance - $request->amount;

            $account->update([
                'balance' => $newBalance,
            ]);

            $withdrawalRequest = WithdrawalRequest::create([
                'user_id'         => $user->id,
                'bank_account_id' => $account->id,
                'amount'          => $request->amount,
                'pin_code'        => $pinCode,
                'reference'       => $reference,
                'expires_at'      => now()->addHours(24),
                'status'          => 'pending',
            ]);

            Transaction::create([
                'bank_account_id' => $account->id,
                'type'            => 'debit',
                'category'        => 'withdrawal',
                'amount'          => $request->amount,
                'balance_after'   => $newBalance,
                'description'     => $request->description ?? 'Cardless withdrawal request',
                'reference'       => $withdrawalRequest->reference,
                'status'          => 'pending',
            ]);

            $this->sendWithdrawalEmail(
                $user->email,
                $pinCode,
                $withdrawalRequest->reference,
                (float) $request->amount,
            );
        });


        session()->flash('success', 'Withdrawal PIN code sent to your email address.');

        return back();
    }

    public function cancel(WithdrawalRequest $withdrawalRequest)
    {
        $user = Auth::user();

        if ($withdrawalRequest->user_id !== $user->id) {
            abort(403);
        }

        if ($withdrawalRequest->status !== 'pending') {
            return back()->withErrors([
                'amount' => 'This withdrawal request can no longer be cancelled.',
            ]);
        }

        if ($withdrawalRequest->expires_at->isPast()) {
            return back()->withErrors([
                'amount' => 'This withdrawal request has already expired.',
            ]);
        }

        $account = $user->bankAccount;

        if (!$account) {
            return back()->withErrors([
                'amount' => 'No bank account found.',
            ]);
        }

        DB::transaction(function () use ($account, $withdrawalRequest) {
            $account->increment('balance', $withdrawalRequest->amount);

            $withdrawalRequest->update([
                'status' => 'cancelled',
            ]);

            Transaction::where('reference', $withdrawalRequest->reference)->update([
                'status' => 'failed',
            ]);
        });

        return back()->with('success', 'Withdrawal request cancelled successfully. The reserved amount has been refunded.');
    }

    public function useCode(Request $request)
    {
        $request->validate([
            'reference' => 'required|string',
            'pin_code'  => 'required|string|size:6',
        ]);

        $withdrawalRequest = WithdrawalRequest::where('reference', $request->reference)
            ->where('pin_code', $request->pin_code)
            ->first();

        if (!$withdrawalRequest) {
            return back()->withErrors([
                'pin_code' => 'Invalid withdrawal code or reference.',
            ]);
        }

        if ($withdrawalRequest->status !== 'pending') {
            return back()->withErrors([
                'pin_code' => 'This withdrawal code is no longer active.',
            ]);
        }

        if ($withdrawalRequest->expires_at->isPast()) {
            $account = $withdrawalRequest->bankAccount;

            DB::transaction(function () use ($account, $withdrawalRequest) {
                if ($account) {
                    $account->increment('balance', $withdrawalRequest->amount);
                }

                $withdrawalRequest->update([
                    'status' => 'expired',
                ]);

                Transaction::where('reference', $withdrawalRequest->reference)->update([
                    'status' => 'failed',
                ]);
            });

            return back()->withErrors([
                'pin_code' => 'This withdrawal code has expired.',
            ]);
        }

        DB::transaction(function () use ($withdrawalRequest) {
            $withdrawalRequest->update([
                'status' => 'used',
                'used_at' => now(),
            ]);

            Transaction::where('reference', $withdrawalRequest->reference)->update([
                'status' => 'completed',
            ]);
        });

        return back()->with('success', 'Withdrawal code used successfully.');
    }
    private function sendWithdrawalEmail(string $email, string $pinCode, string $reference, float $amount): void
    {
        $subject = 'Your Cardless Withdrawal PIN Code';

        $message = "
            Hello,

            Your cardless withdrawal request has been
            created successfully.

            Reference: {$reference}

            PIN Code: {$pinCode}

            Amount: {$amount} MAD

            Validity: 24 hours

            Do not share this PIN code with anyone.
            This code can be used only once.

            Al-Andalous Bank
            ";

        try {
            Mail::raw($message, function ($mail) use ($email, $subject) {
                $mail->to($email)
                    ->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::warning('Withdrawal email failed in local environment', [
                'error' => $e->getMessage(),
                'email' => $email,
                'pin_code' => $pinCode,
                'reference' => $reference,
            ]);

            if (!app()->environment('local')) {
                throw $e;
            }
        }
    }
}
