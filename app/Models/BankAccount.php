<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankAccount extends Model
{
    protected $fillable = [
        'user_id',
        'account_number',
        'rip',
        'account_type',
        'balance',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }


    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (BankAccount $account) {
            $account->account_number = 'MA' . str_pad(random_int(1, 999999999), 9, '0', STR_PAD_LEFT);
            $account->rip            = '007' . str_pad(random_int(1, 9999999999999), 13, '0', STR_PAD_LEFT);
        });
    }
}
