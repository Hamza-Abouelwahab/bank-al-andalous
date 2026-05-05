import { Head, Link } from '@inertiajs/react';

export default function Unlocked() {
    const nextSteps = [
        {
            title: 'Review recent activity',
            text: 'Check recent payments, transfers, and sign-ins to confirm everything looks correct.',
            icon: '📋',
        },
        {
            title: 'Update your password',
            text: 'Choose a strong password and avoid reusing passwords from other services.',
            icon: '🔑',
        },
        {
            title: 'Enable extra protection',
            text: 'Turn on two-factor authentication for stronger account security.',
            icon: '🛡️',
        },
    ];

    return (
        <>
            <Head title="Account Restored" />

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
                            <Link href="/support/unlock" className="hover:text-[#E8632A] transition">
                                Verify Identity
                            </Link>
                            <span>›</span>
                            <span className="text-[#0F0D0B]">Account Restored</span>
                        </div>
                    </div>

                    <div className="rounded-[36px] border border-[#EDE8E0] bg-white shadow-[0_14px_45px_rgba(15,13,11,0.05)] overflow-hidden">
                        <div className="relative px-6 lg:px-10 py-10 lg:py-12 border-b border-[#F2ECE5] bg-[radial-gradient(circle_at_top,#FFF2E6,transparent_60%)]">
                            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#FFF4EA] -translate-y-1/2 translate-x-1/3" />
                            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[#FFF8F3] translate-y-1/3 -translate-x-1/3" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-[#EDF9F1] flex items-center justify-center text-5xl shadow-sm">
                                    ✅
                                </div>

                                <p className="mt-6 text-sm text-[#9C978F]">Recovery Complete</p>

                                <h1
                                    className="mt-2 text-4xl lg:text-5xl font-extrabold text-[#0F0D0B] tracking-tight"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Your account has been restored
                                </h1>

                                <p className="mt-4 max-w-2xl text-[#625C56] text-base leading-7">
                                    Your identity was confirmed successfully. Access to your account and
                                    protected actions has now been restored.
                                </p>

                                <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#EAF9EF] text-[#16A34A] px-4 py-2 text-sm font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                                    Account active again
                                </div>
                            </div>
                        </div>

                        <div className="px-6 lg:px-10 py-8">
                            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                                <div>
                                    <h2
                                        className="text-2xl font-bold text-[#0F0D0B] mb-5"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        Recommended next steps
                                    </h2>

                                    <div className="space-y-4">
                                        {nextSteps.map((step, index) => (
                                            <div
                                                key={step.title}
                                                className="rounded-[24px] border border-[#F1EAE3] bg-[#FFFCF9] p-5"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] flex items-center justify-center text-xl shrink-0">
                                                        {step.icon}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] uppercase tracking-[1.5px] text-[#9C978F] font-bold">
                                                                Next {index + 1}
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

                                <div className="space-y-6">
                                    <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6 shadow-[0_10px_30px_rgba(15,13,11,0.03)]">
                                        <h3
                                            className="text-xl font-bold text-[#0F0D0B] mb-3"
                                            style={{ fontFamily: "'Syne', sans-serif" }}
                                        >
                                            Need anything else?
                                        </h3>

                                        <p className="text-sm text-[#6E6861] leading-6">
                                            You can continue to support, review your account, or return to your dashboard.
                                        </p>

                                        <div className="mt-5 flex flex-col gap-3">
                                            <Link
                                                href="/dashboard"
                                                className="inline-flex items-center justify-center rounded-2xl bg-[#E8632A] hover:bg-[#CF5623] text-white font-bold px-6 py-3.5 shadow-[0_12px_25px_rgba(232,99,42,0.22)] transition"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                Go to Dashboard
                                            </Link>

                                            <Link
                                                href="/support"
                                                className="inline-flex items-center justify-center rounded-2xl border border-[#E6DDD4] bg-white text-[#5C5751] font-semibold px-6 py-3.5 hover:bg-[#FAF7F3] transition"
                                            >
                                                Back to Support
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6 shadow-[0_10px_30px_rgba(15,13,11,0.03)]">
                                        <h3
                                            className="text-xl font-bold text-[#0F0D0B] mb-4"
                                            style={{ fontFamily: "'Syne', sans-serif" }}
                                        >
                                            Security Status
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between rounded-2xl bg-[#FFFCF9] border border-[#F1EAE3] px-4 py-3">
                                                <span className="text-sm text-[#5C5751]">Identity verification</span>
                                                <span className="text-sm font-semibold text-[#16A34A]">Completed</span>
                                            </div>

                                            <div className="flex items-center justify-between rounded-2xl bg-[#FFFCF9] border border-[#F1EAE3] px-4 py-3">
                                                <span className="text-sm text-[#5C5751]">Protected actions</span>
                                                <span className="text-sm font-semibold text-[#16A34A]">Restored</span>
                                            </div>

                                            <div className="flex items-center justify-between rounded-2xl bg-[#FFFCF9] border border-[#F1EAE3] px-4 py-3">
                                                <span className="text-sm text-[#5C5751]">Account access</span>
                                                <span className="text-sm font-semibold text-[#16A34A]">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}