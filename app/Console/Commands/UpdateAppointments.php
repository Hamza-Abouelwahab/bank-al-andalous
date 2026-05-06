<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;

class UpdateAppointments extends Command
{
    protected $signature = 'appointments:update';
    protected $description = 'Update past appointments to completed';

    public function handle()
    {
        $now = now();

        Appointment::whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($now) {
                $q->whereDate('date', '<', $now->toDateString())
                  ->orWhere(function ($q2) use ($now) {
                      $q2->whereDate('date', $now->toDateString())
                         ->whereTime('time', '<', $now->toTimeString());
                  });
            })
            ->update(['status' => 'completed']);

        return Command::SUCCESS;
    }
}