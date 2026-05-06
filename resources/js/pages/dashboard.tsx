import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Bell,
    // Bell,
    Bot,
    // ChevronDown,
    CreditCard,
    Eye,
    EyeOff,
    FileText,
    LayoutGrid,
    // Menu,
    PiggyBank,
    Send,
    Sparkles,
    Target,
    Wallet,
    ShieldCheck ,
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

const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: ArrowDownToLine, label: 'Deposit', href: '/deposit' },
    { icon: ArrowUpFromLine, label: 'Withdraw', href: '/withdraw' },
    { icon: Send, label: 'Transfer', href: '/transfer' },
    { icon: FileText, label: 'Pay Bills', href: '/bills' },
    { icon: CreditCard, label: 'My Card', href: '/account' },
    { icon: Target, label: 'Saving Challenges', href: '/saving-challenges/create' },
    { icon: Bot, label: 'AI Advisor', href: '/ai-chat' },
];

const transactionIcon: Record<string, any> = {
    deposit: ArrowDownToLine,
    withdrawal: ArrowUpFromLine,
    transfer_out: Send,
    transfer_in: Send,
    bill_payment: FileText,
};

export default function Dashboard() {

    const [activeModal, setActiveModal] = useState<string | null>(null);


    const {
        auth,
        transactions = [],
        summary = {},
        goals = [],
        challenges = [],
        ai_insights = [],
        alerts = [] ,
    } = usePage<any>().props;

    const user: AuthUser = auth.user;
    const account = user.bank_account;

    const [balanceVisible, setBalanceVisible] = useState(true);

    const balance = Number(account?.balance ?? 0);
    const income = Number(summary?.total_credit ?? 0);
    const expenses = Number(summary?.total_debit ?? 0);
    const savings = Math.max(income - expenses, 0);

    const firstName = user.name.split(' ')[0];

    const initials = user.name
        .split(' ')
        .slice(0, 2)
        .map((word: string) => word[0])
        .join('')
        .toUpperCase();

    const formatMoney = (value: number) =>
        `${Number(value).toLocaleString('en-MA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} MAD`;

    const statCards = [
        {
            label: 'Total Balance',
            value: balanceVisible ? formatMoney(balance) : '•••••• MAD',
            icon: Wallet,
            bg: 'bg-orange-50',
            iconColor: 'text-orange-600',
            change: '+12.5%',
            changeColor: 'text-green-600',
        },
        {
            label: 'Income',
            value: formatMoney(income),
            icon: ArrowDownToLine,
            bg: 'bg-green-50',
            iconColor: 'text-green-600',
            change: '+8.2%',
            changeColor: 'text-green-600',
        },
        {
            label: 'Expenses',
            value: formatMoney(expenses),
            icon: ArrowUpFromLine,
            bg: 'bg-red-50',
            iconColor: 'text-red-600',
            change: '+3.7%',
            changeColor: 'text-red-600',
        },
        {
            label: 'Savings',
            value: formatMoney(savings),
            icon: PiggyBank,
            bg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            change: '+15.3%',
            changeColor: 'text-green-600',
        },
    ];

    const quickActions = [
        {
            label: 'Deposit',
            href: '/deposit',
            icon: ArrowDownToLine,
            bg: 'bg-green-50',
            color: 'text-green-600',
        },
        {
            label: 'Withdraw',
            href: '/withdraw',
            icon: ArrowUpFromLine,
            bg: 'bg-orange-50',
            color: 'text-orange-600',
        },
        {
            label: 'Transfer',
            href: '/transfer',
            icon: Send,
            bg: 'bg-blue-50',
            color: 'text-blue-600',
        },
        {
            label: 'Pay Bills',
            href: '/bills',
            icon: FileText,
            bg: 'bg-purple-50',
            color: 'text-purple-600',
        },
        {
            label: 'My Card',
            href: '/account',
            icon: CreditCard,
            bg: 'bg-indigo-50',
            color: 'text-indigo-600',
        },
        {
            label: 'AI Advisor',
            href: '/ai-chat',
            icon: Bot,
            bg: 'bg-pink-50',
            color: 'text-pink-600',
        },
    ];
    const alertIcons: Record<string, any> = {
    wallet: Wallet,
    target: Target,
    shield: ShieldCheck,
};



    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-[#F8F6F1] font-sans text-[#0F0D0B]">
                <div className="flex min-h-screen">



                    {/* Main */}
                    <main className="min-w-0 flex-1">


                        <div className="px-4 py-6 sm:px-6 lg:px-8">
                            {/* Welcome */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    Welcome back, {firstName}
                                </h1>
                                <p className="mt-1 text-sm text-[#5C5751] sm:text-base">
                                    Here&apos;s what&apos;s happening with your finances today.
                                </p>

                            </div>



                            {/* Stats */}
                            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {statCards.map((card) => {
                                    const Icon = card.icon;

                                    return (
                                        <div
                                            key={card.label}
                                            className="rounded-3xl border border-[#EDE8E0] bg-white p-5 shadow-sm"
                                        >
                                            <div className="mb-5 flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-[#5C5751]">
                                                        {card.label}
                                                    </p>
                                                    <h3 className="mt-3 text-2xl font-extrabold">
                                                        {card.value}
                                                    </h3>
                                                </div>

                                                <div
                                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
                                                >
                                                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-sm">
                                                <span className={`font-bold ${card.changeColor}`}>
                                                    {card.change}
                                                </span>
                                                <span className="text-[#5C5751]">from last month</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Main grid */}
                            <div className="grid gap-6 xl:grid-cols-3">
                                {/* Spending chart */}
                                <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm xl:col-span-2">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold">Spending Overview</h3>
                                            <p className="mt-1 text-sm text-[#9C978F]">This Month</p>
                                        </div>

                                        <button className="rounded-xl border border-[#EDE8E0] px-3 py-2 text-sm font-semibold">
                                            This Month
                                        </button>
                                    </div>

                                    <div className="relative h-72 overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50/80 to-white">
                                        <svg
                                            viewBox="0 0 700 260"
                                            className="h-full w-full"
                                            preserveAspectRatio="none"
                                        >
                                            <defs>
                                                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.28" />
                                                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>

                                            {[40, 90, 140, 190, 240].map((y) => (
                                                <line
                                                    key={y}
                                                    x1="0"
                                                    y1={y}
                                                    x2="700"
                                                    y2={y}
                                                    stroke="#EDE8E0"
                                                    strokeWidth="1"
                                                />
                                            ))}

                                            <path
                                                d="M0 220 C70 120, 110 140, 160 150 C230 160, 250 80, 310 100 C370 125, 390 170, 450 130 C500 95, 540 120, 580 70 C630 30, 660 130, 700 110 L700 260 L0 260 Z"
                                                fill="url(#area)"
                                            />

                                            <path
                                                d="M0 220 C70 120, 110 140, 160 150 C230 160, 250 80, 310 100 C370 125, 390 170, 450 130 C500 95, 540 120, 580 70 C630 30, 660 130, 700 110"
                                                fill="none"
                                                stroke="#F97316"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                            />
                                        </svg>

                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-[#9C978F]">
                                            <span>1 Jun</span>
                                            <span>7 Jun</span>
                                            <span>14 Jun</span>
                                            <span>21 Jun</span>
                                            <span>30 Jun</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent transactions */}
                                <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-lg font-bold">Recent Transactions</h3>
                                        <Link
                                            href="/transactions"
                                            className="rounded-xl  px-3 py-2 text-sm bg-orange-600 hover:bg-orange-700  font-semibold text-white"
                                        >
                                            View All
                                        </Link>
                                    </div>

                                    <div className="space-y-4">
                                        {transactions.length > 0 ? (
                                            transactions.slice(0, 5).map((tx: Transaction) => {
                                                const Icon = transactionIcon[tx.category] ?? CreditCard;
                                                const isCredit = tx.type === 'credit';

                                                return (
                                                    <div key={tx.id} className="flex items-center gap-4">
                                                        <div
                                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isCredit ? 'bg-green-50' : 'bg-red-50'
                                                                }`}
                                                        >
                                                            <Icon
                                                                className={`h-5 w-5 ${isCredit ? 'text-green-600' : 'text-red-600'
                                                                    }`}
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-semibold">
                                                                {tx.description}
                                                            </p>
                                                            <p className="text-sm text-[#9C978F]">
                                                                {new Date(tx.created_at).toLocaleDateString('en-GB', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>

                                                        <p
                                                            className={`shrink-0 font-bold ${isCredit ? 'text-green-600' : 'text-red-600'
                                                                }`}
                                                        >
                                                            {isCredit ? '+' : '-'}
                                                            {formatMoney(Number(tx.amount))}
                                                        </p>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="rounded-2xl bg-[#F8F6F1] p-6 text-center">
                                                <p className="text-3xl">📭</p>
                                                <p className="mt-2 font-semibold">No transactions yet</p>
                                                <p className="mt-1 text-sm text-[#9C978F]">
                                                    Make a deposit to get started.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom grid */}
                            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                                {/* Bank card */}
                                <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm">
                                    <div className="mb-5 flex items-center justify-between">
                                        <h3 className="text-lg font-bold">Account Summary</h3>
                                        <button
                                            onClick={() => setBalanceVisible(!balanceVisible)}
                                            className="rounded-xl cursor-pointer p-2 hover:bg-[#F8F6F1]"
                                        >
                                            {balanceVisible ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f1a17] via-[#8a2f0b] to-orange-600 p-6 text-white shadow-lg">
                                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
                                        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/10" />

                                        <div className="relative">
                                            <div className="mb-10 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <PiggyBank className="h-5 w-5" />
                                                    <span className="font-bold">Nestora Bank</span>
                                                </div>
                                                <CreditCard className="h-6 w-6" />
                                            </div>

                                            <p className="font-mono text-lg tracking-widest">
                                                **** **** ****{' '}
                                                {account?.account_number
                                                    ? account.account_number.slice(-4)
                                                    : '4242'}
                                            </p>

                                            <div className="mt-8">
                                                <p className="text-sm text-white/70">Balance</p>
                                                <p className="mt-1 text-3xl font-extrabold">
                                                    {balanceVisible ? formatMoney(balance) : '•••••• MAD'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                    {/* Smart alert */}
                                <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">
    <div className="mb-6 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">
                Smart Alerts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
                Real-time insights based on your account activity.
            </p>
        </div>

        <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
            <Bell className="h-6 w-6" />
        </div>
    </div>

    <div className="space-y-4">
        {alerts.length > 0 ? (
            alerts.map((alert, index) => {
                const Icon = alertIcons[alert.icon];

                return (
                     <div
                    key={index}
                    className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4"
                >
                    <div className="flex items-center ">

                <div className="rounded-xl  p-2 text-orange-600 ">
                    {Icon && <Icon className="h-5 w-5" />}
                </div>

                    <h3 className="font-semibold text-slate-900">
                        {alert.title}
                    </h3>


                </div>
                    <p className="mt-1 text-sm pl-8 text-slate-500">
                        {alert.message}
                    </p>
                </div>
                )

            })
        ) : (
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="font-semibold text-slate-900">
                    No alerts right now
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    Your account looks stable.
                </p>
            </div>
        )}
    </div>
</div>

                                {/* Quick actions */}
                                <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm">
                                    <h3 className="mb-6 text-lg font-bold">Quick Actions</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {quickActions.map((action) => {
                                            const Icon = action.icon;

                                            return (
                                                 <div
                                                    key={action.label}
                                                    onClick={() => setActiveModal(action.label)}
                                                    className="cursor-pointer rounded-2xl border border-[#EDE8E0] p-4 text-center transition hover:-translate-y-1 hover:shadow-md"
                                                >
                                                    <div
                                                        className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${action.bg}`}
                                                    >
                                                        <Icon className={`h-5 w-5 ${action.color}`} />
                                                    </div>

                                                    <p className="text-sm font-bold">{action.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* AI and challenges */}
                            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                                <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm xl:col-span-2">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
                                                <Target className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <h3 className="text-lg font-bold">Saving Goals</h3>
                                        </div>

                                        <button
                                            onClick={() => router.visit('savings/index')}
                                            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold cursor-pointer text-white hover:bg-orange-700"
                                        >
                                            New Goal
                                        </button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        {goals.length > 0 ? (
                                            goals.slice(0, 2).map((goal: any) => {
                                                const saved = Number(goal.saved_amount ?? 0);
                                                const target = Number(goal.target_amount ?? 0);
                                                const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;

                                                return (
                                                    <div
                                                        key={goal.id}
                                                        className="rounded-2xl border border-[#EDE8E0] bg-white p-4"
                                                    >
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <p className="font-bold">{goal.name}</p>
                                                            <p className="text-sm font-bold text-orange-600">
                                                                {progress.toFixed(0)}%
                                                            </p>
                                                        </div>

                                                        <div className="mb-3 h-2 rounded-full bg-[#F1EEE9]">
                                                            <div
                                                                className="h-2 rounded-full bg-orange-500"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm text-[#9C978F]">
                                                            <span>{formatMoney(saved)}</span>
                                                            <span>{formatMoney(target)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="rounded-2xl bg-[#F8F6F1] p-6 md:col-span-2">
                                                <p className="font-semibold">No saving goals yet</p>
                                                <p className="text-sm text-[#9C978F]">
                                                    Create a goal to start tracking your progress.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm">
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50">
                                            <Sparkles className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-bold">AI Insights</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {ai_insights.length > 0 ? (
                                            ai_insights.slice(0, 2).map((insight: any) => (
                                                <div
                                                    key={insight.id}
                                                    className="rounded-2xl border border-blue-100 bg-blue-50 p-4"
                                                >
                                                    <p className="font-bold text-blue-800">
                                                        {insight.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-blue-600">
                                                        {insight.message}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                                                <p className="font-bold text-orange-800">
                                                    Smart saving tip
                                                </p>
                                                <p className="mt-1 text-sm text-orange-600">
                                                    Try saving 10% of each deposit automatically.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="/ai-chat"
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 hover:bg-orange-700 py-3 font-bold text-white transition hover:shadow-lg"
                                    >
                                        <Bot className="h-5 w-5" />
                                        Ask AI Advisor
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>


            {/* modals  */}


            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setActiveModal(null)}
                    />

                    {/* CENTER MODAL */}
                    <div className="
            relative z-10
            w-full max-w-md
            h-[85vh]
            bg-white
            rounded-3xl
            shadow-2xl
            overflow-hidden
        ">

                        {/* HEADER */}
                        <div className="px-4 py-4 flex justify-between items-center border-b">
                            <h2 className="font-bold text-lg">{activeModal}</h2>

                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-gray-400 hover:text-black text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* CONTENT */}
                        <iframe
                            src={
                                activeModal === 'Deposit'
                                    ? '/deposit?modal=1'
                                    : activeModal === 'Withdraw'
                                        ? '/withdraw?modal=1'
                                        : activeModal === 'Transfer'
                                            ? '/transfer?modal=1'
                                            : activeModal === 'Pay Bills'
                                                ? '/bills?modal=1'
                                                : activeModal === 'Acount'
                                                    ? '/account?modal=1'
                                                    :'/'
                            }
                            className="w-full h-[calc(85vh-64px)] border-0"
                        />

                    </div>
                </div>
            )}
        </>
    );
}
