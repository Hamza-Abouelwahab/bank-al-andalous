<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class SavingGroup extends Model
{
    protected $fillable = [
        'name',
        'amount',
        'max_members',
        'current_members',
        'owner_id',
        'start_date',
        'cycle_days',
        'current_winner_id',
        'next_draw_date',
        'status',
        'visibility',
        'bank_sponsored',
        'bank_fee_percent',
        'group_code',
    ];

    protected $casts = [
        'bank_sponsored' => 'boolean',
        'start_date'     => 'date',
        'next_draw_date' => 'date',
    ];

    public function members()
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function currentWinner()
    {
        return $this->belongsTo(User::class, 'current_winner_id');
    }

    public function joinRequests()
    {
        return $this->hasMany(GroupJoinRequest::class, 'group_id');
    }

    public function pendingRequests()
    {
        return $this->hasMany(GroupJoinRequest::class, 'group_id')
            ->where('status', 'pending')
            ->where('type', 'request');
    }

    public function pendingInvitations()
    {
        return $this->hasMany(GroupJoinRequest::class, 'group_id')
            ->where('status', 'pending')
            ->where('type', 'invitation');
    }
    protected static function booted()
    {
        static::creating(function ($group) {
            do {
                $code = random_int(100000, 999999);
            } while (self::where('group_code', $code)->exists());

            $group->group_code = $code;
        });
    }

    /**
     * Check if the group should activate, be bank-sponsored, or be cancelled.
     * Called on page load and after a member joins.
     */
    public function checkReadiness(): void
    {
        if ($this->status !== 'waiting' || ! $this->start_date) {
            return;
        }

        if (Carbon::today()->lt(Carbon::parse($this->start_date))) {
            return;
        }

        $missing = $this->max_members - $this->current_members;

        if ($missing === 0) {
            // Case A — full group, start normally
            $this->update([
                'status'         => 'active',
                'next_draw_date' => Carbon::parse($this->start_date)->addDays($this->cycle_days)->toDateString(),
            ]);
        } elseif ($missing === 1) {
            // Case B — bank fills the last seat
            $this->update([
                'status'            => 'active',
                'bank_sponsored'    => true,
                'bank_fee_percent'  => 5,
                'current_members'   => $this->max_members,
                'next_draw_date'    => Carbon::parse($this->start_date)->addDays($this->cycle_days)->toDateString(),
            ]);
        } else {
            // Case C — not enough members, cancel
            $this->update(['status' => 'cancelled']);
        }
    }

    /**
     * Return the next real member eligible to receive the pot (rotation order).
     * The bank is never a receiver.
     */
    public function currentReceiver(): ?array
    {
        if ($this->status !== 'active') {
            return null;
        }

        // If there's already a current winner set, return them
        if ($this->current_winner_id && $this->currentWinner) {
            return [
                'id'   => $this->currentWinner->id,
                'name' => $this->currentWinner->name,
            ];
        }

        // Otherwise, find the next eligible member who hasn't won yet
        $member = $this->members()
            ->where('has_won', false)
            ->orderBy('id')
            ->with('user')
            ->first();

        return $member && $member->user
            ? ['id' => $member->user->id, 'name' => $member->user->name]
            : null;
    }
}
