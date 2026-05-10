import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRightLeft,
    CalendarCheck,
    CalendarDays,
    ChevronDown,
    CreditCard,
    Eye,
    FileBarChart2,
    Globe,
    Lock,
    Mail,
    Phone,
    Search,
    Shield,
    Trash2,
    UserCog,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    created_at: string;
    bank_account: {
        account_number: string;
        account_type: string;
        balance: number;
    } | null;
    bankAccount?: {
        account_number: string;
        account_type: string;
        balance: number;
    } | null;
    profile: { phone: string } | null;
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
    auth: { user: User };
    users: User[];
    appointments: Appointment[];
    stats: {
        total_users: number;
        total_accounts: number;
        total_balance: number;
        total_transactions: number;
        future_appointments: number;
    };
}

type Tone = 'orange' | 'green' | 'red' | 'blue' | 'amber' | 'purple';
type RoleFilter = 'users' | 'agents' | 'admins';

export default function AdminDashboard() {
    const { auth, users = [], appointments = [], stats } =
        usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('users');
    const [roleMenuOpen, setRoleMenuOpen] = useState(false);

    const adminName = auth.user.name.split(' ')[0];

    const totalAdmins = users.filter((u) => u.role === 'admin').length;
    const totalAgents = users.filter((u) => u.role === 'agent').length;
    const totalRegularUsers = users.filter((u) => u.role === 'user').length;
    const totalCustomers = users.filter((u) => u.role !== 'admin').length;

    const roleOptions: { key: RoleFilter; label: string; count: number }[] = [
        { key: 'users', label: 'Users', count: totalRegularUsers },
        { key: 'agents', label: 'Agents', count: totalAgents },
        { key: 'admins', label: 'Admins', count: totalAdmins },
    ];

    const selectedRoleOption =
        roleOptions.find((option) => option.key === roleFilter) ?? roleOptions[0];

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const account = u.bank_account ?? u.bankAccount;
            const query = search.toLowerCase();

            const matchesSearch =
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                (u.profile?.phone ?? '').toLowerCase().includes(query) ||
                (account?.account_number ?? '').toLowerCase().includes(query);

            const matchesRole =
                roleFilter === 'users'
                    ? u.role === 'user'
                    : roleFilter === 'agents'
                        ? u.role === 'agent'
                        : u.role === 'admin';

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const displayedUsers = filteredUsers.slice(0, 5);

    const recentUsers = [...users]
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        )
        .slice(0, 5);

    const usersWithAccounts = users.filter((u) => u.bank_account ?? u.bankAccount).length;
    const zeroBalanceAccounts = users.filter((u) => {
        const account = u.bank_account ?? u.bankAccount;
        return (account?.balance ?? 0) <= 0;
    }).length;

    const handleDelete = (id: number) => {
        router.delete(`/admin/users/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteConfirm(null),
            onError: (errors) => {
                console.log(errors);
                alert(
                    errors.user ??
                    'Delete failed. Check if your admin middleware allows this action.',
                );
            },
        });
    };

    const formatMoney = (value: number) =>
        `${Number(value).toLocaleString('en-MA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} MAD`;

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

    const toneClasses: Record<
        Tone,
        {
            iconBox: string;
            icon: string;
            card: string;
            text: string;
            pill: string;
        }
    > = {
        orange: {
            iconBox: 'bg-orange-50 dark:bg-orange-500/10',
            icon: 'text-orange-500',
            card: 'border-orange-100 bg-orange-50/70 dark:border-orange-500/20 dark:bg-orange-500/10',
            text: 'text-orange-600 dark:text-orange-400',
            pill: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
        },
        green: {
            iconBox: 'bg-emerald-50 dark:bg-emerald-500/10',
            icon: 'text-emerald-500',
            card: 'border-emerald-100 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/10',
            text: 'text-emerald-600 dark:text-emerald-400',
            pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        },
        red: {
            iconBox: 'bg-red-50 dark:bg-red-500/10',
            icon: 'text-red-500',
            card: 'border-red-100 bg-red-50/70 dark:border-red-500/20 dark:bg-red-500/10',
            text: 'text-red-600 dark:text-red-400',
            pill: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
        },
        blue: {
            iconBox: 'bg-blue-50 dark:bg-blue-500/10',
            icon: 'text-blue-500',
            card: 'border-blue-100 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-500/10',
            text: 'text-blue-600 dark:text-blue-400',
            pill: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        },
        amber: {
            iconBox: 'bg-amber-50 dark:bg-amber-500/10',
            icon: 'text-amber-500',
            card: 'border-amber-100 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10',
            text: 'text-amber-600 dark:text-amber-400',
            pill: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        },
        purple: {
            iconBox: 'bg-purple-50 dark:bg-purple-500/10',
            icon: 'text-purple-500',
            card: 'border-purple-100 bg-purple-50/70 dark:border-purple-500/20 dark:bg-purple-500/10',
            text: 'text-purple-600 dark:text-purple-400',
            pill: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
        },
    };

    const statCards = [
        {
            label: 'Total Users',
            value: stats?.total_users ?? users.length,
            icon: Users,
            tone: 'orange' as Tone,
            change: '+8.6%',
        },
        {
            label: 'Active Accounts',
            value: stats?.total_accounts ?? usersWithAccounts,
            icon: CreditCard,
            tone: 'green' as Tone,
            change: '+6.3%',
        },
        {
            label: 'Total Balance',
            value: formatMoney(stats?.total_balance ?? 0),
            icon: Wallet,
            tone: 'orange' as Tone,
            change: '+5.7%',
        },
        {
            label: "Today's Transactions",
            value: stats?.total_transactions ?? 0,
            icon: ArrowRightLeft,
            tone: 'red' as Tone,
            change: '+12.4%',
        },
        {
            label: 'Future Appointments',
            value: stats?.future_appointments ?? appointments.length,
            icon: CalendarCheck,
            tone: 'purple' as Tone,
            change: 'Upcoming',
        },
        {
            label: 'Zero Balance Accounts',
            value: zeroBalanceAccounts,
            icon: FileBarChart2,
            tone: 'red' as Tone,
            change: 'Review',
        },
    ];

    const securityItems = [
        {
            icon: AlertTriangle,
            title: 'Suspicious Activity Reports',
            desc: 'New reports requiring review',
            value: 24,
            tone: 'red' as Tone,
            delta: '+20%',
        },
        {
            icon: Lock,
            title: 'Failed Login Attempts',
            desc: 'Last 24 hours',
            value: 1287,
            tone: 'amber' as Tone,
            delta: '+15%',
        },
        {
            icon: ArrowRightLeft,
            title: 'Large Transfers',
            desc: 'Over threshold detected',
            value: 36,
            tone: 'orange' as Tone,
            delta: '+8%',
        },
        {
            icon: UserCog,
            title: 'Pending Identity Verification',
            desc: 'Waiting document review',
            value: 89,
            tone: 'blue' as Tone,
            delta: '+5%',
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-[#F8F6F1] text-[#1f1a17] transition-colors duration-300 dark:bg-[#0F0D0B] dark:text-white">
                <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 lg:px-8">
                    {/* Welcome */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
                                <Shield className="h-3.5 w-3.5" />
                                Admin Control
                            </span>
                            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1f1a17] sm:text-3xl dark:text-white">
                                Good evening, {adminName} 👋
                            </h1>
                            <p className="mt-1 text-sm font-medium text-[#1f1a17]/55 dark:text-white/55">
                                Monitor customers, accounts, appointments, and risk activity.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#EDE8E0] bg-white px-4 py-3 text-sm font-black text-[#1f1a17] shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] dark:text-white">
                            {filteredUsers.length} users
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-6">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            const tone = toneClasses[card.tone];

                            return (
                                <div
                                    key={card.label}
                                    className="fintech-card rounded-[26px] border border-[#EDE8E0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-900/5 dark:border-[#2A2520] dark:bg-[#1A1714] dark:hover:border-orange-500/20 sm:p-5"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-2">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.iconBox}`}
                                        >
                                            <Icon className={`h-5 w-5 ${tone.icon}`} />
                                        </div>

                                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 sm:text-xs">
                                            ↗ {card.change}
                                        </span>
                                    </div>

                                    <p className="text-xs font-bold text-[#1f1a17]/50 sm:text-sm dark:text-white/50">
                                        {card.label}
                                    </p>
                                    <p className="mt-1 break-words text-[17px] leading-tight font-extrabold text-[#1f1a17] sm:text-xl dark:text-white">
                                        {card.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Middle Grid */}
                    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
                        {/* Security Center */}
                        <section className="rounded-[26px] border border-[#EDE8E0] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] 2xl:col-span-4">
                            <SectionHeader
                                icon={<Shield className="h-5 w-5 text-orange-500" />}
                                title="Security Center"
                                action="View All"
                            />

                            <div className="divide-y divide-[#EDE8E0] dark:divide-[#2A2520]">
                                {securityItems.map((item) => {
                                    const Icon = item.icon;
                                    const tone = toneClasses[item.tone];

                                    return (
                                        <div
                                            key={item.title}
                                            className="flex items-center gap-4 px-5 py-4 transition hover:bg-orange-50/40 dark:hover:bg-orange-500/5"
                                        >
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone.iconBox}`}
                                            >
                                                <Icon className={`h-5 w-5 ${tone.icon}`} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-black text-[#1f1a17] dark:text-white">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs font-medium text-[#1f1a17]/45 dark:text-white/45">
                                                    {item.desc}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-extrabold text-[#1f1a17] dark:text-white">
                                                    {item.value}
                                                </p>
                                                <p className="text-xs font-bold text-red-500">
                                                    ↑ {item.delta}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Recent Users */}
                        <section className="rounded-[26px] border border-[#EDE8E0] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] 2xl:col-span-4">
                            <SectionHeader
                                icon={<Users className="h-5 w-5 text-orange-500" />}
                                title="Recent Users"
                                action="View All Users"
                            />

                            <div className="divide-y divide-[#EDE8E0] dark:divide-[#2A2520]">
                                {recentUsers.length > 0 ? (
                                    recentUsers.map((user) => {
                                        const account = user.bank_account ?? user.bankAccount;

                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-4 px-5 py-4 transition hover:bg-orange-50/40 dark:hover:bg-orange-500/5"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-[#7a2800] font-black text-white shadow-lg shadow-orange-900/15">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-black text-[#1f1a17] dark:text-white">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-xs font-medium text-[#1f1a17]/45 dark:text-white/45">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm font-bold capitalize text-[#1f1a17] dark:text-white">
                                                        {account?.account_type ?? 'No account'}
                                                    </p>
                                                    <p className="text-xs text-[#1f1a17]/45 dark:text-white/45">
                                                        {account
                                                            ? formatMoney(Number(account.balance))
                                                            : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <EmptyState text="No recent users found" />
                                )}
                            </div>
                        </section>

                        {/* User Summary */}
                        <section className="rounded-[26px] border border-[#EDE8E0] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] 2xl:col-span-4">
                            <SectionHeader
                                icon={<UserCog className="h-5 w-5 text-orange-500" />}
                                title="User Summary"
                            />

                            <div className="grid gap-3 p-5 sm:grid-cols-2 2xl:grid-cols-1">
                                {[
                                    {
                                        label: 'Branch / Admin Users',
                                        value: totalAdmins,
                                        tone: 'blue' as Tone,
                                    },
                                    {
                                        label: 'Customer Users',
                                        value: totalCustomers,
                                        tone: 'green' as Tone,
                                    },
                                    {
                                        label: 'Users With Accounts',
                                        value: usersWithAccounts,
                                        tone: 'orange' as Tone,
                                    },
                                    {
                                        label: 'Accounts With Zero Balance',
                                        value: zeroBalanceAccounts,
                                        tone: 'red' as Tone,
                                    },
                                ].map((item) => {
                                    const tone = toneClasses[item.tone];

                                    return (
                                        <div
                                            key={item.label}
                                            className={`rounded-2xl border p-4 ${tone.card}`}
                                        >
                                            <p className="text-sm font-semibold text-[#1f1a17]/55 dark:text-white/55">
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


                    {/* User Management */}
                    <section
                        id="users"
                        className="mt-6 overflow-hidden rounded-[2rem] border border-[#EDE8E0] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]"
                    >
                        <div className="border-b border-[#EDE8E0] bg-gradient-to-r from-white via-[#FFFCFA] to-orange-50/40 px-5 py-6 dark:border-[#2A2520] dark:from-[#1A1714] dark:via-[#1A1714] dark:to-orange-500/5 sm:px-6">
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
                                        <Users className="h-3.5 w-3.5" />
                                        Admin Users
                                    </div>

                                    <h2 className="text-2xl font-black tracking-tight text-[#1f1a17] dark:text-white">
                                        User Management
                                    </h2>

                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#1f1a17]/50 dark:text-white/45">
                                        Showing only the first 5 users. Use search or role filter to find more users.
                                    </p>
                                </div>

                                <div className="flex w-full flex-col gap-3 lg:flex-row xl:w-auto">
                                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#EDE8E0] bg-white px-4 py-3 shadow-sm dark:border-[#2A2520] dark:bg-[#252118] lg:w-[430px]">
                                        <Search className="h-4 w-4 shrink-0 text-[#1f1a17]/40 dark:text-white/40" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search name, email, phone, account..."
                                            className="w-full bg-transparent text-sm font-semibold text-[#1f1a17] outline-none placeholder:text-[#1f1a17]/35 dark:text-white dark:placeholder:text-white/30"
                                        />
                                    </div>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setRoleMenuOpen((current) => !current)}
                                            className="flex h-full min-h-[50px] w-full items-center justify-between gap-4 rounded-2xl border-2 border-orange-900/30 bg-white px-5 py-3 text-sm font-black text-[#1f1a17] shadow-sm transition hover:border-orange-500/50 dark:border-[#7a2800]/70 dark:bg-[#252118] dark:text-white lg:w-[210px]"
                                        >
                                            <span>
                                                {selectedRoleOption.label} ({selectedRoleOption.count})
                                            </span>
                                            <ChevronDown
                                                className={`h-4 w-4 text-orange-500 transition ${roleMenuOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>

                                        {roleMenuOpen && (
                                            <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-orange-900/30 bg-white p-2 shadow-2xl shadow-orange-900/20 dark:border-[#7a2800]/70 dark:bg-[#24160f] lg:w-[210px]">
                                                {roleOptions.map((option) => {
                                                    const active = option.key === roleFilter;

                                                    return (
                                                        <button
                                                            key={option.key}
                                                            type="button"
                                                            onClick={() => {
                                                                setRoleFilter(option.key);
                                                                setRoleMenuOpen(false);
                                                            }}
                                                            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-black transition ${active
                                                                    ? 'bg-orange-600 text-white'
                                                                    : 'text-[#1f1a17] hover:bg-orange-50 dark:text-white dark:hover:bg-orange-500/10'
                                                                }`}
                                                        >
                                                            <span>{option.label}</span>
                                                            <span>({option.count})</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-2xl border border-[#EDE8E0] bg-white px-5 py-3 text-sm font-black text-[#1f1a17] shadow-sm dark:border-[#2A2520] dark:bg-[#252118] dark:text-white">
                                        {displayedUsers.length} of {filteredUsers.length} users
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <MiniStat
                                    label="Total Users"
                                    value={users.length}
                                    icon={<Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                                    className={toneClasses.orange.card}
                                />

                                <MiniStat
                                    label="Admins"
                                    value={totalAdmins}
                                    icon={<Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                    className={toneClasses.blue.card}
                                />

                                <MiniStat
                                    label="Customers"
                                    value={totalCustomers}
                                    icon={<UserCog className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                                    className={toneClasses.green.card}
                                />

                                <MiniStat
                                    label="With Accounts"
                                    value={usersWithAccounts}
                                    icon={<CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                                    className={toneClasses.amber.card}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#FCFBF9] dark:bg-[#201C18]">
                                        {[
                                            'User',
                                            'Contact',
                                            'Bank Account',
                                            'Balance',
                                            'Role',
                                            'Joined',
                                            'Actions',
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                className="whitespace-nowrap px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.18em] text-[#1f1a17]/45 dark:text-white/35"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {displayedUsers.length > 0 ? (
                                        displayedUsers.map((u, index) => {
                                            const account = u.bank_account ?? u.bankAccount;
                                            const isAdmin = u.role === 'admin';
                                            const isAgent = u.role === 'agent';

                                            return (
                                                <tr
                                                    key={u.id}
                                                    className={`border-t border-[#EDE8E0] transition hover:bg-orange-50/40 dark:border-[#2A2520] dark:hover:bg-orange-500/5 ${index % 2 === 0
                                                            ? 'bg-white dark:bg-[#1A1714]'
                                                            : 'bg-[#FFFCFA] dark:bg-[#181511]'
                                                        }`}
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            {u.avatar ? (
                                                                <img
                                                                    src={`/storage/${u.avatar}`}
                                                                    alt={u.name}
                                                                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-orange-100 dark:ring-orange-500/20"
                                                                />
                                                            ) : (
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-[#7a2800] text-sm font-black text-white shadow-lg shadow-orange-900/15">
                                                                    {getInitials(u.name)}
                                                                </div>
                                                            )}

                                                            <div className="min-w-0">
                                                                <p className="truncate font-black text-[#1f1a17] dark:text-white">
                                                                    {u.name}
                                                                </p>

                                                                <p className="mt-1 truncate text-xs font-medium text-[#1f1a17]/45 dark:text-white/40">
                                                                    User ID: #{u.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm text-[#1f1a17]/70 dark:text-white/70">
                                                                <Mail className="h-4 w-4 text-[#1f1a17]/35 dark:text-white/35" />
                                                                <span className="max-w-[220px] truncate">
                                                                    {u.email}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-2 text-sm text-[#1f1a17]/55 dark:text-white/50">
                                                                <Phone className="h-4 w-4 text-[#1f1a17]/35 dark:text-white/35" />
                                                                <span>{u.profile?.phone ?? 'No phone'}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        {account ? (
                                                            <div>
                                                                <p className="font-mono text-sm font-bold text-[#1f1a17] dark:text-white">
                                                                    {account.account_number}
                                                                </p>

                                                                <span className="mt-2 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold capitalize text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                                                    {account.account_type}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="rounded-full bg-[#F5F1EA] px-3 py-1 text-xs font-bold text-[#1f1a17]/45 dark:bg-[#252118] dark:text-white/40">
                                                                No account
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        {account ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                                    <Wallet className="h-4 w-4" />
                                                                </div>

                                                                <div>
                                                                    <p className="text-sm font-black text-[#1f1a17] dark:text-white">
                                                                        {formatMoney(Number(account.balance ?? 0))}
                                                                    </p>
                                                                    <p className="text-xs text-[#1f1a17]/45 dark:text-white/40">
                                                                        Available
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-[#1f1a17]/45 dark:text-white/40">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black capitalize ${isAdmin
                                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                                                    : isAgent
                                                                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
                                                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                }`}
                                                        >
                                                            {isAdmin ? (
                                                                <Shield className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <UserCog className="h-3.5 w-3.5" />
                                                            )}
                                                            {u.role}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#1f1a17]/70 dark:text-white/70">
                                                            <CalendarDays className="h-4 w-4 text-[#1f1a17]/35 dark:text-white/35" />
                                                            {formatDate(u.created_at)}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                className="rounded-xl border border-[#EDE8E0] p-2 text-[#1f1a17]/65 transition hover:bg-[#F8F6F1] dark:border-[#2A2520] dark:text-white/65 dark:hover:bg-[#252118]"
                                                                title="View user"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="rounded-xl border border-[#EDE8E0] p-2 text-[#1f1a17]/65 transition hover:bg-[#F8F6F1] dark:border-[#2A2520] dark:text-white/65 dark:hover:bg-[#252118]"
                                                                title="Security profile"
                                                            >
                                                                <Shield className="h-4 w-4" />
                                                            </button>

                                                            {!isAdmin ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDeleteConfirm(u.id)}
                                                                    className="rounded-xl border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                                                                    title="Delete user"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    className="cursor-not-allowed rounded-xl border border-[#EDE8E0] p-2 text-[#1f1a17]/25 dark:border-[#2A2520] dark:text-white/20"
                                                                    title="Admin users are protected"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-20 text-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                                    <Search className="h-7 w-7" />
                                                </div>

                                                <h3 className="mt-4 text-lg font-black text-[#1f1a17] dark:text-white">
                                                    No users found
                                                </h3>

                                                <p className="mt-2 text-sm text-[#1f1a17]/50 dark:text-white/45">
                                                    Try searching by another name, email, or account number.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Appointments */}
                    <section
                        id="appointments"
                        className="mt-6 overflow-hidden rounded-[2rem] border border-[#EDE8E0] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]"
                    >
                        <div className="flex flex-col gap-2 border-b border-[#EDE8E0] px-6 py-5 dark:border-[#2A2520]">
                            <div className="flex items-center gap-2">
                                <CalendarCheck className="h-5 w-5 text-orange-500" />
                                <h3 className="text-lg font-black text-[#1f1a17] dark:text-white">
                                    Future Appointments
                                </h3>
                            </div>
                            <p className="text-sm text-[#1f1a17]/50 dark:text-white/45">
                                All pending and confirmed appointments from all users.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#FCFBF9] dark:bg-[#201C18]">
                                        {['User', 'Email', 'Date', 'Time', 'Type', 'Status'].map(
                                            (head) => (
                                                <th
                                                    key={head}
                                                    className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-[#1f1a17]/45 dark:text-white/35"
                                                >
                                                    {head}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {appointments.length > 0 ? (
                                        appointments.map((appointment, index) => {
                                            const account =
                                                appointment.user?.bank_account ??
                                                appointment.user?.bankAccount;

                                            return (
                                                <tr
                                                    key={appointment.id}
                                                    className={`border-t border-[#EDE8E0] transition hover:bg-orange-50/40 dark:border-[#2A2520] dark:hover:bg-orange-500/5 ${index % 2 === 0
                                                        ? 'bg-white dark:bg-[#1A1714]'
                                                        : 'bg-[#FFFCFA] dark:bg-[#181511]'
                                                        }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-[#7a2800] font-black text-white shadow-lg shadow-orange-900/15">
                                                                {appointment.user?.name
                                                                    ?.charAt(0)
                                                                    .toUpperCase() ?? '?'}
                                                            </div>

                                                            <div>
                                                                <p className="font-black text-[#1f1a17] dark:text-white">
                                                                    {appointment.user?.name ?? 'Unknown user'}
                                                                </p>
                                                                <p className="text-xs text-[#1f1a17]/45 dark:text-white/40">
                                                                    {account?.account_number ?? 'No account'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-[#1f1a17]/65 dark:text-white/65">
                                                        {appointment.user?.email ?? '—'}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm font-bold text-[#1f1a17] dark:text-white">
                                                        {new Date(appointment.date).toLocaleDateString('en-GB')}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm font-bold text-[#1f1a17] dark:text-white">
                                                        {appointment.time}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold capitalize text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                                            {appointment.type}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${appointment.status === 'confirmed'
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                                }`}
                                                        >
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-14 text-center text-sm text-[#1f1a17]/50 dark:text-white/45"
                                            >
                                                No future appointments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Bottom widgets */}
                    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <DashboardWidget
                            icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
                            title="Risk & Compliance"
                            items={[
                                ['High Risk Alerts', '128', '+18%', 'text-red-500'],
                                ['Compliance Reviews', '342', '+12%', 'text-emerald-600 dark:text-emerald-400'],
                                ['Policy Violations', '23', '+9%', 'text-red-500'],
                                ['Sanctions Matches', '7', '+13%', 'text-emerald-600 dark:text-emerald-400'],
                            ]}
                        />

                        <section className="rounded-[26px] border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mb-5 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-orange-500" />
                                <h3 className="text-lg font-black text-[#1f1a17] dark:text-white">
                                    Global Operations
                                </h3>
                            </div>

                            <div className="flex h-[220px] items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-orange-50/50 text-center dark:border-orange-500/20 dark:bg-orange-500/5">
                                <div>
                                    <p className="text-4xl">🌍</p>
                                    <p className="mt-3 text-sm font-bold text-[#1f1a17]/60 dark:text-white/55">
                                        Operations overview placeholder
                                    </p>
                                    <p className="mt-1 text-xs text-[#1f1a17]/40 dark:text-white/35">
                                        Add regional metrics here later.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <DashboardWidget
                            icon={<Wallet className="h-5 w-5 text-orange-500" />}
                            title="Account Health"
                            items={[
                                ['Users With Accounts', String(usersWithAccounts), '+6%', 'text-emerald-600 dark:text-emerald-400'],
                                ['Zero Balance Accounts', String(zeroBalanceAccounts), 'Review', 'text-red-500'],
                                ['Customers', String(totalCustomers), 'Active', 'text-orange-600 dark:text-orange-400'],
                                ['Admins', String(totalAdmins), 'Protected', 'text-blue-600 dark:text-blue-400'],
                            ]}
                        />
                    </div>
                </main>
            </div >

            {deleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-[2rem] border border-[#EDE8E0] bg-white p-6 shadow-2xl dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-black text-[#1f1a17] dark:text-white">
                                    Delete user?
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-[#1f1a17]/55 dark:text-white/55">
                                    This action will remove the selected non-admin user. Confirm only if you are sure.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F8F6F1] text-[#1f1a17]/60 transition hover:bg-orange-50 hover:text-orange-600 dark:bg-white/5 dark:text-white/60 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 rounded-2xl border border-[#EDE8E0] bg-white px-4 py-3 text-sm font-black text-[#1f1a17] transition hover:bg-[#F8F6F1] dark:border-[#2A2520] dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    );
}

function SectionHeader({
    icon,
    title,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    action?: string;
}) {
    return (
        <div className="flex items-center justify-between border-b border-[#EDE8E0] px-5 py-5 dark:border-[#2A2520]">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-lg font-black text-[#1f1a17] dark:text-white">
                    {title}
                </h3>
            </div>
            {action && (
                <button className="text-sm font-black text-orange-600 transition hover:text-[#7a2800] dark:text-orange-400 dark:hover:text-orange-300">
                    {action}
                </button>
            )}
        </div>
    );
}

function MiniStat({
    label,
    value,
    icon,
    className,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    className: string;
}) {
    return (
        <div className={`rounded-2xl border p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1f1a17]/55 dark:text-white/55">
                    {label}
                </p>
                {icon}
            </div>
            <p className="mt-2 text-2xl font-black text-[#1f1a17] dark:text-white">
                {value}
            </p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="px-6 py-10 text-center text-sm font-medium text-[#1f1a17]/45 dark:text-white/40">
            {text}
        </div>
    );
}

function DashboardWidget({
    icon,
    title,
    items,
}: {
    icon: React.ReactNode;
    title: string;
    items: [string, string, string, string][];
}) {
    return (
        <section className="rounded-[26px] border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-lg font-black text-[#1f1a17] dark:text-white">
                        {title}
                    </h3>
                </div>
                <button className="rounded-xl border border-[#EDE8E0] px-3 py-2 text-xs font-bold text-[#1f1a17]/65 dark:border-[#2A2520] dark:text-white/60">
                    Last 30 Days
                </button>
            </div>

            <div className="space-y-3">
                {items.map(([label, value, change, color]) => (
                    <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-[#EDE8E0] bg-[#FCFBF9] px-4 py-3 dark:border-[#2A2520] dark:bg-[#201C18]"
                    >
                        <div>
                            <p className="text-sm font-medium text-[#1f1a17]/55 dark:text-white/50">
                                {label}
                            </p>
                            <p className="text-lg font-black text-[#1f1a17] dark:text-white">
                                {value}
                            </p>
                        </div>
                        <p className={`text-sm font-black ${color}`}>{change}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
