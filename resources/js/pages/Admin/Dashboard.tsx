import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    // Bell,
    Building2,
    // ChevronDown,
    CreditCard,
    FileBarChart2,
    Globe,
    // LayoutDashboard,
    Lock,
    Search,
    Shield,
    TrendingUp,
    UserCog,
    Users,
    Wallet,
    XCircle,
    Trash2,
    Eye,
    ArrowRightLeft,
    // Settings,
    // LifeBuoy,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    bank_account: {
        account_number: string;
        account_type: string;
        balance: number;
    } | null;
    profile: { phone: string } | null;
}

interface PageProps extends InertiaPageProps {
    auth: { user: User };
    users: User[];
    stats: {
        total_users: number;
        total_accounts: number;
        total_balance: number;
        total_transactions: number;
    };
}

export default function AdminDashboard() {
    const { auth, users = [], stats } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const adminName = auth.user.name.split(' ')[0];
    const initials = auth.user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                (u.bank_account?.account_number ?? '')
                    .toLowerCase()
                    .includes(search.toLowerCase()),
        );
    }, [users, search]);

    const recentUsers = [...users]
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        )
        .slice(0, 5);

    const totalAdmins = users.filter((u) => u.role === 'admin').length;
    const totalCustomers = users.filter((u) => u.role !== 'admin').length;
    const usersWithAccounts = users.filter((u) => u.bank_account).length;
    const zeroBalanceAccounts = users.filter(
        (u) => (u.bank_account?.balance ?? 0) <= 0,
    ).length;

    const handleDelete = (id: number) => {
        router.delete(`/admin/users/${id}`, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const formatMoney = (value: number) =>
        `${Number(value).toLocaleString('en-MA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} MAD`;

    const statCards = [
        {
            label: 'Total Users',
            value: stats?.total_users ?? 0,
            icon: Users,
            tone: 'orange',
            change: '+8.6% vs last month',
        },
        {
            label: 'Active Accounts',
            value: stats?.total_accounts ?? 0,
            icon: CreditCard,
            tone: 'amber',
            change: '+6.3% vs last month',
        },
        {
            label: 'Total Balance',
            value: formatMoney(stats?.total_balance ?? 0),
            icon: Wallet,
            tone: 'green',
            change: '+5.7% vs last month',
        },
        {
            label: "Today's Transactions",
            value: stats?.total_transactions ?? 0,
            icon: ArrowRightLeft,
            tone: 'blue',
            change: '+12.4% vs yesterday',
        },
        {
            label: 'Pending Reports',
            value: zeroBalanceAccounts,
            icon: FileBarChart2,
            tone: 'orange',
            change: '-10 vs yesterday',
        },
        {
            label: 'Locked Accounts',
            value: 0,
            icon: Lock,
            tone: 'red',
            change: '+0 vs yesterday',
        },
    ];

    // const sidebarItems = [
    //     { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', active: true },
    //     { icon: Users, label: 'Users', href: '/admin' },
    //     { icon: CreditCard, label: 'Accounts', href: '/admin' },
    //     { icon: ArrowRightLeft, label: 'Transactions', href: '/admin' },
    //     { icon: Shield, label: 'Security Center', href: '/admin' },
    //     { icon: FileBarChart2, label: 'Reports', href: '/admin' },
    //     { icon: LifeBuoy, label: 'Support Tickets', href: '/admin' },
    //     { icon: Settings, label: 'Settings', href: '/admin' },
    // ];

    const toneClasses: Record<
        string,
        { bg: string; text: string; border: string; soft: string }
    > = {
        orange: {
            bg: 'bg-orange-500',
            text: 'text-orange-600',
            border: 'border-orange-200',
            soft: 'bg-orange-50',
        },
        amber: {
            bg: 'bg-amber-500',
            text: 'text-amber-600',
            border: 'border-amber-200',
            soft: 'bg-amber-50',
        },
        green: {
            bg: 'bg-green-500',
            text: 'text-green-600',
            border: 'border-green-200',
            soft: 'bg-green-50',
        },
        blue: {
            bg: 'bg-blue-500',
            text: 'text-blue-600',
            border: 'border-blue-200',
            soft: 'bg-blue-50',
        },
        red: {
            bg: 'bg-red-500',
            text: 'text-red-600',
            border: 'border-red-200',
            soft: 'bg-red-50',
        },
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-[#F8F6F1] text-[#171412]">
                <div className="flex min-h-screen">


                    {/* Content */}
                    <main className="min-w-0 flex-1">
                        {/* Top Bar */}


                        <div className="space-y-6 p-5 lg:p-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-6">
                                {statCards.map((card) => {
                                    const Icon = card.icon;
                                    const tone = toneClasses[card.tone];

                                    return (
                                        <div
                                            key={card.label}
                                            className="rounded-3xl border border-[#ECE7DF] bg-white p-5 shadow-sm"
                                        >
                                            <div className="mb-4 flex items-start justify-between">
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.soft} ${tone.text}`}
                                                >
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                            </div>

                                            <p className="text-sm text-[#7B756E]">
                                                {card.label}
                                            </p>
                                            <p className="mt-1 text-[30px] font-extrabold leading-none tracking-tight text-[#171412]">
                                                {card.value}
                                            </p>
                                            <p className="mt-3 text-sm text-[#7B756E]">
                                                <span className="font-semibold text-green-600">
                                                    ↗
                                                </span>{' '}
                                                {card.change}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Middle Grid */}
                            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
                                {/* Security Center */}
                                <section className="rounded-3xl border border-[#ECE7DF] bg-white shadow-sm 2xl:col-span-4">
                                    <div className="flex items-center justify-between border-b border-[#F2EEEA] px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-[#171412]" />
                                            <h3 className="text-lg font-bold">
                                                Security Center
                                            </h3>
                                        </div>
                                        <button className="text-sm font-semibold text-orange-600">
                                            View All
                                        </button>
                                    </div>

                                    <div className="divide-y divide-[#F2EEEA]">
                                        {[
                                            {
                                                icon: AlertTriangle,
                                                title: 'Suspicious Activity Reports',
                                                desc: 'New reports requiring review',
                                                value: 24,
                                                tone: 'red',
                                                delta: '+20%',
                                            },
                                            {
                                                icon: Lock,
                                                title: 'Failed Login Attempts',
                                                desc: 'Last 24 hours',
                                                value: 1287,
                                                tone: 'amber',
                                                delta: '+15%',
                                            },
                                            {
                                                icon: ArrowRightLeft,
                                                title: 'Large Transfers',
                                                desc: 'Over threshold detected',
                                                value: 36,
                                                tone: 'orange',
                                                delta: '+8%',
                                            },
                                            {
                                                icon: UserCog,
                                                title: 'Pending Identity Verification',
                                                desc: 'Waiting document review',
                                                value: 89,
                                                tone: 'blue',
                                                delta: '+5%',
                                            },
                                        ].map((item) => {
                                            const Icon = item.icon;
                                            const tone = toneClasses[item.tone];

                                            return (
                                                <div
                                                    key={item.title}
                                                    className="flex items-center gap-4 px-6 py-5"
                                                >
                                                    <div
                                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone.soft} ${tone.text}`}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-semibold text-[#171412]">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-sm text-[#9A948C]">
                                                            {item.desc}
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-[#171412]">
                                                            {item.value}
                                                        </p>
                                                        <p className="text-xs text-red-500">
                                                            ↑ {item.delta}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Recent Activity */}
                                <section className="rounded-3xl border border-[#ECE7DF] bg-white shadow-sm 2xl:col-span-4">
                                    <div className="flex items-center justify-between border-b border-[#F2EEEA] px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <ArrowRightLeft className="h-5 w-5 text-[#171412]" />
                                            <h3 className="text-lg font-bold">
                                                Recent Users
                                            </h3>
                                        </div>
                                        <button className="text-sm font-semibold text-orange-600">
                                            View All Users
                                        </button>
                                    </div>

                                    <div className="divide-y divide-[#F2EEEA]">
                                        {recentUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-4 px-6 py-4"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF1E9] font-semibold text-orange-600">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-sm text-[#9A948C]">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-[#171412]">
                                                        {user.bank_account?.account_type ??
                                                            'No account'}
                                                    </p>
                                                    <p className="text-xs text-[#9A948C]">
                                                        {user.bank_account
                                                            ? formatMoney(
                                                                Number(
                                                                    user
                                                                        .bank_account
                                                                        .balance,
                                                                ),
                                                            )
                                                            : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {recentUsers.length === 0 && (
                                            <div className="px-6 py-10 text-center text-sm text-[#9A948C]">
                                                No recent users found
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* User Summary */}
                                <section className="rounded-3xl border border-[#ECE7DF] bg-white shadow-sm 2xl:col-span-4">
                                    <div className="flex items-center justify-between border-b border-[#F2EEEA] px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <UserCog className="h-5 w-5 text-[#171412]" />
                                            <h3 className="text-lg font-bold">
                                                User Summary
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6">
                                        {[
                                            {
                                                label: 'Branch / Admin Users',
                                                value: totalAdmins,
                                                tone: 'blue',
                                            },
                                            {
                                                label: 'Customer Users',
                                                value: totalCustomers,
                                                tone: 'green',
                                            },
                                            {
                                                label: 'Users With Accounts',
                                                value: usersWithAccounts,
                                                tone: 'orange',
                                            },
                                            {
                                                label: 'Accounts With Zero Balance',
                                                value: zeroBalanceAccounts,
                                                tone: 'red',
                                            },
                                        ].map((item) => {
                                            const tone = toneClasses[item.tone];

                                            return (
                                                <div
                                                    key={item.label}
                                                    className={`rounded-2xl border p-4 ${tone.border} ${tone.soft}`}
                                                >
                                                    <p className="text-sm text-[#7B756E]">
                                                        {item.label}
                                                    </p>
                                                    <p className={`mt-1 text-2xl font-extrabold ${tone.text}`}>
                                                        {item.value}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </div>

                            {/* User table */}
                            <section className="overflow-hidden rounded-3xl border border-[#ECE7DF] bg-white shadow-sm">
                                <div className="flex flex-col gap-4 border-b border-[#F2EEEA] px-6 py-5 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            User Management
                                        </h3>
                                        <p className="text-sm text-[#9A948C]">
                                            Manage customers, account holders,
                                            and admin access.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-[#9A948C]">
                                            {filteredUsers.length} users
                                        </span>

                                        <div className="flex items-center gap-2 rounded-2xl border border-[#ECE7DF] bg-[#FCFBF9] px-3 py-2">
                                            <Search className="h-4 w-4 text-[#9A948C]" />
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                placeholder="Search users..."
                                                className="bg-transparent text-sm outline-none placeholder:text-[#9A948C]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                            <tr className="bg-[#FCFBF9]">
                                                {[
                                                    'User',
                                                    'Account Number',
                                                    'Type',
                                                    'Balance',
                                                    'Role',
                                                    'Joined',
                                                    'Actions',
                                                ].map((head) => (
                                                    <th
                                                        key={head}
                                                        className="whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-[#9A948C]"
                                                    >
                                                        {head}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((u, index) => (
                                                    <tr
                                                        key={u.id}
                                                        className={`border-t border-[#F2EEEA] ${index % 2 === 0
                                                                ? 'bg-white'
                                                                : 'bg-[#FFFCFA]'
                                                            }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1E9] font-semibold text-orange-600">
                                                                    {u.avatar ? (
                                                                        // ✅ IMAGE
                                                                        <div className="h-10 w-10 rounded-full overflow-hidden">
                                                                            <img
                                                                                src={`/storage/${u.avatar}`}
                                                                                alt={u.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        // ✅ INITIALS FALLBACK
                                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1E9] font-semibold text-orange-600">
                                                                            {u.name
                                                                                .split(' ')
                                                                                .map((n) => n[0])
                                                                                .join('')
                                                                                .toUpperCase()
                                                                                .slice(0, 2)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-semibold text-[#171412]">
                                                                        {u.name}
                                                                    </p>
                                                                    <p className="truncate text-sm text-[#7B756E]">
                                                                        {u.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4 text-sm font-mono text-[#4D4944]">
                                                            {u.bank_account
                                                                ?.account_number ??
                                                                '—'}
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            {u.bank_account ? (
                                                                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
                                                                    {
                                                                        u
                                                                            .bank_account
                                                                            .account_type
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="text-sm text-[#9A948C]">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4 text-sm font-semibold text-[#171412]">
                                                            {u.bank_account
                                                                ? formatMoney(
                                                                    Number(
                                                                        u
                                                                            .bank_account
                                                                            .balance,
                                                                    ),
                                                                )
                                                                : '—'}
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${u.role ===
                                                                        'admin'
                                                                        ? 'bg-[#171412] text-white'
                                                                        : 'bg-green-50 text-green-700'
                                                                    }`}
                                                            >
                                                                {u.role}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4 text-sm text-[#7B756E]">
                                                            {new Date(
                                                                u.created_at,
                                                            ).toLocaleDateString(
                                                                'en-GB',
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <button className="rounded-xl border border-[#ECE7DF] p-2 text-[#4D4944] hover:bg-[#F8F6F1]">
                                                                    <Eye className="h-4 w-4" />
                                                                </button>

                                                                <button className="rounded-xl border border-[#ECE7DF] p-2 text-[#4D4944] hover:bg-[#F8F6F1]">
                                                                    <Shield className="h-4 w-4" />
                                                                </button>

                                                                {u.role !==
                                                                    'admin' && (
                                                                        <button
                                                                            onClick={() =>
                                                                                setDeleteConfirm(
                                                                                    u.id,
                                                                                )
                                                                            }
                                                                            className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="px-6 py-14 text-center text-sm text-[#9A948C]"
                                                    >
                                                        No users found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Bottom widgets */}
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                                {/* Risk overview */}
                                <section className="rounded-3xl border border-[#ECE7DF] bg-white p-6 shadow-sm">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5" />
                                            <h3 className="text-lg font-bold">
                                                Risk & Compliance
                                            </h3>
                                        </div>
                                        <button className="rounded-xl border border-[#ECE7DF] px-3 py-2 text-sm font-medium">
                                            Last 30 Days
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                label: 'High Risk Alerts',
                                                value: 128,
                                                change: '+18%',
                                                color: 'text-red-500',
                                            },
                                            {
                                                label: 'Compliance Reviews',
                                                value: 342,
                                                change: '+12%',
                                                color: 'text-green-600',
                                            },
                                            {
                                                label: 'Policy Violations',
                                                value: 23,
                                                change: '+9%',
                                                color: 'text-red-500',
                                            },
                                            {
                                                label: 'Sanctions Matches',
                                                value: 7,
                                                change: '+13%',
                                                color: 'text-green-600',
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between rounded-2xl bg-[#FCFBF9] px-4 py-3"
                                            >
                                                <div>
                                                    <p className="text-sm text-[#7B756E]">
                                                        {item.label}
                                                    </p>
                                                    <p className="text-lg font-bold">
                                                        {item.value}
                                                    </p>
                                                </div>
                                                <p
                                                    className={`text-sm font-semibold ${item.color}`}
                                                >
                                                    {item.change}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Global operations */}
                                <section className="rounded-3xl border border-[#ECE7DF] bg-white p-6 shadow-sm">
                                    <div className="mb-5 flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        <h3 className="text-lg font-bold">
                                            Global Operations
                                        </h3>
                                    </div>

                                    <div className="flex h-[260px] items-center justify-center rounded-3xl bg-[#FCFBF9]">
                                        <div className="text-center">
                                            <Building2 className="mx-auto h-12 w-12 text-orange-500" />
                                            <p className="mt-4 font-semibold">
                                                Global Branch Overview
                                            </p>
                                            <p className="mt-1 text-sm text-[#9A948C]">
                                                42 branches across regions
                                            </p>
                                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                                <div className="rounded-2xl bg-white px-4 py-3">
                                                    North America: 12
                                                </div>
                                                <div className="rounded-2xl bg-white px-4 py-3">
                                                    Europe: 9
                                                </div>
                                                <div className="rounded-2xl bg-white px-4 py-3">
                                                    Asia Pacific: 11
                                                </div>
                                                <div className="rounded-2xl bg-white px-4 py-3">
                                                    MENA: 10
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* System summary */}
                                <section className="rounded-3xl border border-[#ECE7DF] bg-white p-6 shadow-sm">
                                    <div className="mb-5 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        <h3 className="text-lg font-bold">
                                            System Summary
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                label: 'System Uptime',
                                                value: '99.98%',
                                                sub: 'All systems healthy',
                                            },
                                            {
                                                label: 'Active Sessions',
                                                value: '2,847',
                                                sub: '+7% vs yesterday',
                                            },
                                            {
                                                label: 'Data Storage',
                                                value: '68%',
                                                sub: '2.04TB / 3TB used',
                                            },
                                            {
                                                label: 'API Requests (24h)',
                                                value: '1.32M',
                                                sub: '+9% vs yesterday',
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="rounded-2xl bg-[#FCFBF9] p-4"
                                            >
                                                <p className="text-sm text-[#7B756E]">
                                                    {item.label}
                                                </p>
                                                <p className="mt-1 text-[32px] font-extrabold leading-none">
                                                    {item.value}
                                                </p>
                                                <p className="mt-2 text-sm text-[#7B756E]">
                                                    {item.sub}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
                    <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <XCircle className="h-8 w-8" />
                        </div>

                        <h3 className="text-center text-2xl font-extrabold text-[#171412]">
                            Delete User
                        </h3>

                        <p className="mt-3 text-center text-sm leading-6 text-[#7B756E]">
                            Are you sure you want to delete this user? This will
                            also remove the linked bank account and all related
                            transactions.
                            <span className="font-semibold text-red-600">
                                {' '}
                                This action cannot be undone.
                            </span>
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 rounded-2xl border border-[#ECE7DF] px-4 py-3 font-semibold text-[#4D4944] transition hover:bg-[#F8F6F1]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}