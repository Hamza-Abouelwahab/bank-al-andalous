import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

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
    const { auth, users, stats } = usePage<PageProps>().props;
    const adminName = auth.user.name.split(' ')[0];
    const initials  = auth.user.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const filtered = (users ?? []).filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: number) => {
        router.delete(`/admin/users/${id}`, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const statCards = [
        { label: 'Total Users',    value: stats?.total_users ?? 0,   icon: '👥', bg: '#fff0e8', change: '+8.6% this month'  },
        { label: 'Total Accounts', value: stats?.total_accounts ?? 0, icon: '💳', bg: '#eff6ff', change: '+10.2% this month' },
        { label: 'Total Balance',  value: `${(stats?.total_balance ?? 0).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD`, icon: '💰', bg: '#f0fdf4', change: '+12.7% this month' },
        { label: 'Transactions',   value: stats?.total_transactions ?? 0, icon: '↔️', bg: '#f5f3ff', change: '+15.3% this month' },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div style={{ minHeight: '100vh', background: '#F8F6F1', fontFamily: "'DM Sans', sans-serif" }}>

                {/* Top bar */}


                <div style={{ padding: '28px', maxWidth: 1400, margin: '0 auto' }}>

                    {/* Welcome banner */}
                    <div style={{ background: 'linear-gradient(135deg, #0F0D0B 0%, #1a1715 100%)', borderRadius: 20, padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -40, right: 200, width: 200, height: 200, background: '#E8632A', borderRadius: '50%', opacity: .06 }} />
                        <div style={{ position: 'absolute', bottom: -30, right: 100, width: 150, height: 150, background: '#E8632A', borderRadius: '50%', opacity: .04 }} />
                        <div style={{ position: 'relative' }}>
                            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, margin: '0 0 4px' }}>Admin Panel</p>
                            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', fontFamily: "'Syne', sans-serif" }}>
                                Welcome back, <span style={{ color: '#E8632A' }}>{adminName}!</span> 👋
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, margin: 0 }}>
                                You are logged in as Super Admin. Manage users, accounts, transactions, and monitor performance.
                            </p>
                        </div>
                        <a href="/dashboard" style={{ background: '#E8632A', color: '#fff', fontSize: 13, fontWeight: 700, padding: '12px 24px', borderRadius: 12, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, position: 'relative' }}>
                            Go to Dashboard →
                        </a>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                        {statCards.map((card, i) => (
                            <div key={i} style={{ background: '#fff', border: '1px solid #EDE8E0', borderRadius: 20, padding: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div style={{ width: 40, height: 40, background: card.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{card.icon}</div>
                                    <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600, background: '#dcfce7', padding: '3px 8px', borderRadius: 20 }}>{card.change}</span>
                                </div>
                                <p style={{ fontSize: 10, color: '#9C978F', textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 4px' }}>{card.label}</p>
                                <p style={{ fontSize: 22, fontWeight: 800, color: '#0F0D0B', margin: 0, fontFamily: "'Syne', sans-serif" }}>{card.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                        {[
                            { icon: '👥', label: 'Manage Users',      desc: 'Add, edit, or remove users',     color: '#E8632A', bg: '#fff0e8' },
                            { icon: '💳', label: 'Manage Accounts',   desc: 'View all customer accounts',     color: '#3B82F6', bg: '#eff6ff' },
                            { icon: '↔️', label: 'View Transactions', desc: 'Monitor all transactions',       color: '#8B5CF6', bg: '#f5f3ff' },
                            { icon: '📊', label: 'Reports',           desc: 'Generate reports and analytics', color: '#16a34a', bg: '#f0fdf4' },
                        ].map((action, i) => (
                            <button key={i} style={{ background: '#fff', border: '1.5px solid #EDE8E0', borderRadius: 16, padding: 20, textAlign: 'left', cursor: 'pointer', transition: 'all .15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = action.color; (e.currentTarget as HTMLElement).style.background = action.bg; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#EDE8E0'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
                                <div style={{ fontSize: 28, marginBottom: 10 }}>{action.icon}</div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F0D0B', margin: '0 0 4px', fontFamily: "'Syne', sans-serif" }}>{action.label}</p>
                                <p style={{ fontSize: 12, color: '#9C978F', margin: 0 }}>{action.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Users table */}
                    <div style={{ background: '#fff', border: '1px solid #EDE8E0', borderRadius: 20, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #EDE8E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0F0D0B', textTransform: 'uppercase', letterSpacing: 2, margin: 0, fontFamily: "'Syne', sans-serif" }}>All Users</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 12, color: '#9C978F' }}>{filtered.length} total</span>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ height: 36, border: '1.5px solid #EDE8E0', borderRadius: 10, padding: '0 12px', fontSize: 13, color: '#0F0D0B', outline: 'none', width: 220, fontFamily: "'DM Sans', sans-serif" }}
                                />
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#F8F6F1' }}>
                                        {['User', 'Email', 'Account Number', 'Type', 'Balance', 'Role', 'Joined', 'Actions'].map(h => (
                                            <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#9C978F', textTransform: 'uppercase', letterSpacing: 1.5, whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length > 0 ? filtered.map((u, i) => (
                                        <tr key={u.id} style={{ borderTop: '1px solid #F5F0EA', background: i % 2 === 0 ? '#fff' : '#FDFAF7' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FFFCF9'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#fff' : '#FDFAF7'}>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 34, height: 34, background: '#E8632A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0F0D0B' }}>{u.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: 13, color: '#5C5751' }}>{u.email}</td>
                                            <td style={{ padding: '14px 16px', fontSize: 12, color: '#5C5751', fontFamily: 'monospace' }}>{u.bank_account?.account_number ?? '—'}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                {u.bank_account ? (
                                                    <span style={{ fontSize: 11, fontWeight: 600, background: '#FFF0E8', color: '#E8632A', padding: '4px 10px', borderRadius: 20, textTransform: 'capitalize' }}>
                                                        {u.bank_account.account_type}
                                                    </span>
                                                ) : <span style={{ fontSize: 12, color: '#9C978F' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#0F0D0B' }}>
                                                {u.bank_account ? `${Number(u.bank_account.balance).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD` : '—'}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: u.role === 'admin' ? '#0F0D0B' : '#F5F0EA', color: u.role === 'admin' ? '#fff' : '#5C5751' }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: 13, color: '#9C978F' }}>
                                                {new Date(u.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => setDeleteConfirm(u.id)}
                                                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                                                        🗑 Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} style={{ padding: '40px', textAlign: 'center', fontSize: 14, color: '#9C978F' }}>No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Status bar */}
                    <div style={{ marginTop: 16, background: '#fff', border: '1px solid #EDE8E0', borderRadius: 14, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%' }} />
                        <p style={{ fontSize: 12, color: '#5C5751', margin: 0 }}>
                            You are in control! All systems are running smoothly. · Last login: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {deleteConfirm !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 400, width: '100%' }}>
                        <div style={{ width: 56, height: 56, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>🗑</div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F0D0B', textAlign: 'center', margin: '0 0 8px', fontFamily: "'Syne', sans-serif" }}>Delete User</h3>
                        <p style={{ fontSize: 14, color: '#9C978F', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
                            Are you sure? This will also delete their bank account and all transactions. <strong style={{ color: '#dc2626' }}>This cannot be undone.</strong>
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, height: 44, border: '1.5px solid #EDE8E0', borderRadius: 12, background: '#fff', fontSize: 14, fontWeight: 600, color: '#5C5751', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, height: 44, border: 'none', borderRadius: 12, background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}