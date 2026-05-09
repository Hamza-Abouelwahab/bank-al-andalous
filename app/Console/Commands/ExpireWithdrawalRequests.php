<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use App\Models\WithdrawalRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExpireWithdrawalRequests extends Command
{
    protected $signature = 'withdrawals:expire';

    protected $description = 'Expire pending cardless withdrawal requests and refund reserved amounts';

    public function handle(): int
    {
        $requests = WithdrawalRequest::where('status', 'pending')
            ->where('expires_at', '<', now())
            ->get();

        foreach ($requests as $withdrawalRequest) {
            $account = $withdrawalRequest->bankAccount;

            if (!$account) {
                continue;
            }

            DB::transaction(function () use ($account, $withdrawalRequest) {
                $account->increment('balance', $withdrawalRequest->amount);

                $withdrawalRequest->update([
                    'status' => 'expired',
                ]);

                Transaction::where('reference', $withdrawalRequest->reference)->update([
                    'status' => 'failed',
                ]);
            });
        }

        $this->info($requests->count() . ' withdrawal request(s) expired.');

        return self::SUCCESS;
    }
    public function bankAccount()
    {
        return $this->belongsTo(\App\Models\BankAccount::class);
    }
}
