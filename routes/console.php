<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 🔔 Appointment reminder (runs every day)
Schedule::command('appointment:reminder')->daily();

// 🔄 Auto update appointments (runs every minute)
Schedule::command('appointments:update')->everyMinute();
