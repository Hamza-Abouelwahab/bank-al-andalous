import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRightLeft,
    BadgeCheck,
    Banknote,
    CheckCircle2,
    Clock,
    FileWarning,
    Fingerprint,
    Globe2,
    KeyRound,
    Lock,
    Radar,
    Shield,
    ShieldAlert,
    ShieldCheck,
    TrendingUp,
    UserCog,
    Users,
} from 'lucide-react';

interface Transaction {
    id: number;
    type?: string;
    category?: string;
    amount: number;
    description?: string | null;
    reference?: string | null;
    status?: string | null;
    created_at: string;
}

interface PageProps extends InertiaPageProps {
    largeTransfers: Transaction[];
    stats: {
        suspicious_reports: number;
        failed_logins: number;
        large_transfers: number;
        locked_accounts: number;
        zero_balance_accounts: number;
        admin_users: number;
        customer_users: number;
    };
}

export default function AdminSecurity() {
    const { stats, largeTransfers = [] } = usePage<PageProps>().props;

    const formatMoney = (value: number) =>
        `${Number(value).toLocaleString('en-MA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} MAD`;

    const formatDate = (date: string) =>
        new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });

    const securityStats = [
        {
            label: 'Suspicious Reports',
            value: stats?.suspicious_reports ?? 0,
            icon: ShieldAlert,
            tone: 'red',
            sub: 'Require admin review',
        },
        {
            label: 'Failed Logins',
            value: stats?.failed_logins ?? 0,
            icon: KeyRound,
            tone: 'amber',
            sub: 'Last 24 hours',
        },
        {
            label: 'Large Transfers',
            value: stats?.large_transfers ?? 0,
            icon: ArrowRightLeft,
            tone: 'orange',
            sub: 'High value movement',
        },
        {
            label: 'Locked Accounts',
            value: stats?.locked_accounts ?? 0,
            icon: Lock,
            tone: 'blue',
            sub: 'Currently restricted',
        },
    ];

    const riskItems = [
        {
            title: 'Large transaction monitoring',
            desc: 'Transfers and withdrawals above the security threshold are flagged for review.',
            icon: Banknote,
            status: 'Active',
            tone: 'orange',
        },
        {
            title: 'Admin role protection',
            desc: 'Admin accounts cannot be deleted from user management.',
            icon: UserCog,
            status: 'Protected',
            tone: 'blue',
        },
        {
            title: 'Account balance watch',
            desc: 'Zero or negative balance accounts are monitored as operational risk.',
            icon: Radar,
            status: `${stats?.zero_balance_accounts ?? 0} flagged`,
            tone: 'amber',
        },
        {
            title: 'Session and login control',
            desc: 'Failed login and lockout tracking can be connected to activity logs later.',
            icon: Fingerprint,
            status: 'Ready',
            tone: 'green',
        },
    ];

    const complianceItems = [
        {
            title: 'KYC / Identity Review',
            value: 'Ready',
            icon: BadgeCheck,
        },
        {
            title: 'Transaction Review',
            value: `${stats?.large_transfers ?? 0} items`,
            icon: ArrowRightLeft,
        },
        {
            title: 'Policy Alerts',
            value: `${stats?.suspicious_reports ?? 0} reports`,
            icon: FileWarning,
        },
        {
            title: 'System Health',
            value: 'Stable',
            icon: CheckCircle2,
        },
    ];

    return (
        <>
            <Head title="Admin Security Center" />

            <div className="min-h-screen bg-[#F8F6F1] p-4 text-[#171412] dark:bg-[#0F0D0B] dark:text-[#F5F0EA] lg:p-6">
                <div className="space-y-6">
                    {/* Hero */}
                    <section className="relative overflow-hidden rounded-[2rem] border border-[#2A2520] bg-[#171412] p-6 text-white shadow-sm">
                        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" />
                        <div className="absolute bottom-0 left-1/2 h-44 w-44 rounded-full bg-orange-500/20 blur-3xl" />

                        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-200">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Security Center
                                </div>

                                <h1 className="text-2xl font-black tracking-tight md:text-4xl">
                                    Bank Risk & Security
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                                    Monitor risky activity, admin protection, large transfers, login security, and operational risk signals.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
                                <p className="text-sm font-semibold text-white/60">
                                    Security Status
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-green-400" />
                                    <p className="text-3xl font-black">Active</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main stats */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {securityStats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <SecurityStatCard
                                    key={item.label}
                                    label={item.label}
                                    value={item.value}
                                    sub={item.sub}
                                    icon={<Icon className="h-6 w-6" />}
                                    tone={item.tone as 'red' | 'amber' | 'orange' | 'blue'}
                                />
                            );
                        })}
                    </section>

                    {/* Security grid */}
                    <section className="grid gap-6 xl:grid-cols-12">
                        {/* Risk Controls */}
                        <div className="rounded-[2rem] border border-[#ECE7DF] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] xl:col-span-7">
                            <div className="border-b border-[#F2EEEA] px-6 py-5 dark:border-[#2A2520]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                        <Shield className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black">Risk Controls</h2>
                                        <p className="text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                            Security modules currently monitored by the admin panel.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 p-6 md:grid-cols-2">
                                {riskItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="rounded-3xl border border-[#ECE7DF] bg-[#FFFCFA] p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#2A2520] dark:bg-[#181511]"
                                        >
                                            <div className="mb-4 flex items-start justify-between gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#7B756E] shadow-sm dark:bg-[#252118] dark:text-[#AFA49A]">
                                                    {item.status}
                                                </span>
                                            </div>

                                            <h3 className="font-black">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-6 text-[#7B756E] dark:text-[#AFA49A]">
                                                {item.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Compliance */}
                        <div className="rounded-[2rem] border border-[#ECE7DF] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] xl:col-span-5">
                            <div className="border-b border-[#F2EEEA] px-6 py-5 dark:border-[#2A2520]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                                        <Globe2 className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black">Compliance Overview</h2>
                                        <p className="text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                            Admin-level risk and compliance summary.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 p-6">
                                {complianceItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="flex items-center justify-between rounded-2xl border border-[#ECE7DF] bg-[#FFFCFA] p-4 dark:border-[#2A2520] dark:bg-[#181511]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                                    <Icon className="h-4 w-4" />
                                                </div>

                                                <p className="font-bold">{item.title}</p>
                                            </div>

                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#7B756E] dark:bg-[#252118] dark:text-[#AFA49A]">
                                                {item.value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Large transfers */}
                    <section className="overflow-hidden rounded-[2rem] border border-[#ECE7DF] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="flex flex-col gap-2 border-b border-[#F2EEEA] bg-[#FFFCFA] px-6 py-5 dark:border-[#2A2520] dark:bg-[#181511]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black">Large Transfer Watchlist</h2>
                                    <p className="text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                        Recent transactions above the 5,000 MAD threshold.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#FCFBF9] dark:bg-[#201C18]">
                                        {['Reference', 'Description', 'Type', 'Amount', 'Status', 'Date'].map((head) => (
                                            <th
                                                key={head}
                                                className="whitespace-nowrap px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.18em] text-[#9A948C]"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {largeTransfers.length > 0 ? (
                                        largeTransfers.map((tx, index) => (
                                            <tr
                                                key={tx.id}
                                                className={`border-t border-[#F2EEEA] transition hover:bg-red-50/30 dark:border-[#2A2520] dark:hover:bg-red-500/5 ${
                                                    index % 2 === 0
                                                        ? 'bg-white dark:bg-[#1A1714]'
                                                        : 'bg-[#FFFCFA] dark:bg-[#181511]'
                                                }`}
                                            >
                                                <td className="px-6 py-5">
                                                    <p className="font-mono text-sm font-black">
                                                        {tx.reference ?? `TX-${tx.id}`}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="max-w-[300px] truncate text-sm font-semibold">
                                                        {tx.description ?? 'Large transaction'}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black capitalize text-orange-600 dark:bg-orange-500/10">
                                                        {tx.category ?? tx.type ?? 'transaction'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="font-black text-red-600">
                                                        {formatMoney(Number(tx.amount ?? 0))}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black capitalize text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                                        {tx.status ?? 'completed'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-[#4D4944] dark:text-[#D8D0C8]">
                                                        <Clock className="h-4 w-4 text-[#A8A098]" />
                                                        {formatDate(tx.created_at)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-green-50 text-green-600 dark:bg-green-500/10">
                                                    <CheckCircle2 className="h-7 w-7" />
                                                </div>

                                                <h3 className="mt-4 text-lg font-black">
                                                    No large transfers found
                                                </h3>

                                                <p className="mt-2 text-sm text-[#9A948C]">
                                                    No transactions above the security threshold were detected.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Bottom summary */}
                    <section className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-[2rem] border border-[#ECE7DF] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                                    <Users className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#8A837A] dark:text-[#AFA49A]">
                                        Admin Users
                                    </p>
                                    <p className="text-2xl font-black">
                                        {stats?.admin_users ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-[#ECE7DF] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-500/10">
                                    <Users className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#8A837A] dark:text-[#AFA49A]">
                                        Customer Users
                                    </p>
                                    <p className="text-2xl font-black">
                                        {stats?.customer_users ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-[#ECE7DF] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10">
                                    <TrendingUp className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#8A837A] dark:text-[#AFA49A]">
                                        Zero Balance Accounts
                                    </p>
                                    <p className="text-2xl font-black">
                                        {stats?.zero_balance_accounts ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function SecurityStatCard({
    label,
    value,
    sub,
    icon,
    tone,
}: {
    label: string;
    value: number;
    sub: string;
    icon: React.ReactNode;
    tone: 'red' | 'amber' | 'orange' | 'blue';
}) {
    const tones = {
        red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:border-red-500/20',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20',
        orange: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20',
        blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20',
    };

    return (
        <div className="rounded-3xl border border-[#ECE7DF] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-[#8A837A] dark:text-[#AFA49A]">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-black text-[#171412] dark:text-white">
                        {value}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#A8A098]">
                        {sub}
                    </p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tones[tone]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}