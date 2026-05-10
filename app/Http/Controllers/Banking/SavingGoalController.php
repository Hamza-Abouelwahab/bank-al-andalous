<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavingGoalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'target_amount' => 'required|numeric|min:100',
            'end_date' => 'required|date|after:today',
            'saving_type' => 'required|in:auto_saving,challenge,smart_suggestion,group_saving',
        ]);

        $daysLeft = now()->diffInDays($validated['end_date']);
        $dailyAmount = $daysLeft > 0
            ? $validated['target_amount'] / $daysLeft
            : $validated['target_amount'];

        $account = Auth::user()->bankAccount;

        if (!$account) {
            return back()->withErrors([
                'target_amount' => 'No bank account found.',
            ]);
        }

        $maxDailySaving = $account->balance * 0.20;

        if ($dailyAmount > $maxDailySaving) {
            return back()->withErrors([
                'end_date' => 'Daily saving is too high for your current balance. Please choose a longer deadline or a smaller target amount.',
            ]);
        }

        SavingGoal::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'target_amount' => $validated['target_amount'],
            'saved_amount' => 0,
            'daily_amount' => $dailyAmount,
            'saving_type' => $validated['saving_type'],
            'start_date' => now(),
            'end_date' => $validated['end_date'],
            'status' => 'active',
            'color' => '#E8632A',
        ]);

        NotificationService::create(
            userId: Auth::id(),
            title: 'Saving Goal Created',
            message: 'Your saving goal "' . $validated['name'] . '" has been created successfully.',
            type: 'saving',
            icon: 'target',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Saving goal created successfully.');
    }

    public function runAutoSavingForGoal(SavingGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        if ($goal->saving_type !== 'auto_saving') {
            return back()->withErrors([
                'goal' => 'This goal is not an auto saving goal.',
            ]);
        }

        if ($goal->status !== 'active') {
            return back()->withErrors([
                'goal' => 'This goal is paused. Resume it first.',
            ]);
        }

        $account = Auth::user()->bankAccount;

        if (!$account) {
            return back()->withErrors([
                'account' => 'No bank account found.',
            ]);
        }

        $remaining = $goal->target_amount - $goal->saved_amount;
        $amountToSave = min($goal->daily_amount, $remaining);

        if ($amountToSave <= 0) {
            $goal->update([
                'saved_amount' => $goal->target_amount,
                'status' => 'completed',
            ]);

            NotificationService::create(
                userId: Auth::id(),
                title: 'Saving Goal Completed! 🎉',
                message: 'Congratulations! You completed your "' . $goal->name . '" saving goal.',
                type: 'saving',
                icon: 'check-circle',
                actionUrl: '/savings/index'
            );

            return back()->with('success', 'Goal completed.');
        }

        if ($account->balance < $amountToSave) {
            $goal->update([
                'status' => 'paused',
            ]);

            return back()->withErrors([
                'balance' => 'Your balance is too low. This goal has been paused until you add money and resume it.',
            ]);
        }

        $account->balance -= $amountToSave;
        $account->save();

        $goal->saved_amount += $amountToSave;

        if ($goal->saved_amount >= $goal->target_amount) {
            $goal->saved_amount = $goal->target_amount;
            $goal->status = 'completed';

            NotificationService::create(
                userId: Auth::id(),
                title: 'Saving Goal Completed! 🎉',
                message: 'Congratulations! You completed your "' . $goal->name . '" saving goal.',
                type: 'saving',
                icon: 'check-circle',
                actionUrl: '/savings/index'
            );
        } else {
            NotificationService::create(
                userId: Auth::id(),
                title: 'Daily Saving Deducted',
                message: number_format($amountToSave, 2) . ' MAD saved for "' . $goal->name . '". Keep going!',
                type: 'saving',
                icon: 'target',
                actionUrl: '/savings/index'
            );
        }

        $goal->save();

        return back()->with('success', 'Daily saving simulated successfully.');
    }

    public function smartSuggestion(SavingGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $account = Auth::user()->bankAccount;

        if (!$account) {
            return back()->withErrors([
                'account' => 'No bank account found.',
            ]);
        }

        $remaining = $goal->target_amount - $goal->saved_amount;
        $daysLeft = now()->diffInDays($goal->end_date, false);

        if ($remaining <= 0) {
            $goal->update([
                'saved_amount' => $goal->target_amount,
                'status' => 'completed',
            ]);

            return back()->with('success', 'Goal completed 🎉');
        }

        if ($daysLeft <= 0) {
            return back()->withErrors([
                'goal' => 'Deadline has passed. Please create a new plan.',
            ]);
        }

        $suggestedDaily = $remaining / $daysLeft;
$safeDaily = $account->balance * 0.20;

if ($suggestedDaily > $safeDaily) {
    return back()->withErrors([
        'goal' => 'Smart suggestion: your daily saving is too high. Try extending the deadline or reducing the target.',
    ]);
}

$suggestedDaily = round($suggestedDaily, 2);

$goal->update([
    'daily_amount' => $suggestedDaily,
]);

return back()->with(
    'success',
    'Smart plan applied: ' . number_format($suggestedDaily, 2) .
    ' MAD/day based on your balance and deadline.'
);
    }

    public function destroy(SavingGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $goal->delete();

        return back()->with('success', 'Goal deleted successfully.');
    }
    public function pause(SavingGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $goal->update([
            'status' => 'paused',
        ]);

        NotificationService::create(
            userId: Auth::id(),
            title: 'Saving Goal Paused',
            message: 'Your saving goal "' . $goal->name . '" has been paused.',
            type: 'saving',
            icon: 'alert-circle',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Goal paused successfully.');
    }

    public function resume(SavingGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $goal->update([
            'status' => 'active',
        ]);

        NotificationService::create(
            userId: Auth::id(),
            title: 'Saving Goal Resumed',
            message: 'Your saving goal "' . $goal->name . '" has been resumed.',
            type: 'saving',
            icon: 'target',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Goal resumed successfully.');
    }
    public function addProgress(SavingGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        if ($goal->saving_type !== 'challenge') {
            return back()->withErrors([
                'goal' => 'This is not a challenge goal.',
            ]);
        }

        $account = Auth::user()->bankAccount;

        if (!$account) {
            return back()->withErrors([
                'account' => 'No bank account found.',
            ]);
        }

        $amount =  request()->validate([
            'amount' => 'required|numeric|min:10|max:5000',
            [
                'amount.min' => 'Minimum amount is 10 MAD',
                'amount.required' => 'Amount is required',
                'amount.numeric' => 'Amount must be a number',
            ]
        ])['amount'];

        if ($account->balance < $amount) {
            return back()->withErrors([
                'balance' => 'Not enough balance.',
            ]);
        }

        $remaining = $goal->target_amount - $goal->saved_amount;
        $amountToAdd = min($amount, $remaining);

        $account->balance -= $amountToAdd;
        $account->save();

        $goal->saved_amount += $amountToAdd;

        if ($goal->saved_amount >= $goal->target_amount) {
            $goal->saved_amount = $goal->target_amount;
            $goal->status = 'completed';

            NotificationService::create(
                userId: Auth::id(),
                title: 'Challenge Completed! 🎉',
                message: 'Congratulations! You completed your "' . $goal->name . '" challenge.',
                type: 'saving',
                icon: 'check-circle',
                actionUrl: '/savings/index'
            );
        } else {
            NotificationService::create(
                userId: Auth::id(),
                title: 'Challenge Progress Added',
                message: number_format($amountToAdd, 2) . ' MAD added to "' . $goal->name . '". Keep it up!',
                type: 'saving',
                icon: 'target',
                actionUrl: '/savings/index'
            );
        }

        $goal->save();

        return back()->with('success', 'Progress added to challenge.');
    }
}
