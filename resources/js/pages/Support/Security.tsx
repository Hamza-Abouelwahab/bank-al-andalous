import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Security() {
    const [open, setOpen] = useState(false);

    const supportItems = [
        { title: 'Live Chat', subtitle: 'Chat with our support team', badge: 'Online', icon: '💬' },
        { title: 'Call Us', subtitle: '+212 5 22 12 34 56', badge: '24/7', icon: '📞' },
        { title: 'Email Us', subtitle: 'support@bankco.ma', badge: '24/7', icon: '✉️' },
        { title: 'Visit Branch', subtitle: 'Find a branch near you', badge: '', icon: '📍' },
    ];

    const tips = [
        'Never share your login details or one-time codes.',
        'Enable two-factor authentication on your account.',
        'Review recent activity regularly and report anything unusual.',
    ];

    const actions = [
        'Freeze all transactions',
        'Disable transfers and withdrawals',
        'Require identity verification to unlock',
    ];

    const confirmReport = () => {
        router.post('/support/report');
    };

    return (
        <>
            <Head title="Security Support" />

            <div className="min-h-screen bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-[#9C978F]">
                            <Link href="/support" className="hover:text-[#E8632A] transition">
                                Support
                            </Link>
                            <span>›</span>
                            <span className="text-[#0F0D0B]">Security</span>
                        </div>
                    </div>

                    <div className="grid xl:grid-cols-[0.78fr_1.22fr] gap-6">
                        <div className="space-y-6">
                            <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6 shadow-[0_10px_40px_rgba(15,13,11,0.04)]">
                                <div className="w-16 h-16 rounded-[22px] bg-[#FFF3EA] flex items-center justify-center text-3xl mb-5">
                                    🛡️
                                </div>

                                <h1
                                    className="text-3xl font-extrabold text-[#0F0D0B] tracking-tight"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Suspicious activity?
                                </h1>

                                <p className="mt-3 text-[#6E6861] leading-7">
                                    If you notice unusual logins, transfers, or payments on your account,
                                    report it immediately so we can help protect your funds.
                                </p>

                                <button
                                    onClick={() => setOpen(true)}
                                    className="mt-6 w-full rounded-2xl bg-[#E8632A] hover:bg-[#CF5623] text-white py-3.5 font-bold shadow-[0_12px_25px_rgba(232,99,42,0.22)] transition"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Report Now
                                </button>
                            </div>

                            <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6 shadow-[0_10px_40px_rgba(15,13,11,0.04)]">
                                <h2
                                    className="text-xl font-bold text-[#0F0D0B] mb-4"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Security Tips
                                </h2>

                                <ul className="space-y-3">
                                    {tips.map((tip) => (
                                        <li key={tip} className="flex items-start gap-3 text-sm text-[#6E6861] leading-6">
                                            <span className="text-[#E8632A] mt-0.5">•</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6 shadow-[0_10px_40px_rgba(15,13,11,0.04)]">
                                <div className="flex items-center justify-between mb-5">
                                    <h2
                                        className="text-2xl font-bold text-[#0F0D0B]"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        Contact Support
                                    </h2>

                                    <span className="text-xs font-semibold text-[#E8632A] bg-[#FFF3EA] px-3 py-1 rounded-full">
                                        Priority Help
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {supportItems.map((item) => (
                                        <button
                                            key={item.title}
                                            className="w-full flex items-center justify-between rounded-2xl border border-[#F1EAE3] px-4 py-4 hover:border-[#E8632A] hover:bg-[#FFF8F3] transition"
                                        >
                                            <div className="flex items-center gap-4 text-left">
                                                <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] flex items-center justify-center text-xl">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-[#0F0D0B]">{item.title}</p>
                                                    <p className="text-sm text-[#7C756E]">{item.subtitle}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {item.badge ? (
                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                                            item.badge === 'Online'
                                                                ? 'bg-[#EAF9EF] text-[#16A34A]'
                                                                : 'bg-[#EEF4FF] text-[#3B82F6]'
                                                        }`}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                ) : null}
                                                <span className="text-[#9C978F] text-lg">›</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6 shadow-[0_10px_40px_rgba(15,13,11,0.04)] relative overflow-hidden">
                                <div className="absolute right-[-20px] bottom-[-30px] text-[180px] opacity-[0.05] select-none">
                                    🔒
                                </div>

                                <h2
                                    className="text-2xl font-bold text-[#0F0D0B] mb-3"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    What happens after you report?
                                </h2>

                                <p className="text-[#6E6861] leading-7 max-w-2xl">
                                    To keep your account safe, we can temporarily secure it while we verify
                                    your identity and review recent activity.
                                </p>

                                <div className="mt-6 grid md:grid-cols-3 gap-4 relative z-10">
                                    <div className="rounded-2xl border border-[#F1EAE3] bg-[#FFFCF9] p-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#FFF3EA] flex items-center justify-center mb-3 text-lg">
                                            ⛔
                                        </div>
                                        <p className="font-bold text-[#0F0D0B]">Freeze activity</p>
                                        <p className="text-sm text-[#6E6861] mt-1 leading-6">
                                            Transactions and risky actions are paused.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-[#F1EAE3] bg-[#FFFCF9] p-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#FFF3EA] flex items-center justify-center mb-3 text-lg">
                                            🪪
                                        </div>
                                        <p className="font-bold text-[#0F0D0B]">Verify identity</p>
                                        <p className="text-sm text-[#6E6861] mt-1 leading-6">
                                            We ask you to confirm that you are the account owner.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-[#F1EAE3] bg-[#FFFCF9] p-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#FFF3EA] flex items-center justify-center mb-3 text-lg">
                                            ✅
                                        </div>
                                        <p className="font-bold text-[#0F0D0B]">Restore access</p>
                                        <p className="text-sm text-[#6E6861] mt-1 leading-6">
                                            Once verified, your account access is restored safely.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <div
                            className="absolute inset-0 bg-[#0F0D0B]/55 backdrop-blur-[2px]"
                            onClick={() => setOpen(false)}
                        />

                        <div className="relative w-full max-w-md rounded-[30px] bg-white border border-[#EDE8E0] shadow-[0_30px_80px_rgba(15,13,11,0.22)] p-7">
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-5 right-5 text-xl text-[#9C978F] hover:text-[#0F0D0B] transition"
                            >
                                ×
                            </button>

                            <div className="w-20 h-20 rounded-full bg-[#FFF4EA] flex items-center justify-center text-4xl mx-auto">
                                ⚠️
                            </div>

                            <h3
                                className="mt-5 text-2xl font-extrabold text-[#0F0D0B] text-center"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                Report suspicious activity?
                            </h3>

                            <p className="mt-3 text-center text-[#6E6861] leading-7">
                                Are you sure you want to secure your account now? This action will help prevent
                                further access until your identity is verified.
                            </p>

                            <div className="mt-6 rounded-2xl border border-[#F2E7DA] bg-[#FFF9F4] p-4">
                                <p className="text-sm font-bold text-[#0F0D0B] mb-3">This will:</p>
                                <div className="space-y-3">
                                    {actions.map((item) => (
                                        <div key={item} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#FFF1E6] flex items-center justify-center text-xs mt-0.5">
                                                🔒
                                            </div>
                                            <p className="text-sm text-[#6E6861] leading-6">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-7 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="h-12 rounded-2xl border border-[#E6DED5] text-[#5C5751] font-semibold hover:bg-[#FAF7F3] transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmReport}
                                    className="h-12 rounded-2xl bg-[#E8632A] hover:bg-[#CF5623] text-white font-bold shadow-[0_12px_25px_rgba(232,99,42,0.22)] transition"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Yes, lock my account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}