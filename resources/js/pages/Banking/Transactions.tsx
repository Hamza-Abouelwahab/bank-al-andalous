import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

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
    net: number;
    count: number;
}

const CATEGORY_ICON: Record<string, string> = {
    deposit:      '💵',
    withdrawal:   '🏧',
    transfer_out: '📤',
    transfer_in:  '📥',
    bill_payment: '📄',
};

const CATEGORY_LABEL: Record<string, string> = {
    deposit:      'Deposit',
    withdrawal:   'Withdrawal',
    transfer_out: 'Transfer Out',
    transfer_in:  'Transfer In',
    bill_payment: 'Bill Payment',
};

export default function Transactions() {
    const { transactions, balance, summary, filters } = usePage<any>().props;

    const [type,     setType]     = useState(filters?.type     ?? '');
    const [category, setCategory] = useState(filters?.category ?? '');
    const [from,     setFrom]     = useState(filters?.from     ?? '');
    const [to,       setTo]       = useState(filters?.to       ?? '');

    const applyFilters = () => {
        router.get('/transactions', {
            ...(type     ? { type }     : {}),
            ...(category ? { category } : {}),
            ...(from     ? { from }     : {}),
            ...(to       ? { to }       : {}),
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setType(''); setCategory(''); setFrom(''); setTo('');
        router.get('/transactions');
    };

    const hasFilters = type || category || from || to;

    return (
        <>
            <Head title="Transactions" />
            <div className="min-h-screen bg-[#FFFCF9] p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-4xl mx-auto">

                    {/* Back */}
                    <a href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-[#9C978F] hover:text-[#0F0D0B] mb-6 transition-colors">
                        ← Back to Dashboard
                    </a>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#0F0D0B]" style={{ fontFamily: "'Syne', sans-serif" }}>
                                Transaction History
                            </h1>
                            <p className="text-sm text-[#9C978F] mt-1">{summary.count} transactions total</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-1">Current Balance</p>
                            <p className="text-lg font-extrabold text-[#0F0D0B]" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {Number(balance).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                            </p>
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-[#EDE8E0] rounded-2xl p-4">
                            <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-1">Total In</p>
                            <p className="text-lg font-extrabold text-green-600" style={{ fontFamily: "'Syne', sans-serif" }}>
                                +{Number(summary.total_credit).toLocaleString('en-MA', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-[#9C978F]">MAD received</p>
                        </div>
                        <div className="bg-white border border-[#EDE8E0] rounded-2xl p-4">
                            <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-1">Total Out</p>
                            <p className="text-lg font-extrabold text-red-500" style={{ fontFamily: "'Syne', sans-serif" }}>
                                -{Number(summary.total_debit).toLocaleString('en-MA', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-[#9C978F]">MAD spent</p>
                        </div>
                        <div className="bg-white border border-[#EDE8E0] rounded-2xl p-4">
                            <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-1">Net Flow</p>
                            <p className={`text-lg font-extrabold ${summary.net >= 0 ? 'text-green-600' : 'text-red-500'}`}
                                style={{ fontFamily: "'Syne', sans-serif" }}>
                                {summary.net >= 0 ? '+' : ''}{Number(summary.net).toLocaleString('en-MA', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-[#9C978F]">MAD net</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white border border-[#EDE8E0] rounded-2xl p-5 mb-5">
                        <p className="text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-3">Filters</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">

                            {/* Type */}
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="h-10 border-2 border-[#EDE8E0] rounded-xl px-3 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-gray-50"
                            >
                                <option value="">All Types</option>
                                <option value="credit">Credit (In)</option>
                                <option value="debit">Debit (Out)</option>
                            </select>

                            {/* Category */}
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="h-10 border-2 border-[#EDE8E0] rounded-xl px-3 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-gray-50"
                            >
                                <option value="">All Categories</option>
                                <option value="deposit">Deposit</option>
                                <option value="withdrawal">Withdrawal</option>
                                <option value="transfer_in">Transfer In</option>
                                <option value="transfer_out">Transfer Out</option>
                                <option value="bill_payment">Bill Payment</option>
                            </select>

                            {/* From date */}
                            <input
                                type="date"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                className="h-10 border-2 border-[#EDE8E0] rounded-xl px-3 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-gray-50"
                            />

                            {/* To date */}
                            <input
                                type="date"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                className="h-10 border-2 border-[#EDE8E0] rounded-xl px-3 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-gray-50"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="h-9 px-5 bg-[#E8632A] hover:bg-[#C4501F] text-white text-xs font-bold rounded-lg transition"
                            >
                                Apply Filters
                            </button>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="h-9 px-5 border-2 border-[#EDE8E0] text-[#9C978F] text-xs font-bold rounded-lg hover:border-[#E8632A] hover:text-[#E8632A] transition"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Transactions list */}
                    <div className="bg-white border border-[#EDE8E0] rounded-2xl overflow-hidden">
                        {transactions && transactions.length > 0 ? (
                            transactions.map((tx: Transaction, i: number) => (
                                <div key={tx.id}
                                    className={`flex items-center gap-4 px-5 py-4 border-b border-[#F5F0EA] last:border-0 hover:bg-[#FFFCF9] transition-colors ${
                                        i % 2 === 0 ? '' : 'bg-[#FDFAF7]'
                                    }`}>

                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                                        tx.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                                    }`}>
                                        {CATEGORY_ICON[tx.category] ?? '💳'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#0F0D0B] truncate">{tx.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-[#9C978F]">
                                                {new Date(tx.created_at).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                            <span className="text-[#EDE8E0]">·</span>
                                            <span className="text-[10px] font-semibold text-[#9C978F] bg-[#F5F0EA] px-2 py-0.5 rounded-full">
                                                {CATEGORY_LABEL[tx.category] ?? tx.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Amount + balance after */}
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-sm font-extrabold ${
                                            tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                                        }`}>
                                            {tx.type === 'credit' ? '+' : '-'}
                                            {Number(tx.amount).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                                        </p>
                                        <p className="text-[10px] text-[#9C978F] mt-0.5">
                                            Balance: {Number(tx.balance_after).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <span className="text-5xl mb-4">📭</span>
                                <p className="text-sm font-semibold text-[#0F0D0B]">No transactions found</p>
                                <p className="text-xs text-[#9C978F] mt-1">
                                    {hasFilters ? 'Try adjusting your filters' : 'Make a deposit to get started'}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}