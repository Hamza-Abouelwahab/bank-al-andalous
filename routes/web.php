<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Onboarding\ProfileController;
use App\Http\Controllers\Onboarding\BankController;
use App\Http\Controllers\Onboarding\ConfirmController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Onboarding routes
Route::middleware(['auth'])->group(function () {
    Route::get('/onboarding/profile', [ProfileController::class, 'create'])->name('onboarding.profile');
    Route::post('/onboarding/profile', [ProfileController::class, 'store'])->name('onboarding.profile.store');

    Route::get('/onboarding/bank', [BankController::class, 'create'])->name('onboarding.bank');
    Route::post('/onboarding/bank', [BankController::class, 'store'])->name('onboarding.bank.store');

    Route::get('/onboarding/confirm', [ConfirmController::class, 'create'])->name('onboarding.confirm');
    Route::post('/onboarding/confirm', [ConfirmController::class, 'store'])->name('onboarding.confirm.store');
});

// Main app — remove the first dashboard, keep only this one
Route::middleware(['auth', 'verified', 'onboarding'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

// admin route 

Route::middleware(['auth', 'admin'])->group(function () {
    Route::inertia('/admin', 'Admin/Dashboard')->name('admin.dashboard');
});

Route::middleware(['auth'])->get('/account', [AccountController::class, 'show'])
    ->name('account.show');



require __DIR__ . '/settings.php';
