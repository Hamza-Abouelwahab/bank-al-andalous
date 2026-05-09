import { useForm, usePage, Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpFromLine,
    ShieldCheck,
    X,
    Zap,
    Smartphone,
    KeyRound,
    Clock3,
} from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import type { FormEvent } from 'react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

type WithdrawalRequest = {
    id: number;
    amount: number;
    reference: string;
    status: 'pending' | 'used' | 'expired' | 'cancelled';
    expires_at: string;
    created_at: string;
};

export default function Withdraw() {
    const {
        balance,
        account_number,
        phone,
        requests = [],
        flash = {},
    } = usePage<any>().props;

    const [review, setReview] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        description: '',
    });

    const codeForm = useForm({
        reference: '',
        pin_code: '',
    });

    const parsed = parseFloat(data.amount) || 0;
    const remaining = balance - parsed;
    const isInsufficient = parsed > balance;
    const isValid = parsed >= 100 && parsed <= 50000 && !isInsufficient;

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (!isValid) return;

        setReview(true);
    };

    const confirmWithdraw = () => {
        post('/withdraw', {
            onSuccess: () => {
                setReview(false);
                reset('amount', 'description');
            },
        });
    };

    const submitCode = (e: FormEvent) => {
        e.preventDefault();

        codeForm.post('/withdraw/use-code', {
            onSuccess: () => {
                codeForm.reset('reference', 'pin_code');
            },
        });
    };

    const fmt = (n: number) =>
        `${Number(n).toLocaleString('en-MA', {
            minimumFractionDigits: 2,
        })} MAD`;

    const maskPhone = (value?: string) => {
        if (!value) return 'your phone number';

        const clean = value.replace(/\s/g, '');

        if (clean.length < 6) return value;

        return `${clean.slice(0, 2)}******${clean.slice(-2)}`;
    };

    const statusClass = (status: string) => {
        if (status === 'pending') {
            return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-500/30';
        }

        if (status === 'used') {
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-500/30';
        }

        if (status === 'expired') {
            return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/10';
        }

        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30';
    };

    useLayoutEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const theme = params.get('theme');

        if (!theme) return;

        const isDark = theme === 'dark';

        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
        document.getElementById('app')?.classList.toggle('dark', isDark);
    }, []);

    const cancelRequest = (id: number) => {
        if (
            !confirm('Are you sure you want to cancel this withdrawal request?')
        ) {
            return;
        }

        router.post(`/withdraw/${id}/cancel`);
    };
    return (
        <>
            <Head title="Cardless Withdrawal" />

            <div className="bg-[#F8F6F1] p-4 text-[#1f1a17] sm:p-6 lg:p-8 dark:bg-[#0F0D0B] dark:text-white">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-500/15 dark:to-[#7a2800]/20">
                                <ArrowUpFromLine className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-[#1f1a17] dark:text-white">
                                    Cardless Withdrawal
                                </h1>

                                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                    Generate a secure 6-digit PIN code to
                                    withdraw money from an ATM without your
                                    card.
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400">
                            <ShieldCheck className="h-4 w-4" />
                            <span>
                                Secure session • 6-digit PIN • Valid for 24
                                hours
                            </span>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Main Form */}
                        <div className="order-2 space-y-6 lg:order-1 lg:col-span-8">
                            <div className="rounded-3xl border border-[#EDE8E0] bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                                <form onSubmit={submit} className="space-y-7">
                                    {/* Quick Amount */}
                                    <div>
                                        <div className="mb-3 flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />

                                            <label className="text-xs font-bold tracking-widest text-[#1f1a17] uppercase dark:text-white">
                                                Quick Amount
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            {QUICK_AMOUNTS.map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            'amount',
                                                            String(amt),
                                                        )
                                                    }
                                                    className={`group relative rounded-2xl border px-2 py-3 text-sm font-bold transition-all duration-200 ${
                                                        data.amount ===
                                                        String(amt)
                                                            ? 'border-orange-600 bg-orange-600 text-white shadow-lg dark:border-orange-500 dark:bg-orange-600/80'
                                                            : 'border-orange-200 bg-white text-[#1f1a17] hover:border-orange-300 hover:bg-orange-50 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white dark:hover:border-orange-500/60 dark:hover:bg-orange-900/20'
                                                    }`}
                                                >
                                                    {amt.toLocaleString()} MAD
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount Input */}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold tracking-widest text-[#1f1a17] uppercase dark:text-white">
                                            Withdrawal Amount
                                        </label>

                                        <div className="group relative">
                                            <input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) =>
                                                    setData(
                                                        'amount',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter amount"
                                                className={`h-16 w-full rounded-2xl border bg-white px-5 pr-20 text-2xl font-bold text-[#1f1a17] transition-all duration-200 outline-none placeholder:text-slate-400 focus:shadow-lg dark:bg-[#1f1a17] dark:text-white dark:placeholder:text-white/35 ${
                                                    isInsufficient
                                                        ? 'border-red-300 focus:border-red-500 dark:border-red-500/50'
                                                        : 'border-orange-200/70 focus:border-orange-600 dark:border-[#7a2800]/40 dark:focus:border-orange-500'
                                                }`}
                                            />

                                            <span className="absolute top-1/2 right-5 -translate-y-1/2 text-sm font-semibold text-slate-400 dark:text-white/40">
                                                MAD
                                            </span>
                                        </div>

                                        {errors.amount && (
                                            <p className="mt-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                                                {errors.amount}
                                            </p>
                                        )}

                                        {isInsufficient && (
                                            <p className="mt-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                                                Insufficient balance for this
                                                amount
                                            </p>
                                        )}

                                        {parsed > 0 && !isInsufficient && (
                                            <p className="mt-2.5 text-xs text-[#1f1a17]/60 dark:text-white/60">
                                                Reserved balance after request:{' '}
                                                <span className="font-bold text-[#1f1a17] dark:text-white">
                                                    {fmt(remaining)}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Note Input */}
                                    <div>
                                        <label className="mb-3 block text-xs font-bold tracking-widest text-[#1f1a17] uppercase dark:text-white">
                                            Note Optional
                                        </label>

                                        <input
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. ATM withdrawal, urgent cash"
                                            className="h-12 w-full rounded-2xl border border-orange-200/70 bg-white px-4 text-sm text-[#1f1a17] transition-all duration-200 outline-none placeholder:text-slate-400 focus:border-orange-600 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white dark:placeholder:text-white/35 dark:focus:border-orange-500"
                                        />
                                    </div>

                                    {/* Warning Box */}
                                    <div className="flex items-start gap-3 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-[#f8f6f1] p-4 dark:border-[#7a2800]/40 dark:from-orange-900/15 dark:to-[#7a2800]/10">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />

                                        <p className="text-sm font-medium text-[#7a2800] dark:text-orange-300">
                                            A 6-digit withdrawal PIN will be
                                            sent by SMS to{' '}
                                            <span className="font-extrabold">
                                                {maskPhone(phone)}
                                            </span>
                                            . The code is valid for 24 hours and
                                            can be used only once.
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={!isValid || processing}
                                        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-orange-600 py-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7a2800] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 dark:bg-orange-600 dark:hover:bg-orange-700"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />

                                        <span className="relative flex items-center justify-center gap-2">
                                            Generate Withdrawal Code
                                            <ArrowUpFromLine className="h-4 w-4" />
                                        </span>
                                    </button>
                                </form>
                            </div>

                            {/* ATM Simulation Form */}
                            <div className="rounded-3xl border border-orange-200/70 bg-white p-8 shadow-sm dark:border-[#7a2800]/40 dark:bg-[#1A1714]">
                                <div className="mb-5 flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-900/20">
                                        <KeyRound className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-extrabold text-[#1f1a17] dark:text-white">
                                            Simulate ATM Withdrawal
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            Enter the reference and PIN code
                                            received by SMS to complete the
                                            withdrawal.
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={submitCode}
                                    className="grid gap-4 sm:grid-cols-2"
                                >
                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-[#1f1a17] uppercase dark:text-white">
                                            Reference
                                        </label>
                                        <input
                                            value={codeForm.data.reference}
                                            onChange={(e) =>
                                                codeForm.setData(
                                                    'reference',
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            placeholder="CWD-20260508-123456"
                                            className="h-12 w-full rounded-2xl border border-orange-200/70 bg-white px-4 text-sm font-bold text-[#1f1a17] transition outline-none focus:border-orange-600 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white"
                                        />
                                        {codeForm.errors.reference && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                                {codeForm.errors.reference}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-[#1f1a17] uppercase dark:text-white">
                                            PIN Code
                                        </label>
                                        <input
                                            value={codeForm.data.pin_code}
                                            onChange={(e) =>
                                                codeForm.setData(
                                                    'pin_code',
                                                    e.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 6),
                                                )
                                            }
                                            placeholder="6 digits"
                                            inputMode="numeric"
                                            maxLength={6}
                                            className="h-12 w-full rounded-2xl border border-orange-200/70 bg-white px-4 text-sm font-bold tracking-[0.3em] text-[#1f1a17] transition outline-none focus:border-orange-600 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white"
                                        />
                                        {codeForm.errors.pin_code && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                                {codeForm.errors.pin_code}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={codeForm.processing}
                                        className="rounded-2xl bg-gradient-to-r from-[#1f1a17] to-[#7a2800] py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20 disabled:opacity-50 sm:col-span-2 dark:from-orange-600 dark:to-[#7a2800]"
                                    >
                                        {codeForm.processing
                                            ? 'Checking Code…'
                                            : 'Confirm ATM Withdrawal'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Cards */}
                        <div className="order-1 space-y-5 lg:order-2 lg:col-span-4">
                            {/* Balance Card */}
                            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f1a17] via-[#7a2800] to-orange-600 p-6 text-white shadow-lg transition-all duration-200 hover:shadow-xl">
                                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-all group-hover:blur-3xl" />
                                <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

                                <div className="relative space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">
                                            Available Balance
                                        </p>

                                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                                            {fmt(balance)}
                                        </h2>
                                    </div>

                                    <p className="text-xs text-white/45">
                                        Account: ****{' '}
                                        {account_number?.slice(-4)}
                                    </p>

                                    {parsed > 0 && !isInsufficient && (
                                        <div className="border-t border-white/15 pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-white/60">
                                                    Reserved after request
                                                </span>

                                                <span className="text-lg font-bold text-orange-200">
                                                    {fmt(remaining)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-[#2A2520] dark:bg-[#1A1714]">
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#1f1a17] dark:text-white">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                        <span className="text-xs text-orange-600 dark:text-orange-400">
                                            ✓
                                        </span>
                                    </div>
                                    Request Summary
                                </h3>

                                <div className="space-y-3 text-sm">
                                    {[
                                        [
                                            'Amount',
                                            parsed
                                                ? `${parsed.toLocaleString()} MAD`
                                                : '—',
                                        ],
                                        ['PIN validity', '24 hours'],
                                        [
                                            'SMS delivery',
                                            phone
                                                ? maskPhone(phone)
                                                : 'Phone required',
                                        ],
                                        ['Status', 'Pending until used'],
                                    ].map(([k, v]) => (
                                        <div
                                            key={k}
                                            className="flex items-center justify-between border-b border-orange-100/70 pb-2.5 last:border-0 last:pb-0 dark:border-[#7a2800]/20"
                                        >
                                            <span className="font-medium text-[#1f1a17]/70 dark:text-white/70">
                                                {k}
                                            </span>

                                            <span className="text-right font-bold text-[#1f1a17] dark:text-white">
                                                {v}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="group rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-[#f8f6f1] p-5 transition-all duration-200 hover:shadow-md dark:border-[#7a2800]/40 dark:from-orange-900/15 dark:to-[#7a2800]/10">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 px-2 dark:bg-orange-900/30">
                                        <Smartphone className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-[#7a2800] dark:text-orange-300">
                                            SMS PIN Verification
                                        </p>

                                        <p className="mt-1 text-xs leading-relaxed text-[#7a2800]/80 dark:text-orange-400/80">
                                            Your withdrawal code is sent by SMS,
                                            expires after 24 hours, and becomes
                                            invalid after one use.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Requests */}
                            <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                                <div className="mb-4 flex items-center gap-2">
                                    <Clock3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <h3 className="text-sm font-extrabold text-[#1f1a17] dark:text-white">
                                        Recent Requests
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {requests.length > 0 ? (
                                        requests.map(
                                            (item: WithdrawalRequest) => (
                                                <div
                                                    key={item.id}
                                                    className="rounded-2xl border border-orange-100 bg-orange-50/40 p-3 dark:border-[#7a2800]/30 dark:bg-orange-900/10"
                                                >
                                                    <div className="mb-2 flex items-center justify-between gap-2">
                                                        <p className="truncate text-xs font-extrabold text-[#1f1a17] dark:text-white">
                                                            {item.reference}
                                                        </p>

                                                        <span
                                                            className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase ${statusClass(item.status)}`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            {fmt(
                                                                Number(
                                                                    item.amount,
                                                                ),
                                                            )}
                                                        </span>

                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            Expires:{' '}
                                                            {new Date(
                                                                item.expires_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {item.status ===
                                                        'pending' && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                cancelRequest(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="mt-3 w-full cursor-pointer rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-900/15 dark:text-red-300 dark:hover:bg-red-900/25"
                                                        >
                                                            Cancel Request
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="rounded-2xl bg-slate-50 p-4 text-center text-xs font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">
                                            No withdrawal requests yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {review && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setReview(false)}
                    />

                    <div className="relative z-10 w-full max-w-sm rounded-3xl border border-[#EDE8E0] bg-white p-7 text-[#1f1a17] shadow-2xl dark:border-[#2A2520] dark:bg-[#1A1714] dark:text-white">
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-500/10">
                                    <ArrowUpFromLine className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-[#1f1a17] dark:text-white">
                                        Confirm Cardless Withdrawal
                                    </h2>

                                    <p className="text-xs text-[#1f1a17]/60 dark:text-white/60">
                                        The amount will be reserved and a PIN
                                        will be sent by SMS.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setReview(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1f1a17]/60 transition hover:bg-orange-50 hover:text-[#7a2800] dark:text-white/60 dark:hover:bg-orange-900/20 dark:hover:text-orange-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-6 space-y-3 rounded-2xl bg-gradient-to-br from-[#f8f6f1] to-orange-50/70 p-5 dark:from-orange-900/15 dark:to-[#7a2800]/10">
                            {[
                                ['Amount', `${parsed.toLocaleString()} MAD`],
                                ['Balance after reservation', fmt(remaining)],
                                ['PIN sent to', maskPhone(phone)],
                                ['Expires after', '24 hours'],
                            ].map(([k, v]) => (
                                <div
                                    key={k}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <span className="text-sm font-medium text-[#1f1a17]/70 dark:text-white/70">
                                        {k}
                                    </span>

                                    <span className="text-right text-sm font-bold text-[#1f1a17] dark:text-white">
                                        {v}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmWithdraw}
                                disabled={processing}
                                className="group relative flex-1 overflow-hidden rounded-2xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7a2800] disabled:opacity-50 disabled:hover:translate-y-0 dark:hover:bg-orange-700"
                            >
                                <span className="relative">
                                    {processing
                                        ? 'Generating…'
                                        : 'Confirm & Send PIN'}
                                </span>
                            </button>

                            <button
                                onClick={() => setReview(false)}
                                disabled={processing}
                                className="flex-1 rounded-2xl border-2 border-orange-200/70 py-3 text-sm font-bold text-[#1f1a17] transition-colors hover:bg-orange-50 dark:border-[#7a2800]/40 dark:text-white dark:hover:bg-orange-900/20"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="mt-5 flex items-center gap-2 rounded-lg bg-orange-50/70 px-3 py-2.5 dark:bg-orange-900/15">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-orange-600 dark:text-orange-400" />

                            <p className="text-xs font-medium text-[#7a2800] dark:text-orange-400">
                                Never share your PIN code. It is valid for one
                                withdrawal only.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
