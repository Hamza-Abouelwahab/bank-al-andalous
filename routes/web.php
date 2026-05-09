<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AIChatController;
use App\Http\Controllers\AppointmentController;
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
use App\Http\Controllers\Banking\SavingGoalController;
use App\Http\Controllers\Banking\SavingGroupController;
use App\Http\Controllers\Banking\TransactionController;
use App\Http\Controllers\Banking\SavingsController;
use App\Http\Controllers\LoanSimulationController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\StatementController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;



Route::get('/two-factor-challenge', function () {
    return Inertia::render('auth/two-factor-challenge');
})->name('two-factor.login');

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// her for chat ai

Route::middleware(['auth'])->group(function () {

    Route::middleware(['onboarding'])->group(function () {

        Route::get('/ai-chat', [AIChatController::class, 'create'])
            ->name('ai-chat');

        Route::post('/ai-chat/ask', [AIChatController::class, 'ask'])
            ->name('ai.chat.ask');
    });
});

// Onboarding
Route::middleware(['auth'])->group(function () {
    Route::get('/onboarding/profile',  [ProfileController::class, 'create'])->name('onboarding.profile');
    Route::post('/onboarding/profile', [ProfileController::class, 'store'])->name('onboarding.profile.store');

    Route::post('/onboarding/profile/scan', [ProfileController::class, 'scan'])
        ->name('onboarding.profile.scan');

    Route::get('/onboarding/bank',     [BankController::class, 'create'])->name('onboarding.bank');
    Route::post('/onboarding/bank',    [BankController::class, 'store'])->name('onboarding.bank.store');

    Route::get('/onboarding/confirm',  [ConfirmController::class, 'create'])->name('onboarding.confirm');
    Route::post('/onboarding/confirm', [ConfirmController::class, 'store'])->name('onboarding.confirm.store');


    // for book an Appointment

    Route::get('/appointments/create', [AppointmentController::class, 'create'])
        ->name('appointments.create');

    Route::post('/appointments', [AppointmentController::class, 'store'])
        ->name('appointments.store');

    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update'])
        ->name('appointments.update');

    Route::middleware(['auth'])->get('/appointments/verify/{token}', [AppointmentController::class, 'verify'])
        ->name('appointments.verify');

    Route::middleware(['auth'])->post('/appointments/check-in/{appointment}', [AppointmentController::class, 'checkIn'])
        ->name('appointments.check-in');
    // for simulation
    // 🔥 Simulation UI
    Route::get('/simulation', function () {
        return Inertia::render('Simulation/Loan');
    });

    // 🔥 Run simulation (API)
    Route::post('/loan/simulate', [LoanSimulationController::class, 'simulate']);

    // 🔥 Apply loan (API)
    Route::post('/loan/apply', [LoanSimulationController::class, 'apply']);

    // 🔥 Simulation history
    Route::get('/loan/history', [LoanSimulationController::class, 'index']);

    // 🔥 Real loans list
    Route::get('/loans', function () {
        return Inertia::render('Simulation/Loans', [
            'loans' => Auth::user()->loans()->latest()->get()
        ]);
    });

    // 🔥 Apply page (optional UI page)
    Route::get('/loan/apply', function () {
        return Inertia::render('Simulation/Apply');
    });
});

// User dashboard
Route::middleware(['auth', 'verified', 'onboarding'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    Route::get('/admin/users', [DashboardController::class, 'users'])
        ->name('admin.users');

    Route::get('/admin/appointments', [DashboardController::class, 'appointments'])
        ->name('admin.appointments');

    Route::get('/admin/security', [DashboardController::class, 'security'])
        ->name('admin.security');

    Route::delete('/admin/users/{user}', [DashboardController::class, 'destroy'])
        ->name('admin.users.destroy');

    Route::get('/deposit', [DepositController::class, 'create'])
        ->name('deposit');

    Route::post('/deposit', [DepositController::class, 'store'])
        ->name('deposit.store');

    Route::post('/deposit/find-customer', [DepositController::class, 'findCustomer'])
        ->name('deposit.find-customer');
});

// Account card
Route::middleware(['auth'])->get('/account', [AccountController::class, 'show'])->name('account.show');

// Banking
Route::middleware(['auth', 'onboarding'])->group(function () {
    Route::get('/account/statement', [StatementController::class, 'download'])
        ->name('account.statement');


    Route::get('/withdraw',     [WithdrawController::class,    'create'])->name('withdraw');
    Route::post('/withdraw',    [WithdrawController::class,    'store'])->name('withdraw.store');
    Route::post('/withdraw/{withdrawalRequest}/cancel', [WithdrawController::class, 'cancel'])
        ->name('withdraw.cancel');
    Route::post('/withdraw/use-code', [WithdrawController::class, 'useCode'])
        ->name('withdraw.use-code');

    Route::get('/transfer',     [TransferController::class,    'create'])->name('transfer');
    Route::post('/transfer',    [TransferController::class,    'store'])->name('transfer.store');

    Route::get('/bills',        [BillController::class,        'create'])->name('bills');
    Route::post('/bills',       [BillController::class,        'store'])->name('bills.store');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions');

    Route::get('savings/index', [SavingsController::class, 'index'])->name('saving.index');
    Route::post('/saving-goals', [SavingGoalController::class, 'store'])->name('saving-goals.store');

    // * auto saving
    Route::post('/saving-goals/{goal}/run-auto-saving', [SavingGoalController::class, 'runAutoSavingForGoal'])
        ->name('saving-goals.run-one');
    // * delete challenge
    Route::delete('/saving-goals/{goal}', [SavingGoalController::class, 'destroy'])
        ->name('saving-goals.destroy');
    // * pause
    Route::post('/saving-goals/{goal}/pause', [SavingGoalController::class, 'pause'])
        ->name('saving-goals.pause');
    // * resume
    Route::post('/saving-goals/{goal}/resume', [SavingGoalController::class, 'resume'])
        ->name('saving-goals.resume');
    // * challenge savinge
    Route::post('/saving-goals/{goal}/add-progress', [SavingGoalController::class, 'addProgress'])
        ->name('saving-goals.add-progress');
    // * smart suggestion
    Route::post('/saving-goals/{goal}/smart-suggestion', [SavingGoalController::class, 'smartSuggestion'])
        ->name('saving-goals.smart-suggestion');
    // * group saving
    Route::post('/saving-groups/{group}/request-join', [SavingGroupController::class, 'requestJoin'])
        ->name('saving-groups.request-join');
    Route::post('/saving-groups/request-by-code', [SavingGroupController::class, 'requestByCode'])
        ->name('saving-groups.request-by-code');
    Route::post('/saving-groups/requests/{request}/approve', [SavingGroupController::class, 'approveRequest'])
        ->name('saving-groups.approve-request');
    Route::post('/saving-groups/requests/{request}/reject', [SavingGroupController::class, 'rejectRequest'])
        ->name('saving-groups.reject-request');
    Route::post('/saving-groups/{group}/invite', [SavingGroupController::class, 'inviteByAccountNumber'])
        ->name('saving-groups.invite');
    Route::post('/saving-groups/requests/{request}/accept-invitation', [SavingGroupController::class, 'acceptInvitation'])
        ->name('saving-groups.accept-invitation');
    Route::post('/saving-groups/requests/{request}/decline-invitation', [SavingGroupController::class, 'declineInvitation'])
        ->name('saving-groups.decline-invitation');
    Route::post('/saving-groups/{group}/draw', [SavingGroupController::class, 'draw'])
        ->name('saving-groups.draw');
    Route::post('/saving-groups', [SavingGroupController::class, 'store'])
        ->name('saving-groups.store');

    Route::middleware(['auth', 'onboarding'])->get('/ai-chat', function () {
        return Inertia::render('Banking/chat/AIChat');
    })->name('ai-chat');
});


// the sepport pages

Route::middleware(['auth'])->group(function () {
    Route::get('/support', [SupportController::class, 'index'])->name('support');
    Route::get('/support/security', [SupportController::class, 'security'])->name('support.security');
    Route::get('/support/locked', [SupportController::class, 'locked'])->name('support.locked');
    Route::get('/support/unlock', [SupportController::class, 'unlock'])->name('support.unlock');
    Route::get('/support/unlocked', [SupportController::class, 'unlocked'])->name('support.unlocked');

    Route::post('/support/report', [SupportController::class, 'report'])->name('support.report');
    Route::post('/support/verify', [SupportController::class, 'verify'])->name('support.verify');
});

require __DIR__ . '/settings.php';
