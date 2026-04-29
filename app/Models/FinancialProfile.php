<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialProfile extends Model
{
    protected $fillable = [
        'user_id',
        'employment_status',
        'occupation',
        'monthly_income',
        'source_of_funds',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
