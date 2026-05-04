import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    CreditCard,
    Eye,
    EyeOff,
    FileText,
    Send,
    Sparkles,
    Target,
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
interface Summary {
    total_credit: number;
    total_debit: number;
}

const NAV = [
    { icon: '⊞', label: 'Dashboard', href: '/dashboard', active: true },
    { icon: '↔', label: 'Transactions', href: '/transactions', active: false },
    { icon: '⬇', label: 'Deposit', href: '/deposit', active: false },
    { icon: '⬆', label: 'Withdraw', href: '/withdraw', active: false },
    { icon: '→', label: 'Transfer', href: '/transfer', active: false },
    { icon: '📄', label: 'Pay Bills', href: '/bills', active: false },
    { icon: '💳', label: 'My Card', href: '/account', active: false },
];

const CAT_ICON: Record<string, string> = {
    deposit: '⬇',
    withdrawal: '⬆',
    transfer_out: '→',
    transfer_in: '←',
    bill_payment: '📄',
};

export default function Dashboard() {
    const { auth, transactions, summary, goals, challenges, auto_saving, ai_insights, smart_alerts } = usePage<any>().props;

    const user: AuthUser = auth.user;
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const account = user.bank_account;
    const balance = account?.balance ?? 0;
    const firstName = user.name.split(' ')[0];
    const initials = user.name
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase();
    const income = summary?.total_credit ?? 0;
    const expenses = summary?.total_debit ?? 0;

    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 17
              ? 'Good afternoon'
              : 'Good evening';
    const activeGoals = goals ?? [];
    return (
        <>
            <Head title="Dashboard" />
            <div
                style={{
                    display: 'flex',
                    minHeight: '100vh',
                    background: '#F8F6F1',
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {/* ── Sidebar ── */}

                {/* ── Main ── */}
                <main
                    style={{
                        marginLeft: sidebarOpen ? 0 : 0,
                        flex: 1,
                        transition: 'margin-left .25s',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ padding: '28px 28px', flex: 1 }}>
                        {/* Welcome */}
                        <div style={{ marginBottom: 24 }}>
                            <p
                                style={{
                                    color: '#9C978F',
                                    fontSize: 14,
                                    marginBottom: 4,
                                }}
                            >
                                {greeting} 👋
                            </p>
                            <h1
                                style={{
                                    fontSize: 26,
                                    fontWeight: 800,
                                    color: '#0F0D0B',
                                    fontFamily: "'Syne', sans-serif",
                                    margin: 0,
                                }}
                            >
                                Welcome back, {firstName}!
                            </h1>
                        </div>

                        {/* Top row */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: 16,
                                marginBottom: 24,
                            }}
                        >
                            {/* Balance card */}
                            {/* <div style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #E8632A 0%, #C4501F 100%)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,.1)', borderRadius: '50%' }} />
                                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, background: 'rgba(255,255,255,.07)', borderRadius: '50%' }} />
                                <div style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>Total Balance</p>
                                        <button onClick={() => setBalanceVisible(!balanceVisible)} style={{ background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 8, padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
                                            {balanceVisible ? '👁' : '🙈'}
                                        </button>
                                    </div>
                                    <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 4px', fontFamily: "'Syne', sans-serif" }}>
                                        {balanceVisible ? `${balance.toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD` : '•••••• MAD'}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, margin: '0 0 16px', fontFamily: 'monospace' }}>{account?.account_number ?? '—'}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase' }}>{account?.account_type ?? 'N/A'}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%' }} />
                                            <span style={{ color: 'rgba(255,255,255,.8)', fontSize: 12 }}>Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="rounded-3xl bg-gradient-to-br from-primary via-orange-500 to-orange-600 p-8 text-white shadow-xl">
                                <div className="mb-6 flex items-start justify-between">
                                    <div>
                                        <p className="mb-2 text-orange-100">
                                            Total Balance
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-5xl">
                                                {balanceVisible
                                                    ? `${balance.toFixed(2)} MAD`
                                                    : '••••••'}
                                            </h1>
                                            <button
                                                onClick={() =>
                                                    setBalanceVisible(
                                                        !balanceVisible,
                                                    )
                                                }
                                                className="hover:bg-opacity-20 rounded-lg p-2 transition-all hover:cursor-pointer"
                                            >
                                                {balanceVisible ? (
                                                    <EyeOff className="h-8 w-8 text-black" />
                                                ) : (
                                                    <Eye className="h-8 w-8 text-black" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="mb-1 text-sm text-orange-100">
                                            Account Number
                                        </p>
                                        <p className="font-mono text-white">
                                            {account?.account_number ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-opacity-20 mt-8 grid grid-cols-2 gap-6 border-t border-white pt-6">
                                    <div>
                                        <p className="mb-1 text-sm text-orange-100">
                                            Available Balance
                                        </p>
                                        <p className="text-2xl">50 MAD</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-sm text-orange-100">
                                            In Savings Goals
                                        </p>
                                        <p className="text-2xl">50 MAD</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid #EDE8E0',
                                borderRadius: 20,
                                padding: 20,
                                marginBottom: 24,
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: '#0F0D0B',
                                    textTransform: 'uppercase',
                                    letterSpacing: 2,
                                    margin: '0 0 16px',
                                    fontFamily: "'Syne', sans-serif",
                                }}
                            >
                                Quick Actions
                            </h3>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: 12,
                                }}
                            >
                                {[
                                    {
                                        icon: <ArrowDownToLine />,
                                        label: 'Deposit',
                                        href: '/deposit',
                                        bg: '#f0fdf4',
                                        color: 'green',
                                    },
                                    {
                                        icon: <ArrowUpFromLine />,
                                        label: 'Withdraw',
                                        href: '/withdraw',
                                        bg: '#fff7ed',
                                        color: 'orange',
                                    },
                                    {
                                        icon: <Send />,
                                        label: 'Transfer',
                                        href: '/transfer',
                                        bg: '#eff6ff',
                                        color: '#3B82F6',
                                    },
                                    {
                                        icon: <FileText />,
                                        label: 'Pay Bills',
                                        href: '/bills',
                                        bg: '#f5f3ff',
                                        color: '#8B5CF6',
                                    },
                                    {
                                        icon: <CreditCard />,
                                        label: 'My Card',
                                        href: '/account',
                                        bg: '#EEF2FF',
                                        color: '#4F46E5',
                                    },
                                ].map((a) => (
                                    <a
                                        key={a.label}
                                        className="transition-all hover:shadow-lg"
                                        href={a.href}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: 24,
                                            borderRadius: 14,
                                            border: '1.5px solid #EDE8E0',
                                            textDecoration: 'none',
                                            transition: 'all .15s',
                                            background: '#fff',
                                        }}
                                        onMouseEnter={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background = a.bg;
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.borderColor = a.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background = '#fff';
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.borderColor = '#EDE8E0';
                                        }}
                                    >
                                        <div
                                            className="transition-transform group-hover:scale-110"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 12,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 24,
                                                    color: a.color,
                                                }}
                                            >
                                                {a.icon}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: '#5C5751',
                                                }}
                                            >
                                                {a.label}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Savings Features */}
            <div className="col-span-2 space-y-6">
              {/* Savings Goals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-xl">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-gray-800">Savings Goals</h3>
                  </div>
                  <button
                    onClick={() => router.visit('/dashboard')}
                    className="text-primary hover:text-orange-600 text-sm"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {activeGoals.slice(0, 2).map((goal:any) => {
                   const progress = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
                    return (
                      <div key={goal.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-800">{goal.name}</p>
                          <p className="text-sm text-gray-600">{progress.toFixed(0)}%</p>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{Number(goal.saved).toFixed(2) } MAD</span>
                          <span className="text-gray-500">of {Number(goal.target).toFixed(2)} MAD</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>


            {/* Saving Challenges */}
                  <div className="">

            <div className="rounded-2xl border border-gray-200 bg-white px-6 shadow-sm">
                <div className="flex justify-between items-center  py-6 ">

    <h3 className=" text-gray-800  ">Saving Challenges</h3>
                  <button
        onClick={() => router.visit('/saving-challenges/create')}
        className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
        New Challenge
    </button>
        </div>
    {challenges?.slice(0, 2).map((challenge: any) => (
        <div key={challenge.id} className="mb-4 rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-gray-800">Save {challenge.name} MAD</p>
                <p className="text-sm text-gray-600">{challenge.progress}%</p>
            </div>

            <div className="mb-2 h-2.5 w-full rounded-full bg-gray-100">
                <div
                    className="h-2.5 rounded-full bg-orange-500"
                    style={{ width: `${challenge.progress}%` }}
                    />
            </div>

            <div className="flex justify-between text-sm text-gray-500">
                <span>{challenge.days_left} days left</span>
                <span>{challenge.reward}</span>
            </div>
        </div>
    ))}
</div>
</div>
                    </div>
            {/* Right Column - AI & Alerts */}
            <div className="space-y-6">
              {/* AI Insights */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-gray-800">AI Insights</h3>
                </div>

                <div className="space-y-4">
                  {ai_insights.map((insight:any) => {
                    const Icon = insight.icon;
                    return (
                        <div
                        key={insight.id}
                        className={`p-4 rounded-xl border ${
                          insight.color === 'green'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start gap-0">
                          <Icon
                            className={` mt-0.5 ${
                              insight.color === 'green' ? 'text-green-600' : 'text-blue-600'
                            }`}
                          />
                          <div>
                            <p
                              className={`mb-1 ${
                                insight.color === 'green' ? 'text-green-800' : 'text-blue-800'
                              }`}
                            >
                                <div className="flex gap-2 ">

                              <p className=''>{Icon}</p>
                              {insight.title}
                                </div>
                            </p>
                            <p
                              className={`text-sm  pl-8 ${
                                  insight.color === 'green' ? 'text-green-600' : 'text-blue-600'
                                }`}
                                >
                              {insight.message}
                            </p>
                          </div>
                        </div>
                      </div>

);
})}
                </div>

                <button
                  onClick={() => router.visit('/saving-challenges/create') }
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  Ask AI Advisor
                </button>
              </div>
                  </div>
                  </div>

                        {/* Bottom row */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr',
                                gap: 20,
                            }}
                        >
                            {/* Transactions */}
                            <div
                                style={{
                                    background: '#fff',
                                    border: '1px solid #EDE8E0',
                                    borderRadius: 20,
                                    padding: 20,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 16,
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: '#0F0D0B',
                                            textTransform: 'uppercase',
                                            letterSpacing: 2,
                                            margin: 0,
                                            fontFamily: "'Syne', sans-serif",
                                        }}
                                    >
                                        Recent Transactions
                                    </h3>
                                    <a
                                        href="/transactions"
                                        style={{
                                            fontSize: 12,
                                            color: '#E8632A',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        View all →
                                    </a>
                                </div>
                                {transactions && transactions.length > 0 ? (
                                    transactions.map((tx: Transaction) => (
                                        <div
                                            key={tx.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '12px 0',
                                                borderBottom:
                                                    '1px solid #F5F0EA',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 12,
                                                    background:
                                                        tx.type === 'credit'
                                                            ? '#dcfce7'
                                                            : '#fee2e2',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 16,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {CAT_ICON[tx.category] ?? '💳'}
                                            </div>
                                            <div
                                                style={{ flex: 1, minWidth: 0 }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        color: '#0F0D0B',
                                                        margin: 0,
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {tx.description}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: 11,
                                                        color: '#9C978F',
                                                        margin: 0,
                                                    }}
                                                >
                                                    {new Date(
                                                        tx.created_at,
                                                    ).toLocaleDateString(
                                                        'en-GB',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                    {' · '}
                                                    {tx.category.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    textAlign: 'right',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 700,
                                                        color:
                                                            tx.type === 'credit'
                                                                ? '#16a34a'
                                                                : '#dc2626',
                                                        margin: 0,
                                                    }}
                                                >
                                                    {tx.type === 'credit'
                                                        ? '+'
                                                        : '-'}
                                                    {Number(
                                                        tx.amount,
                                                    ).toLocaleString('en-MA', {
                                                        minimumFractionDigits: 2,
                                                    })}{' '}
                                                    MAD
                                                </p>
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        background: '#F5F0EA',
                                                        color: '#9C978F',
                                                        padding: '2px 8px',
                                                        borderRadius: 20,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            padding: '40px 0',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 40,
                                                marginBottom: 8,
                                            }}
                                        >
                                            📭
                                        </div>
                                        <p
                                            style={{
                                                fontSize: 14,
                                                color: '#5C5751',
                                                fontWeight: 600,
                                                margin: '0 0 4px',
                                            }}
                                        >
                                            No transactions yet
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 12,
                                                color: '#9C978F',
                                                margin: 0,
                                            }}
                                        >
                                            Make a deposit to get started
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Account Info */}
                            <div
                                style={{
                                    background: '#fff',
                                    border: '1px solid #EDE8E0',
                                    borderRadius: 20,
                                    padding: 20,
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: '#0F0D0B',
                                        textTransform: 'uppercase',
                                        letterSpacing: 2,
                                        margin: '0 0 16px',
                                        fontFamily: "'Syne', sans-serif",
                                    }}
                                >
                                    Account Info
                                </h3>
                                {[
                                    { label: 'Full Name', value: user.name },
                                    { label: 'Email', value: user.email },
                                    {
                                        label: 'Phone',
                                        value: user.profile?.phone ?? '—',
                                    },
                                    {
                                        label: 'Account No.',
                                        value: account?.account_number ?? '—',
                                    },
                                    {
                                        label: 'Occupation',
                                        value:
                                            user.financial_profile
                                                ?.occupation ?? '—',
                                    },
                                    {
                                        label: 'Employment',
                                        value:
                                            user.financial_profile
                                                ?.employment_status ?? '—',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '10px 0',
                                            borderBottom: '1px solid #F5F0EA',
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: 10,
                                                color: '#9C978F',
                                                textTransform: 'uppercase',
                                                letterSpacing: 1.5,
                                                margin: '0 0 2px',
                                            }}
                                        >
                                            {item.label}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 13,
                                                color: '#0F0D0B',
                                                fontWeight: 600,
                                                margin: 0,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}
