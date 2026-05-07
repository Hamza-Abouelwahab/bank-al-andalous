import { Head, router, usePage } from '@inertiajs/react';
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, CreditCard, FileText, Send, SlidersHorizontal, X } from 'lucide-react';
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

const CATEGORY_ICON: Record<string, any> = {
    deposit:      ArrowDownToLine,
    withdrawal:   ArrowUpFromLine,
    transfer_out: Send,
    transfer_in:  Send,
    bill_payment: FileText,
};

const CATEGORY_LABEL: Record<string, string> = {
    deposit:      'Deposit',
    withdrawal:   'Withdrawal',
    transfer_out: 'Transfer Out',
    transfer_in:  'Transfer In',
    bill_payment: 'Bill Payment',
};

const CATEGORY_COLOR: Record<string, string> = {
    deposit:      'bg-orange-50 text-orange-600 dark:bg-orange-900/15 dark:text-orange-400',
    withdrawal:   'bg-[#f8f6f1] text-[#7a2800] dark:bg-[#7a2800]/10 dark:text-orange-500',
    transfer_out: 'bg-orange-100/60 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
    transfer_in:  'bg-orange-50 text-orange-600 dark:bg-orange-900/15 dark:text-orange-400',
    bill_payment: 'bg-[#f8f6f1] text-[#1f1a17] dark:bg-white/5 dark:text-white/70',
};

export default function Transactions() {
    const { transactions, balance, summary, filters } = usePage<any>().props;

    const [type,     setType]     = useState(filters?.type     ?? '');
    const [category, setCategory] = useState(filters?.category ?? '');
    const [from,     setFrom]     = useState(filters?.from     ?? '');
    const [to,       setTo]       = useState(filters?.to       ?? '');
    const [filtersOpen, setFiltersOpen] = useState(false);

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

    const fmt = (n: number) => Number(n).toLocaleString('en-MA', { minimumFractionDigits: 2 });

    return (
        <>
            <Head title="Transactions" />
            <div className="min-h-screen bg-[#F8F6F1] dark:bg-[#0F0D0B] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl animate-fade-in">

                    {/* Back */}
                    <a href="/dashboard"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#1f1a17]/60 hover:text-orange-600 transition-colors dark:text-white/60 dark:hover:text-orange-400">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </a>

                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#1f1a17] dark:text-white">Transaction History</h1>
                            <p className="mt-1 text-sm text-[#1f1a17]/60 dark:text-white/60">{summary.count} transactions total</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-[#1f1a17]/60 dark:text-white/60">Current Balance</p>
                            <p className="text-lg font-extrabold text-[#1f1a17] dark:text-white">{fmt(balance)} MAD</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                        {[
                            { label: 'Total In',  value: `+${fmt(summary.total_credit)}`, color: 'text-orange-600', sub: 'MAD received', border: 'border-l-orange-400' },
                            { label: 'Total Out', value: `-${fmt(summary.total_debit)}`,  color: 'text-[#7a2800]',     sub: 'MAD spent',    border: 'border-l-[#7a2800]' },
                            { label: 'Net Flow',
                              value: `${summary.net >= 0 ? '+' : ''}${fmt(summary.net)}`,
                              color: summary.net >= 0 ? 'text-orange-600' : 'text-[#7a2800]',
                              sub: 'MAD net',
                              border: summary.net >= 0 ? 'border-l-orange-400' : 'border-l-[#7a2800]' },
                        ].map((c) => (
                            <div key={c.label} className={`fintech-card rounded-2xl border border-orange-100/60 border-l-4 ${c.border} bg-white p-4 dark:border-[#7a2800]/30 dark:bg-[#1f1a17]`}>
                                <p className="text-[10px] uppercase tracking-widest text-[#1f1a17]/60 dark:text-white/60">{c.label}</p>
                                <p className={`mt-1 text-lg font-extrabold ${c.color}`}>{c.value}</p>
                                <p className="text-xs text-[#1f1a17]/60 dark:text-white/60">{c.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filter Bar */}
                    <div className="mb-4 rounded-2xl border border-orange-100/60 bg-white p-4 dark:border-[#7a2800]/30 dark:bg-[#1f1a17]">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-[#1f1a17] dark:text-white">Filters</p>
                            <div className="flex items-center gap-2">
                                {hasFilters && (
                                    <button onClick={clearFilters}
                                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition">
                                        <X className="h-3 w-3" /> Clear
                                    </button>
                                )}
                                <button onClick={() => setFiltersOpen(!filtersOpen)}
                                    className="flex items-center gap-2 rounded-lg border border-orange-200/60 px-3 py-1.5 text-xs font-semibold text-[#1f1a17] hover:border-orange-400 hover:text-orange-600 transition dark:border-[#7a2800]/40 dark:text-white dark:hover:text-orange-400">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    {filtersOpen ? 'Hide' : 'Show'} Filters
                                </button>
                            </div>
                        </div>

                        {filtersOpen && (
                            <div className="mt-4 animate-fade-in">
                                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    <select value={type} onChange={e => setType(e.target.value)}
                                        className="h-10 rounded-xl border border-orange-200/60 bg-[#f8f6f1] px-3 text-sm text-[#1f1a17] outline-none focus:border-orange-600 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white">
                                        <option value="">All Types</option>
                                        <option value="credit">Credit (In)</option>
                                        <option value="debit">Debit (Out)</option>
                                    </select>
                                    <select value={category} onChange={e => setCategory(e.target.value)}
                                        className="h-10 rounded-xl border border-orange-200/60 bg-[#f8f6f1] px-3 text-sm text-[#1f1a17] outline-none focus:border-orange-600 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white">
                                        <option value="">All Categories</option>
                                        <option value="deposit">Deposit</option>
                                        <option value="withdrawal">Withdrawal</option>
                                        <option value="transfer_in">Transfer In</option>
                                        <option value="transfer_out">Transfer Out</option>
                                        <option value="bill_payment">Bill Payment</option>
                                    </select>
                                    <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                                        className="h-10 rounded-xl border border-orange-200/60 bg-[#f8f6f1] px-3 text-sm text-[#1f1a17] outline-none focus:border-orange-600 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white" />
                                    <input type="date" value={to} onChange={e => setTo(e.target.value)}
                                        className="h-10 rounded-xl border border-orange-200/60 bg-[#f8f6f1] px-3 text-sm text-[#1f1a17] outline-none focus:border-orange-600 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white" />
                                </div>
                                <button onClick={applyFilters}
                                    className="mt-3 rounded-xl bg-orange-600 px-5 py-2 text-sm font-bold text-white hover:bg-[#7a2800] transition">
                                    Apply Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Transactions List */}
                    <div className="overflow-hidden rounded-2xl border border-orange-100/60 bg-white dark:border-[#7a2800]/30 dark:bg-[#1f1a17]">
                        {transactions && transactions.length > 0 ? (
                            transactions.map((tx: Transaction, i: number) => {
                                const Icon = CATEGORY_ICON[tx.category] ?? CreditCard;
                                const iconCls = CATEGORY_COLOR[tx.category] ?? 'bg-slate-50 text-slate-500';
                                return (
                                    <div key={tx.id}
                                        className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-orange-50/40 dark:hover:bg-orange-900/10 ${i !== 0 ? 'border-t border-orange-100/50 dark:border-[#7a2800]/20' : ''}`}>
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconCls}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[#1f1a17] dark:text-white">{tx.description}</p>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <span className="text-xs text-[#1f1a17]/60 dark:text-white/60">
                                                    {new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="text-[#1f1a17]/30 dark:text-white/30">·</span>
                                                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-[#7a2800] dark:bg-orange-900/20 dark:text-orange-400">
                                                    {CATEGORY_LABEL[tx.category] ?? tx.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className={`text-sm font-extrabold ${tx.type === 'credit' ? 'text-orange-600' : 'text-[#7a2800]'}`}>
                                                {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)} MAD
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-[#1f1a17]/60 dark:text-white/60">
                                                Bal: {fmt(tx.balance_after)} MAD
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <span className="text-5xl">📭</span>
                                <p className="mt-4 text-sm font-semibold text-[#1f1a17] dark:text-white">No transactions found</p>
                                <p className="mt-1 text-xs text-[#1f1a17]/60 dark:text-white/60">
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