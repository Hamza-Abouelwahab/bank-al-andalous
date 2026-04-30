<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'bank_account_id',
        'type',
        'category',
        'amount',
        'balance_after',
        'description',
        'reference',
        'recipient_account',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'amount'        => 'decimal:2',
            'balance_after' => 'decimal:2',
        ];
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    // Helper to generate unique reference
    public static function generateReference(string $prefix): string
    {
        return strtoupper($prefix) . '-' . strtoupper(uniqid());
    }
}
