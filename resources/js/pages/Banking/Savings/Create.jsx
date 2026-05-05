import { Head, router, useForm } from '@inertiajs/react';

export default function SavingChallengeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        target_amount: '',
        end_date: '',
    });

    console.log(data);
    function submit(e) {
        e.preventDefault();

        post('/saving-challenges');
    }

    return (
        <>
            <Head title="Create Saving Challenge" />

            <main className="min-h-screen bg-[#F8F6F1] p-8">
                <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <button
                        onClick={() => router.visit('/dashboard')}
                        className="mb-6 text-sm text-orange-600"
                    >
                        ← Back to Dashboard
                    </button>

                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Create Saving Challenge
                    </h1>
                    <p className="mb-8 text-sm text-gray-500">
                        Set a target amount and deadline to challenge yourself.
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Challenge Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Save 1000 MAD"
                                className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-orange-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Target Amount
                            </label>
                            <input
                                type="number"
                                min="100"
                                step="0.01"
                                value={data.target_amount}
                                onChange={(e) =>
                                    setData('target_amount', e.target.value)
                                }
                                placeholder="1000"
                                className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-orange-500"
                            />
                            {errors.target_amount && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.target_amount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                required
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-orange-500"
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
                        >
                            {processing ? 'Creating...' : 'Create Challenge'}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}
