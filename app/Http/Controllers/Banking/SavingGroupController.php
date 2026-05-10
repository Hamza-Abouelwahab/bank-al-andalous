<?php

namespace App\Http\Controllers\Banking;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\GroupJoinRequest;
use App\Models\GroupMember;
use App\Models\SavingGroup;
use App\Services\NotificationService;
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
            'cycle_days'  => 'required|integer|in:7,15,30',
            'visibility'  => 'required|string|in:public,private',
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
            'visibility'       => $validated['visibility'],
            'bank_sponsored'   => false,
            'bank_fee_percent' => 0,
        ]);

        GroupMember::create([
            'group_id' => $group->id,
            'user_id'  => Auth::id(),
            'has_won'  => false,
        ]);

        NotificationService::create(
            userId: Auth::id(),
            title: 'Group Saving Created',
            message: 'Your group "' . $validated['name'] . '" has been created successfully.',
            type: 'group',
            icon: 'users',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Group created successfully.');
    }

    public function requestJoin(SavingGroup $group)
    {
        if ($group->visibility !== 'public') {
            return back()->withErrors(['group' => 'This group is private.']);
        }

        if ($group->status !== 'waiting') {
            return back()->withErrors(['group' => 'This group is no longer accepting requests.']);
        }

        if ($group->current_members >= $group->max_members) {
            return back()->withErrors(['group' => 'Group is full.']);
        }

        if ($group->members()->where('user_id', Auth::id())->exists()) {
            return back()->withErrors(['group' => 'You are already in this group.']);
        }

        if ($group->joinRequests()->where('user_id', Auth::id())->exists()) {
            return back()->withErrors(['group' => 'You already have a pending request for this group.']);
        }

        GroupJoinRequest::create([
            'group_id'     => $group->id,
            'user_id'      => Auth::id(),
            'type'         => 'request',
            'status'       => 'pending',
            'requested_at' => now(),
        ]);

        NotificationService::create(
            userId: $group->owner_id,
            title: 'New Join Request',
            message: Auth::user()->name . ' wants to join your group "' . $group->name . '".',
            type: 'group',
            icon: 'users',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Join request sent successfully.');
    }

    public function approveRequest(GroupJoinRequest $request)
    {
        $group = $request->group;

        if ($group->owner_id !== Auth::id()) {
            return back()->withErrors(['group' => 'Only the group owner can approve requests.']);
        }

        if ($request->status !== 'pending') {
            return back()->withErrors(['group' => 'This request has already been processed.']);
        }

        if ($group->status !== 'waiting') {
            return back()->withErrors(['group' => 'Group is no longer accepting members.']);
        }

        if ($group->current_members >= $group->max_members) {
            return back()->withErrors(['group' => 'Group is full.']);
        }

        GroupMember::create([
            'group_id' => $group->id,
            'user_id'  => $request->user_id,
            'has_won'  => false,
        ]);

        $group->increment('current_members');
        $request->update([
            'status'       => 'accepted',
            'responded_at' => now(),
        ]);

        $group->refresh();
        $group->checkReadiness();

        NotificationService::create(
            userId: $request->user_id,
            title: 'Join Request Accepted',
            message: 'Your request to join "' . $group->name . '" has been accepted!',
            type: 'group',
            icon: 'check-circle',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Request approved successfully.');
    }

    public function rejectRequest(GroupJoinRequest $request)
    {
        $group = $request->group;

        if ($group->owner_id !== Auth::id()) {
            return back()->withErrors(['group' => 'Only the group owner can reject requests.']);
        }

        if ($request->status !== 'pending') {
            return back()->withErrors(['group' => 'This request has already been processed.']);
        }

        $request->update([
            'status'       => 'rejected',
            'responded_at' => now(),
        ]);

        NotificationService::create(
            userId: $request->user_id,
            title: 'Join Request Rejected',
            message: 'Your request to join "' . $group->name . '" has been rejected.',
            type: 'group',
            icon: 'alert-circle',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Request rejected.');
    }

    public function inviteByAccountNumber(Request $request, SavingGroup $group)
    {
        if ($group->owner_id !== Auth::id()) {
            return back()->withErrors(['group' => 'Only the group owner can invite users.']);
        }

        if ($group->visibility !== 'private') {
            return back()->withErrors(['group' => 'Only private groups can invite by account number.']);
        }

        if ($group->status !== 'waiting') {
            return back()->withErrors(['group' => 'Group is no longer accepting members.']);
        }

        if ($group->current_members >= $group->max_members) {
            return back()->withErrors(['group' => 'Group is full.']);
        }

        $validated = $request->validate([
            'account_number' => 'required|string',
        ]);

        $bankAccount = BankAccount::where('account_number', $validated['account_number'])->first();

        if (!$bankAccount) {
            return back()->withErrors(['account_number' => 'Account number not found.']);
        }

        $user = $bankAccount->user;

        if ($group->members()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['account_number' => 'This user is already a member.']);
        }

        if ($group->joinRequests()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['account_number' => 'This user already has a pending invitation.']);
        }

        GroupJoinRequest::create([
            'group_id'     => $group->id,
            'user_id'      => $user->id,
            'type'         => 'invitation',
            'status'       => 'pending',
            'requested_at' => now(),
        ]);

        NotificationService::create(
            userId: $user->id,
            title: 'Group Invitation',
            message: 'You have been invited to join "' . $group->name . '" group.',
            type: 'group',
            icon: 'users',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Invitation sent successfully.');
    }

    public function acceptInvitation(GroupJoinRequest $request)
    {
        if ($request->user_id !== Auth::id()) {
            return back()->withErrors(['invitation' => 'This invitation is not for you.']);
        }

        if ($request->type !== 'invitation') {
            return back()->withErrors(['invitation' => 'This is not an invitation.']);
        }

        if ($request->status !== 'pending') {
            return back()->withErrors(['invitation' => 'This invitation has already been processed.']);
        }

        $group = $request->group;

        if ($group->status !== 'waiting') {
            return back()->withErrors(['invitation' => 'Group is no longer accepting members.']);
        }

        if ($group->current_members >= $group->max_members) {
            return back()->withErrors(['invitation' => 'Group is full.']);
        }

        GroupMember::create([
            'group_id' => $group->id,
            'user_id'  => Auth::id(),
            'has_won'  => false,
        ]);

        $group->increment('current_members');
        $request->update([
            'status'       => 'accepted',
            'responded_at' => now(),
        ]);

        $group->refresh();
        $group->checkReadiness();

        NotificationService::create(
            userId: $group->owner_id,
            title: 'Invitation Accepted',
            message: Auth::user()->name . ' accepted your invitation to join "' . $group->name . '".',
            type: 'group',
            icon: 'check-circle',
            actionUrl: '/savings/index'
        );

        return back()->with('success', 'Invitation accepted successfully.');
    }

    public function declineInvitation(GroupJoinRequest $request)
    {
        if ($request->user_id !== Auth::id()) {
            return back()->withErrors(['invitation' => 'This invitation is not for you.']);
        }

        if ($request->type !== 'invitation') {
            return back()->withErrors(['invitation' => 'This is not an invitation.']);
        }

        if ($request->status !== 'pending') {
            return back()->withErrors(['invitation' => 'This invitation has already been processed.']);
        }

        $request->update([
            'status'       => 'rejected',
            'responded_at' => now(),
        ]);

        return back()->with('success', 'Invitation declined.');
    }

    public function requestByCode(Request $request)
    {
        $validated = $request->validate([
            'group_code' => 'required|string',
        ]);

        // Extract group ID from code (format: SG-{id})
        $group = SavingGroup::where('group_code', $validated['group_code'])->first();

        if (!$group) {
            return back()->withErrors(['group_code' => 'Invalid group code.']);
        }

        if ($group->status !== 'waiting') {
            return back()->withErrors(['group_code' => 'This group is no longer accepting requests.']);
        }

        if ($group->current_members >= $group->max_members) {
            return back()->withErrors(['group_code' => 'Group is full.']);
        }

        if ($group->members()->where('user_id', Auth::id())->exists()) {
            return back()->withErrors(['group_code' => 'You are already in this group.']);
        }

        if ($group->joinRequests()->where('user_id', Auth::id())->exists()) {
            return back()->withErrors(['group_code' => 'You already have a pending request for this group.']);
        }

        GroupJoinRequest::create([
            'group_id'     => $group->id,
            'user_id'      => Auth::id(),
            'type'         => 'request',
            'status'       => 'pending',
            'requested_at' => now(),
        ]);

        return back()->with('success', 'Join request sent successfully.');
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

        NotificationService::create(
            userId: $winner->user_id,
            title: 'You Won the Draw! 🎉',
            message: 'Congratulations! You received ' . number_format($winnerAmount, 2) . ' MAD from "' . $group->name . '".',
            type: 'group',
            icon: 'check-circle',
            actionUrl: '/transactions'
        );

        foreach ($group->members as $member) {
            if ($member->user_id !== $winner->user_id) {
                NotificationService::create(
                    userId: $member->user_id,
                    title: 'Group Draw Completed',
                    message: $winner->user->name . ' won the draw in "' . $group->name . '". Next draw: ' . ($remaining > 0 ? $group->next_draw_date : 'Group completed') . '.',
                    type: 'group',
                    icon: 'users',
                    actionUrl: '/savings/index'
                );
            }
        }

        return back()->with('success', '🎉 ' . $winner->user->name . ' receives ' . $winnerAmount . ' MAD');
    }
}
