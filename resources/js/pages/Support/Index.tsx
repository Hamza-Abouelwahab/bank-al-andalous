import { Head, Link, usePage } from '@inertiajs/react';

interface AuthUser {
    name: string;
    email: string;
}

export default function SupportIndex() {
    const { auth } = usePage().props as { auth?: { user?: AuthUser } };
    const firstName = auth?.user?.name?.split(' ')[0] ?? 'User';

    const topics = [
        {
            title: 'Account Security',
            description: 'Learn how to keep your account safe and report suspicious activity.',
            icon: '🔒',
            href: '/support/security',
            tone: 'bg-[#FFF3EA] text-[#E8632A]',
        },
        {
            title: 'Cards & Payments',
            description: 'Get help with cards, payments, and card-related questions.',
            icon: '💳',
            href: '/support',
            tone: 'bg-[#EEF5FF] text-[#3B82F6]',
        },
        {
            title: 'Transfers & Limits',
            description: 'Understand transfer times, limits, and payment issues.',
            icon: '↔️',
            href: '/support',
            tone: 'bg-[#F6F0FF] text-[#8B5CF6]',
        },
        {
            title: 'Profile & Settings',
            description: 'Manage personal info, preferences, and account settings.',
            icon: '👤',
            href: '/support',
            tone: 'bg-[#EDF9F1] text-[#16A34A]',
        },
    ];

    const contactItems = [
        { title: 'Live Chat', subtitle: 'Chat with our support team', badge: 'Online', icon: '💬' },
        { title: 'Call Us', subtitle: '+212 5 22 12 34 56', badge: '24/7', icon: '📞' },
        { title: 'Email Us', subtitle: 'support@bankco.ma', badge: '24/7', icon: '✉️' },
        { title: 'Visit Branch', subtitle: 'Find a branch near you', badge: '', icon: '📍' },
    ];

    const securityFeatures = [
        {
            title: 'Bank-level Security',
            text: 'Advanced encryption helps protect your information, activity, and transactions.',
            icon: '🛡️',
        },
        {
            title: 'Real-time Alerts',
            text: 'Stay informed instantly about unusual activity or important account changes.',
            icon: '🔔',
        },
        {
            title: 'Fast Recovery Process',
            text: 'If something looks wrong, you can quickly report and secure your account.',
            icon: '⚡',
        },
    ];

    return (
        <>
            <Head title="Support Center" />

            <div className="min-h-screen bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="rounded-[32px] border border-[#EFE7DE] bg-white/80 backdrop-blur-sm overflow-hidden shadow-[0_10px_40px_rgba(15,13,11,0.04)]">
                        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 px-6 lg:px-10 py-10 border-b border-[#F2ECE5]">
                            <div className="max-w-2xl">
                                <p className="text-[#9C978F] text-sm mb-3">Support Center</p>
                                <h1
                                    className="text-4xl lg:text-5xl font-extrabold text-[#0F0D0B] tracking-tight leading-tight"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    How can we help you, {firstName}?
                                </h1>
                                <p className="mt-4 text-lg text-[#5C5751] max-w-xl leading-relaxed">
                                    Find help for cards, payments, security, account access, and urgent support.
                                </p>

                                <div className="mt-8 relative">
                                    <input
                                        type="text"
                                        placeholder="Search help topics, articles, questions..."
                                        className="w-full h-16 rounded-2xl border border-[#EDE8E0] bg-[#FFFCF9] pl-6 pr-16 text-base text-[#0F0D0B] placeholder:text-[#A8A29B] outline-none focus:border-[#E8632A] focus:ring-4 focus:ring-[#E8632A]/10 transition"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-[#7B746C]">
                                        ⌕
                                    </div>
                                </div>
                            </div>

                            <div className="relative min-h-[280px] rounded-[28px] bg-[radial-gradient(circle_at_top,#FFF1E7,transparent_60%)] flex items-center justify-center overflow-hidden">
                                <div className="absolute top-8 right-10 w-20 h-20 rounded-full bg-[#FFE9D8] flex items-center justify-center text-3xl">
                                    💬
                                </div>
                                <div className="absolute left-10 bottom-10 w-20 h-20 rounded-[24px] bg-[#FFF6EF] border border-[#F3E6D9] flex items-center justify-center text-3xl">
                                    🛡️
                                </div>
                                <div className="relative w-48 h-56 rounded-[28px] bg-gradient-to-b from-[#FF944D] to-[#E8632A] shadow-[0_30px_60px_rgba(232,99,42,0.28)] flex items-center justify-center">
                                    <div className="absolute -top-16 w-20 h-20 border-[10px] border-[#D8C7B4] border-b-0 rounded-t-[40px]" />
                                    <div className="w-12 h-12 rounded-full bg-[#231C18] flex items-center justify-center text-2xl text-white">
                                        •
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 lg:px-10 py-8">
                            <div className="flex items-center justify-between mb-5">
                                <h2
                                    className="text-xl font-bold text-[#0F0D0B]"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Popular Topics
                                </h2>
                                <Link href="/support" className="text-sm font-medium text-[#E8632A] hover:underline">
                                    View all →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {topics.map((topic) => (
                                    <Link
                                        key={topic.title}
                                        href={topic.href}
                                        className="group rounded-2xl border border-[#EDE8E0] bg-white p-5 hover:border-[#E8632A] hover:shadow-[0_12px_30px_rgba(232,99,42,0.08)] transition-all"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${topic.tone}`}>
                                            {topic.icon}
                                        </div>
                                        <h3 className="mt-4 text-lg font-bold text-[#0F0D0B] group-hover:text-[#E8632A] transition">
                                            {topic.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-[#6E6861]">
                                            {topic.description}
                                        </p>
                                        <div className="mt-5 text-[#E8632A] text-lg">→</div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 lg:px-10 pb-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
                            <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6">
                                <h3
                                    className="text-2xl font-bold text-[#0F0D0B] mb-5"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Contact Support
                                </h3>

                                <div className="space-y-3">
                                    {contactItems.map((item) => (
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

                            <div className="rounded-[28px] border border-[#EDE8E0] bg-white p-6 relative overflow-hidden">
                                <div className="absolute right-[-30px] bottom-[-40px] text-[180px] opacity-[0.06] select-none">
                                    🛡️
                                </div>

                                <h3
                                    className="text-2xl font-bold text-[#0F0D0B] mb-2"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Security is our priority
                                </h3>
                                <p className="text-[#6E6861] max-w-xl leading-7">
                                    We use multiple layers of protection to help keep your banking experience
                                    safe, trusted, and secure.
                                </p>

                                <div className="mt-8 space-y-5 relative z-10">
                                    {securityFeatures.map((item) => (
                                        <div key={item.title} className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] flex items-center justify-center text-xl">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0F0D0B]">{item.title}</p>
                                                <p className="text-sm text-[#6E6861] leading-6 mt-1">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/support/security"
                                    className="inline-flex items-center gap-2 mt-8 text-[#E8632A] font-semibold hover:gap-3 transition-all"
                                >
                                    Learn more about security <span>→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="px-6 lg:px-10 pb-10">
                            <div className="rounded-[24px] border border-[#F2E6D8] bg-[#FFF8F2] px-5 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] flex items-center justify-center text-xl">
                                        ⚠️
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-[#0F0D0B]">Suspicious activity?</p>
                                        <p className="text-sm text-[#6E6861]">
                                            Report it immediately to help protect your account and funds.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/support/security"
                                    className="inline-flex items-center justify-center rounded-2xl bg-[#E8632A] hover:bg-[#CF5623] text-white font-bold px-6 py-3 shadow-[0_10px_25px_rgba(232,99,42,0.25)] transition"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    Report Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}