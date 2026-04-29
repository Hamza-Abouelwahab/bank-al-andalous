import { Head, usePage } from '@inertiajs/react';

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
    profile: {
        phone: string;
    } | null;
}

interface PageProps {
    auth: { user: User };
    users: User[];
    stats: {
        total_users: number;
        total_accounts: number;
        total_balance: number;
    };
}

export default function Dashboard() {
    const { auth, users, stats } = usePage<PageProps>().props;
    const adminName = auth.user.name.split(' ')[0];

    const statCards = [
        { label: 'Total Users', value: stats?.total_users ?? 0, icon: '👥', change: '+8.6% this month' },
        { label: 'Total Accounts', value: stats?.total_accounts ?? 0, icon: '💳', change: '+10.2% this month' },
        { label: 'Total Balance', value: `${(stats?.total_balance ?? 0).toLocaleString()} MAD`, icon: '💰', change: '+12.7% this month' },
        { label: 'Transactions Today', value: 0, icon: '↔️', change: '+15.3% this month' },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[#9C978F] text-sm mb-1">Admin Panel</p>
                            <h1 className="text-2xl font-extrabold text-[#0F0D0B] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                                Welcome back, {adminName} 👋
                            </h1>
                            <p className="text-[#9C978F] text-sm mt-1">Manage users, accounts, and monitor performance.</p>
                        </div>
                        <a href="/dashboard" className="text-sm text-[#E8632A] font-medium hover:underline">
                            ← User Dashboard
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((card, i) => (
                            <div key={i} className="bg-white border border-[#EDE8E0] rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl">{card.icon}</span>
                                    <span className="text-[10px] text-green-500 font-medium">{card.change}</span>
                                </div>
                                <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-1">{card.label}</p>
                                <p className="text-xl font-extrabold text-[#0F0D0B]" style={{ fontFamily: "'Syne', sans-serif" }}>{card.value}</p>
                                
                            </div>
                        ))}
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: '👥', label: 'Manage Users', desc: 'Add, edit, or remove users', color: '#E8632A' },
                            { icon: '💳', label: 'Manage Accounts', desc: 'View all customer accounts', color: '#3B82F6' },
                            { icon: '↔️', label: 'View Transactions', desc: 'Monitor all transactions', color: '#8B5CF6' },
                            { icon: '📊', label: 'Reports', desc: 'Generate reports and analytics', color: '#10B981' },
                        ].map((action, i) => (
                            <button key={i} className="bg-white border border-[#EDE8E0] rounded-2xl p-5 text-left hover:border-[#E8632A] hover:bg-[#FFF0E8] transition-all group">
                                <span className="text-2xl mb-3 block">{action.icon}</span>
                                <p className="text-sm font-bold text-[#0F0D0B] mb-1 group-hover:text-[#E8632A]" style={{ fontFamily: "'Syne', sans-serif" }}>{action.label}</p>
                                <p className="text-xs text-[#9C978F]">{action.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Users table */}
                    <div className="bg-white border border-[#EDE8E0] rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-[#EDE8E0] flex items-center justify-between">
                            <h3 className="text-xs font-bold text-[#0F0D0B] uppercase tracking-[2px]" style={{ fontFamily: "'Syne', sans-serif" }}>All Users</h3>
                            <span className="text-xs text-[#9C978F]">{users?.length ?? 0} total</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F5F0EA]">
                                        {['Name', 'Email', 'Account Number', 'Type', 'Balance', 'Role', 'Joined'].map(h => (
                                            <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-[#9C978F] uppercase tracking-[1.5px]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.length > 0 ? users.map((u, i) => (
                                        <tr key={u.id} className={`border-t border-[#F5F0EA] hover:bg-[#FFFCF9] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FDFAF7]'}`}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#E8632A] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-[#0F0D0B]">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#5C5751]">{u.email}</td>
                                            <td className="px-5 py-4 text-sm font-mono text-[#5C5751]">{u.bank_account?.account_number ?? '—'}</td>
                                            <td className="px-5 py-4">
                                                {u.bank_account ? (
                                                    <span className="text-xs font-medium bg-[#FFF0E8] text-[#E8632A] px-2.5 py-1 rounded-full capitalize">
                                                        {u.bank_account.account_type}
                                                    </span>
                                                ) : <span className="text-xs text-[#9C978F]">—</span>}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-semibold text-[#0F0D0B]">
                                                {u.bank_account ? `${u.bank_account.balance.toLocaleString()} MAD` : '—'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-[#0F0D0B] text-white' : 'bg-[#F5F0EA] text-[#5C5751]'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#9C978F]">
                                                {new Date(u.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#9C978F]">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}