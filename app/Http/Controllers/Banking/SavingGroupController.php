<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\GroupMember;
use App\Models\SavingGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavingGroupController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'amount'      => 'required|numeric|min:10',
            'max_members' => 'required|integer|min:2|max:12',
            'start_date'  => 'required|date|after_or_equal:today',
            'cycle_days'  => 'required|integer|in:15,30',
        ]);
        $totalPot = $validated['amount'] * $validated['max_members'];

        if ($totalPot < 3000) {
            return back()->withErrors([
                'amount' => 'The group total pot must be at least 3000 MAD.',
            ]);
        }

        $group = SavingGroup::create([
            'name'             => $validated['name'],
            'amount'           => $validated['amount'],
            'max_members'      => $validated['max_members'],
            'current_members'  => 1,
            'owner_id'         => Auth::id(),
            'start_date'       => $validated['start_date'],
            'cycle_days'       => $validated['cycle_days'],
            'status'           => 'waiting',
            'bank_sponsored'   => false,
            'bank_fee_percent' => 0,
        ]);

        GroupMember::create([
            'group_id' => $group->id,
            'user_id'  => Auth::id(),
            'has_won'  => false,
        ]);

        return back()->with('success', 'Group created successfully.');
    }

    public function join(SavingGroup $group)
    {
        if ($group->status === 'cancelled') {
            return back()->withErrors(['group' => 'This group has been cancelled.']);
        }

        if ($group->status !== 'waiting') {
            return back()->withErrors(['group' => 'This group is no longer accepting members.']);
        }

        if ($group->current_members >= $group->max_members) {
            return back()->withErrors(['group' => 'Group is full.']);
        }

        if ($group->members()->where('user_id', Auth::id())->exists()) {
            return back()->withErrors(['group' => 'You are already in this group.']);
        }

        $group->members()->create([
            'user_id' => Auth::id(),
            'has_won' => false,
        ]);

        $group->increment('current_members');
        $group->refresh();
        $group->checkReadiness();

        return back()->with('success', 'Joined group successfully.');
    }

    public function draw(SavingGroup $group)
    {
        if ($group->status !== 'active') {
            return back()->withErrors(['group' => 'Group is not active.']);
        }

        $members = $group->members()->where('has_won', false)->orderBy('id')->get();

        if ($members->isEmpty()) {
            $group->update(['status' => 'completed']);
            return back()->with('success', 'All members have received their turn. Group completed!');
        }

        $winner       = $members->first();
        $totalPot     = $group->amount * $group->max_members;
        $bankFee      = $group->bank_sponsored
            ? round($totalPot * ($group->bank_fee_percent / 100), 2)
            : 0;
        $winnerAmount = $totalPot - $bankFee;

        $winner->update(['has_won' => true]);

        $account = $winner->user->bankAccount;
        $account->balance += $winnerAmount;
        $account->save();

        $remaining = $group->members()->where('has_won', false)->count();

        $group->update(
            $remaining === 0
                ? ['status' => 'completed', 'current_winner_id' => $winner->user_id]
                : [
                    'current_winner_id' => $winner->user_id,
                    'next_draw_date'    => now()->addDays($group->cycle_days)->toDateString(),
                ]
        );

        return back()->with('success', '🎉 ' . $winner->user->name . ' receives ' . $winnerAmount . ' MAD');
    }
}
