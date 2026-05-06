<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'months',
        'interest_rate',
        'monthly_payment',
        'total_payment',
        'total_interest',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
