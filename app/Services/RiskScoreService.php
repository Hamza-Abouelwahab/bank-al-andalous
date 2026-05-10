<?php

namespace App\Services;

use App\Models\User;
use App\Models\RiskScore;

class RiskScoreService
{
    public function calculate(User $user): RiskScore
    {
        $user->load([
            'profile',
            'bankAccount.transactions',
            'financialProfile',
            'savingGoals',
            'loans',
        ]);

        $identityScore = $this->calculateIdentityScore($user);
        $securityScore = $this->calculateSecurityScore($user);
        $transactionScore = $this->calculateTransactionScore($user);
        $loanScore = $this->calculateLoanScore($user);
        $savingScore = $this->calculateSavingScore($user);

        $score = $identityScore
            + $securityScore
            + $transactionScore
            + $loanScore
            + $savingScore;

        $score = max(0, min(100, $score));

        $flags = $this->buildFlags($user, $score);
        $recommendations = $this->buildRecommendations($user, $score);

        return RiskScore::updateOrCreate(
            ['user_id' => $user->id],
            [
                'score' => $score,
                'level' => $this->levelFromScore($score),

                'identity_score' => $identityScore,
                'security_score' => $securityScore,
                'transaction_score' => $transactionScore,
                'loan_score' => $loanScore,
                'saving_score' => $savingScore,

                'flags' => $flags,
                'recommendations' => $recommendations,
                'calculated_at' => now(),
            ]
        );
    }

    private function calculateIdentityScore(User $user): int
    {
        $score = 0;

        if ($user->profile) {
            $score += 10;
        }

        if ($user->profile?->cin) {
            $score += 10;
        }

        if ($user->profile?->phone) {
            $score += 5;
        }

        return min($score, 25);
    }

    private function calculateSecurityScore(User $user): int
    {
        $score = 10;

        if (!empty($user->two_factor_secret)) {
            $score += 15;
        }

        if ($user->email_verified_at) {
            $score += 5;
        }

        return min($score, 25);
    }

    private function calculateTransactionScore(User $user): int
    {
        $account = $user->bankAccount;

        if (!$account) {
            return 0;
        }

        $transactions = $account->transactions ?? collect();

        if ($transactions->isEmpty()) {
            return 10;
        }

        $score = 20;

        $largeWithdrawals = $transactions
            ->whereIn('type', ['withdraw', 'withdrawal'])
            ->where('amount', '>=', 5000)
            ->count();

        if ($largeWithdrawals >= 3) {
            $score -= 10;
        } elseif ($largeWithdrawals >= 1) {
            $score -= 5;
        }

        $failedTransactions = $transactions
            ->whereIn('status', ['failed', 'rejected'])
            ->count();

        if ($failedTransactions >= 3) {
            $score -= 5;
        }

        return max(0, min(20, $score));
    }

    private function calculateLoanScore(User $user): int
    {
        $loans = $user->loans ?? collect();

        if ($loans->isEmpty()) {
            return 15;
        }

        $score = 15;

        $pendingLoans = $loans->where('status', 'pending')->count();
        $rejectedLoans = $loans->where('status', 'rejected')->count();

        if ($pendingLoans >= 2) {
            $score -= 5;
        }

        if ($rejectedLoans >= 1) {
            $score -= 5;
        }

        return max(0, min(15, $score));
    }

    private function calculateSavingScore(User $user): int
    {
        $savingGoals = $user->savingGoals ?? collect();

        if ($savingGoals->isEmpty()) {
            return 5;
        }

        return 15;
    }

    private function levelFromScore(int $score): string
    {
        return match (true) {
            $score >= 90 => 'excellent',
            $score >= 70 => 'low',
            $score >= 50 => 'medium',
            default => 'high',
        };
    }

    private function buildFlags(User $user, int $score): array
    {
        $flags = [];

        if (!$user->profile?->cin) {
            $flags[] = [
                'type' => 'identity_missing',
                'severity' => 'medium',
                'message' => 'CIN verification is incomplete.',
            ];
        }

        if (empty($user->two_factor_secret)) {
            $flags[] = [
                'type' => 'two_factor_disabled',
                'severity' => 'medium',
                'message' => 'Two-factor authentication is not enabled.',
            ];
        }

        if ($score < 50) {
            $flags[] = [
                'type' => 'high_risk_score',
                'severity' => 'high',
                'message' => 'This account requires manual review.',
            ];
        }

        return $flags;
    }

    private function buildRecommendations(User $user, int $score): array
    {
        $recommendations = [];

        if (!$user->profile?->cin) {
            $recommendations[] = 'Complete CIN identity verification.';
        }

        if (empty($user->two_factor_secret)) {
            $recommendations[] = 'Enable two-factor authentication to improve account security.';
        }

        if (($user->savingGoals ?? collect())->isEmpty()) {
            $recommendations[] = 'Create a savings goal to improve financial stability.';
        }

        if ($score < 70) {
            $recommendations[] = 'Keep transactions consistent and avoid repeated large withdrawals.';
        }

        return $recommendations;
    }
}