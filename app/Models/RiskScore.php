<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiskScore extends Model
{
    protected $fillable = [
        'user_id',
        'score',
        'level',
        'identity_score',
        'security_score',
        'transaction_score',
        'loan_score',
        'saving_score',
        'flags',
        'recommendations',
        'calculated_at',
    ];

    protected $casts = [
        'flags' => 'array',
        'recommendations' => 'array',
        'calculated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}