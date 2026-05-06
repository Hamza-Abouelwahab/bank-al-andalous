<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    // 👉 Show page (for modal / page)
    public function create()
    {
        return inertia('appointments/Create');
    }

    // 👉 Store appointment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|after:today',

            'time' => [
                'required',
                // 🔥 prevent double booking
                Rule::unique('appointments')->where(function ($query) use ($request) {
                    return $query->where('date', $request->date);
                }),
            ],

            'type' => 'required|string|max:255',
        ]);

        Appointment::create([
            'user_id' => Auth::id(),
            'date'    => $validated['date'],
            'time'    => $validated['time'],
            'type'    => $validated['type'],
            'status'  => 'pending',
        ]);

        return back()->with('success', 'Appointment booked successfully!');
    }
}