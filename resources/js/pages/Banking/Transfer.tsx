import { useForm, usePage, Head } from '@inertiajs/react';
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

    const parsed = parseFloat(data.amount) || 0;
    const fee = parsed > 0 ? 2 : 0;
    const total = parsed + fee;
    const remaining = balance - total;

    const isInsufficient = total > balance;
    const isValid =
        data.recipient_account.length > 5 &&
        parsed >= 10 &&
        parsed <= 100000 &&
        !isInsufficient;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setReview(true);
    };

    const confirmTransfer = () => {
        post('/transfer', {
            preserveScroll: false,
            onSuccess: () => {
                setReview(false);
                reset();
            },
            onError: () => {
                // keep modal open so you can see errors
                setReview(true);
            },
        });
    };

    return (
        <>
            <Head title="Transfer" />

            <div className="min-h-screen bg-[#F8F7F5]">

                {/* PAGE HEADER */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <a href="/dashboard" className="text-sm text-gray-500">
                        ← Back to Dashboard
                    </a>

                    <div className="flex items-center gap-3">
                        <span className="text-sm">{user?.name}</span>
                        <span className="text-green-600 text-sm">● Verified</span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">

                    {/* BALANCE BANNER */}
                    <div className="bg-black text-white p-6 rounded-2xl mb-8 flex justify-between items-center">
                        <div>
                            <p className="text-xs opacity-60">AVAILABLE BALANCE</p>
                            <h2 className="text-3xl font-bold">
                                {balance.toLocaleString()} MAD
                            </h2>
                            <p className="text-xs opacity-40 mt-1">
                                IBAN: **** {account_number.slice(-4)}
                            </p>
                        </div>

                        {parsed > 0 && (
                            <div className="text-right">
                                <p className="text-xs opacity-60">After transfer</p>
                                <p className="text-green-400 font-bold text-lg">
                                    {remaining.toLocaleString()} MAD
                                </p>
                            </div>
                        )}
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT */}
                        <div className="lg:col-span-8">
                            <div className="bg-white p-8 rounded-2xl border">

                                <h1 className="text-2xl font-bold mb-2">
                                    Send Money
                                </h1>

                                <p className="text-gray-500 mb-6">
                                    Transfer funds securely to another account
                                </p>

                                <form onSubmit={submit} className="space-y-6">

                                    {/* RECIPIENT */}
                                    <div>
                                        <label className="text-sm text-gray-500 mb-2 block">
                                            Recipient Account
                                        </label>
                                        <input
                                            placeholder="MA123456789..."
                                            value={data.recipient_account}
                                            onChange={(e) =>
                                                setData('recipient_account', e.target.value)
                                            }
                                            className="w-full h-12 border rounded-xl px-4"
                                        />

                                        {errors.recipient_account && (
                                            <p className="mt-2 text-sm text-red-500">{errors.recipient_account}</p>
                                        )}
                                    </div>

                                    {/* QUICK */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {QUICK_AMOUNTS.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() =>
                                                    setData('amount', String(amt))
                                                }
                                                className={`py-3 rounded-xl border font-semibold ${data.amount === String(amt)
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                {amt}
                                            </button>
                                        ))}
                                    </div>

                                    {/* AMOUNT */}
                                    <div>
                                        <label className="text-sm text-gray-500 mb-2 block">
                                            Amount (MAD)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) =>
                                                setData('amount', e.target.value)
                                            }
                                            className="w-full h-12 border rounded-xl px-4"
                                        />

                                        {errors.amount && (
                                            <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
                                        )}
                                    </div>

                                    {isInsufficient && (
                                        <p className="text-red-500 text-sm">
                                            Insufficient balance
                                        </p>
                                    )}

                                    {/* NOTE */}
                                    <input
                                        value={data.description}
                                        onChange={(e) =>
                                            setData('description', e.target.value)
                                        }
                                        placeholder="Description"
                                        className="w-full h-11 border rounded-xl px-4"
                                    />

                                    <button
                                        type="submit"
                                        disabled={!isValid || processing}
                                        className="w-full h-12 bg-orange-500 text-white rounded-xl font-semibold"
                                    >
                                        Review Transfer
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="lg:col-span-4 space-y-6">

                            <div className="bg-white border rounded-2xl p-6">
                                <h3 className="font-semibold mb-4">
                                    Transfer Summary
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Amount</span>
                                        <span>{parsed} MAD</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Fee</span>
                                        <span>{fee} MAD</span>
                                    </div>

                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>{total} MAD</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                                <p className="text-green-700 text-sm">
                                    Secure transfer protected with bank-level encryption.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {review && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md">

                        <h2 className="font-bold text-lg mb-4">
                            Confirm Transfer
                        </h2>

                        <p>To: {data.recipient_account}</p>
                        <p>Amount: {parsed} MAD</p>
                        <p>Total: {total} MAD</p>

                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={confirmTransfer}
                                disabled={processing}
                                className="flex-1 bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50"
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