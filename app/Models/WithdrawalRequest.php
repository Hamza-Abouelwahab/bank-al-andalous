<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WithdrawalRequest extends Model
{
    protected $fillable = [
        'user_id',
        'bank_account_id',
        'amount',
        'pin_code',
        'reference',
        'expires_at',
        'used_at',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    public function bankAccount()
    {
        return $this->belongsTo(\App\Models\BankAccount::class);
    }

    public static function generateReference(): string
    {
        do {
            $reference = 'CWD-' . now()->format('Ymd') . '-' . random_int(100000, 999999);
        } while (self::where('reference', $reference)->exists());

        return $reference;
    }
}
