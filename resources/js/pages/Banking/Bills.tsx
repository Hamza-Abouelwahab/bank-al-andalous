import { useForm, usePage, Head } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

const BILLS = [
    { value: 'electricity', label: 'Electricity', icon: '⚡', provider: 'ONEE' },
    { value: 'water', label: 'Water', icon: '💧', provider: 'ONEE' },
    { value: 'internet', label: 'Internet', icon: '🌐', provider: 'IAM / Orange' },
    { value: 'phone', label: 'Phone', icon: '📱', provider: 'Any operator' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️', provider: 'Insurance company' },
    { value: 'tax', label: 'Tax', icon: '🏛️', provider: 'DGI Morocco' },
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

    const parsed = parseFloat(data.amount) || 0;
    const remaining = balance - parsed;
    const isInsufficient = parsed > balance;

    const selectedBill = BILLS.find(b => b.value === data.bill_type);

    const isValid =
        parsed >= 10 &&
        !isInsufficient &&
        data.bill_type !== '' &&
        data.reference !== '';

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setReview(true);
    };

    const confirmPayment = () => {
        post('/bills');
    };

    return (
        <>
            <Head title="Pay Bills" />

            <div className="min-h-screen bg-[#F8F7F5]">

                {/* HEADER */}
                <div className="bg-white border-b px-6 py-4 flex justify-between">
                    <a href="/dashboard" className="text-sm text-gray-500">
                        ← Back to Dashboard
                    </a>

                    <div className="flex gap-3">
                        <span>{user?.name}</span>
                        <span className="text-green-600">● Verified</span>
                    </div>
                </div>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto">

                    {/* BALANCE */}
                    <div className="bg-black text-white p-6 rounded-2xl mb-8 flex justify-between">
                        <div>
                            <p className="text-xs opacity-60">AVAILABLE BALANCE</p>
                            <h2 className="text-3xl font-bold">
                                {balance.toLocaleString()} MAD
                            </h2>
                            <p className="text-xs opacity-40">
                                IBAN: **** {account_number.slice(-4)}
                            </p>
                        </div>

                        {parsed > 0 && (
                            <div className="text-right">
                                <p className="text-xs opacity-60">After payment</p>
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
                                    Pay Bills
                                </h1>

                                <p className="text-gray-500 mb-6">
                                    Select your bill and enter details
                                </p>

                                <form onSubmit={submit} className="space-y-6">

                                    {/* BILL TYPE */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {BILLS.map(bill => (
                                            <button
                                                key={bill.value}
                                                type="button"
                                                onClick={() => setData('bill_type', bill.value)}
                                                className={`p-4 rounded-xl border text-sm ${
                                                    data.bill_type === bill.value
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <div className="text-xl">{bill.icon}</div>
                                                {bill.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* PROVIDER */}
                                    {selectedBill && (
                                        <div className="bg-purple-50 border p-3 rounded-xl text-sm">
                                            Provider: {selectedBill.provider}
                                        </div>
                                    )}

                                    {/* REFERENCE */}
                                    <input
                                        placeholder="Reference number"
                                        value={data.reference}
                                        onChange={(e) => setData('reference', e.target.value)}
                                        className="w-full h-12 border rounded-xl px-4"
                                    />

                                    {/* QUICK */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {QUICK_AMOUNTS.map(amt => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setData('amount', String(amt))}
                                                className={`py-2 rounded-xl border ${
                                                    data.amount === String(amt)
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                {amt}
                                            </button>
                                        ))}
                                    </div>

                                    {/* AMOUNT */}
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="Amount"
                                        className="w-full h-12 border rounded-xl px-4"
                                    />

                                    {isInsufficient && (
                                        <p className="text-red-500 text-sm">
                                            Insufficient balance
                                        </p>
                                    )}

                                    {/* WARNING */}
                                    <div className="bg-purple-50 border rounded-xl p-3 text-sm">
                                        ⚠️ Payments are instant and cannot be reversed
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isValid || processing}
                                        className="w-full h-12 bg-purple-600 text-white rounded-xl"
                                    >
                                        Review Payment
                                    </button>

                                </form>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="lg:col-span-4 space-y-6">

                            <div className="bg-white border rounded-2xl p-6">
                                <h3 className="font-semibold mb-4">
                                    Payment Summary
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Amount</span>
                                        <span>{parsed} MAD</span>
                                    </div>

                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>{parsed} MAD</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border p-5 rounded-2xl">
                                <p className="text-green-700 text-sm">
                                    Secure payment protected with encryption
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
                            Confirm Payment
                        </h2>

                        <p>Bill: {data.bill_type}</p>
                        <p>Amount: {parsed} MAD</p>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={confirmPayment}
                                className="flex-1 bg-purple-600 text-white py-2 rounded-lg"
                            >
                                Confirm
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