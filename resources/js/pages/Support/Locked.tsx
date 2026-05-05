import { Head, Link, router } from '@inertiajs/react';

export default function Locked() {
    const steps = [
        {
            title: 'Account temporarily secured',
            text: 'We paused access to sensitive actions to help prevent unauthorized use.',
            icon: '🔒',
        },
        {
            title: 'Verification required',
            text: 'You will need to confirm your identity before full access is restored.',
            icon: '🪪',
        },
        {
            title: 'Support is available',
            text: 'Our team can guide you through the recovery process if needed.',
            icon: '💬',
        },
    ];

    return (
        <>
            <Head title="Account Locked" />

            <div className="min-h-screen bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
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
                            <span className="text-[#0F0D0B]">Account Locked</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
                        <div className="rounded-[32px] border border-[#EDE8E0] bg-white p-7 lg:p-8 shadow-[0_12px_40px_rgba(15,13,11,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-[#FFF2E8] -translate-y-1/2 translate-x-1/3" />
                            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[#FFF7F1] translate-y-1/3 -translate-x-1/3" />

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-[28px] bg-[#FFF3EA] flex items-center justify-center text-4xl shadow-sm">
                                    🔒
                                </div>

                                <p className="mt-6 text-sm text-[#9C978F]">Security Protection Enabled</p>

                                <h1
                                    className="mt-2 text-4xl lg:text-[44px] leading-tight font-extrabold text-[#0F0D0B] tracking-tight"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Your account is temporarily locked
                                </h1>

                                <p className="mt-4 text-[#625C56] text-base leading-7 max-w-2xl">
                                    We secured your account after a suspicious activity report.
                                    Sensitive actions like transfers, payments, and card controls are
                                    temporarily paused until your identity is verified.
                                </p>

                                <div className="mt-7 rounded-[24px] border border-[#F1E7DC] bg-[#FFF9F4] p-5">
                                    <p className="text-sm font-bold text-[#0F0D0B] mb-3">What this means right now</p>

                                    <div className="space-y-3">
                                        {[
                                            'Transfers and withdrawals are paused',
                                            'Card controls may be restricted temporarily',
                                            'You can continue recovery by verifying your identity',
                                        ].map((item) => (
                                            <div key={item} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#FFEFE3] flex items-center justify-center text-xs mt-0.5">
                                                    !
                                                </div>
                                                <p className="text-sm text-[#6E6861] leading-6">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => router.visit('/support/unlock')}
                                        className="inline-flex items-center justify-center rounded-2xl bg-[#E8632A] hover:bg-[#CF5623] text-white font-bold px-6 py-3.5 shadow-[0_12px_25px_rgba(232,99,42,0.22)] transition"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        Start Verification
                                    </button>

                                    <Link
                                        href="/support"
                                        className="inline-flex items-center justify-center rounded-2xl border border-[#E6DDD4] bg-white text-[#5C5751] font-semibold px-6 py-3.5 hover:bg-[#FAF7F3] transition"
                                    >
                                        Back to Support
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-[32px] border border-[#EDE8E0] bg-white p-6 shadow-[0_12px_40px_rgba(15,13,11,0.05)]">
                                <h2
                                    className="text-2xl font-bold text-[#0F0D0B] mb-5"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Recovery Steps
                                </h2>

                                <div className="space-y-4">
                                    {steps.map((step, index) => (
                                        <div
                                            key={step.title}
                                            className="rounded-2xl border border-[#F1EAE3] bg-[#FFFCF9] p-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] flex items-center justify-center text-xl shrink-0">
                                                    {step.icon}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] uppercase tracking-[1.5px] text-[#9C978F] font-bold">
                                                            Step {index + 1}
                                                        </span>
                                                    </div>
                                                    <p className="text-base font-bold text-[#0F0D0B]">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-sm text-[#6E6861] leading-6 mt-1">
                                                        {step.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[32px] border border-[#EDE8E0] bg-white p-6 shadow-[0_12px_40px_rgba(15,13,11,0.05)]">
                                <h3
                                    className="text-xl font-bold text-[#0F0D0B] mb-3"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Need immediate help?
                                </h3>

                                <p className="text-sm text-[#6E6861] leading-6">
                                    If you did not submit this report or need urgent assistance, contact our
                                    support team right away.
                                </p>

                                <div className="mt-5 grid gap-3">
                                    <button className="w-full flex items-center justify-between rounded-2xl border border-[#F1EAE3] px-4 py-4 hover:border-[#E8632A] hover:bg-[#FFF8F3] transition">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-11 h-11 rounded-2xl bg-[#FFF3EA] flex items-center justify-center text-lg">
                                                💬
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0F0D0B]">Live Chat</p>
                                                <p className="text-xs text-[#7C756E]">Talk to support now</p>
                                            </div>
                                        </div>
                                        <span className="text-[#9C978F] text-lg">›</span>
                                    </button>

                                    <button className="w-full flex items-center justify-between rounded-2xl border border-[#F1EAE3] px-4 py-4 hover:border-[#E8632A] hover:bg-[#FFF8F3] transition">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-11 h-11 rounded-2xl bg-[#FFF3EA] flex items-center justify-center text-lg">
                                                📞
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0F0D0B]">Call Support</p>
                                                <p className="text-xs text-[#7C756E]">+212 5 22 12 34 56</p>
                                            </div>
                                        </div>
                                        <span className="text-[#9C978F] text-lg">›</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}