<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $account = Auth::user()->bankAccount;

        $query = $account->transactions()->latest();

        // Filter by type
        if ($request->filled('type') && in_array($request->type, ['credit', 'debit'])) {
            $query->where('type', $request->type);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by date range
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $transactions = $query->get();

        // Summary stats
        $totalCredit = $transactions->where('type', 'credit')->sum('amount');
        $totalDebit  = $transactions->where('type', 'debit')->sum('amount');

        return Inertia::render('Banking/Transactions', [
            'transactions' => $transactions,
            'balance'      => $account->balance,
            'summary'      => [
                'total_credit' => $totalCredit,
                'total_debit'  => $totalDebit,
                'net'          => $totalCredit - $totalDebit,
                'count'        => $transactions->count(),
            ],
            'filters' => $request->only(['type', 'category', 'from', 'to']),
        ]);
    }
}