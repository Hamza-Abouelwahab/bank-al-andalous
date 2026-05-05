<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingGoal extends Model
{
    protected $fillable = [
    'user_id',
    'name',
    'target_amount',
    'saved_amount',
    'daily_amount',
    'saving_type',
    'start_date',
    'end_date',
    'status',
    'color',
];

protected $casts = [
    'target_amount' => 'decimal:2',
    'saved_amount' => 'decimal:2',
    'daily_amount' => 'decimal:2',
    'start_date' => 'date',
    'end_date' => 'date',
];
}
