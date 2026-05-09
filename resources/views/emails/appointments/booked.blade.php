{{-- <x-mail::message>
# Introduction

The body of your message.

<x-mail::button :url="''">
Button Text
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message> --}}


@component('mail::message')
# Appointment Booked Successfully

Hello {{ $appointment->user->name }},

Your appointment has been booked successfully.

## Appointment Details

- **Type:** {{ ucfirst($appointment->type) }}
- **Date:** {{ $appointment->date }}
- **Time:** {{ substr($appointment->time, 0, 5) }}
- **Status:** {{ ucfirst($appointment->status) }}

@if($appointment->agent)
- **Agent:** {{ $appointment->agent->name }}
@endif

Please show your appointment QR code when you arrive at the bank branch.

@component('mail::button', ['url' => $verificationUrl])
Open Appointment QR
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent
