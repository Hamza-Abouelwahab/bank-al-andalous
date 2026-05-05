import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function TwoFactorChallenge() {
    const [useRecovery, setUseRecovery] = useState(false);

    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newCode = data.code.split('');
        newCode[index] = value;
        const updated = newCode.join('').slice(0, 6);

        setData('code', updated);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/two-factor-challenge');
    };

    return (
        <>
            <Head title="Two Factor Authentication" />

            <div className="flex min-h-screen items-center justify-center bg-[#F6F1EB]">
                <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                            🔒
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-center text-xl font-bold text-slate-800">
                        Two-Factor Authentication
                    </h2>

                    <p className="mt-2 text-center text-sm text-slate-500">
                        {useRecovery
                            ? 'Enter one of your recovery codes'
                            : 'Enter the 6-digit code from your authenticator app'}
                    </p>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="mt-6">

                        {/* 🔐 OTP MODE */}
                        {!useRecovery && (
                            <>
                                <div className="flex justify-between gap-2">
                                    {[...Array(6)].map((_, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputs.current[index] = el)}
                                            type="text"
                                            maxLength={1}
                                            className={`h-12 w-12 rounded-xl border text-center text-lg font-semibold 
                                            ${errors.code ? 'border-red-500' : 'border-slate-200'}
                                            focus:border-orange-500 focus:ring-orange-500`}
                                            onChange={(e) => handleChange(e.target.value, index)}
                                        />
                                    ))}
                                </div>

                                {errors.code && (
                                    <p className="mt-3 text-center text-sm font-medium text-red-500">
                                        Invalid code. Please try again.
                                    </p>
                                )}
                            </>
                        )}

                        {/* 🔑 RECOVERY MODE */}
                        {useRecovery && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter recovery code"
                                    className={`mt-4 w-full rounded-xl border p-3 
                                    ${errors.recovery_code ? 'border-red-500' : 'border-slate-200'}`}
                                    onChange={(e) =>
                                        setData('recovery_code', e.target.value)
                                    }
                                />

                                {errors.recovery_code && (
                                    <p className="mt-2 text-center text-sm text-red-500">
                                        Invalid recovery code.
                                    </p>
                                )}
                            </>
                        )}

                        {/* 🔁 TOGGLE BUTTON */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setUseRecovery(!useRecovery)}
                                className="text-sm text-orange-500 hover:underline"
                            >
                                {useRecovery
                                    ? 'Use authentication code instead'
                                    : 'Use a recovery code instead'}
                            </button>
                        </div>

                        {/* remember device */}
                        <div className="mt-4 flex items-center gap-2">
                            <input type="checkbox" id="remember_device" />
                            <Label htmlFor="remember_device" className="text-sm text-slate-600">
                                Remember this device
                            </Label>
                        </div>

                        {/* BUTTON */}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-6 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-400"
                        >
                            Verify & Continue
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}