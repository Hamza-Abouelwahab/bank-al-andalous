import { useForm, usePage, Head } from '@inertiajs/react';
import { FileText, ShieldCheck, X, Zap } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

const BILLS = [
    { value: 'electricity', label: 'Electricity', icon: '⚡', provider: 'ONEE' },
    { value: 'water',       label: 'Water',        icon: '💧', provider: 'ONEE' },
    { value: 'internet',    label: 'Internet',     icon: '🌐', provider: 'IAM / Orange' },
    { value: 'phone',       label: 'Phone',        icon: '📱', provider: 'Any operator' },
    { value: 'insurance',   label: 'Insurance',    icon: '🛡️', provider: 'Insurance company' },
    { value: 'tax',         label: 'Tax',          icon: '🏛️', provider: 'DGI Morocco' },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export default function Bills() {
    const { balance, account_number, user } = usePage<any>().props;
    const [review, setReview] = useState(false);

    const { data, setData, post, processing } = useForm({
        bill_type: '',
        reference: '',
        amount: '',
    });

    const parsed        = parseFloat(data.amount) || 0;
    const remaining     = balance - parsed;
    const isInsufficient = parsed > balance;
    const selectedBill  = BILLS.find((b) => b.value === data.bill_type);
    const isValid       = parsed >= 10 && !isInsufficient && data.bill_type !== '' && data.reference !== '';

    const submit = (e: FormEvent) => { e.preventDefault(); setReview(true); };
    const confirmPayment = () => { post('/bills'); };

    const fmt = (n: number) => `${Number(n).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD`;

    return (
        <>
            <Head title="Pay Bills" />
            <div className="min-h-screen bg-[#F8F6F1] dark:bg-[#0F0D0B] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl">

                    {/* Header with Premium Styling */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10">
                                <FileText className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Pay Bills</h1>
                                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                    Pay all your bills in one secure place
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400 mt-3">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Secure session • 256-bit encryption</span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-12 stagger animate-fade-in">
                        {/* ── Form Card ── */}
                        <div className="lg:col-span-8">
                            <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                                <form onSubmit={submit} className="space-y-7">

                                    {/* Bill Type Selector - Enhanced */}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#1f1a17] dark:text-white">Select Bill Type</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {BILLS.map((bill) => (
                                                <button key={bill.value} type="button"
                                                    onClick={() => setData('bill_type', bill.value)}
                                                    className={`group relative rounded-2xl border p-4 text-center transition-all duration-200 overflow-hidden ${data.bill_type === bill.value
                                                        ? 'border-orange-600 bg-orange-600 dark:bg-orange-600/50 dark:border-orange-600/20 text-white shadow-lg '
                                                        : 'border-orange-200 text-[#1f1a17] hover:border-orange-300 hover:bg-orange-600/20 dark:border-[#2A2520] dark:text-white dark:hover:bg-orange-600/50'
                                                    }`}>
                                                    <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="relative space-y-2">
                                                        <span className="inline-block text-3xl">{bill.icon}</span>
                                                        <p className="text-xs font-semibold text-[#1f1a17] dark:text-white">{bill.label}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Provider Pill - Enhanced */}
                                    {selectedBill && (
                                        <div className="flex items-center gap-2 rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-[#f8f6f1] px-4 py-3 dark:border-[#7a2800]/40 dark:from-orange-900/10 dark:to-[#7a2800]/5">
                                            <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
                                            <span className="text-sm font-medium text-[#7a2800] dark:text-orange-300">
                                                Provider: <span className="font-bold">{selectedBill.provider}</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Reference Number - Premium */}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#1f1a17] dark:text-white">Reference Number</label>
                                        <input placeholder="e.g. MA-2024-123456"
                                            value={data.reference}
                                            onChange={(e) => setData('reference', e.target.value)}
                                            className="h-14 w-full rounded-2xl border border-orange-200  bg-white px-4 font-mono text-sm text-[#1f1a17] outline-none transition-all duration-200 focus:border-orange-600 dark:border-[#2A2520] focus:dark:border-orange-600 dark:bg-[#1f1a17] dark:text-white" />
                                    </div>

                                    {/* Quick amounts - Enhanced */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Zap className="h-4 w-4 text-orange-600" />
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#1f1a17] dark:text-white">Quick Amount</label>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {QUICK_AMOUNTS.map((amt) => (
                                                <button key={amt} type="button"
                                                    onClick={() => setData('amount', String(amt))}
                                                    className={`group relative rounded-2xl border py-3 px-2 text-sm font-bold transition-all duration-300 ${data.amount === String(amt)
                                                          ? 'border-orange-600 bg-orange-600 dark:bg-orange-600/50 dark:border-orange-600/20 text-white shadow-lg '
                                                        : 'border-orange-200 text-[#1f1a17] hover:border-orange-300 hover:bg-orange-600/20 dark:border-[#2A2520] dark:text-white dark:hover:bg-orange-600/50'
                                                    }`}>
                                                    {amt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount Input - Premium */}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#1f1a17] dark:text-white">Payment Amount</label>
                                        <div className="relative group">
                                            <input type="number" value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                placeholder="Enter amount"
                                                className={`h-16 w-full rounded-2xl border bg-white px-5 pr-20 text-2xl font-bold text-[#1f1a17] outline-none transition-all duration-200  dark:bg-[#1f1a17] dark:text-white ${
                                                    isInsufficient
                                                    ? 'border-orange-600 focus:border-orange-600 text-white '
                                                    : 'border-orange-200 text-[#1f1a17] hover:border-orange-300 focus:border-orange-600 focus:dark:border-orange-600 dark:border-[#2A2520] dark:text-white '
                                                }`} />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">MAD</span>
                                        </div>
                                        {isInsufficient && <p className="mt-2.5 text-xs font-medium text-red-600 dark:text-red-400">Insufficient balance</p>}
                                    </div>

                                    {/* Submit Button - Premium */}
                                    <button type="submit" disabled={!isValid || processing}
                                        className="group relative w-full overflow-hidden rounded-2xl bg-orange-600 py-4 text-sm font-bold text-white  cursor-pointer transition-all duration-300 hover:bg-orange-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">
                                        <span className="relative flex items-center justify-center gap-2">
                                            Review Payment
                                            <FileText className="h-4 w-4" />
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* ── Sidebar Cards ── */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* Balance Card - Premium Gradient */}
                            <div className="fintech-card group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f1a17] via-[#7a2800] to-orange-600 p-6 text-white shadow-lg transition-all duration-200 hover:shadow-xl">
                                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl group-hover:blur-3xl transition-all" />
                                <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
                                <div className="relative space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Available Balance</p>
                                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{fmt(balance)}</h2>
                                    </div>
                                    <p className="text-xs text-white/40">Account: **** {account_number?.slice(-4)}</p>
                                    {parsed > 0 && (
                                        <div className="border-t border-white/15 pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-white/60">After payment</span>
                                                <span className={`text-lg font-bold ${isInsufficient ? 'text-red-300' : 'text-orange-200'}`}>{fmt(remaining)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Card - Premium */}
                            <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-[#2A2520] dark:bg-[#1A1714]">
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#1f1a17] dark:text-white">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/15">
                                        <span className="text-xs text-orange-600">✓</span>
                                    </div>
                                    Payment Summary
                                </h3>
                                <div className="space-y-3 text-sm">
                                    {[['Bill', selectedBill?.label ?? '—'], ['Amount', parsed ? `${parsed.toLocaleString()} MAD` : '—'], ['Processing fee', 'Free']].map(([k, v]) => (
                                        <div key={k} className="flex items-center justify-between border-b border-orange-100/50 pb-2.5 dark:border-[#7a2800]/20 last:border-0 last:pb-0">
                                            <span className="text-[#1f1a17]/70 dark:text-white/70 font-medium">{k}</span>
                                            <span className="font-bold text-[#1f1a17] dark:text-white">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Info - Premium */}
                            <div className="fintech-card group rounded-3xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-[#f8f6f1] p-5 transition-all duration-200 hover:shadow-md dark:border-[#7a2800]/40 dark:from-orange-900/10 dark:to-[#7a2800]/5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center shrink-0 justify-center rounded-xl bg-orange-100 dark:bg-orange-900/20">
                                        <ShieldCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#7a2800] dark:text-orange-300">Secure Payment</p>
                                        <p className="mt-1 text-xs text-[#7a2800]/80 dark:text-orange-400/70 leading-relaxed">
                                            Protected with bank-level encryption and verified providers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal - Premium */}
            {review && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all" onClick={() => setReview(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-3xl border border-[#EDE8E0] bg-white p-7 shadow-2xl dark:border-[#2A2520] dark:bg-[#1A1714] animate-scale-in">
                        {/* Modal Header */}
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-900/15">
                                    <FileText className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1f1a17] dark:text-white">Confirm Payment</h2>
                                    <p className="text-xs text-[#1f1a17]/60 dark:text-white/60">Review before proceeding</p>
                                </div>
                            </div>
                            <button onClick={() => setReview(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1f1a17]/60 shadow-sm transition-all duration-300 hover:bg-orange-50 hover:text-[#7a2800] dark:text-white/60 dark:hover:bg-orange-900/20">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Summary Section */}
                        <div className="mb-6 space-y-3 rounded-2xl bg-gradient-to-br from-[#f8f6f1] to-orange-50/50 p-5 dark:from-orange-900/10 dark:to-[#7a2800]/5">
                            {[['Bill Type', selectedBill?.label ?? data.bill_type], ['Reference', data.reference], ['Amount', `${parsed.toLocaleString()} MAD`]].map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between">
                                    <span className="text-sm text-[#1f1a17]/70 dark:text-white/70 font-medium">{k}</span>
                                    <span className="text-lg font-bold text-[#1f1a17] dark:text-white">{v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button onClick={confirmPayment} disabled={processing}
                                className="group flex-1 relative overflow-hidden rounded-2xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#7a2800] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">
                                <span className="relative">
                                    {processing ? 'Processing…' : 'Confirm Payment'}
                                </span>
                            </button>
                            <button onClick={() => setReview(false)} disabled={processing}
                                className="flex-1 rounded-2xl border-2 border-orange-200/60 py-3 text-sm font-bold text-[#1f1a17] shadow-sm transition-all duration-300 hover:bg-orange-50 hover:border-orange-300 dark:border-[#7a2800]/40 dark:text-white dark:hover:bg-orange-900/10">
                                Cancel
                            </button>
                        </div>

                        {/* Footer Security Note */}
                        <div className="mt-5 flex items-center gap-2 rounded-lg bg-orange-50/50 px-3 py-2.5 dark:bg-orange-900/10">
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                            <p className="text-xs text-[#7a2800] dark:text-orange-400 font-medium">Payment protected with 256-bit encryption</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
