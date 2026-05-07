<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\BankAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Appointment;
use App\Models\Transaction;




class DashboardController extends Controller
{
    

    public function index()
    {
        $user = Auth::user();


        if ($user->role === 'admin') {
            $appointments = Appointment::query()
                ->with(['user.profile', 'user.bankAccount'])
                ->whereIn('status', ['pending', 'confirmed'])
                ->where(function ($query) {
                    $query->whereDate('date', '>', now()->toDateString())
                        ->orWhere(function ($query) {
                            $query->whereDate('date', now()->toDateString())
                                ->whereTime('time', '>=', now()->format('H:i'));
                        });
                })
                ->orderBy('date')
                ->orderBy('time')
                ->get();

            return Inertia::render('Admin/Dashboard', [
                'auth' => [
                    'user' => $user,
                ],

                'users' => User::with(['bankAccount', 'profile'])
                    ->latest()
                    ->get(),

                'appointments' => $appointments,

                'stats' => [
                    'total_users' => User::count(),
                    'total_accounts' => BankAccount::count(),
                    'total_balance' => BankAccount::sum('balance'),
                    'total_transactions' => Transaction::count(),
                    'future_appointments' => $appointments->count(),
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
        $account = auth()->user()->bankAccount;
        $goals = auth()->user()->savingGoals;
        $recentTransactions = $bankAccount
            ? $bankAccount->transactions()->latest()->take(5)->get()
            : collect();

        $alerts = [];

        if ($account && $account->balance < 3000) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'Low balance alert',
                'message' => 'Your balance is getting low. Try to keep enough funds for your goals.',
                'icon' => 'wallet',
            ];
        }

        if ($goals->count() === 0) {
            $alerts[] = [
                'type' => 'suggestion',
                'title' => 'No active saving goals',
                'message' => 'Create a saving goal to start tracking your progress.',
                'icon' => 'target',
            ];
        }

        $largeTransaction = $recentTransactions->firstWhere('amount', '>=', 5000);

        if ($largeTransaction) {
            $alerts[] = [
                'type' => 'security',
                'title' => 'Large transaction detected',
                'message' => 'A large transaction was recently made on your account.',
                'icon' => 'shield',
            ];
        }

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
        $goals = $user->savingGoals()->latest()->get()->map(function ($goal) {

            return [
                'id' => $goal->id,
                'end_date' => optional($goal->end_date)->toDateString(),
                'name' => $goal->name,
                'target' => $goal->target_amount,
                'saved' => $goal->saved_amount,
                'saving_type' => $goal->saving_type,
                'daily_amount' => $goal->daily_amount,
                'status' => $goal->status,
                'color' => $goal->color,
                'progress' => $goal->target_amount > 0
                    ? round(($goal->saved_amount / $goal->target_amount) * 100)
                    : 0,
                'days_left' => $goal->end_date
                    ? now()->diffInDays($goal->end_date, false)
                    : 0,
            ];
        });

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
                'name'      => $c->name,
                'days_left' => $daysLeft,
                'progress' => round(min($progress, 100)),
                'reward' => number_format($c->saved_amount, 2) . ' Mad saved',
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
            'alerts' => $alerts,
        ]);
    }


    public function users()
    {
        $users = User::query()
            ->with(['bankAccount', 'profile'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Users', [
            'auth' => [
                'user' => Auth::user(),
            ],

            'users' => $users,

            'stats' => [
                'total_users' => User::count(),
                'total_accounts' => BankAccount::count(),
                'total_balance' => BankAccount::sum('balance'),
            ],
        ]);
    }

    public function appointments()
    {
        $appointments = Appointment::query()
            ->with(['user.profile', 'user.bankAccount'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) {
                $query->whereDate('date', '>', now()->toDateString())
                    ->orWhere(function ($query) {
                        $query->whereDate('date', now()->toDateString())
                            ->whereTime('time', '>=', now()->format('H:i'));
                    });
            })
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return Inertia::render('Admin/Appointments', [
            'auth' => [
                'user' => Auth::user(),
            ],

            'appointments' => $appointments,

            'stats' => [
                'future_appointments' => $appointments->count(),
                'pending_appointments' => $appointments->where('status', 'pending')->count(),
                'confirmed_appointments' => $appointments->where('status', 'confirmed')->count(),
            ],
        ]);
    }

    public function security()
    {
        return Inertia::render('Admin/Security', [
            'auth' => [
                'user' => Auth::user(),
            ],

            'stats' => [
                'failed_logins' => 0,
                'locked_accounts' => 0,
                'large_transfers' => 0,
                'suspicious_reports' => 0,
            ],
        ]);
    }


    public function destroy(User $user)
    {
        if (Auth::id() === $user->id) {
            return back()->withErrors([
                'user' => 'You cannot delete your own account.',
            ]);
        }

        if ($user->role === 'admin') {
            return back()->withErrors([
                'user' => 'You cannot delete another admin.',
            ]);
        }

        DB::transaction(function () use ($user) {
            $user->appointments()->delete();

            if ($user->bankAccount) {
                $user->bankAccount->transactions()->delete();
                $user->bankAccount->delete();
            }

            $user->profile()?->delete();
            $user->financialProfile()?->delete();

            $user->delete();
        });

        return back()->with('success', 'User deleted successfully.');
    }
}
