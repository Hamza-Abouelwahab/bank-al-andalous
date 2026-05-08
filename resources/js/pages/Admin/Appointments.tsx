import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    Clock,
    Mail,
    Phone,
    Search,
    Timer,
    UserRound,
    WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    bank_account?: {
        account_number: string;
        account_type: string;
        balance: number;
    } | null;
    bankAccount?: {
        account_number: string;
        account_type: string;
        balance: number;
    } | null;
    profile?: {
        phone: string;
    } | null;
}

interface Appointment {
    id: number;
    date: string;
    time: string;
    type: string;
    status: string;
    user: User | null;
}

interface PageProps extends InertiaPageProps {
    appointments: Appointment[];
    stats: {
        future_appointments: number;
        pending_appointments: number;
        confirmed_appointments: number;
        today_appointments: number;
    };
}

export default function AdminAppointments() {
    const { appointments = [], stats } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appointment) => {
            const account = appointment.user?.bank_account ?? appointment.user?.bankAccount;

            const matchesSearch =
                appointment.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                appointment.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
                appointment.type?.toLowerCase().includes(search.toLowerCase()) ||
                account?.account_number?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || appointment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [appointments, search, statusFilter]);

    const groupedAppointments = useMemo(() => {
        return filteredAppointments.reduce<Record<string, Appointment[]>>((groups, appointment) => {
            if (!groups[appointment.date]) {
                groups[appointment.date] = [];
            }

            groups[appointment.date].push(appointment);

            return groups;
        }, {});
    }, [filteredAppointments]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

    const formatShortDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
        });

    const getInitials = (name?: string) =>
        name
            ? name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
            : '?';

    const statusClass = (status: string) => {
        if (status === 'confirmed') {
            return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
        }

        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    };
    

    return (
        <>
            <Head title="Admin Appointments" />

            <div className="min-h-screen bg-[#F8F6F1] p-4 text-[#171412] dark:bg-[#0F0D0B] dark:text-[#F5F0EA] lg:p-6">
                <div className="space-y-6">
                    {/* Hero */}
                    <section className="relative overflow-hidden rounded-[2rem] border border-[#ECE7DF] bg-[#171412] p-6 text-white shadow-sm dark:border-[#2A2520]">
                        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
                        <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-orange-600/20 blur-3xl" />

                        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-200">
                                    <CalendarCheck className="h-3.5 w-3.5" />
                                    Admin Scheduling
                                </div>

                                <h1 className="text-2xl font-black tracking-tight md:text-4xl">
                                    Appointment Management
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                                    Review every future appointment across all users, track pending requests, and monitor branch scheduling activity.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
                                <p className="text-sm font-semibold text-white/60">
                                    Future Appointments
                                </p>
                                <p className="mt-1 text-4xl font-black">
                                    {stats?.future_appointments ?? appointments.length}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="All Future"
                            value={stats?.future_appointments ?? appointments.length}
                            icon={<CalendarDays className="h-6 w-6" />}
                            tone="orange"
                        />
                        <StatCard
                            label="Today"
                            value={stats?.today_appointments ?? 0}
                            icon={<CalendarClock className="h-6 w-6" />}
                            tone="blue"
                        />
                        <StatCard
                            label="Pending"
                            value={stats?.pending_appointments ?? 0}
                            icon={<Timer className="h-6 w-6" />}
                            tone="amber"
                        />
                        <StatCard
                            label="Confirmed"
                            value={stats?.confirmed_appointments ?? 0}
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            tone="green"
                        />
                    </section>

                    {/* Filters */}
                    <section className="rounded-[2rem] border border-[#ECE7DF] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="text-xl font-black">
                                    Upcoming Schedule
                                </h2>
                                <p className="mt-1 text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                    {filteredAppointments.length} appointment result(s)
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#ECE7DF] bg-[#FFFCFA] px-4 py-3 dark:border-[#2A2520] dark:bg-[#252118] sm:w-[360px]">
                                    <Search className="h-4 w-4 shrink-0 text-[#9A948C]" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search user, email, type, account..."
                                        className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#A8A098]"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value as 'all' | 'pending' | 'confirmed')
                                    }
                                    className="rounded-2xl border border-[#ECE7DF] bg-[#FFFCFA] px-4 py-3 text-sm font-bold outline-none dark:border-[#2A2520] dark:bg-[#252118]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Appointment groups */}
                    {Object.keys(groupedAppointments).length > 0 ? (
                        <section className="space-y-5">
                            {Object.entries(groupedAppointments).map(([date, items]) => (
                                <div
                                    key={date}
                                    className="overflow-hidden rounded-[2rem] border border-[#ECE7DF] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]"
                                >
                                    <div className="flex flex-col gap-2 border-b border-[#F2EEEA] bg-[#FFFCFA] px-6 py-5 dark:border-[#2A2520] dark:bg-[#181511] sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                                <CalendarDays className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-black">
                                                    {formatDate(date)}
                                                </h3>
                                                <p className="text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                                    {items.length} appointment(s)
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-600 dark:bg-orange-500/10">
                                            {formatShortDate(date)}
                                        </span>
                                    </div>

                                    <div className="divide-y divide-[#F2EEEA] dark:divide-[#2A2520]">
                                        {items.map((appointment) => {
                                            const account =
                                                appointment.user?.bank_account ??
                                                appointment.user?.bankAccount;

                                            return (
                                                <div
                                                    key={appointment.id}
                                                    className="grid gap-4 px-6 py-5 transition hover:bg-orange-50/30 dark:hover:bg-orange-500/5 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr]"
                                                >
                                                    {/* User */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-[#7a2800] text-sm font-black text-white shadow-lg shadow-orange-900/20">
                                                            {getInitials(appointment.user?.name)}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-black">
                                                                {appointment.user?.name ?? 'Unknown user'}
                                                            </p>

                                                            <div className="mt-1 flex flex-col gap-1 text-xs text-[#8A837A] dark:text-[#AFA49A] sm:flex-row sm:items-center sm:gap-3">
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Mail className="h-3.5 w-3.5" />
                                                                    {appointment.user?.email ?? 'No email'}
                                                                </span>

                                                                <span className="inline-flex items-center gap-1">
                                                                    <Phone className="h-3.5 w-3.5" />
                                                                    {appointment.user?.profile?.phone ?? 'No phone'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Time */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                                                            <Clock className="h-4 w-4" />
                                                        </div>

                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#A8A098]">
                                                                Time
                                                            </p>
                                                            <p className="font-black">
                                                                {appointment.time}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Type + Account */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10">
                                                            <WalletCards className="h-4 w-4" />
                                                        </div>

                                                        <div>
                                                            <p className="font-black capitalize">
                                                                {appointment.type}
                                                            </p>
                                                            <p className="text-xs font-medium text-[#8A837A] dark:text-[#AFA49A]">
                                                                {account?.account_number ?? 'No account'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="flex items-center xl:justify-end">
                                                        <span
                                                            className={`inline-flex rounded-full border px-4 py-2 text-xs font-black capitalize ${statusClass(
                                                                appointment.status,
                                                            )}`}
                                                        >
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </section>
                    ) : (
                        <section className="rounded-[2rem] border border-[#ECE7DF] bg-white px-6 py-20 text-center shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                <CalendarCheck className="h-7 w-7" />
                            </div>

                            <h3 className="mt-4 text-lg font-black">
                                No appointments found
                            </h3>

                            <p className="mt-2 text-sm text-[#9A948C]">
                                No future appointments match your search or filter.
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    icon,
    tone,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone: 'orange' | 'blue' | 'green' | 'amber';
}) {
    const tones = {
        orange: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20',
        blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20',
        green: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:border-green-500/20',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20',
    };

    return (
        <div className="rounded-3xl border border-[#ECE7DF] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-[#8A837A] dark:text-[#AFA49A]">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#171412] dark:text-white">
                        {value}
                    </p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tones[tone]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}