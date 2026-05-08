<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;

class AppointmentController extends Controller
{
    public function create()
    {
        $today = now()->toDateString();
        $currentTime = now()->format('H:i');

        $appointments = Appointment::query()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($today, $currentTime) {
                $query->where('date', '>', $today)
                    ->orWhere(function ($query) use ($today, $currentTime) {
                        $query->where('date', $today)
                            ->where('time', '>=', $currentTime);
                    });
            })
            ->get(['date', 'time']);

        $bookedSlots = $appointments
            ->groupBy('date')
            ->map(function ($items) {
                return $items
                    ->map(fn($appointment) => substr($appointment->time, 0, 5))
                    ->values();
            })
            ->toArray();

        $myAppointment = Appointment::query()
            ->where('user_id', Auth::id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($today, $currentTime) {
                $query->where('date', '>', $today)
                    ->orWhere(function ($query) use ($today, $currentTime) {
                        $query->where('date', $today)
                            ->where('time', '>=', $currentTime);
                    });
            })
            ->orderBy('date')
            ->orderBy('time')
            ->first();

        return inertia('appointments/Create', [
            'bookedSlots' => $bookedSlots,
            'myAppointment' => $myAppointment ? [
                'id' => $myAppointment->id,
                'date' => $myAppointment->date,
                'time' => substr($myAppointment->time, 0, 5),
                'type' => $myAppointment->type,
                'status' => $myAppointment->status,

                // ✅ true only if appointment is more than 48 hours away
                'can_update' => now()->diffInHours(
                    \Carbon\Carbon::parse($myAppointment->date . ' ' . $myAppointment->time),
                    false
                ) >= 48,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|after:today',

            'time' => [
                'required',
                'date_format:H:i',

                Rule::unique('appointments', 'time')
                    ->where(fn($query) => $query->where('date', $request->date)),
            ],

            'type' => 'required|string|max:255',
        ], [
            'time.unique' => 'This time slot is already booked. Please choose another time.',
        ]);

        // Optional: prevent same user from having more than one upcoming appointment
        $hasActiveAppointment = Appointment::query()
            ->where('user_id', Auth::id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) {
                $query->where('date', '>', now()->toDateString())
                    ->orWhere(function ($query) {
                        $query->where('date', now()->toDateString())
                            ->where('time', '>=', now()->format('H:i'));
                    });
            })
            ->exists();

        if ($hasActiveAppointment) {
            return back()->withErrors([
                'time' => 'You already have an upcoming appointment.',
            ]);
        }

        try {
            Appointment::create([
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'time' => $validated['time'],
                'type' => $validated['type'],
                'status' => 'pending',
            ]);
        } catch (QueryException $e) {
            return back()->withErrors([
                'time' => 'This time slot was just booked by another user. Please choose another time.',
            ]);
        }

        return back()->with('success', 'Appointment booked successfully!');
    }

    public function update(Request $request, Appointment $appointment)
    {
        // ✅ user can update only his own appointment
        if ($appointment->user_id !== Auth::id()) {
            abort(403);
        }

        $appointmentDateTime = \Carbon\Carbon::parse(
            $appointment->date . ' ' . $appointment->time
        );

        // ✅ cannot update if appointment is less than 48 hours away
        if (now()->diffInHours($appointmentDateTime, false) < 48) {
            return back()->withErrors([
                'time' => 'You can only change your appointment at least 48 hours before the appointment time.',
            ]);
        }

        $validated = $request->validate([
            'date' => 'required|date|after:today',

            'time' => [
                'required',
                'date_format:H:i',

                Rule::unique('appointments', 'time')
                    ->where(fn($query) => $query->where('date', $request->date))
                    ->ignore($appointment->id),
            ],

            'type' => 'required|string|max:255',
        ], [
            'time.unique' => 'This time slot is already booked. Please choose another time.',
        ]);

        try {
            $appointment->update([
                'date' => $validated['date'],
                'time' => $validated['time'],
                'type' => $validated['type'],
                'status' => 'pending',
            ]);
        } catch (QueryException $e) {
            return back()->withErrors([
                'time' => 'This time slot was just booked by another user. Please choose another time.',
            ]);
        }

        return back()->with('success', 'Appointment updated successfully!');
    }
}
