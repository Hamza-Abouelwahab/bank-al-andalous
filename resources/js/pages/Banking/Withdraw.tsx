import { useForm, usePage, Head } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function Withdraw() {
    const { balance, account_number, user } = usePage<any>().props;

    const [review, setReview] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
    });

    const parsed = parseFloat(data.amount) || 0;
    const remaining = balance - parsed;
    const isInsufficient = parsed > balance;
    const isValid = parsed >= 100 && parsed <= 50000 && !isInsufficient;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setReview(true);
    };

    const confirmWithdraw = () => {
        post('/withdraw');
    };

    return (
        <>
            <Head title="Withdraw" />

            <div className="min-h-screen bg-[#FFFCF9] p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                            🔒 Secure Banking Session
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{user?.name}</span>
                            <span className="text-green-600 text-sm">● Verified</span>
                        </div>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                        {/* LEFT FORM */}
                        <div className="lg:col-span-8 order-2 lg:order-1">
                            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl border">

                                <h1 className="text-lg sm:text-xl font-bold mb-2">
                                    Withdraw Cash
                                </h1>

                                <p className="text-sm text-gray-500 mb-6">
                                    Min 100 MAD · Max 50,000 MAD
                                </p>

                                <form onSubmit={submit} className="space-y-6">

                                    {/* QUICK */}
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block">
                                            QUICK AMOUNT
                                        </label>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                            {QUICK_AMOUNTS.map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setData('amount', String(amt))}
                                                    className={`py-2.5 sm:py-3 rounded-xl border font-semibold text-sm ${
                                                        data.amount === String(amt)
                                                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                                                            : 'border-gray-200'
                                                    }`}
                                                >
                                                    {amt.toLocaleString()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AMOUNT */}
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block">
                                            AMOUNT (MAD)
                                        </label>

                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="0.00"
                                            className={`w-full h-11 sm:h-12 border rounded-xl px-4 text-base sm:text-lg font-semibold ${
                                                isInsufficient ? 'border-red-400' : ''
                                            }`}
                                        />

                                        {errors.amount && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.amount}
                                            </p>
                                        )}

                                        {isInsufficient && (
                                            <p className="text-red-500 text-sm mt-1">
                                                Amount exceeds your balance
                                            </p>
                                        )}

                                        {parsed > 0 && !isInsufficient && (
                                            <div className="mt-2 flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Remaining Balance
                                                </span>
                                                <span className="font-bold">
                                                    {remaining.toLocaleString()} MAD
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* NOTE */}
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block">
                                            NOTE (OPTIONAL)
                                        </label>

                                        <input
                                            value={data.description}
                                            onChange={(e) =>
                                                setData('description', e.target.value)
                                            }
                                            placeholder="e.g. Rent, groceries"
                                            className="w-full h-11 border rounded-xl px-4 text-sm"
                                        />
                                    </div>

                                    {/* WARNING */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700">
                                        ⚠️ Withdrawals are instant and cannot be reversed.
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        type="submit"
                                        disabled={!isValid || processing}
                                        className="w-full h-11 sm:h-12 bg-black text-white rounded-xl font-semibold disabled:opacity-40"
                                    >
                                        Review Withdrawal
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="lg:col-span-4 order-1 lg:order-2 space-y-4 sm:space-y-6">

                            {/* BALANCE */}
                            <div className="bg-[#0F0D0B] text-white p-5 sm:p-6 rounded-2xl">
                                <p className="text-xs opacity-60">AVAILABLE BALANCE</p>

                                <h2 className="text-xl sm:text-2xl font-bold mt-2">
                                    {Number(balance).toLocaleString()} MAD
                                </h2>

                                <p className="text-xs opacity-40 mt-2">
                                    IBAN: **** {account_number.slice(-4)}
                                </p>

                                {parsed > 0 && !isInsufficient && (
                                    <div className="mt-4 border-t border-white/10 pt-3 flex justify-between text-sm">
                                        <span className="opacity-60">After</span>
                                        <span className="text-red-400 font-bold">
                                            {remaining.toLocaleString()} MAD
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* SUMMARY */}
                            <div className="bg-white border rounded-2xl p-5 sm:p-6">
                                <h3 className="font-semibold mb-4">
                                    Withdrawal Summary
                                </h3>

                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span>Amount</span>
                                        <span>{parsed || 0} MAD</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Fee</span>
                                        <span>0 MAD</span>
                                    </div>

                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>{parsed || 0} MAD</span>
                                    </div>
                                </div>
                            </div>

                            {/* SECURITY */}
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                                <h4 className="font-semibold text-green-700 mb-2">
                                    Secure Withdrawal
                                </h4>

                                <p className="text-xs text-green-700">
                                    Transactions are protected and processed instantly.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* REVIEW MODAL */}
            {review && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md">

                        <h2 className="font-bold text-lg mb-4">
                            Confirm Withdrawal
                        </h2>

                        <div className="text-sm space-y-2 mb-4">
                            <p><strong>Amount:</strong> {parsed} MAD</p>
                            <p><strong>Remaining:</strong> {remaining} MAD</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmWithdraw}
                                className="flex-1 bg-black text-white py-2 rounded-lg"
                            >
                                {processing ? 'Processing...' : 'Confirm'}
                            </button>

                            <button
                                onClick={() => setReview(false)}
                                className="flex-1 border py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}