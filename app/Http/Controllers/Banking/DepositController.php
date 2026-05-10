<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DepositController extends Controller
{
    public function create()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        return Inertia::render('Banking/Deposit', [
            'balance' => 0,
            'account_number' => null,
        ]);
    }

    public function findCustomer(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $request->validate([
            'identifier' => 'required|string|max:50',
        ]);

        $identifier = strtoupper(str_replace(' ', '', trim($request->identifier)));

        $customer = User::with(['bankAccount', 'profile'])
            ->whereHas('bankAccount', function ($q) use ($identifier) {
                $q->whereRaw("REPLACE(UPPER(account_number), ' ', '') = ?", [$identifier]);
            })
            ->orWhereHas('profile', function ($q) use ($identifier) {
                $q->whereRaw("REPLACE(UPPER(cin), ' ', '') = ?", [$identifier]);
            })
            ->first();

        if (!$customer || !$customer->bankAccount) {
            return response()->json([
                'found' => false,
                'message' => 'Customer not found.',
            ], 404);
        }

        return response()->json([
            'found' => true,
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->profile?->phone,
                'account_number' => $customer->bankAccount->account_number,
                'account_type' => $customer->bankAccount->account_type,
                'balance' => $customer->bankAccount->balance,
                'cin' => $customer->profile?->cin,
            ],
        ]);
    }
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $request->validate([
            'identifier'  => 'required|string|max:50',
            'amount'      => 'required|numeric|min:100|max:100000',
            'source'      => 'required|string',
            'description' => 'nullable|string|max:100',
        ]);

        $identifier = strtoupper(trim($request->identifier));

        $customer = User::with(['bankAccount', 'profile'])
            ->whereHas('bankAccount', function ($q) use ($identifier) {
                $q->where('account_number', $identifier);
            })
            ->orWhereHas('profile', function ($q) use ($identifier) {
                $q->where('cin', $identifier);
            })
            ->first();

        if (!$customer || !$customer->bankAccount) {
            throw ValidationException::withMessages([
                'identifier' => 'Customer not found.',
            ]);
        }

        $account = $customer->bankAccount;
        $newBalance = $account->balance + $request->amount;

        $account->update([
            'balance' => $newBalance,
        ]);

        Transaction::create([
            'bank_account_id' => $account->id,
            'type'            => 'credit',
            'category'        => 'deposit',
            'amount'          => $request->amount,
            'balance_after'   => $newBalance,
            'description'     => $request->description ?? 'Admin Cash Deposit via ' . $request->source,
            'reference'       => Transaction::generateReference('DEP'),
            'status'          => 'completed',
        ]);

        // Notify customer about deposit
        NotificationService::create(
            userId: $customer->id,
            title: 'Deposit Received',
            message: 'Your account has received ' . number_format($request->amount, 2) . ' MAD.',
            type: 'deposit',
            icon: 'wallet',
            actionUrl: '/transactions'
        );

        return back();
    }
}
