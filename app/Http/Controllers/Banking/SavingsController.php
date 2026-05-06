<?php

namespace App\Http\Controllers\Banking;

use App\Models\GroupJoinRequest;
use App\Models\SavingGroup;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class SavingsController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // User's groups (groups they are a member of)
        $userGroups = SavingGroup::with(['members.user', 'currentWinner', 'pendingRequests.user', 'pendingInvitations.user'])
            ->whereHas('members', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get()
            ->each(fn($g) => $g->checkReadiness())
            ->map(function ($group) use ($user) {
                $data = $this->mapGroupData($group, $user);
                
                // Add pending requests if user is owner
                if ($group->owner_id === $user->id) {
                    $data['pending_requests'] = $group->pendingRequests->map(fn($req) => [
                        'id'           => $req->id,
                        'user_id'      => $req->user_id,
                        'user_name'    => $req->user?->name ?? 'Unknown',
                        'requested_at' => $req->requested_at?->toDateTimeString(),
                    ]);
                    $data['pending_invitations'] = $group->pendingInvitations->map(fn($req) => [
                        'id'           => $req->id,
                        'user_id'      => $req->user_id,
                        'user_name'    => $req->user?->name ?? 'Unknown',
                        'requested_at' => $req->requested_at?->toDateTimeString(),
                    ]);
                }
                
                return $data;
            });

        // Available groups (public, not full, user is not a member, status = waiting)
        $availableGroups = SavingGroup::with(['members.user', 'joinRequests' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->where('visibility', 'public')
            ->where('status', 'waiting')
            ->whereColumn('current_members', '<', 'max_members')
            ->whereDoesntHave('members', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get()
            ->each(fn($g) => $g->checkReadiness())
            ->map(function ($group) use ($user) {
                $data = $this->mapGroupData($group, $user);
                
                // Add request status for current user
                $userRequest = $group->joinRequests->first();
                $data['user_request_status'] = $userRequest ? $userRequest->status : null;
                
                return $data;
            });

        // Pending invitations for current user
        $pendingInvitations = GroupJoinRequest::with(['group.owner'])
            ->where('user_id', $user->id)
            ->where('type', 'invitation')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($inv) => [
                'id'                => $inv->id,
                'group_id'          => $inv->group_id,
                'group_name'        => $inv->group?->name ?? 'Unknown',
                'owner_name'        => $inv->group?->owner?->name ?? 'Unknown',
                'amount'            => $inv->group?->amount ?? 0,
                'max_members'       => $inv->group?->max_members ?? 0,
                'current_members'   => $inv->group?->current_members ?? 0,
                'start_date'        => $inv->group?->start_date?->toDateString(),
                'cycle_days'        => $inv->group?->cycle_days ?? 0,
                'requested_at'      => $inv->requested_at?->toDateTimeString(),
            ]);

        return Inertia::render('Banking/Savings/Index', [
            'goals'              => $user->savingGoals()->latest()->get(),
            'challenges'         => $user->savingChallenges()->latest()->get(),
            'groups'             => $userGroups,
            'availableGroups'    => $availableGroups,
            'pendingInvitations' => $pendingInvitations,
            'autoSaving'         => [
                'enabled'     => true,
                'rule'        => 'Round-up every transaction',
                'saved_month' => 0,
            ],
        ]);
    }

    private function mapGroupData($group, $user)
    {
        $totalPot     = $group->amount * $group->max_members;
        $bankFee      = $group->bank_sponsored
            ? round($totalPot * ($group->bank_fee_percent / 100), 2)
            : 0;
        $winnerAmount = $totalPot - $bankFee;

        $currentReceiver = $group->currentReceiver();
        $nextDrawDate    = $group->next_draw_date
            ? Carbon::parse($group->next_draw_date)
            : null;
        $startDate       = $group->start_date
            ? Carbon::parse($group->start_date)
            : null;
        $daysRemaining   = $nextDrawDate
            ? max(0, (int) Carbon::today()->diffInDays($nextDrawDate, false))
            : null;

        return [
            'id'                    => $group->id,
            'name'                  => $group->name,
            'amount'                => $group->amount,
            'max_members'           => $group->max_members,
            'current_members'       => $group->current_members,
            'status'                => $group->status ?? 'waiting',
            'visibility'            => $group->visibility ?? 'private',
            'group_code'            => $group->group_code,
            'owner_id'              => $group->owner_id,
            'is_owner'              => $group->owner_id === $user->id,
            'start_date'            => $group->start_date?->toDateString(),
            'next_draw_date'        => $nextDrawDate?->toDateString(),
            'cycle_days'            => $group->cycle_days,
            'total_pot'             => $totalPot,
            'bank_sponsored'        => (bool) $group->bank_sponsored,
            'bank_fee_percent'      => $group->bank_fee_percent,
            'bank_fee'              => $bankFee,
            'winner_amount'         => $winnerAmount,
            'is_member'             => $group->members()->where('user_id', $user->id)->exists(),
            'members'               => $group->members->map(fn($m) => [
                'id'      => $m->id,
                'name'    => $m->user?->name ?? 'Unknown',
                'has_won' => (bool) $m->has_won,
            ]),
            'current_winner'        => $group->currentWinner
                ? ['id' => $group->currentWinner->id, 'name' => $group->currentWinner->name]
                : null,
            // Rotation / draw timeline
            'current_receiver'      => $currentReceiver,
            'current_receiver_name' => $currentReceiver['name'] ?? null,
            'draw_start_date'       => $startDate?->toDateString(),
            'draw_end_date'         => $nextDrawDate?->toDateString(),
            'days_remaining'        => $daysRemaining,
        ];
    }
}
