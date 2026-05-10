import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Fingerprint,
    Lock,
    PiggyBank,
    Search,
    ShieldAlert,
    ShieldCheck,
    TrendingUp,
    UserRound,
    WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type RiskFlag = {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
};

type RiskScore = {
    score: number;
    level: 'excellent' | 'low' | 'medium' | 'high';
    identity_score: number;
    security_score: number;
    transaction_score: number;
    loan_score: number;
    saving_score: number;
    flags?: RiskFlag[] | string | null;
    recommendations?: string[] | string | null;
    calculated_at?: string | null;
};

type User = {
    id: number;
    name: string;
    email: string;
    role?: string;
    created_at?: string;
    profile?: {
        cin?: string | null;
        phone?: string | null;
    } | null;
    bank_account?: {
        account_number?: string | null;
        account_type?: string | null;
        balance?: number | string | null;
    } | null;
    bankAccount?: {
        account_number?: string | null;
        account_type?: string | null;
        balance?: number | string | null;
    } | null;
    risk_score?: RiskScore | null;
    riskScore?: RiskScore | null;
};

type Props = {
    users: User[];
};

const parseJsonArray = <T,>(value: T[] | string | null | undefined): T[] => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    try {
        return JSON.parse(value);
    } catch {
        return [];
    }
};

const levelStyle = {
    excellent: 'bg-emerald-50 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-300',
    low: 'bg-green-50 text-green-700 ring-green-500/20 dark:bg-green-950/30 dark:text-green-300',
    medium: 'bg-amber-50 text-amber-700 ring-amber-500/20 dark:bg-amber-950/30 dark:text-amber-300',
    high: 'bg-red-50 text-red-700 ring-red-500/20 dark:bg-red-950/30 dark:text-red-300',
};

const scoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
};

const getBankAccount = (user: User) => user.bank_account ?? user.bankAccount ?? null;
const getRiskScore = (user: User) => user.risk_score ?? user.riskScore ?? null;

export default function AdminRiskIndex({ users }: Props) {
    const [query, setQuery] = useState('');
    const [level, setLevel] = useState<'all' | 'excellent' | 'low' | 'medium' | 'high'>('all');

    const normalizedUsers = users.map((user) => ({
        ...user,
        bank: getBankAccount(user),
        risk: getRiskScore(user),
    }));

    const stats = useMemo(() => {
        const total = normalizedUsers.length;
        const high = normalizedUsers.filter((user) => user.risk?.level === 'high').length;
        const medium = normalizedUsers.filter((user) => user.risk?.level === 'medium').length;
        const low = normalizedUsers.filter((user) => user.risk?.level === 'low' || user.risk?.level === 'excellent').length;
        const avg =
            total > 0
                ? Math.round(
                      normalizedUsers.reduce((sum, user) => sum + Number(user.risk?.score ?? 0), 0) / total,
                  )
                : 0;

        return { total, high, medium, low, avg };
    }, [users]);

    const filteredUsers = normalizedUsers.filter((user) => {
        const risk = user.risk;
        const bank = user.bank;

        const matchesSearch =
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            String(bank?.account_number ?? '').toLowerCase().includes(query.toLowerCase()) ||
            String(user.profile?.cin ?? '').toLowerCase().includes(query.toLowerCase());

        const matchesLevel = level === 'all' || risk?.level === level;

        return matchesSearch && matchesLevel;
    });

    return (
        <>
            <Head title="Admin Risk Center" />

            <div
                className="min-h-screen bg-[#F8F6F1] p-4 text-[#1f1a17] sm:p-6 lg:p-8 dark:bg-[#0f0d0b] dark:text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="overflow-hidden rounded-[2rem] bg-[#15110D] shadow-xl">
                        <div className="relative p-6 sm:p-8">
                            <div className="absolute right-0 top-0 h-56 w-56 translate-x-20 -translate-y-20 rounded-full bg-orange-500/20 blur-3xl" />
                            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-300">
                                        <ShieldAlert size={14} />
                                        Admin Intelligence Center
                                    </div>

                                    <h1
                                        className="text-3xl font-black tracking-tight text-white sm:text-4xl"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        Aman Score Monitoring
                                    </h1>

                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
                                        Monitor customer trust scores, detect high-risk accounts,
                                        and review identity/security issues from one place.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                                        <p className="text-xs text-white/45">Users</p>
                                        <p className="mt-1 text-2xl font-black text-white">{stats.total}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                                        <p className="text-xs text-white/45">Avg Score</p>
                                        <p className="mt-1 text-2xl font-black text-white">{stats.avg}</p>
                                    </div>
                                    <div className="rounded-2xl bg-red-500/10 p-4 ring-1 ring-red-500/20">
                                        <p className="text-xs text-red-200/70">High Risk</p>
                                        <p className="mt-1 text-2xl font-black text-red-300">{stats.high}</p>
                                    </div>
                                    <div className="rounded-2xl bg-green-500/10 p-4 ring-1 ring-green-500/20">
                                        <p className="text-xs text-green-200/70">Healthy</p>
                                        <p className="mt-1 text-2xl font-black text-green-300">{stats.low}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10">
                                    <UserRound size={20} className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#1f1a17]/45 dark:text-white/45">Total customers</p>
                                    <p className="text-xl font-black">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10">
                                    <AlertTriangle size={20} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#1f1a17]/45 dark:text-white/45">High risk</p>
                                    <p className="text-xl font-black">{stats.high}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10">
                                    <TrendingUp size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#1f1a17]/45 dark:text-white/45">Medium risk</p>
                                    <p className="text-xl font-black">{stats.medium}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10">
                                    <ShieldCheck size={20} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#1f1a17]/45 dark:text-white/45">Low/Excellent</p>
                                    <p className="text-xl font-black">{stats.low}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-black">Customer Risk Table</h2>
                                <p className="text-sm text-[#1f1a17]/50 dark:text-white/50">
                                    Review all customer Aman Scores and flags.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative">
                                    <Search
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1f1a17]/35 dark:text-white/35"
                                    />
                                    <input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search name, email, CIN, account..."
                                        className="h-11 w-full rounded-xl border border-[#EDE8E0] bg-[#F8F6F1] pl-10 pr-4 text-sm outline-none focus:border-orange-500 dark:border-[#2A2520] dark:bg-[#241b16]"
                                    />
                                </div>

                                <select
                                    value={level}
                                    onChange={(event) => setLevel(event.target.value as any)}
                                    className="h-11 rounded-xl border border-[#EDE8E0] bg-[#F8F6F1] px-4 text-sm font-semibold outline-none focus:border-orange-500 dark:border-[#2A2520] dark:bg-[#241b16]"
                                >
                                    <option value="all">All levels</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-[#1f1a17]/40 dark:text-white/40">
                                        <th className="px-4">Customer</th>
                                        <th className="px-4">Account</th>
                                        <th className="px-4">Score</th>
                                        <th className="px-4">Breakdown</th>
                                        <th className="px-4">Flags</th>
                                        <th className="px-4">Updated</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const risk = user.risk;
                                        const bank = user.bank;
                                        const flags = parseJsonArray<RiskFlag>(risk?.flags);

                                        return (
                                            <tr
                                                key={user.id}
                                                className="rounded-2xl bg-[#F8F6F1] text-sm dark:bg-[#241b16]"
                                            >
                                                <td className="rounded-l-2xl px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10">
                                                            <UserRound size={18} className="text-orange-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{user.name}</p>
                                                            <p className="text-xs text-[#1f1a17]/45 dark:text-white/45">
                                                                {user.email}
                                                            </p>
                                                            <p className="mt-1 text-[11px] text-[#1f1a17]/35 dark:text-white/35">
                                                                CIN: {user.profile?.cin ?? 'Not verified'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p className="font-mono text-xs font-bold">
                                                        {bank?.account_number ?? '—'}
                                                    </p>
                                                    <p className="mt-1 text-xs capitalize text-[#1f1a17]/45 dark:text-white/45">
                                                        {bank?.account_type ?? 'No account'}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {risk ? (
                                                        <>
                                                            <p className={`text-2xl font-black ${scoreColor(risk.score)}`}>
                                                                {risk.score}
                                                            </p>
                                                            <span
                                                                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ring-1 ${levelStyle[risk.level]}`}
                                                            >
                                                                {risk.level}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-[#1f1a17]/40 dark:text-white/40">
                                                            Not calculated
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {risk ? (
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {[
                                                                [Fingerprint, risk.identity_score, 25],
                                                                [Lock, risk.security_score, 25],
                                                                [WalletCards, risk.transaction_score, 20],
                                                                [TrendingUp, risk.loan_score, 15],
                                                                [PiggyBank, risk.saving_score, 15],
                                                            ].map(([Icon, value, max], index) => {
                                                                const IconComponent = Icon as typeof Fingerprint;
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="rounded-xl bg-white p-2 text-center dark:bg-[#1A1714]"
                                                                    >
                                                                        <IconComponent
                                                                            size={14}
                                                                            className="mx-auto mb-1 text-orange-500"
                                                                        />
                                                                        <p className="text-[10px] font-bold">
                                                                            {String(value)}/{String(max)}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {flags.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {flags.slice(0, 2).map((flag, index) => (
                                                                <div
                                                                    key={`${flag.type}-${index}`}
                                                                    className="rounded-lg bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-700 dark:text-red-300"
                                                                >
                                                                    {flag.message}
                                                                </div>
                                                            ))}
                                                            {flags.length > 2 && (
                                                                <p className="text-[11px] text-[#1f1a17]/45 dark:text-white/45">
                                                                    +{flags.length - 2} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                                                            <CheckCircle2 size={13} />
                                                            Clean
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="rounded-r-2xl px-4 py-4 text-xs text-[#1f1a17]/45 dark:text-white/45">
                                                    {risk?.calculated_at
                                                        ? new Date(risk.calculated_at).toLocaleString()
                                                        : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-[#EDE8E0] p-8 text-center text-sm text-[#1f1a17]/50 dark:border-[#2A2520] dark:text-white/50">
                                No customers match your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminRiskIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin Risk Center',
            href: '/admin/risk-center',
        },
    ],
};