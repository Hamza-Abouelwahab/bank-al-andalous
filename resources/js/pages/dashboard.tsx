import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Bell,
    Bot,
    CreditCard,
    Eye,
    EyeOff,
    FileText,
    LayoutGrid,
    PiggyBank,
    Send,
    Sparkles,
    Target,
    Wallet,
    ShieldCheck,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { useState } from 'react';

interface BankAccount {
    account_number: string;
    account_type: string;
    balance: number;
}

interface Profile {
    date_of_birth: string;
    phone: string;
    address: string;
}

interface FinancialProfile {
    employment_status: string;
    occupation: string;
    monthly_income: string;
    source_of_funds: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    profile: Profile | null;
    bank_account: BankAccount | null;
    financial_profile: FinancialProfile | null;
}

interface Transaction {
    id: number;
    type: 'credit' | 'debit';
    category: string;
    amount: number;
    balance_after: number;
    description: string;
    reference: string;
    status: string;
    created_at: string;
}

const transactionIcon: Record<string, any> = {
    deposit: ArrowDownToLine,
    withdrawal: ArrowUpFromLine,
    transfer_out: Send,
    transfer_in: Send,
    bill_payment: FileText,
};

const alertIcons: Record<string, any> = {
    wallet: Wallet,
    target: Target,
    shield: ShieldCheck,
};

const quickActions = [
    { label: 'Deposit', href: '/deposit', icon: ArrowDownToLine, bg: 'bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10', color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Withdraw', href: '/withdraw', icon: ArrowUpFromLine, bg: 'bg-gradient-to-br from-[#f8f6f1] to-orange-50 dark:from-[#7a2800]/10 dark:to-orange-900/15', color: 'text-[#7a2800] dark:text-orange-500' },
    { label: 'Transfer', href: '/transfer', icon: Send, bg: 'bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10', color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Pay Bills', href: '/bills', icon: FileText, bg: 'bg-gradient-to-br from-[#f8f6f1] to-orange-50 dark:from-[#7a2800]/10 dark:to-orange-900/15', color: 'text-[#7a2800] dark:text-orange-500' },
    { label: 'My Card', href: '/account', icon: CreditCard, bg: 'bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10', color: 'text-orange-600 dark:text-orange-400' },
    { label: 'AI Advisor', href: '/ai-chat', icon: Bot, bg: 'bg-gradient-to-br from-[#f8f6f1] to-orange-50 dark:from-[#7a2800]/10 dark:to-orange-900/15', color: 'text-[#7a2800] dark:text-orange-500' },
];

export default function Dashboard() {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const {
        auth,
        transactions = [],
        summary = {},
        goals = [],
        challenges = [],
        ai_insights = [],
        alerts = [],
    } = usePage<any>().props;

    const user: AuthUser = auth.user;
    const account = user.bank_account;

    const [balanceVisible, setBalanceVisible] = useState(true);

    const balance = Number(account?.balance ?? 0);
    const income = Number(summary?.total_credit ?? 0);
    const expenses = Number(summary?.total_debit ?? 0);
    const savings = Math.max(income - expenses, 0);

    const firstName = user.name.split(' ')[0];

    const formatMoney = (value: number) =>
        `${Number(value).toLocaleString('en-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;

    const statCards = [
        { label: 'Total Balance', value: balanceVisible ? formatMoney(balance) : '•••••• MAD', icon: Wallet, bg: 'bg-orange-50 dark:bg-orange-500/10', iconColor: 'text-orange-500', change: '+12.5%', positive: true },
        { label: 'Income', value: formatMoney(income), icon: ArrowDownToLine, bg: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-500', change: '+8.2%', positive: true },
        { label: 'Expenses', value: formatMoney(expenses), icon: ArrowUpFromLine, bg: 'bg-red-50 dark:bg-red-500/10', iconColor: 'text-red-500', change: '+3.7%', positive: false },
        { label: 'Savings', value: formatMoney(savings), icon: PiggyBank, bg: 'bg-purple-50 dark:bg-purple-500/10', iconColor: 'text-purple-500', change: '+15.3%', positive: true },
    ];
    // logo 
    function BankLogo({

        className = '',
    }: {
        size?: number;
        className?: string;
    }) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 84"
                width={24}
                height={24}
                className={className}
                fill="none"
            >
                <path
                    d="M11 78 V30 C11 26.5 12.3 23.7 14.8 21.5 L19.4 17.4 L22.8 13.2 L26.1 9.1 L29.1 5.8 L32 3.5 L34.9 5.8 L37.9 9.1 L41.2 13.2 L44.6 17.4 L49.2 21.5 C51.7 23.7 53 26.5 53 30 V78"
                    stroke="#F97316"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M17 29 C17 26.4 18 24.2 19.9 22.5 L24 18.8 L26.8 15.2 L29.2 12.1 L32 9.8 L34.8 12.1 L37.2 15.2 L40 18.8 L44.1 22.5 C46 24.2 47 26.4 47 29"
                    stroke="#F97316"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18 78 V33 C18 30.6 18.9 28.6 20.6 27 L24.4 23.4 L27 20.2 L29.2 17.6 L32 15.4 L34.8 17.6 L37 20.2 L39.6 23.4 L43.4 27 C45.1 28.6 46 30.6 46 33 V78"
                    stroke="#F97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18 34.5H21.2"
                    stroke="#F97316"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <path
                    d="M42.8 34.5H46"
                    stroke="#F97316"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <path
                    d="M32 20.2 L33.1 22.6 L35.7 21.9 L35 24.5 L37.4 25.6 L35 26.7 L35.7 29.3 L33.1 28.6 L32 31 L30.9 28.6 L28.3 29.3 L29 26.7 L26.6 25.6 L29 24.5 L28.3 21.9 L30.9 22.6 Z"
                    fill="#F97316"
                />
                <g transform="translate(32 53)">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
                        <path
                            key={r}
                            d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                            stroke="#F97316"
                            strokeWidth="1.6"
                            fill="none"
                            transform={`rotate(${r})`}
                        />
                    ))}
                    <circle
                        cx="0"
                        cy="0"
                        r="2.2"
                        stroke="#F97316"
                        strokeWidth="1.4"
                        fill="none"
                    />
                </g>
            </svg>
        );
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-[#F8F6F1] dark:bg-[#0F0D0B]">
                <main className="px-3 py-5 sm:px-6 lg:px-8">

                    {/* ── Welcome Banner ── */}
                    <div className="mb-6 animate-fade-in">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Good {getTimeOfDay()}, {firstName} 👋
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Here's what's happening with your finances today.
                        </p>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 stagger animate-fade-in">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            const Trend = card.positive ? TrendingUp : TrendingDown;

                            return (
                                <div
                                    key={card.label}
                                    className="fintech-card rounded-[26px] border border-[#EDE8E0] bg-white p-4 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] sm:p-5"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-2">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.bg} sm:h-12 sm:w-12`}
                                        >
                                            <Icon className={`h-5 w-5 ${card.iconColor}`} />
                                        </div>

                                        <span
                                            className={`flex shrink-0 items-center gap-1 text-[10px] font-bold sm:text-xs ${card.positive ? 'text-emerald-600' : 'text-red-500'
                                                }`}
                                        >
                                            <Trend className="h-3 w-3" />
                                            {card.change}
                                        </span>
                                    </div>

                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                                        {card.label}
                                    </p>

                                    <p className="mt-1 break-words text-[17px] font-extrabold leading-tight text-slate-900 dark:text-white sm:text-xl">
                                        {card.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid gap-6 xl:grid-cols-3">

                        {/* Spending Chart */}
                        <div className="animate-fade-in rounded-2xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] xl:col-span-2">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Spending Overview</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">This Month</p>
                                </div>
                                <span className="rounded-xl border border-[#EDE8E0] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-[#2A2520] dark:text-slate-300">
                                    This Month
                                </span>
                            </div>
                            <div className="relative h-60 overflow-hidden rounded-xl bg-gradient-to-b from-orange-50/80 to-white dark:from-orange-500/5 dark:to-transparent">
                                <svg viewBox="0 0 700 220" className="h-full w-full" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#F97316" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {[30, 70, 110, 150, 190].map((y) => (
                                        <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="currentColor" strokeWidth="0.5" className="text-slate-100 dark:text-slate-800" />
                                    ))}
                                    <path d="M0 180 C70 100, 110 120, 160 130 C230 140, 250 60, 310 80 C370 105, 390 150, 450 110 C500 75, 540 100, 580 50 C630 10, 660 110, 700 90 L700 220 L0 220 Z"
                                        fill="url(#chartArea)" />
                                    <path d="M0 180 C70 100, 110 120, 160 130 C230 140, 250 60, 310 80 C370 105, 390 150, 450 110 C500 75, 540 100, 580 50 C630 10, 660 110, 700 90"
                                        fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                                <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[10px] text-slate-400">
                                    <span>1 Jun</span><span>7 Jun</span><span>14 Jun</span><span>21 Jun</span><span>30 Jun</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="animate-fade-in rounded-2xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent</h3>
                                <Link href="/transactions"
                                    className="rounded-lg  bg-gradient-to-r from-orange-600 to-[#7a2800]  hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/30 px-3 py-1.5 text-xs font-bold text-white transition">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 5).map((tx: Transaction) => {
                                        const Icon = transactionIcon[tx.category] ?? CreditCard;
                                        const isCredit = tx.type === 'credit';
                                        return (
                                            <div key={tx.id} className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isCredit ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
                                                    <Icon className={`h-4 w-4 ${isCredit ? 'text-emerald-500' : 'text-red-500'}`} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{tx.description}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                                <p className={`shrink-0 text-sm font-bold ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                                                    {isCredit ? '+' : '-'}{Number(tx.amount).toLocaleString('en-MA', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <span className="text-3xl">📭</span>
                                        <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">No transactions yet</p>
                                        <p className="mt-1 text-xs text-slate-400">Make a deposit to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom Grid ── */}
                    <div className="mt-6 grid gap-6 xl:grid-cols-3">

                        {/* Virtual Bank Card */}
                        <div className="animate-fade-in rounded-2xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Account Summary</h3>
                                <button onClick={() => setBalanceVisible(!balanceVisible)}
                                    className="rounded-xl cursor-pointer p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-white/5 transition">
                                    {balanceVisible ? <EyeOff className="h-5 w-5 " /> : <Eye className="h-5 w-5 text-orange-600" />}
                                </button>
                            </div>

                            {/* Card Visual */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f1a17] via-[#7a2800] to-orange-600 p-5 text-white shadow-lg shadow-orange-900/30">
                                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
                                <div className="relative">
                                    <div className="mb-8 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BankLogo className='' />
                                            <span className="text-m font-bold tracking-widest text-orange-100 uppercase">Al-Andalous</span>
                                        </div>
                                        <CreditCard className="h-5 w-5 text-white/60" />
                                    </div>
                                    <p className="font-mono text-sm tracking-[0.2em] text-white/80">
                                        **** **** **** {account?.account_number?.slice(-4) ?? '4242'}
                                    </p>
                                    <div className="mt-5">
                                        <p className="text-[10px] uppercase tracking-widest text-white/50">Balance</p>
                                        <p className="mt-1 text-2xl font-extrabold">
                                            {balanceVisible ? formatMoney(balance) : '•••••• MAD'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Smart Alerts */}
                        <div className="animate-fade-in rounded-2xl border border-orange-100 bg-white p-6 shadow-sm dark:border-orange-500/15 dark:bg-[#1A1714]">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Alerts</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Real-time insights</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10">
                                    <Bell className="h-4 w-4 text-orange-500" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {alerts.length > 0 ? (
                                    alerts.map((alert: any, index: number) => {
                                        const Icon = alertIcons[alert.icon];
                                        return (
                                            <div key={index} className="rounded-xl border border-orange-100 bg-orange-50/60 p-3 dark:border-orange-500/20 dark:bg-orange-500/5">
                                                <div className="flex items-center gap-2">
                                                    {Icon && <Icon className="h-4 w-4 shrink-0 text-orange-500" />}
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{alert.title}</p>
                                                </div>
                                                <p className="mt-1 pl-6 text-xs text-slate-500 dark:text-slate-400">{alert.message}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-white/5">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All clear! 🎉</p>
                                        <p className="mt-1 text-xs text-slate-400">Your account looks healthy.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="animate-fade-in rounded-3xl border border-orange-100/70 bg-gradient-to-br from-white via-[#f8f6f1]/30 to-orange-50/40 p-6 shadow-lg shadow-orange-900/5 dark:border-[#7a2800]/30 dark:from-[#1f1a17] dark:via-[#241b16] dark:to-[#2b160b]">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-[#7a2800] shadow-lg shadow-orange-600/25">
                                    <LayoutGrid className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-[#1f1a17] dark:text-white">Quick Actions</h3>
                                    <p className="text-xs font-medium text-[#1f1a17]/60 dark:text-white/60">Fast access to banking services</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <div key={action.label}
                                            onClick={() => setActiveModal(action.label)}
                                            className="group cursor-pointer rounded-2xl border border-orange-200/60 bg-white/80 p-4 text-center shadow-sm shadow-orange-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-900/15 dark:border-[#7a2800]/40 dark:bg-white/5 dark:hover:border-[#7a2800]/60">
                                            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${action.bg}`}>
                                                <Icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${action.color}`} />
                                            </div>
                                            <p className="text-xs font-extrabold text-[#1f1a17] dark:text-white">{action.label}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── AI & Goals Row ── */}
                    <div className="mt-6 grid gap-6 xl:grid-cols-3">

                        {/* Saving Goals */}
                        <div className="animate-fade-in rounded-2xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] xl:col-span-2">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10">
                                        <Target className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Saving Goals</h3>
                                </div>
                                <button onClick={() => router.visit('savings/index')}
                                    className="rounded-lg  bg-gradient-to-r from-orange-600 to-[#7a2800] px-3 py-1.5 text-xs font-bold cursor-pointer text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/30 transition">
                                    + New Goal
                                </button>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {goals.length > 0 ? (
                                    goals.slice(0, 4).map((goal: any) => {
                                        const saved = Number(goal.saved_amount ?? 0);
                                        const target = Number(goal.target_amount ?? 0);
                                        const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
                                        return (
                                            <div key={goal.id} className="rounded-xl border border-[#EDE8E0] p-4 dark:border-[#2A2520]">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{goal.name}</p>
                                                    <span className="ml-2 shrink-0 text-sm font-bold text-orange-500">{progress.toFixed(0)}%</span>
                                                </div>
                                                <div className="mb-2 h-2 rounded-full bg-slate-100 dark:bg-white/10">
                                                    <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 animate-progress-fill"
                                                        style={{ width: `${progress}%` }} />
                                                </div>
                                                <div className="flex justify-between text-xs text-slate-400">
                                                    <span>{formatMoney(saved)}</span>
                                                    <span>{formatMoney(target)}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-2 rounded-xl bg-slate-50 p-6 text-center dark:bg-white/5">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No saving goals yet</p>
                                        <p className="mt-1 text-xs text-slate-400">Create a goal to start tracking your progress.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="animate-fade-in rounded-3xl border border-orange-100/70 bg-gradient-to-br from-white via-[#f8f6f1]/30 to-orange-50/40 p-6 shadow-lg shadow-orange-900/5 dark:border-[#7a2800]/30 dark:from-[#1f1a17] dark:via-[#241b16] dark:to-[#2b160b]">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-[#7a2800] shadow-lg shadow-orange-600/25">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-[#1f1a17] dark:text-white">AI Insights</h3>
                                    <p className="text-xs font-medium text-[#1f1a17]/60 dark:text-white/60">Personalized financial guidance</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {ai_insights.length > 0 ? (
                                    ai_insights.slice(0, 2).map((insight: any) => (
                                        <div key={insight.id}
                                            className="group rounded-2xl border border-orange-200/60 bg-gradient-to-br from-[#f8f6f1] to-orange-50/60 p-4 shadow-sm shadow-orange-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-900/10 dark:border-[#7a2800]/40 dark:from-[#7a2800]/10 dark:to-orange-900/15">
                                            <p className="text-sm font-extrabold text-[#7a2800] dark:text-orange-300">{insight.title}</p>
                                            <p className="mt-2 text-xs leading-relaxed text-[#1f1a17]/70 dark:text-white/70">{insight.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="group rounded-2xl border border-orange-200/60 bg-gradient-to-br from-[#f8f6f1] to-orange-50/60 p-4 shadow-sm shadow-orange-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-900/10 dark:border-[#7a2800]/40 dark:from-[#7a2800]/10 dark:to-orange-900/15">
                                        <p className="text-sm font-extrabold text-[#7a2800] dark:text-orange-300">Smart saving tip 💡</p>
                                        <p className="mt-2 text-xs leading-relaxed text-[#1f1a17]/70 dark:text-white/70">
                                            Try saving 10% of each deposit automatically to build a healthy emergency fund.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <Link href="/ai-chat"
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-[#7a2800] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/30">
                                <Bot className="h-4 w-4" /> Ask AI Advisor
                            </Link>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── Quick Action Modal (iframe) ── */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
                    <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#1A1714]" style={{ height: '85vh' }}>
                        <div className="flex items-center justify-between border-b border-[#EDE8E0] px-5 py-4 dark:border-[#2A2520]">
                            <h2 className="font-bold text-slate-900 dark:text-white">{activeModal}</h2>
                            <button onClick={() => setActiveModal(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 transition">
                                ✕
                            </button>
                        </div>
                        <iframe
                            src={
                                activeModal === 'Deposit' ? '/deposit?modal=1' :
                                    activeModal === 'Withdraw' ? '/withdraw?modal=1' :
                                        activeModal === 'Transfer' ? '/transfer?modal=1' :
                                            activeModal === 'Pay Bills' ? '/bills?modal=1' :
                                                activeModal === 'Account' ? '/account?modal=1' : '/'
                            }
                            className="w-full border-0"
                            style={{ height: 'calc(85vh - 64px)' }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

function getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
}
