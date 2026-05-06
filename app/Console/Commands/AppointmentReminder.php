<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;
use Carbon\Carbon;

class AppointmentReminder extends Command
{
    protected $signature = 'appointment:reminder';
    protected $description = 'Send reminders for upcoming appointments';

    public function handle()
    {
        $tomorrow = Carbon::tomorrow();

        $appointments = Appointment::whereDate('date', $tomorrow)->get();

        foreach ($appointments as $appointment) {
            \Log::info("Reminder sent to user {$appointment->user_id}");
        }

        return Command::SUCCESS;
    }
}
