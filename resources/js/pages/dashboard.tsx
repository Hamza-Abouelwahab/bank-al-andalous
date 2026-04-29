import { Head, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
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

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const user: AuthUser = auth.user;
    const isAdmin = user.role === 'admin';
    const [balanceVisible, setBalanceVisible] = useState(true);

    const firstName = user.name.split(' ')[0];
    const account = user.bank_account;
    const balance = account?.balance ?? 0;

    const quickActions = [
        { icon: '⬇️', label: 'Deposit', color: '#E8632A', route: '/deposit' },
        { icon: '↔️', label: 'Transfer', color: '#3B82F6', route: '/transfer' },
        { icon: '📄', label: 'Pay Bills', color: '#8B5CF6', route: '/bills' },
        { icon: '💳', label: 'Cards', color: '#10B981', route: '/account' },
    ];

    const recentTransactions = [
        { type: 'credit', desc: 'Salary Deposit', date: 'Today, 09:15', amount: '+3,500.00', status: 'Completed' },
        { type: 'debit', desc: 'ATM Withdrawal', date: 'Today, 12:30', amount: '-500.00', status: 'Completed' },
        { type: 'debit', desc: 'Grocery Shopping', date: 'Today, 15:45', amount: '-120.75', status: 'Completed' },
        { type: 'credit', desc: 'Online Transfer', date: 'Yesterday, 21:10', amount: '+200.00', status: 'Completed' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-full bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

                {/* Admin banner */}
                {isAdmin && (
                    <div className="bg-[#0F0D0B] text-white px-6 py-3 flex items-center justify-between">
                        <span className="text-sm text-white/60">You are logged in as <span className="text-[#E8632A] font-semibold">Admin</span></span>
                        <a href="/admin" className="bg-[#E8632A] hover:bg-[#C4501F] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Admin Dashboard →
                        </a>
                    </div>
                )}

                <div className="p-6 lg:p-8 max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[#9C978F] text-sm mb-1">Good morning 👋</p>
                            <h1 className="text-2xl font-extrabold text-[#0F0D0B] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                                Welcome back, {firstName}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-[#9C978F]">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Top row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

                        {/* Balance card */}
                        <div className="lg:col-span-2 bg-[#0F0D0B] rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:scale-[1.01] transition">
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#E8632A] opacity-10 -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#E8632A] opacity-[0.07] translate-y-1/2 -translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-white/40 text-xs uppercase tracking-[2px] mb-1">Total Balance</p>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                                                {balanceVisible ? `${balance.toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD` : '••••••'}
                                            </h2>
                                            <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-white/40 hover:text-white/80 transition-colors text-lg">
                                                {balanceVisible ? '👁️' : '🙈'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-[#E8632A] rounded-xl px-3 py-1.5">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">{account?.account_type ?? 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-white/30 text-[10px] uppercase tracking-[2px] mb-1">Account Number</p>
                                        <p className="text-white font-mono text-sm tracking-widest">{account?.account_number ?? '—'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/30 text-[10px] uppercase tracking-[2px] mb-1">Status</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            <span className="text-green-400 text-xs font-medium">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-white border border-[#EDE8E0] rounded-2xl p-5 flex-1">
                                <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-1">Income (This Month)</p>
                                <p className="text-xl font-extrabold text-green-600" style={{ fontFamily: "'Syne', sans-serif" }}>+ 3,500.00 MAD</p>
                                <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
                            </div>
                            <div className="bg-white border border-[#EDE8E0] rounded-2xl p-5 flex-1">
                                <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-1">Expenses (This Month)</p>
                                <p className="text-xl font-extrabold text-red-500" style={{ fontFamily: "'Syne', sans-serif" }}>- 620.75 MAD</p>
                                <p className="text-xs text-red-400 mt-1">↓ 8% from last month</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="bg-white border border-[#EDE8E0] rounded-2xl p-5 mb-6">
                        <h3 className="text-xs font-bold text-[#0F0D0B] uppercase tracking-[2px] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Quick Actions</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {quickActions.map((action) => (
                                <button key={action.label} onClick={() => router.visit(action.route)}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-[1.5px] border-[#EDE8E0] hover:border-[#E8632A] hover:bg-[#FFF0E8] transition-all group">
                                    <span className="text-2xl">{action.icon}</span>
                                    <span className="text-xs font-semibold text-[#5C5751] group-hover:text-[#E8632A]">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Recent transactions */}
                        <div className="lg:col-span-2 bg-white border border-[#EDE8E0] rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-[#0F0D0B] uppercase tracking-[2px]" style={{ fontFamily: "'Syne', sans-serif" }}>Recent Transactions</h3>
                                <button className="text-xs text-[#E8632A] font-medium hover:underline">View all →</button>
                            </div>
                            <div className="space-y-3">
                                {recentTransactions.map((tx, i) => (
                                    <div key={i} className="flex items-center gap-4 py-2 border-b border-[#F5F0EA] last:border-0">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${tx.type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                                            {tx.type === 'credit' ? '⬇️' : '⬆️'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#0F0D0B] truncate">{tx.desc}</p>
                                            <p className="text-xs text-[#9C978F]">{tx.date}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>{tx.amount} MAD</p>
                                            <p className="text-[10px] text-[#9C978F]">{tx.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Account info */}
                        <div className="bg-white border border-[#EDE8E0] rounded-2xl p-5">
                            <h3 className="text-xs font-bold text-[#0F0D0B] uppercase tracking-[2px] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Account Info</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Full Name', value: user.name },
                                    { label: 'Email', value: user.email },
                                    { label: 'Phone', value: user.profile?.phone ?? '—' },
                                    { label: 'Occupation', value: user.financial_profile?.occupation ?? '—' },
                                    { label: 'Employment', value: user.financial_profile?.employment_status ?? '—' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col py-2 border-b border-[#F5F0EA] last:border-0">
                                        <span className="text-[10px] text-[#9C978F] uppercase tracking-[1.5px]">{item.label}</span>
                                        <span className="text-sm text-[#0F0D0B] font-medium truncate mt-0.5">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};