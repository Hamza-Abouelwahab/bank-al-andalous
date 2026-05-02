<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Onboarding\ProfileController;
use App\Http\Controllers\Onboarding\BankController;
use App\Http\Controllers\Onboarding\ConfirmController;
use App\Http\Controllers\Banking\WithdrawController;
use App\Http\Controllers\Banking\DepositController;
use App\Http\Controllers\Banking\TransferController;
use App\Http\Controllers\Banking\BillController;
use App\Http\Controllers\Banking\TransactionController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Onboarding
Route::middleware(['auth'])->group(function () {
    Route::get('/onboarding/profile',  [ProfileController::class, 'create'])->name('onboarding.profile');
    Route::post('/onboarding/profile', [ProfileController::class, 'store'])->name('onboarding.profile.store');

    Route::get('/onboarding/bank',     [BankController::class, 'create'])->name('onboarding.bank');
    Route::post('/onboarding/bank',    [BankController::class, 'store'])->name('onboarding.bank.store');

    Route::get('/onboarding/confirm',  [ConfirmController::class, 'create'])->name('onboarding.confirm');
    Route::post('/onboarding/confirm', [ConfirmController::class, 'store'])->name('onboarding.confirm.store');
});

// User dashboard
Route::middleware(['auth', 'verified', 'onboarding'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::inertia('/admin', 'Admin/Dashboard')->name('admin.dashboard');
    Route::delete('/admin/users/{user}', [DashboardController::class, 'destroy'])->name('admin.users.destroy');
});

// Account card
Route::middleware(['auth'])->get('/account', [AccountController::class, 'show'])->name('account.show');

// Banking
Route::middleware(['auth', 'onboarding'])->group(function () {
    Route::get('/withdraw',     [WithdrawController::class,    'create'])->name('withdraw');
    Route::post('/withdraw',    [WithdrawController::class,    'store'])->name('withdraw.store');

    Route::get('/deposit',      [DepositController::class,     'create'])->name('deposit');
    Route::post('/deposit',     [DepositController::class,     'store'])->name('deposit.store');

    Route::get('/transfer',     [TransferController::class,    'create'])->name('transfer');
    Route::post('/transfer',    [TransferController::class,    'store'])->name('transfer.store');

    Route::get('/bills',        [BillController::class,        'create'])->name('bills');
    Route::post('/bills',       [BillController::class,        'store'])->name('bills.store');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions');
});

require __DIR__ . '/settings.php';