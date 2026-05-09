import { Head, router, useForm } from '@inertiajs/react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import {
    CalendarDays,
    Clock,
    ShieldCheck,
    UserRound,
    Bell,
    Mail,
    CheckCircle2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import 'react-day-picker/dist/style.css';
import CustomSelect from '@/components/CustomSelect';

type Agent = {
    id: number;
    name: string;
    email: string;
};

type AppointmentReminder = {
    id?: number;
    date: string;
    time: string;
    type: string;
    status?: string;
    can_update?: boolean;
    agent_id?: number | null;
    agent?: Agent | null;
    qr_token?: string | null;
};

type BookedSlots = Record<string, Record<string, string[]>>;

type CreateAppointmentProps = {
    bookedSlots: BookedSlots;
    workingSlots: string[];
    agents: Agent[];
    myAppointment: AppointmentReminder | null;
};

export default function CreateAppointment({
    bookedSlots = {},
    workingSlots = [],
    agents = [],
    myAppointment = null,
}: CreateAppointmentProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            date: '',
            time: '',
            type: '',
            agent_id: '',
        });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [success, setSuccess] = useState(false);
    const [reminder, setReminder] = useState<AppointmentReminder | null>(
        myAppointment,
    );
    const [timeLeft, setTimeLeft] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [dateMessage, setDateMessage] = useState('');

    useEffect(() => {
        setReminder(myAppointment);
    }, [myAppointment]);

    const safeWorkingSlots =
        workingSlots.length > 0
            ? workingSlots
            : [
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

    const selectedAgent = useMemo(() => {
        return agents.find(
            (agent) => String(agent.id) === String(data.agent_id),
        );
    }, [agents, data.agent_id]);

    const reminderAgent = useMemo(() => {
        if (!reminder?.agent_id) {
            return null;
        }

        return agents.find((agent) => agent.id === reminder.agent_id) ?? null;
    }, [agents, reminder]);

    const isWeekend = (date: Date) => {
        const day = date.getDay();

        return day === 0 || day === 6;
    };

    const chooseDate = (date?: Date) => {
        clearErrors();
        setDateMessage('');

        if (!date) {
            setSelectedDate(undefined);
            setData('date', '');
            setData('time', '');
            return;
        }

        if (isWeekend(date)) {
            setSelectedDate(undefined);
            setData('date', '');
            setData('time', '');
            setDateMessage(
                'Appointments are not available on Saturday or Sunday.',
            );
            return;
        }

        setSelectedDate(date);
        setData('date', format(date, 'yyyy-MM-dd'));
        setData('time', '');
    };

    const getAppointmentDateTime = (appointment: AppointmentReminder) => {
        const [year, month, day] = appointment.date.split('-').map(Number);
        const [hours, minutes] = appointment.time
            .slice(0, 5)
            .split(':')
            .map(Number);

        return new Date(year, month - 1, day, hours, minutes, 0);
    };

    const getRemainingTime = (appointment: AppointmentReminder) => {
        const now = new Date();
        const appointmentDate = getAppointmentDateTime(appointment);
        const diff = appointmentDate.getTime() - now.getTime();

        if (diff <= 0) {
            return null;
        }

        const totalMinutes = Math.floor(diff / 1000 / 60);
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m remaining`;
        }

        if (hours > 0) {
            return `${hours}h ${minutes}m remaining`;
        }

        return `${minutes}m remaining`;
    };

    const formatService = (service: string) => {
        switch (service) {
            case 'account_opening':
                return 'Account Opening';
            case 'loan_request':
                return 'Loan Request';
            case 'card_service':
                return 'Card Service';
            case 'customer_support':
                return 'Customer Support';
            case 'financial_advice':
                return 'Financial Advice';
            default:
                return service || 'Not selected';
        }
    };

    useEffect(() => {
        if (!reminder) {
            setTimeLeft('');
            return;
        }

        const updateTimer = () => {
            const remaining = getRemainingTime(reminder);

            if (!remaining) {
                setReminder(null);
                setTimeLeft('');

                router.reload({
                    only: ['bookedSlots', 'myAppointment'],
                });

                return;
            }

            setTimeLeft(remaining);
        };

        updateTimer();

        const interval = setInterval(updateTimer, 30000);

        return () => clearInterval(interval);
    }, [reminder]);

    const safeBookedSlots = bookedSlots ?? {};

    const bookedTimesForSelectedDateAndAgent =
        data.date && data.agent_id
            ? safeBookedSlots?.[data.date]?.[String(data.agent_id)] || []
            : [];

    const isSlotBooked = (slot: string) => {
        if (
            isEditing &&
            reminder &&
            data.date === reminder.date &&
            String(data.agent_id) === String(reminder.agent_id) &&
            slot === reminder.time.slice(0, 5)
        ) {
            return false;
        }

        return bookedTimesForSelectedDateAndAgent.includes(slot);
    };

    const startEditing = () => {
        if (!reminder || !reminder.can_update) {
            return;
        }

        const [year, month, day] = reminder.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        setIsEditing(true);
        setSelectedDate(date);

        setData({
            date: reminder.date,
            time: reminder.time.slice(0, 5),
            type: reminder.type,
            agent_id: reminder.agent_id ? String(reminder.agent_id) : '',
        });

        clearErrors();
        setDateMessage('');
    };

    const cancelEditing = () => {
        setIsEditing(false);
        reset('date', 'time', 'type', 'agent_id');
        setSelectedDate(undefined);
        clearErrors();
        setDateMessage('');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && reminder?.id) {
            put(`/appointments/${reminder.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccess(true);
                    setIsEditing(false);

                    reset('date', 'time', 'type', 'agent_id');
                    setSelectedDate(undefined);
                    clearErrors();
                    setDateMessage('');

                    router.reload({
                        only: ['bookedSlots', 'myAppointment'],
                    });
                },
            });

            return;
        }

        post('/appointments', {
            preserveScroll: true,
            onSuccess: () => {
                setSuccess(true);

                reset('date', 'time', 'type', 'agent_id');
                setSelectedDate(undefined);
                clearErrors();
                setDateMessage('');

                router.reload({
                    only: ['bookedSlots', 'myAppointment'],
                });
            },
        });
    };

    return (
        <>
            <Head title="Schedule an Appointment" />

            <div className="min-h-screen bg-[#f8f6f1] p-6 text-[#1f1a17] dark:bg-[#0f0d0b] dark:text-white">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <p className="mb-2 text-sm font-bold text-orange-600 dark:text-orange-400">
                            ← Back to Appointments
                        </p>

                        <h1 className="text-3xl font-extrabold text-[#1f1a17] dark:text-white">
                            Schedule an Appointment
                        </h1>

                        <p className="mt-2 text-[#1f1a17]/60 dark:text-white/60">
                            Choose a convenient date, advisor, and time to visit
                            your branch.
                        </p>
                    </div>

                    {success && (
                        <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 font-bold text-orange-700 dark:border-orange-500/30 dark:bg-orange-900/20 dark:text-orange-400">
                            ✅ Appointment saved successfully. Please check your
                            email for the appointment confirmation.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                            <div className="rounded-3xl border border-orange-100/60 bg-white p-6 shadow-sm dark:border-[#7a2800]/30 dark:bg-[#1f1a17]">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="border-r-0 md:border-r md:border-orange-100/60 md:pr-6 dark:md:border-[#7a2800]/30">
                                        <h2 className="mb-4 text-xl font-extrabold text-[#1f1a17] dark:text-white">
                                            1. Select a Date
                                        </h2>

                                        <div className="rounded-3xl border border-orange-100/60 bg-[#f8f6f1] p-4 dark:border-[#7a2800]/30 dark:bg-[#241b16]">
                                            <DayPicker
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={chooseDate}
                                                disabled={[
                                                    { before: new Date() },
                                                    { dayOfWeek: [0, 6] },
                                                ]}
                                                weekStartsOn={1}
                                                modifiersClassNames={{
                                                    today: 'bank-today',
                                                    selected: 'bank-selected',
                                                    disabled: 'bank-disabled',
                                                }}
                                                className="bank-calendar"
                                            />
                                        </div>

                                        {(errors.date || dateMessage) && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.date || dateMessage}
                                            </p>
                                        )}

                                        <div className="mt-4 flex gap-4 text-xs text-[#1f1a17]/60 dark:text-white/60">
                                            <span className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-orange-600" />
                                                Available
                                            </span>

                                            <span className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-[#1f1a17]/30 dark:bg-white/30" />
                                                Weekend / Not available
                                            </span>
                                        </div>

                                        {reminder && (
                                            <div className="mt-6 space-y-5 rounded-3xl border border-orange-200 bg-orange-50 p-5 shadow-sm dark:border-orange-500/20 dark:bg-orange-900/10">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/10">
                                                        <Bell className="h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-extrabold text-[#1f1a17] dark:text-white">
                                                            Upcoming Appointment
                                                        </h3>

                                                        <p className="text-xs text-[#1f1a17]/60 dark:text-white/60">
                                                            This reminder
                                                            updates from your
                                                            database and
                                                            disappears after
                                                            expiry.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-[#241b16]">
                                                        <span className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                                            Date
                                                        </span>

                                                        <span className="font-bold text-[#1f1a17] dark:text-white">
                                                            {format(
                                                                getAppointmentDateTime(
                                                                    reminder,
                                                                ),
                                                                'EEEE, MMM dd, yyyy',
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-[#241b16]">
                                                        <span className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                                            Time
                                                        </span>

                                                        <span className="font-bold text-[#1f1a17] dark:text-white">
                                                            {reminder.time.slice(
                                                                0,
                                                                5,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-[#241b16]">
                                                        <span className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                                            Service
                                                        </span>

                                                        <span className="font-bold text-[#1f1a17] dark:text-white">
                                                            {formatService(
                                                                reminder.type,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-[#241b16]">
                                                        <span className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                                            Branch
                                                        </span>

                                                        <span className="text-[14px] font-bold text-[#1f1a17] dark:text-white">
                                                            {reminderAgent?.name ||
                                                                reminder.agent
                                                                    ?.name ||
                                                                'Bank Advisor'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-[#241b16]">
                                                        <span className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                                            Status
                                                        </span>

                                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-700 uppercase dark:bg-orange-500/10 dark:text-orange-400">
                                                            {reminder.status ||
                                                                'pending'}
                                                        </span>
                                                    </div>

                                                    <div className="rounded-2xl border border-orange-200 bg-orange-100/70 px-4 py-3 text-center dark:border-orange-500/20 dark:bg-orange-500/10">
                                                        <p className="text-xs font-medium tracking-wide text-orange-700 uppercase dark:text-orange-300">
                                                            Time left
                                                        </p>

                                                        <p className="mt-1 text-lg font-extrabold text-orange-600 dark:text-orange-400">
                                                            {timeLeft}
                                                        </p>
                                                    </div>
                                                </div>

                                                {reminder.can_update ? (
                                                    <div className="grid gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                startEditing
                                                            }
                                                            className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#7a2800]"
                                                        >
                                                            Change Appointment
                                                        </button>

                                                        {isEditing && (
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    cancelEditing
                                                                }
                                                                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-extrabold text-orange-700 transition hover:bg-orange-50 dark:border-orange-500/20 dark:bg-[#241b16] dark:text-orange-400"
                                                            >
                                                                Cancel Editing
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                                                        You can no longer change
                                                        this appointment because
                                                        it is less than 48 hours
                                                        away.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="mb-2 text-xl font-extrabold text-[#1f1a17] dark:text-white">
                                            2. Select a Branch
                                        </h2>

                                        <p className="mb-4 text-sm text-[#1f1a17]/60 dark:text-white/60">
                                            Choose the nearest branch for your
                                            appointment.
                                        </p>

                                        <CustomSelect
                                            label="Branch"
                                            value={data.agent_id}
                                            placeholder="Select a branch"
                                            options={agents.map((agent) => ({
                                                value: agent.id,
                                                label: agent.name,
                                                description: agent.email,
                                            }))}
                                            error={errors.agent_id}
                                            onChange={(value) => {
                                                setData('agent_id', value);
                                                setData('time', '');
                                                clearErrors();
                                            }}
                                        />
                                        <h2 className="mb-2 text-xl font-extrabold text-[#1f1a17] dark:text-white">
                                            3. Select a Time
                                        </h2>

                                        <p className="mb-4 text-sm text-[#1f1a17]/60 dark:text-white/60">
                                            Available slots for{' '}
                                            <span className="font-bold text-orange-600 dark:text-orange-400">
                                                {selectedDate
                                                    ? format(
                                                          selectedDate,
                                                          'EEEE, MMM dd, yyyy',
                                                      )
                                                    : 'selected date'}
                                            </span>
                                        </p>

                                        <div className="grid grid-cols-3 gap-3">
                                            {safeWorkingSlots.map((slot) => {
                                                const booked =
                                                    isSlotBooked(slot);
                                                const disabled =
                                                    booked ||
                                                    !selectedDate ||
                                                    !data.agent_id;

                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        disabled={disabled}
                                                        onClick={() => {
                                                            if (!disabled) {
                                                                setData(
                                                                    'time',
                                                                    slot,
                                                                );
                                                            }
                                                        }}
                                                        className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                                                            booked
                                                                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through dark:border-white/10 dark:bg-white/5 dark:text-white/30'
                                                                : data.time ===
                                                                    slot
                                                                  ? 'border-orange-600 bg-orange-600 text-white shadow-sm'
                                                                  : disabled
                                                                    ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white/20'
                                                                    : 'border-orange-200/60 bg-white hover:bg-orange-50 dark:border-[#7a2800]/40 dark:bg-[#241b16] dark:text-white dark:hover:bg-orange-900/10'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <p className="mt-3 text-xs text-[#1f1a17]/50 dark:text-white/50">
                                            Select an advisor and a date first.
                                            Booked times are disabled
                                            automatically.
                                        </p>

                                        {errors.time && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.time}
                                            </p>
                                        )}

                                        <div className="mt-5 flex items-center gap-2 text-sm text-[#1f1a17]/60 dark:text-white/60">
                                            <Clock className="h-4 w-4" />
                                            All times are local branch time
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#7a2800]/30 dark:bg-[#1f1a17]">
                                <h2 className="mb-6 text-center text-xl font-extrabold text-[#1f1a17] dark:text-white">
                                    Appointment Summary
                                </h2>

                                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/10">
                                    <CalendarDays className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                                </div>

                                <div className="space-y-5">
                                    <div className="border-b border-[#EDE8E0] pb-4 dark:border-[#2A2520]">
                                        <p className="text-sm font-bold text-[#1f1a17] dark:text-white">
                                            Date
                                        </p>

                                        <p className="mt-1 font-extrabold text-orange-600 dark:text-orange-400">
                                            {selectedDate
                                                ? format(
                                                      selectedDate,
                                                      'EEEE, MMM dd, yyyy',
                                                  )
                                                : 'Not selected'}
                                        </p>
                                    </div>

                                    <div className="border-b border-[#EDE8E0] pb-4 dark:border-[#2A2520]">
                                        <p className="text-sm font-bold text-[#1f1a17] dark:text-white">
                                            Advisor
                                        </p>

                                        <p className="mt-1 font-extrabold text-orange-600 dark:text-orange-400">
                                            {selectedAgent?.name ||
                                                'Not selected'}
                                        </p>
                                    </div>

                                    <div className="border-b border-[#EDE8E0] pb-4 dark:border-[#2A2520]">
                                        <p className="text-sm font-bold text-[#1f1a17] dark:text-white">
                                            Time
                                        </p>

                                        <p className="mt-1 font-extrabold text-orange-600 dark:text-orange-400">
                                            {data.time || 'Not selected'}
                                        </p>
                                    </div>

                                    <div className="border-b border-[#EDE8E0] pb-4 dark:border-[#2A2520]">
                                        <CustomSelect
                                            label="Service"
                                            value={data.type}
                                            placeholder="Select service"
                                            options={[
                                                {
                                                    value: 'account_opening',
                                                    label: 'Account Opening',
                                                },
                                                {
                                                    value: 'loan_request',
                                                    label: 'Loan Request',
                                                },
                                                {
                                                    value: 'card_service',
                                                    label: 'Card Service',
                                                },
                                                {
                                                    value: 'customer_support',
                                                    label: 'Customer Support',
                                                },
                                                {
                                                    value: 'financial_advice',
                                                    label: 'Financial Advice',
                                                },
                                            ]}
                                            error={errors.type}
                                            onChange={(value) => {
                                                setData('type', value);
                                                clearErrors();
                                            }}
                                        />

                                        {errors.type && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F6F1] dark:bg-[#241b16]">
                                            <UserRound className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        </div>

                                        <div>
                                            <p className="font-bold text-[#1f1a17] dark:text-white">
                                                Selected Branch
                                            </p>

                                            <p className="text-sm text-[#9C978F] dark:text-white/50">
                                                {selectedAgent?.name ||
                                                    'Branch Appointment Desk'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.date ||
                                        !data.time ||
                                        !data.type ||
                                        !data.agent_id
                                    }
                                    className="mt-8 w-full rounded-2xl bg-orange-600 py-4 font-extrabold text-white transition hover:bg-[#7a2800] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? isEditing
                                            ? 'Updating...'
                                            : 'Booking...'
                                        : isEditing
                                          ? 'Update Appointment →'
                                          : 'Confirm Appointment →'}
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-[#1f1a17]/60 dark:text-white/60">
                                    <ShieldCheck className="h-5 w-5" />
                                    Your information is secure and encrypted
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
