import { useForm } from '@inertiajs/react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarDays, Clock, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import 'react-day-picker/dist/style.css';

const timeSlots = [
    '09:00', '09:30', '10:00',
    '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00',
    '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00',
];

export default function CreateAppointment() {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        date: '',
        time: '',
        type: '',
    });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [success, setSuccess] = useState(false);

    const chooseDate = (date?: Date) => {
        setSelectedDate(date);

        if (date) {
            setData('date', format(date, 'yyyy-MM-dd'));
        }
    };

    const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/appointments', {
        preserveScroll: true,
        onSuccess: () => {
            setSuccess(true);

            // empty form inputs
            reset('date', 'time', 'type');

            // empty calendar selection
            setSelectedDate(undefined);

            // clear validation errors
            clearErrors();
        },
    });
};

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-6 text-[#0F0D0B]">
            <div className="mx-auto max-w-6xl">

                <div className="mb-8">
                    <p className="mb-2 text-sm font-bold text-orange-600">
                        ← Back to Appointments
                    </p>
                    <h1 className="text-3xl font-extrabold">
                        Schedule an Appointment
                    </h1>
                    <p className="mt-2 text-[#9C978F]">
                        Choose a convenient date and time to meet with your advisor.
                    </p>
                </div>

                {success && (
                    <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 font-bold text-green-700">
                        ✅ Appointment booked successfully
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm">
                            <div className="grid gap-6 md:grid-cols-2">

                                {/* Calendar */}
                                <div className="border-r-0 md:border-r md:border-[#EDE8E0] md:pr-6">
                                    <h2 className="mb-4 text-xl font-extrabold">
                                        1. Select a Date
                                    </h2>

                                    <div className="rounded-3xl border border-[#EDE8E0] bg-[#FFFCF8] p-4">
                                        <DayPicker
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={chooseDate}
                                            disabled={{ before: new Date() }}
                                            weekStartsOn={1}
                                            className="bank-calendar"
                                        />
                                    </div>

                                    {errors.date && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.date}
                                        </p>
                                    )}

                                    <div className="mt-4 flex gap-4 text-xs text-[#9C978F]">
                                        <span className="flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-orange-600" />
                                            Available
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-gray-300" />
                                            Not available
                                        </span>
                                    </div>
                                </div>

                                {/* Time */}
                                <div>
                                    <h2 className="mb-2 text-xl font-extrabold">
                                        2. Select a Time
                                    </h2>

                                    <p className="mb-4 text-sm text-[#9C978F]">
                                        Available slots for{' '}
                                        <span className="font-bold text-orange-600">
                                            {selectedDate
                                                ? format(selectedDate, 'EEEE, MMM dd, yyyy')
                                                : 'selected date'}
                                        </span>
                                    </p>

                                    <div className="grid grid-cols-3 gap-3">
                                        {timeSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setData('time', slot)}
                                                className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                                                    data.time === slot
                                                        ? 'border-orange-600 bg-orange-600 text-white shadow-md'
                                                        : 'border-[#EDE8E0] bg-white hover:bg-orange-50'
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>

                                    {errors.time && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.time}
                                        </p>
                                    )}

                                    <div className="mt-5 flex items-center gap-2 text-sm text-[#9C978F]">
                                        <Clock className="h-4 w-4" />
                                        All times are local branch time
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-center text-xl font-extrabold">
                                Appointment Summary
                            </h2>

                            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                                <CalendarDays className="h-7 w-7 text-orange-600" />
                            </div>

                            <div className="space-y-5">
                                <div className="border-b border-[#EDE8E0] pb-4">
                                    <p className="text-sm font-bold">Date</p>
                                    <p className="mt-1 font-extrabold text-orange-600">
                                        {selectedDate
                                            ? format(selectedDate, 'EEEE, MMM dd, yyyy')
                                            : 'Not selected'}
                                    </p>
                                </div>

                                <div className="border-b border-[#EDE8E0] pb-4">
                                    <p className="text-sm font-bold">Time</p>
                                    <p className="mt-1 font-extrabold text-orange-600">
                                        {data.time || 'Not selected'}
                                    </p>
                                </div>

                                <div className="border-b border-[#EDE8E0] pb-4">
                                    <p className="text-sm font-bold">Service</p>

                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-[#EDE8E0] p-3 focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select service</option>
                                        <option value="consultation">Consultation</option>
                                        <option value="loan">Loan Request</option>
                                        <option value="support">Customer Support</option>
                                    </select>

                                    {errors.type && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F6F1]">
                                        <UserRound className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Bank Advisor</p>
                                        <p className="text-sm text-[#9C978F]">
                                            Personal Banking Advisor
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-8 w-full rounded-2xl bg-orange-600 py-4 font-extrabold text-white transition hover:bg-orange-700 disabled:opacity-60"
                            >
                                {processing ? 'Booking...' : 'Confirm Appointment →'}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-[#9C978F]">
                                <ShieldCheck className="h-5 w-5" />
                                Your information is secure and encrypted
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}