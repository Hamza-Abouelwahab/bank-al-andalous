<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingChallenge extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'target_amount',
        'saved_amount',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'saved_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}

