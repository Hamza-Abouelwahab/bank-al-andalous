<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\BankAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();


        if ($user->role === 'admin') {
            return Inertia::render('Admin/Dashboard', [
                'auth' => [
                    'user' => $user,
                ],
                'users' => User::with(['bankAccount', 'profile'])->get(),
                'stats' => [
                    'total_users' => User::count(),
                    'total_accounts' => BankAccount::count(),
                    'total_balance' => BankAccount::sum('balance'),
                ],
            ]);
        }


        $bankAccount = $user->bankAccount;
        $transactions = $bankAccount
            ? $bankAccount->transactions()->latest()->take(10)->get()
            : collect();

        $totalCredit = $bankAccount
            ? $bankAccount->transactions()->where('type', 'credit')->sum('amount')
            : 0;
        $totalDebit = $bankAccount
            ? $bankAccount->transactions()->where('type', 'debit')->sum('amount')
            : 0;

        $balance = $bankAccount?->balance ?? 0;
        $monthlyIncome = (float) ($user->financialProfile?->monthly_income ?? 0);

        // ── Smart Alerts ──────────────────────────────────────────────
        $alerts = [];
        if ($balance < 500) {
            $alerts[] = ['type' => 'warning', 'icon' => '⚠️', 'title' => 'Low Balance', 'message' => 'Your balance is below 500 MAD. Consider making a deposit.'];
        }
        $lastWeekDebit = $bankAccount
            ? $bankAccount->transactions()->where('type', 'debit')->where('created_at', '>=', now()->subDays(7))->sum('amount')
            : 0;
        $avgWeeklyDebit = $bankAccount
            ? $bankAccount->transactions()->where('type', 'debit')->where('created_at', '>=', now()->subDays(30))->sum('amount') / 4
            : 0;
        if ($avgWeeklyDebit > 0 && $lastWeekDebit > $avgWeeklyDebit * 1.5) {
            $alerts[] = ['type' => 'danger', 'icon' => '🚨', 'title' => 'Unusual Spending', 'message' => 'Your spending this week is 50% above your average.'];
        }
        $alerts[] = ['type' => 'info', 'icon' => '📅', 'title' => 'Bill Reminder', 'message' => 'You have upcoming bills due this month. Stay on top of payments.'];

        // ── AI Insights ───────────────────────────────────────────────
        $savingsRate = $monthlyIncome > 0 ? round((($monthlyIncome - $totalDebit / max(1, now()->month)) / $monthlyIncome) * 100) : 0;
        $topCategory = $bankAccount
            ? $bankAccount->transactions()->where('type', 'debit')->selectRaw('category, SUM(amount) as total')->groupBy('category')->orderByDesc('total')->first()
            : null;

        $insights = [
            ['icon' => '💡', 'title' => 'Savings Rate', 'message' => $savingsRate >= 20 ? "Great job! You're saving {$savingsRate}% of your income." : "Try to save at least 20% of your income. Currently at {$savingsRate}%."],
            ['icon' => '📊', 'title' => 'Top Spending', 'message' => $topCategory ? "Your highest spending category is '{$topCategory->category}' at " . number_format($topCategory->total, 2) . ' MAD.' : 'No spending data yet. Start tracking your expenses.'],
            // ['icon' => '🎯', 'title' => 'Smart Tip', 'message' => $balance > $monthlyIncome * 3 ? 'You have a healthy emergency fund. Consider investing the surplus.' : 'Build an emergency fund of 3× your monthly income for financial security.'],
        ];

        // ── Goals (static demo — replace with DB model when ready) ────
        $goals = [
            ['id' => 1, 'name' => 'Emergency Fund',  'icon' => '🛡️', 'target' => 10000, 'saved' => min($balance * 0.4, 10000), 'color' => '#E8632A'],
            ['id' => 2, 'name' => 'Vacation',         'icon' => '✈️', 'target' => 5000,  'saved' => min($balance * 0.15, 5000), 'color' => '#3B82F6'],
            ['id' => 3, 'name' => 'New Laptop',       'icon' => '💻', 'target' => 8000,  'saved' => min($balance * 0.1, 8000),  'color' => '#8B5CF6'],
        ];

        // ── Saving Challenges ─────────────────────────────────────────
        $challenges = $user->savingChallenges()->latest()->get()->map(function ($c) {

            $daysTotal = max(1, $c->start_date->diffInDays($c->end_date));
            $daysPassed = $c->start_date->diffInDays(now());
            $daysLeft = max(0, $c->end_date->diffInDays(now(), false));

            $progress = $c->target_amount > 0
                ? ($c->saved_amount / $c->target_amount) * 100
                : 0;

            return [
                'id' => $c->id,
                'name'      => $c->name ,
                'days_left' => $daysLeft,
                'progress' => round(min($progress , 100)),
                'reward' => number_format($c->saved_amount , 2) . ' Mad saved' ,
            ];
        });

        // ── Auto-Saving ───────────────────────────────────────────────
        $autoSaving = [
            'enabled'     => true,
            'rule'        => 'Round-up every transaction',
            'saved_month' => round($totalDebit * 0.03, 2),
            'saved_total' => round($totalDebit * 0.08, 2),
        ];

        return Inertia::render('dashboard', [
            'auth' => [
                'user' => $user->load(['profile', 'bankAccount', 'financialProfile']),
            ],
            'transactions'  => $transactions,
            'summary'       => ['total_credit' => $totalCredit, 'total_debit' => $totalDebit],
            'goals'         => $goals,
            'challenges'    => $challenges,
            'auto_saving'   => $autoSaving,
            'ai_insights'   => $insights,
            'smart_alerts'  => $alerts,
        ]);
    }


    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->withErrors([
                'user' => 'You cannot delete your own account.',
            ]);
        }

        DB::transaction(function () use ($user) {

            if ($user->bankAccount) {
                $user->bankAccount->transactions()->delete();
                $user->bankAccount->delete();
            }

            $user->profile()?->delete();
            $user->financialProfile()?->delete();

            $user->delete(); //
        });

        return back()->with('success', 'User deleted successfully.');
    }
}
