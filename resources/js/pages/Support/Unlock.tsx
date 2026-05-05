import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Unlock() {
    const [method, setMethod] = useState<'sms' | 'email' | 'questions'>('sms');

    const { data, setData, post, processing, errors } = useForm({
        method: 'sms',
        code: '',
        email_code: '',
        answer_1: '',
        answer_2: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/support/verify');
    };

    const options = [
        {
            key: 'sms',
            title: 'Verify by SMS',
            subtitle: 'Send a one-time code to your phone number',
            icon: '📱',
        },
        {
            key: 'email',
            title: 'Verify by Email',
            subtitle: 'Receive a secure code in your email inbox',
            icon: '✉️',
        },
        {
            key: 'questions',
            title: 'Security Questions',
            subtitle: 'Answer your account recovery questions',
            icon: '🪪',
        },
    ] as const;

    return (
        <>
            <Head title="Verify Identity" />

            <div className="min-h-screen bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-[#9C978F]">
                            <Link href="/support" className="hover:text-[#E8632A] transition">
                                Support
                            </Link>
                            <span>›</span>
                            <Link href="/support/security" className="hover:text-[#E8632A] transition">
                                Security
                            </Link>
                            <span>›</span>
                            <Link href="/support/locked" className="hover:text-[#E8632A] transition">
                                Account Locked
                            </Link>
                            <span>›</span>
                            <span className="text-[#0F0D0B]">Verify Identity</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[0.88fr_1.12fr] gap-6">
                        <div className="space-y-6">
                            <div className="rounded-[32px] border border-[#EDE8E0] bg-white p-7 shadow-[0_12px_40px_rgba(15,13,11,0.05)]">
                                <div className="w-16 h-16 rounded-[22px] bg-[#FFF3EA] flex items-center justify-center text-3xl mb-5">
                                    🪪
                                </div>

                                <p className="text-sm text-[#9C978F]">Recovery Verification</p>

                                <h1
                                    className="mt-2 text-3xl lg:text-4xl font-extrabold text-[#0F0D0B] tracking-tight"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Confirm it’s really you
                                </h1>

                                <p className="mt-4 text-[#625C56] leading-7">
                                    Choose a secure verification method below. Once confirmed, we’ll restore
                                    access to your account safely.
                                </p>

                                <div className="mt-6 rounded-[24px] border border-[#F1E7DC] bg-[#FFF9F4] p-5">
                                    <p className="text-sm font-bold text-[#0F0D0B] mb-3">Before you continue</p>

                                    <div className="space-y-3">
                                        {[
                                            'Use a method you have access to right now',
                                            'Enter the code exactly as received',
                                            'Do not share verification codes with anyone',
                                        ].map((item) => (
                                            <div key={item} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#FFEFE3] flex items-center justify-center text-xs mt-0.5">
                                                    ✓
                                                </div>
                                                <p className="text-sm text-[#6E6861] leading-6">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.visit('/support/locked')}
                                    className="mt-6 text-sm text-[#E8632A] font-medium hover:underline"
                                >
                                    ← Back to account locked
                                </button>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-[#EDE8E0] bg-white p-7 shadow-[0_12px_40px_rgba(15,13,11,0.05)]">
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2
                                        className="text-2xl font-bold text-[#0F0D0B]"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        Verification Method
                                    </h2>
                                    <p className="text-sm text-[#7C756E] mt-1">
                                        Pick one option to continue account recovery.
                                    </p>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#FFF4EA] px-3 py-2 text-xs font-semibold text-[#E8632A]">
                                    <span>Secure Session</span>
                                </div>
                            </div>

                            <div className="grid gap-3 mb-6">
                                {options.map((option) => {
                                    const selected = method === option.key;

                                    return (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => {
                                                setMethod(option.key);
                                                setData('method', option.key);
                                            }}
                                            className={`w-full rounded-2xl border p-4 text-left transition ${
                                                selected
                                                    ? 'border-[#E8632A] bg-[#FFF8F3] shadow-[0_10px_25px_rgba(232,99,42,0.08)]'
                                                    : 'border-[#F1EAE3] bg-[#FFFCF9] hover:border-[#E8632A]'
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] flex items-center justify-center text-xl shrink-0">
                                                    {option.icon}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-base font-bold text-[#0F0D0B]">
                                                            {option.title}
                                                        </p>
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                                selected
                                                                    ? 'border-[#E8632A] bg-[#E8632A]'
                                                                    : 'border-[#D8CFC5]'
                                                            }`}
                                                        >
                                                            {selected ? (
                                                                <div className="w-2 h-2 rounded-full bg-white" />
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-[#6E6861] mt-1 leading-6">
                                                        {option.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                {method === 'sms' && (
                                    <div className="rounded-[24px] border border-[#F1EAE3] bg-[#FFFCF9] p-5">
                                        <label className="block text-sm font-bold text-[#0F0D0B] mb-2">
                                            SMS Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="Enter 6-digit code"
                                            className="w-full h-14 rounded-2xl border border-[#E6DDD4] bg-white px-4 text-[#0F0D0B] placeholder:text-[#A39B92] outline-none focus:border-[#E8632A] focus:ring-4 focus:ring-[#E8632A]/10 transition"
                                        />
                                        {errors.code && (
                                            <p className="mt-2 text-sm text-red-500">{errors.code}</p>
                                        )}
                                        <p className="mt-3 text-xs text-[#8A847C]">
                                            We sent a code to your registered phone number ending in ••24.
                                        </p>
                                    </div>
                                )}

                                {method === 'email' && (
                                    <div className="rounded-[24px] border border-[#F1EAE3] bg-[#FFFCF9] p-5">
                                        <label className="block text-sm font-bold text-[#0F0D0B] mb-2">
                                            Email Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.email_code}
                                            onChange={(e) => setData('email_code', e.target.value)}
                                            placeholder="Enter code from your email"
                                            className="w-full h-14 rounded-2xl border border-[#E6DDD4] bg-white px-4 text-[#0F0D0B] placeholder:text-[#A39B92] outline-none focus:border-[#E8632A] focus:ring-4 focus:ring-[#E8632A]/10 transition"
                                        />
                                        {errors.email_code && (
                                            <p className="mt-2 text-sm text-red-500">{errors.email_code}</p>
                                        )}
                                        <p className="mt-3 text-xs text-[#8A847C]">
                                            We sent a secure code to your registered email address.
                                        </p>
                                    </div>
                                )}

                                {method === 'questions' && (
                                    <div className="rounded-[24px] border border-[#F1EAE3] bg-[#FFFCF9] p-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[#0F0D0B] mb-2">
                                                What is your mother’s maiden name?
                                            </label>
                                            <input
                                                type="text"
                                                value={data.answer_1}
                                                onChange={(e) => setData('answer_1', e.target.value)}
                                                placeholder="Enter your answer"
                                                className="w-full h-14 rounded-2xl border border-[#E6DDD4] bg-white px-4 text-[#0F0D0B] placeholder:text-[#A39B92] outline-none focus:border-[#E8632A] focus:ring-4 focus:ring-[#E8632A]/10 transition"
                                            />
                                            {errors.answer_1 && (
                                                <p className="mt-2 text-sm text-red-500">{errors.answer_1}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-[#0F0D0B] mb-2">
                                                What was the name of your first school?
                                            </label>
                                            <input
                                                type="text"
                                                value={data.answer_2}
                                                onChange={(e) => setData('answer_2', e.target.value)}
                                                placeholder="Enter your answer"
                                                className="w-full h-14 rounded-2xl border border-[#E6DDD4] bg-white px-4 text-[#0F0D0B] placeholder:text-[#A39B92] outline-none focus:border-[#E8632A] focus:ring-4 focus:ring-[#E8632A]/10 transition"
                                            />
                                            {errors.answer_2 && (
                                                <p className="mt-2 text-sm text-red-500">{errors.answer_2}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-2xl bg-[#E8632A] hover:bg-[#CF5623] disabled:opacity-70 text-white font-bold px-6 py-3.5 shadow-[0_12px_25px_rgba(232,99,42,0.22)] transition"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        {processing ? 'Verifying...' : 'Verify & Continue'}
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-2xl border border-[#E6DDD4] bg-white text-[#5C5751] font-semibold px-6 py-3.5 hover:bg-[#FAF7F3] transition"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}