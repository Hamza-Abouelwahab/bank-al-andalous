<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanSimulation extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'months',
        'interest_rate',
        'monthly_payment',
        'total_payment',
        'total_interest',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
