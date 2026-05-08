import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    CalendarDays,
    CreditCard,
    Crown,
    Eye,
    Mail,
    MoreHorizontal,
    Phone,
    Search,
    Trash2,
    UserCog,
    UserRound,
    Users,
    Wallet,
    XCircle,
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
    profile: {
        phone: string;
    } | null;
}

interface PageProps extends InertiaPageProps {
    auth: {
        user: User;
    };
    users: User[];
    stats: {
        total_users: number;
        total_accounts: number;
        total_balance: number;
    };
}

export default function AdminUsers() {
    const { users = [] } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const account = u.bank_account ?? u.bankAccount;

            return (
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                (account?.account_number ?? '').toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [users, search]);

    const totalAdmins = users.filter((u) => u.role === 'admin').length;
    const totalCustomers = users.filter((u) => u.role !== 'admin').length;
    const usersWithAccounts = users.filter((u) => u.bank_account ?? u.bankAccount).length;

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

    const handleDelete = (id: number) => {
        router.delete(`/admin/users/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteConfirm(null),
            onError: (errors) => {
                alert(errors.user ?? 'Delete failed.');
            },
        });
    };

    return (
        <>
            <Head title="Admin Users" />

            <div className="min-h-screen bg-[#F8F6F1] p-4 text-[#171412] dark:bg-[#0F0D0B] dark:text-[#F5F0EA] lg:p-6">
                <section className="overflow-hidden rounded-[2rem] border border-[#ECE7DF] bg-white shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                    <div className="relative overflow-hidden border-b border-[#F2EEEA] bg-[#FFFCFA] px-6 py-6 dark:border-[#2A2520] dark:bg-[#181511]">
                        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
                        <div className="absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-[#7a2800]/10 blur-3xl" />

                        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <Users className="h-3.5 w-3.5" />
                                    Customer Directory
                                </div>

                                <h1 className="text-2xl font-black tracking-tight text-[#171412] dark:text-[#F5F0EA] md:text-3xl">
                                    User Management
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7B756E] dark:text-[#AFA49A]">
                                    Monitor customer profiles, linked bank accounts, balances, and administrative roles from one secure workspace.
                                </p>
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#ECE7DF] bg-white px-4 py-3 shadow-sm dark:border-[#2A2520] dark:bg-[#252118] xl:w-[390px]">
                                    <Search className="h-4 w-4 shrink-0 text-[#9A948C]" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search name, email, account..."
                                        className="w-full bg-transparent text-sm font-semibold text-[#171412] outline-none placeholder:text-[#A8A098] dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center justify-center rounded-2xl border border-[#ECE7DF] bg-white px-5 py-3 text-sm font-black text-[#171412] shadow-sm dark:border-[#2A2520] dark:bg-[#252118] dark:text-white">
                                    {filteredUsers.length} users
                                </div>
                            </div>
                        </div>

                        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard label="Total Users" value={users.length} icon={<Users className="h-6 w-6" />} tone="orange" />
                            <StatCard label="Admins" value={totalAdmins} icon={<Crown className="h-6 w-6" />} tone="blue" />
                            <StatCard label="Customers" value={totalCustomers} icon={<UserRound className="h-6 w-6" />} tone="green" />
                            <StatCard label="Linked Accounts" value={usersWithAccounts} icon={<CreditCard className="h-6 w-6" />} tone="amber" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-[#FCFBF9] dark:bg-[#201C18]">
                                    {['Customer', 'Contact', 'Account', 'Balance', 'Role', 'Joined', 'Actions'].map((head) => (
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
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((u, index) => {
                                        const account = u.bank_account ?? u.bankAccount;
                                        const isAdmin = u.role === 'admin';

                                        return (
                                            <tr
                                                key={u.id}
                                                className={`border-t border-[#F2EEEA] transition duration-200 hover:bg-orange-50/40 dark:border-[#2A2520] dark:hover:bg-orange-500/5 ${
                                                    index % 2 === 0 ? 'bg-white dark:bg-[#1A1714]' : 'bg-[#FFFCFA] dark:bg-[#181511]'
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
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-[#7a2800] text-sm font-black text-white shadow-lg shadow-orange-900/20">
                                                                {getInitials(u.name)}
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="truncate font-black text-[#171412] dark:text-white">
                                                                    {u.name}
                                                                </p>

                                                                {isAdmin && <BadgeCheck className="h-4 w-4 text-blue-600" />}
                                                            </div>

                                                            <p className="mt-1 text-xs font-bold text-[#A8A098]">
                                                                ID #{u.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#4D4944] dark:text-[#D8D0C8]">
                                                            <Mail className="h-4 w-4 text-[#A8A098]" />
                                                            <span className="max-w-[230px] truncate">{u.email}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-[#7B756E] dark:text-[#AFA49A]">
                                                            <Phone className="h-4 w-4 text-[#A8A098]" />
                                                            <span>{u.profile?.phone ?? 'No phone'}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    {account ? (
                                                        <div>
                                                            <p className="font-mono text-sm font-black text-[#171412] dark:text-white">
                                                                {account.account_number}
                                                            </p>

                                                            <span className="mt-2 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-black capitalize text-orange-600 dark:bg-orange-500/10">
                                                                {account.account_type}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-[#F5F1EA] px-3 py-1 text-xs font-black text-[#9A948C] dark:bg-[#252118]">
                                                            No account
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {account ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-500/10">
                                                                <Wallet className="h-4 w-4" />
                                                            </div>

                                                            <div>
                                                                <p className="text-sm font-black text-[#171412] dark:text-white">
                                                                    {formatMoney(Number(account.balance ?? 0))}
                                                                </p>
                                                                <p className="text-xs font-medium text-[#A8A098]">
                                                                    Available balance
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-[#9A948C]">—</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black capitalize ${
                                                            isAdmin
                                                                ? 'bg-[#171412] text-white dark:bg-white dark:text-[#171412]'
                                                                : 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                                        }`}
                                                    >
                                                        {isAdmin ? <Crown className="h-3.5 w-3.5" /> : <UserCog className="h-3.5 w-3.5" />}
                                                        {u.role}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-[#4D4944] dark:text-[#D8D0C8]">
                                                        <CalendarDays className="h-4 w-4 text-[#A8A098]" />
                                                        {formatDate(u.created_at)}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="rounded-xl border border-[#ECE7DF] p-2 text-[#4D4944] transition hover:bg-[#F8F6F1] dark:border-[#2A2520] dark:text-[#D8D0C8] dark:hover:bg-[#252118]"
                                                            title="View user"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="rounded-xl border border-[#ECE7DF] p-2 text-[#4D4944] transition hover:bg-[#F8F6F1] dark:border-[#2A2520] dark:text-[#D8D0C8] dark:hover:bg-[#252118]"
                                                            title="More details"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
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
                                                                className="cursor-not-allowed rounded-xl border border-[#ECE7DF] p-2 text-[#C8BFB5] dark:border-[#2A2520]"
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
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                                <Search className="h-7 w-7" />
                                            </div>

                                            <h3 className="mt-4 text-lg font-black text-[#171412] dark:text-white">
                                                No users found
                                            </h3>

                                            <p className="mt-2 text-sm text-[#9A948C]">
                                                Try another name, email, or account number.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {deleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
                    <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl dark:bg-[#1A1714]">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
                            <XCircle className="h-8 w-8" />
                        </div>

                        <h3 className="text-center text-2xl font-extrabold text-[#171412] dark:text-white">
                            Delete User
                        </h3>

                        <p className="mt-3 text-center text-sm leading-6 text-[#7B756E] dark:text-[#AFA49A]">
                            Are you sure you want to delete this user? This will also remove appointments, bank account, profile, and related transactions.
                            <span className="font-semibold text-red-600"> This action cannot be undone.</span>
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 rounded-2xl border border-[#ECE7DF] px-4 py-3 font-semibold text-[#4D4944] transition hover:bg-[#F8F6F1] dark:border-[#2A2520] dark:text-white dark:hover:bg-[#252118]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
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