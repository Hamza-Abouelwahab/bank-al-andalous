import { useForm, usePage, Head } from '@inertiajs/react';
import type { FormEvent } from 'react';

const BILLS = [
    { value: 'electricity', label: 'Electricity',  icon: '⚡', provider: 'ONEE',       color: '#F59E0B' },
    { value: 'water',       label: 'Water',         icon: '💧', provider: 'ONEE',       color: '#3B82F6' },
    { value: 'internet',    label: 'Internet',      icon: '🌐', provider: 'Maroc Telecom / IAM', color: '#8B5CF6' },
    { value: 'phone',       label: 'Phone Top-up',  icon: '📱', provider: 'Any operator', color: '#10B981' },
    { value: 'insurance',   label: 'Insurance',     icon: '🛡️', provider: 'Your insurer', color: '#E8632A' },
    { value: 'tax',         label: 'Tax Payment',   icon: '🏛️', provider: 'DGI Morocco', color: '#6B7280' },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export default function Bills() {
    const { balance, account_number } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        bill_type:  '',
        reference:  '',
        amount:     '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/bills');
    };

    const parsed        = parseFloat(data.amount) || 0;
    const remaining     = balance - parsed;
    const isInsufficient = parsed > balance;
    const isValid       = parsed >= 10 && !isInsufficient && data.bill_type !== '' && data.reference !== '';
    const selectedBill  = BILLS.find(b => b.value === data.bill_type);

    return (
        <>
            <Head title="Pay Bills" />
            <div className="min-h-screen bg-[#FFFCF9] p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-lg mx-auto">

                    {/* Back */}
                    <a href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-[#9C978F] hover:text-[#0F0D0B] mb-6 transition-colors">
                        ← Back to Dashboard
                    </a>

                    {/* Balance card */}
                    <div className="bg-[#0F0D0B] rounded-2xl p-6 mb-6 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#8B5CF6] opacity-10" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#8B5CF6] opacity-5" />
                        <div className="relative z-10">
                            <p className="text-white/40 text-[10px] uppercase tracking-[2px] mb-1">Available Balance</p>
                            <p className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {Number(balance).toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                            </p>
                            <p className="text-white/30 text-xs font-mono">{account_number}</p>

                            {parsed > 0 && !isInsufficient && (
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-white/40 text-xs">Balance after payment</span>
                                    <span className="font-bold text-sm" style={{ color: '#A78BFA' }}>
                                        {remaining.toLocaleString('en-MA', { minimumFractionDigits: 2 })} MAD
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white border border-[#EDE8E0] rounded-2xl p-6">
                        <h1 className="text-lg font-extrabold text-[#0F0D0B] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Pay Bills
                        </h1>
                        <p className="text-sm text-[#9C978F] mb-6">Select a bill type and enter your reference number</p>

                        <form onSubmit={submit} className="space-y-5">

                            {/* Bill type selector */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-3">
                                    Bill Type
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {BILLS.map(bill => (
                                        <button
                                            key={bill.value}
                                            type="button"
                                            onClick={() => setData('bill_type', bill.value)}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                                data.bill_type === bill.value
                                                    ? 'border-[#8B5CF6] bg-purple-50'
                                                    : 'border-[#EDE8E0] hover:border-[#8B5CF6]'
                                            }`}
                                        >
                                            <span className="text-2xl">{bill.icon}</span>
                                            <span className={`text-xs font-bold ${
                                                data.bill_type === bill.value ? 'text-[#8B5CF6]' : 'text-[#5C5751]'
                                            }`}>
                                                {bill.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {errors.bill_type && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.bill_type}</p>
                                )}
                            </div>

                            {/* Provider info */}
                            {selectedBill && (
                                <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span>{selectedBill.icon}</span>
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: '#5b21b6' }}>{selectedBill.label}</p>
                                        <p style={{ fontSize: 11, color: '#7c3aed' }}>Provider: {selectedBill.provider}</p>
                                    </div>
                                </div>
                            )}

                            {/* Reference number */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#9C978F] uppercase tracking-widest mb-2">
                                    Reference / Contract Number
                                </label>
                                <input
                                    type="text"
                                    value={data.reference}
                                    onChange={e => setData('reference', e.target.value)}
                                    placeholder="e.g. 123456789"
                                    className={`w-full h-11 border-2 rounded-xl px-4 text-sm font-mono text-[#0F0D0B] focus:outline-none transition bg-gray-50 ${
                                        errors.reference
                                            ? 'border-red-400'
                                            : data.reference
                                            ? 'border-[#8B5CF6]'
                                            : 'border-[#EDE8E0] focus:border-[#8B5CF6]'
                                    }`}
                                />
                                {errors.reference && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.reference}</p>
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
                                                    ? 'border-[#8B5CF6] bg-purple-50 text-[#8B5CF6]'
                                                    : 'border-[#EDE8E0] text-[#5C5751] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
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
                                                ? 'border-[#8B5CF6]'
                                                : 'border-[#EDE8E0] focus:border-[#8B5CF6]'
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

                            {/* Warning */}
                            <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10 }}>
                                <span className="shrink-0">⚠️</span>
                                <p style={{ color: '#6b21a8', fontSize: 12, lineHeight: 1.6 }}>
                                    Bill payments are instant and cannot be reversed. Make sure your reference number is correct.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !isValid}
                                className="w-full h-12 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition"
                                style={{ background: isValid ? '#8B5CF6' : '#9CA3AF' }}
                            >
                                {processing
                                    ? 'Processing...'
                                    : `Pay ${parsed > 0 ? parsed.toLocaleString() + ' MAD' : ''}`}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

Bills.layout = () => null;