import CustomSelect from '@/components/CustomSelect';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarClock,
    CheckCircle2,
    Clock,
    Mail,
    Phone,
    QrCode,
    Search,
    Timer,
    UserRound,
    WalletCards,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profile?: {
        phone: string;
    } | null;
    bankAccount?: {
        account_number: string;
        account_type: string;
        balance: number;
    } | null;
    bank_account?: {
        account_number: string;
        account_type: string;
        balance: number;
    } | null;
}

interface BranchAgent {
    id: number;
    name: string;
    email: string;
}

interface Appointment {
    id: number;
    date: string;
    time: string;
    type: string;
    status: string;
    qr_token?: string | null;
    checked_in_at?: string | null;
    user: User | null;
    agent?: BranchAgent | null;
}

interface PageProps extends InertiaPageProps {
    auth: {
        user: User;
    };
    appointments: Appointment[];
    stats: {
        today_appointments: number;
        pending_appointments: number;
        confirmed_appointments: number;
        completed_appointments?: number;
    };
}

export default function AgentAppointments() {
    const { auth, appointments = [], stats } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
    >('all');

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

    const statusClass = (status: string) => {
        if (status === 'confirmed') {
            return 'border-green-100 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400';
        }

        if (status === 'completed') {
            return 'border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400';
        }

        if (status === 'cancelled') {
            return 'border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400';
        }

        return 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400';
    };

    const confirmAppointment = (appointmentId: number) => {
        router.post(
            `/appointments/${appointmentId}/confirm`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const cancelAppointment = (appointmentId: number) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        router.post(
            `/appointments/${appointmentId}/cancel`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const openVerifyPage = (token?: string | null) => {
        if (!token) {
            return;
        }

        router.visit(`/appointments/verify/${token}`);
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appointment) => {
            const account =
                appointment.user?.bank_account ?? appointment.user?.bankAccount;

            const searchValue = search.toLowerCase();

            const matchesSearch =
                appointment.user?.name?.toLowerCase().includes(searchValue) ||
                appointment.user?.email?.toLowerCase().includes(searchValue) ||
                appointment.user?.profile?.phone
                    ?.toLowerCase()
                    .includes(searchValue) ||
                account?.account_number?.toLowerCase().includes(searchValue) ||
                appointment.type?.toLowerCase().includes(searchValue) ||
                formatService(appointment.type)
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === 'all' || appointment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [appointments, search, statusFilter]);

    return (
        <>
            <Head title="Agent Appointments" />

            <div className="min-h-screen bg-[#F8F6F1] p-4 text-[#171412] lg:p-6 dark:bg-[#0F0D0B] dark:text-[#F5F0EA]">
                <div className="mx-auto max-w-7xl space-y-6">
                    <section className="relative overflow-hidden rounded-[2rem] border border-[#ECE7DF] bg-[#171412] p-6 text-white shadow-sm dark:border-[#2A2520]">
                        <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-orange-600/20 blur-3xl" />

                        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black tracking-[0.18em] text-orange-200 uppercase">
                                    <CalendarCheck className="h-3.5 w-3.5" />
                                    Branch Workspace
                                </div>

                                <h1 className="text-2xl font-black tracking-tight md:text-4xl">
                                    Agent Appointments
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                                    Manage appointments for your branch, confirm
                                    customer visits, and verify QR check-ins.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
                                <p className="text-sm font-semibold text-white/60">
                                    Current Branch
                                </p>

                                <p className="mt-1 text-xl font-black">
                                    {auth?.user?.name ?? 'Branch Agent'}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                        <StatCard
                            label="Completed"
                            value={stats?.completed_appointments ?? 0}
                            icon={<QrCode className="h-6 w-6" />}
                            tone="orange"
                        />
                    </section>

                    <section className="rounded-[2rem] border border-[#ECE7DF] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="text-xl font-black">
                                    Branch Schedule
                                </h2>

                                <p className="mt-1 text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                    {filteredAppointments.length} appointment
                                    result(s)
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#ECE7DF] bg-[#FFFCFA] px-4 py-3 sm:w-[360px] dark:border-[#2A2520] dark:bg-[#252118]">
                                    <Search className="h-4 w-4 shrink-0 text-[#9A948C]" />

                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search customer, email, phone, service..."
                                        className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#A8A098]"
                                    />
                                </div>

                                <div className="min-w-[190px]">
                                    <CustomSelect
                                        value={statusFilter}
                                        placeholder="All Status"
                                        options={[
                                            {
                                                value: 'all',
                                                label: 'All Status',
                                            },
                                            {
                                                value: 'pending',
                                                label: 'Pending',
                                            },
                                            {
                                                value: 'confirmed',
                                                label: 'Confirmed',
                                            },
                                            {
                                                value: 'completed',
                                                label: 'Completed',
                                            },
                                            {
                                                value: 'cancelled',
                                                label: 'Cancelled',
                                            },
                                        ]}
                                        onChange={(value) =>
                                            setStatusFilter(
                                                value as
                                                    | 'all'
                                                    | 'pending'
                                                    | 'confirmed'
                                                    | 'completed'
                                                    | 'cancelled',
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {filteredAppointments.length > 0 ? (
                        <section className="grid gap-4">
                            {filteredAppointments.map((appointment) => {
                                const account =
                                    appointment.user?.bank_account ??
                                    appointment.user?.bankAccount;

                                return (
                                    <article
                                        key={appointment.id}
                                        className="rounded-[2rem] border border-[#ECE7DF] bg-white p-5 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/20 dark:border-[#2A2520] dark:bg-[#1A1714] dark:hover:bg-orange-500/5"
                                    >
                                        <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr_0.9fr] xl:items-center">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-[#7a2800] text-sm font-black text-white shadow-lg shadow-orange-900/20">
                                                    <UserRound className="h-6 w-6" />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="truncate text-lg font-black">
                                                            {appointment.user
                                                                ?.name ??
                                                                'Unknown customer'}
                                                        </h3>

                                                        <span
                                                            className={`rounded-full border px-3 py-1 text-xs font-black capitalize ${statusClass(
                                                                appointment.status,
                                                            )}`}
                                                        >
                                                            {appointment.status}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 grid gap-1 text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                                        <p className="inline-flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            {appointment.user
                                                                ?.email ??
                                                                'No email'}
                                                        </p>

                                                        <p className="inline-flex items-center gap-2">
                                                            <Phone className="h-4 w-4" />
                                                            {appointment.user
                                                                ?.profile
                                                                ?.phone ??
                                                                'No phone'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <InfoPill
                                                    icon={
                                                        <CalendarClock className="h-4 w-4" />
                                                    }
                                                    label="Date"
                                                    value={appointment.date}
                                                />

                                                <InfoPill
                                                    icon={
                                                        <Clock className="h-4 w-4" />
                                                    }
                                                    label="Time"
                                                    value={appointment.time.slice(
                                                        0,
                                                        5,
                                                    )}
                                                />

                                                <InfoPill
                                                    icon={
                                                        <WalletCards className="h-4 w-4" />
                                                    }
                                                    label="Service"
                                                    value={formatService(
                                                        appointment.type,
                                                    )}
                                                />

                                                <InfoPill
                                                    icon={
                                                        <WalletCards className="h-4 w-4" />
                                                    }
                                                    label="Account"
                                                    value={
                                                        account?.account_number ??
                                                        'No account'
                                                    }
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3 xl:items-end">
                                                {appointment.checked_in_at ? (
                                                    <div className="inline-flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm font-black text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Checked in
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-500 dark:bg-white/5 dark:text-white/50">
                                                        <QrCode className="h-4 w-4" />
                                                        Not checked in
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-2 xl:justify-end">
                                                    {appointment.status ===
                                                        'pending' && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                confirmAppointment(
                                                                    appointment.id,
                                                                )
                                                            }
                                                            className="rounded-xl bg-green-600 px-4 py-2 text-xs font-black text-white transition hover:bg-green-700"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}

                                                    {appointment.status !==
                                                        'cancelled' &&
                                                        !appointment.checked_in_at && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    cancelAppointment(
                                                                        appointment.id,
                                                                    )
                                                                }
                                                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white transition hover:bg-red-700"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}

                                                    {appointment.qr_token && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openVerifyPage(
                                                                    appointment.qr_token,
                                                                )
                                                            }
                                                            className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white transition hover:bg-[#7a2800]"
                                                        >
                                                            Verify QR
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
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
                                Your branch has no appointments matching this
                                search or filter.
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}

function InfoPill({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-[#FFFCFA] p-4 dark:bg-[#252118]">
            <div className="mb-1 flex items-center gap-2 text-xs font-black tracking-[0.14em] text-[#A8A098] uppercase">
                {icon}
                {label}
            </div>

            <p className="truncate font-black">{value}</p>
        </div>
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

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tones[tone]}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
