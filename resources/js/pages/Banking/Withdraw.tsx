import { useForm, usePage, Head } from '@inertiajs/react';
import type { FormEvent } from 'react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function Withdraw() {
    const { balance, account_number } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/withdraw');
    };

    const parsed   = parseFloat(data.amount) || 0;
    const remaining = balance - parsed;
    const isInsufficient = parsed > balance;
    const isValid = parsed >= 100 && parsed <= 50000 && !isInsufficient;

    return (
        <>
            <Head title="Withdraw" />
            <div className="min-h-screen bg-[#FFFCF9] p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-lg mx-auto">

                    {/* Back */}
                    <a href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-[#9C978F] hover:text-[#0F0D0B] mb-6 transition-colors">
                        ← Back to Dashboard
                    </a>

                    {/* Balance card */}
                    <div className="bg-[#0F0D0B] rounded-2xl p-6 mb-6 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#E8632A] opacity-10" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#E8632A] opacity-5" />
                        <div className="relative z-10">
                            <p className="text-white/40 text-[10px] uppercase tracking-[2px] mb-1">Available Balance</p>
                            <p className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {Number(balance).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                            </p>
                            <p className="text-white/30 text-xs font-mono">{account_number}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white border border-[#EDE8E0] rounded-2xl p-6">
                        <h1 className="text-lg font-extrabold text-[#0F0D0B] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Withdraw Cash
                        </h1>
                        <p className="text-sm text-[#9C978F] mb-6">Min 100 MAD · Max 50,000 MAD per transaction</p>

                        <form onSubmit={submit} className="space-y-5">

                            {/* Quick amounts */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-2">
                                    Quick Select
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {QUICK_AMOUNTS.map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setData('amount', String(amt))}
                                            className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                                                data.amount === String(amt)
                                                    ? 'border-[#E8632A] bg-[#FFF0E8] text-[#E8632A]'
                                                    : 'border-[#EDE8E0] text-[#5C5751] hover:border-[#E8632A] hover:text-[#E8632A]'
                                            }`}
                                        >
                                            {amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-2">
                                    Amount (MAD)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        className={`w-full h-12 border-2 rounded-xl px-4 pr-16 text-lg font-bold text-[#0F0D0B] focus:outline-none transition bg-gray-50 ${
                                            isInsufficient || errors.amount
                                                ? 'border-red-400'
                                                : data.amount
                                                ? 'border-[#E8632A]'
                                                : 'border-[#EDE8E0] focus:border-[#E8632A]'
                                        }`}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9C978F]">
                                        MAD
                                    </span>
                                </div>

                                {errors.amount && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.amount}</p>
                                )}

                                {/* Balance preview */}
                                {parsed > 0 && !isInsufficient && (
                                    <div className="mt-2 flex items-center justify-between text-xs">
                                        <span className="text-[#9C978F]">Balance after withdrawal</span>
                                        <span className="font-bold text-[#0F0D0B]">
                                            {remaining.toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                                        </span>
                                    </div>
                                )}
                                {isInsufficient && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠️ Amount exceeds your available balance</p>
                                )}
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-2">
                                    Note <span className="normal-case font-normal text-[#C8C3BB]">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="e.g. Rent, groceries..."
                                    className="w-full h-11 border-2 border-[#EDE8E0] rounded-xl px-4 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-gray-50 transition"
                                />
                            </div>

                            {/* Warning */}
                            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <span className="shrink-0">⚠️</span>
                                <p className="text-amber-700 text-xs leading-relaxed">
                                    Withdrawals are instant and cannot be reversed. Please verify the amount before confirming.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !isValid}
                                className="w-full h-12 bg-[#0F0D0B] hover:bg-[#2a2825] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition"
                            >
                                {processing
                                    ? 'Processing...'
                                    : `Withdraw ${parsed > 0 ? parsed.toLocaleString() + ' MAD' : ''}`}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}