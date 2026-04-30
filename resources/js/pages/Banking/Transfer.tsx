import { useForm, usePage, Head } from '@inertiajs/react';
import type { FormEvent } from 'react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function Transfer() {
    const { balance, account_number } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        recipient_account: '',
        amount:            '',
        description:       '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/transfer');
    };

    const parsed        = parseFloat(data.amount) || 0;
    const remaining     = balance - parsed;
    const isInsufficient = parsed > balance;
    const isValid       = parsed >= 10 && !isInsufficient && data.recipient_account !== '';

    return (
        <>
            <Head title="Transfer" />
            <div className="min-h-screen bg-[#FFFCF9] p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-lg mx-auto">

                    {/* Back */}
                    <a href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-[#9C978F] hover:text-[#0F0D0B] mb-6 transition-colors">
                        ← Back to Dashboard
                    </a>

                    {/* Balance card */}
                    <div className="bg-[#0F0D0B] rounded-2xl p-6 mb-6 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#3B82F6] opacity-10" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#3B82F6] opacity-5" />
                        <div className="relative z-10">
                            <p className="text-white/40 text-[10px] uppercase tracking-[2px] mb-1">Available Balance</p>
                            <p className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {Number(balance).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                            </p>
                            <p className="text-white/30 text-xs font-mono">{account_number}</p>

                            {parsed > 0 && !isInsufficient && (
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-white/40 text-xs">Balance after transfer</span>
                                    <span className="text-blue-400 font-bold text-sm">
                                        {remaining.toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white border border-[#EDE8E0] rounded-2xl p-6">
                        <h1 className="text-lg font-extrabold text-[#0F0D0B] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Send Money
                        </h1>
                        <p className="text-sm text-[#9C978F] mb-6">Min 10 MAD · Max 100,000 MAD per transfer</p>

                        <form onSubmit={submit} className="space-y-5">

                            {/* Recipient */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-2">
                                    Recipient Account Number
                                </label>
                                <input
                                    type="text"
                                    value={data.recipient_account}
                                    onChange={e => setData('recipient_account', e.target.value)}
                                    placeholder="e.g. MA123456789"
                                    className={`w-full h-12 border-2 rounded-xl px-4 text-sm font-mono text-[#0F0D0B] focus:outline-none transition bg-gray-50 ${
                                        errors.recipient_account
                                            ? 'border-red-400'
                                            : data.recipient_account
                                            ? 'border-[#3B82F6]'
                                            : 'border-[#EDE8E0] focus:border-[#3B82F6]'
                                    }`}
                                />
                                {errors.recipient_account && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.recipient_account}</p>
                                )}
                            </div>

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
                                                    ? 'border-[#3B82F6] bg-blue-50 text-[#3B82F6]'
                                                    : 'border-[#EDE8E0] text-[#5C5751] hover:border-[#3B82F6] hover:text-[#3B82F6]'
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
                                                ? 'border-[#3B82F6]'
                                                : 'border-[#EDE8E0] focus:border-[#3B82F6]'
                                        }`}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9C978F]">
                                        MAD
                                    </span>
                                </div>
                                {errors.amount && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.amount}</p>
                                )}
                                {isInsufficient && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠️ Amount exceeds your available balance</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-2">
                                    Description <span className="normal-case font-normal text-[#C8C3BB]">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="e.g. Rent payment, split bill..."
                                    className="w-full h-11 border-2 border-[#EDE8E0] rounded-xl px-4 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#3B82F6] bg-gray-50 transition"
                                />
                            </div>

                            {/* Warning */}
                            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10 }}>
                                <span className="shrink-0">ℹ️</span>
                                <p style={{ color: '#1e40af', fontSize: 12, lineHeight: 1.6 }}>
                                    Transfers are instant and cannot be reversed. Make sure the account number is correct before confirming.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !isValid}
                                className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition"
                            >
                                {processing
                                    ? 'Processing...'
                                    : `Send ${parsed > 0 ? parsed.toLocaleString() + ' MAD' : ''}`}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

Transfer.layout = () => null;