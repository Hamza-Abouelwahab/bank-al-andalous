<?php

namespace App\Http\Controllers;

use App\Mail\AppointmentBookedMail;
use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    public function create()
    {
        $today = now()->toDateString();
        $currentTime = now()->format('H:i');

        $agents = User::query()
            ->where('role', 'agent')
            ->get(['id', 'name', 'email']);

        $workingSlots = [
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
        ];

        $appointments = Appointment::query()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($today, $currentTime) {
                $query->where('date', '>', $today)
                    ->orWhere(function ($query) use ($today, $currentTime) {
                        $query->where('date', $today)
                            ->where('time', '>=', $currentTime);
                    });
            })
            ->get(['date', 'time', 'agent_id']);

        $bookedSlots = $appointments
            ->groupBy('date')
            ->map(function ($dateItems) {
                return $dateItems
                    ->groupBy('agent_id')
                    ->map(function ($agentItems) {
                        return $agentItems
                            ->map(fn($appointment) => substr($appointment->time, 0, 5))
                            ->values();
                    });
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
            'workingSlots' => $workingSlots,
            'agents' => $agents,
            'myAppointment' => $myAppointment ? [
                'id' => $myAppointment->id,
                'date' => $myAppointment->date,
                'time' => substr($myAppointment->time, 0, 5),
                'type' => $myAppointment->type,
                'status' => $myAppointment->status,
                'agent_id' => $myAppointment->agent_id,
                'qr_token' => $myAppointment->qr_token,
                'can_update' => now()->diffInHours(
                    Carbon::parse($myAppointment->date . ' ' . $myAppointment->time),
                    false
                ) >= 48,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'agent_id' => [
                'required',
                Rule::exists('users', 'id')->where('role', 'agent'),
            ],

            'date' => 'required|date|after:today',

            'time' => [
                'required',
                'date_format:H:i',

                Rule::unique('appointments', 'time')
                    ->where(
                        fn($query) => $query
                            ->where('date', $request->date)
                            ->where('agent_id', $request->agent_id)
                            ->whereIn('status', ['pending', 'confirmed'])
                    ),
            ],

            'type' => [
                'required',
                Rule::in([
                    'account_opening',
                    'loan_request',
                    'card_service',
                    'customer_support',
                    'financial_advice',
                ]),
            ],
        ], [
            'agent_id.required' => 'Please choose an agent.',
            'agent_id.exists' => 'The selected agent is invalid.',
            'time.unique' => 'This agent is already booked at this time. Please choose another slot.',
        ]);

        $appointmentDate = Carbon::parse($validated['date']);

        if ($appointmentDate->isWeekend()) {
            return back()->withErrors([
                'date' => 'Appointments are not available on Saturday or Sunday.',
            ]);
        }

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
            $appointment = Appointment::create([
                'user_id' => Auth::id(),
                'agent_id' => $validated['agent_id'],
                'date' => $validated['date'],
                'time' => $validated['time'],
                'type' => $validated['type'],
                'status' => 'pending',
                'qr_token' => Str::random(64),
            ]);

            Mail::to(Auth::user()->email)->send(
                new AppointmentBookedMail($appointment)
            );
        } catch (QueryException $e) {
            return back()->withErrors([
                'time' => 'This time slot was just booked by another user. Please choose another time.',
            ]);
        }

        return back()->with(
            'success',
            'Appointment booked successfully! Please check your email for the appointment QR code.'
        );
    }

    public function update(Request $request, Appointment $appointment)
    {
        if ($appointment->user_id !== Auth::id()) {
            abort(403);
        }

        $appointmentDateTime = Carbon::parse(
            $appointment->date . ' ' . $appointment->time
        );

        if (now()->diffInHours($appointmentDateTime, false) < 48) {
            return back()->withErrors([
                'time' => 'You can only change your appointment at least 48 hours before the appointment time.',
            ]);
        }

        $validated = $request->validate([
            'agent_id' => [
                'required',
                Rule::exists('users', 'id')->where('role', 'agent'),
            ],

            'date' => 'required|date|after:today',

            'time' => [
                'required',
                'date_format:H:i',

                Rule::unique('appointments', 'time')
                    ->where(
                        fn($query) => $query
                            ->where('date', $request->date)
                            ->where('agent_id', $request->agent_id)
                            ->whereIn('status', ['pending', 'confirmed'])
                    )
                    ->ignore($appointment->id),
            ],

            'type' => [
                'required',
                Rule::in([
                    'account_opening',
                    'loan_request',
                    'card_service',
                    'customer_support',
                    'financial_advice',
                ]),
            ],
        ], [
            'agent_id.required' => 'Please choose an agent.',
            'agent_id.exists' => 'The selected agent is invalid.',
            'time.unique' => 'This agent is already booked at this time. Please choose another slot.',
        ]);

        $appointmentDate = Carbon::parse($validated['date']);

        if ($appointmentDate->isWeekend()) {
            return back()->withErrors([
                'date' => 'Appointments are not available on Saturday or Sunday.',
            ]);
        }

        try {
            $appointment->update([
                'agent_id' => $validated['agent_id'],
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

    public function verify(string $token)
    {
        $appointment = Appointment::with(['user', 'agent'])
            ->where('qr_token', $token)
            ->firstOrFail();

        $user = auth()->user();

        $isAdmin = $user->role === 'admin';
        $isAssignedAgent = $user->role === 'agent'
            && $appointment->agent_id === $user->id;

        $isOwner = $appointment->user_id === $user->id;

        if (! $isAdmin && ! $isAssignedAgent && ! $isOwner) {
            abort(403);
        }

        return inertia('appointments/Verify', [
            'appointment' => [
                'id' => $appointment->id,
                'user_name' => $appointment->user?->name,
                'user_email' => $appointment->user?->email,
                'agent_name' => $appointment->agent?->name,
                'date' => $appointment->date,
                'time' => substr($appointment->time, 0, 5),
                'type' => $appointment->type,
                'status' => $appointment->status,
                'checked_in_at' => $appointment->checked_in_at,
                'is_valid' => ! $appointment->checked_in_at
                    && in_array($appointment->status, ['pending', 'confirmed']),
                'can_check_in' => $isAdmin || $isAssignedAgent,
                'qr_token' => $appointment->qr_token,
            ],
        ]);
    }

    public function checkIn(Appointment $appointment)
    {
        $user = auth()->user();

        $isAdmin = $user->role === 'admin';
        $isAssignedAgent = $user->role === 'agent'
            && $appointment->agent_id === $user->id;

        if (! $isAdmin && ! $isAssignedAgent) {
            abort(403);
        }

        if ($appointment->checked_in_at) {
            return back()->withErrors([
                'qr' => 'This QR code has already been used.',
            ]);
        }

        if (! in_array($appointment->status, ['pending', 'confirmed'])) {
            return back()->withErrors([
                'qr' => 'This appointment is not active.',
            ]);
        }

        $appointment->update([
            'checked_in_at' => now(),
            'status' => 'completed',
        ]);

        return back()->with('success', 'Appointment verified successfully.');
    }

    //
    public function confirm(Appointment $appointment)
    {
        $user = auth()->user();

        $isAdmin = $user->role === 'admin';
        $isAssignedAgent = $user->role === 'agent'
            && $appointment->agent_id === $user->id;

        if (! $isAdmin && ! $isAssignedAgent) {
            abort(403);
        }

        if ($appointment->status !== 'pending') {
            return back()->withErrors([
                'status' => 'Only pending appointments can be confirmed.',
            ]);
        }

        $appointment->update([
            'status' => 'confirmed',
        ]);

        return back()->with('success', 'Appointment confirmed successfully.');
    }

    public function cancel(Appointment $appointment)
    {
        $user = auth()->user();

        $isAdmin = $user->role === 'admin';
        $isAssignedAgent = $user->role === 'agent'
            && $appointment->agent_id === $user->id;

        if (! $isAdmin && ! $isAssignedAgent) {
            abort(403);
        }

        if ($appointment->checked_in_at) {
            return back()->withErrors([
                'status' => 'Checked-in appointments cannot be cancelled.',
            ]);
        }

        if ($appointment->status === 'cancelled') {
            return back()->withErrors([
                'status' => 'This appointment is already cancelled.',
            ]);
        }

        $appointment->update([
            'status' => 'cancelled',
        ]);

        return back()->with('success', 'Appointment cancelled successfully.');
    }
}
