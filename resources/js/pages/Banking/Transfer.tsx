import { useForm, usePage, Head } from '@inertiajs/react';
import { Send, ShieldCheck, X, Zap } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function Transfer() {
    const { balance, account_number, user } = usePage<any>().props;

    const [review, setReview] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        recipient_account: '',
        amount: '',
        description: '',
    });

    const parsed        = parseFloat(data.amount) || 0;
    const fee           = parsed > 0 ? 2 : 0;
    const total         = parsed + fee;
    const remaining     = balance - total;
    const isInsufficient = total > balance;
    const isValid       = data.recipient_account.length > 5 && parsed >= 10 && parsed <= 100000 && !isInsufficient;

    const submit = (e: FormEvent) => { e.preventDefault(); setReview(true); };

    const confirmTransfer = () => {
        post('/transfer', {
            preserveScroll: false,
            onSuccess: () => { setReview(false); reset(); },
            onError:   () => { setReview(true); },
        });
    };

    const fmt = (n: number) => `${Number(n).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD`;

    return (
        <>
            <Head title="Transfer" />
            <div className="min-h-screen bg-[#F8F6F1] dark:bg-[#0F0D0B] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl">

                    {/* Header with Premium Styling */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10">
                                <Send className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Send Money</h1>
                                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                    Transfer funds securely to any account
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
                        <div className="lg:col-span-8 order-2 lg:order-1">
                            <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                                <form onSubmit={submit} className="space-y-7">

                                    {/* Recipient - Enhanced */}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#1f1a17] dark:text-white">Recipient Account Number</label>
                                        <input placeholder="MA123456789..."
                                            value={data.recipient_account}
                                            onChange={(e) => setData('recipient_account', e.target.value)}
                                            className="h-14 w-full rounded-2xl border  px-4 font-mono text-sm text-[#1f1a17] outline-none border-orange-200 transition-all duration-200 focus:border-orange-600 focus:dark:border-orange-600 dark:border-[#2A2520] dark:text-white" />
                                        {errors.recipient_account && <p className="mt-2.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.recipient_account}</p>}
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
                                                    className={`group relative rounded-2xl border py-3 px-2 text-sm font-bold transition-all duration-200 ${data.amount === String(amt)
                                                         ? 'border-orange-600 bg-orange-600 dark:bg-orange-600/50 dark:border-orange-600/20 text-white shadow-lg '
                                                        : 'border-orange-200 text-[#1f1a17] hover:border-orange-300 hover:bg-orange-600/20 dark:border-[#2A2520] dark:text-white dark:hover:bg-orange-600/50'
                                                    }`}>
                                                    {amt.toLocaleString()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Transfer Amount*/}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#1f1a17] dark:text-white">Transfer Amount</label>
                                        <div className="relative group">
                                            <input type="number" value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                placeholder="Enter amount"
                                                className={`h-16 w-full rounded-2xl border bg-white px-5 pr-20 text-2xl font-bold text-[#1f1a17] outline-none transition-all duration-200  dark:bg-[#1f1a17] dark:text-white ${
                                                    isInsufficient
                                                        ? 'border-[#2A2520]  '
                                                        : 'border-orange-200 focus:dark:border-orange-600 focus:border-orange-600 dark:border-[#2A2520]'
                                                }`} />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">MAD</span>
                                        </div>
                                        {errors.amount && <p className="mt-2.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.amount}</p>}
                                        {isInsufficient && <p className="mt-2.5 text-xs font-medium text-red-600 dark:text-red-400">Insufficient balance (including 2 MAD fee)</p>}
                                    </div>

                                    {/* Description (Optional) */}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#1f1a17] dark:text-white">Description (Optional)</label>
                                        <input value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="e.g. Rent payment, family support"
                                            className="h-12 w-full rounded-2xl border border-orange-200 bg-white px-4 text-sm text-[#1f1a17] outline-none transition-all duration-200 focus:border-orange-600  focus:dark:border-orange-600  dark:border-[#2A2520] dark:bg-[#1f1a17] dark:text-white" />
                                    </div>

                                    {/* Submit Button - Premium */}
                                    <button type="submit" disabled={!isValid || processing}
                                        className="w-full rounded-2xl bg-orange-600 py-4 text-sm font-bold text-white shadow-sm transition-all duration-300 cursor-pointer hover:bg-orange-700 disabled:opacity-50">
                                        <span className="flex items-center justify-center gap-2">
                                            Review Transfer
                                            <Send className="h-4 w-4" />
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* ── Sidebar Cards ── */}
                        <div className="lg:col-span-4 order-1 lg:order-2 space-y-5">
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
                                                <span className="text-xs font-medium text-white/60">After transfer</span>
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
                                    Transfer Summary
                                </h3>
                                <div className="space-y-3 text-sm">
                                    {[
                                        ['Amount',       parsed ? `${parsed.toLocaleString()} MAD` : '—'],
                                        ['Transfer fee', `${fee} MAD`],
                                        ['Total',        parsed ? `${total.toLocaleString()} MAD` : '—'],
                                    ].map(([k, v]) => (
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/20">
                                        <ShieldCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#7a2800] dark:text-orange-300">Secure Transfer</p>
                                        <p className="mt-1 text-xs text-[#7a2800]/80 dark:text-orange-400/70 leading-relaxed">
                                            Protected with bank-level encryption and instant processing.
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
                                    <Send className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1f1a17] dark:text-white">Confirm Transfer</h2>
                                    <p className="text-xs text-[#1f1a17]/60 dark:text-white/60">Review before proceeding</p>
                                </div>
                            </div>
                            <button onClick={() => setReview(false)} 
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1f1a17]/60 hover:bg-orange-50 hover:text-[#7a2800] transition dark:text-white/60 dark:hover:bg-orange-900/20">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Summary Section */}
                        <div className="mb-6 space-y-3 rounded-2xl bg-gradient-to-br from-[#f8f6f1] to-orange-50/50 p-5 dark:from-orange-900/10 dark:to-[#7a2800]/5">
                            {[['To Account', data.recipient_account], ['Amount', `${parsed.toLocaleString()} MAD`], ['Fee', `${fee} MAD`], ['Total', `${total.toLocaleString()} MAD`]].map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between">
                                    <span className="text-sm text-[#1f1a17]/70 dark:text-white/70 font-medium">{k}</span>
                                    <span className="text-lg font-bold text-[#1f1a17] dark:text-white">{v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button type="button" onClick={confirmTransfer} disabled={processing}
                                className="flex-1 rounded-2xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#7a2800] disabled:opacity-50">
                                {processing ? 'Processing…' : 'Confirm Transfer'}
                            </button>
                            <button onClick={() => setReview(false)} disabled={processing}
                                className="flex-1 rounded-2xl border-2 border-orange-200/60 py-3 text-sm font-bold text-[#1f1a17] hover:bg-orange-50 transition-colors dark:border-[#7a2800]/40 dark:text-white dark:hover:bg-orange-900/10">
                                Cancel
                            </button>
                        </div>

                        {/* Footer Security Note */}
                        <div className="mt-5 flex items-center gap-2 rounded-lg bg-orange-50/50 px-3 py-2.5 dark:bg-orange-900/10">
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                            <p className="text-xs text-[#7a2800] dark:text-orange-400 font-medium">Transaction protected with 256-bit encryption</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
