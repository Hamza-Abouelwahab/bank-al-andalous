import { Head, Link, usePage } from '@inertiajs/react';
import {
    Landmark,
    ShieldCheck,
    Headphones,
    Lock,
    FileText,
    Bot,
    Calculator,
    Target,
    PauseCircle,
    ArrowRight,
    Rocket,
    Eye,
    Sparkles,
    CreditCard,
    Send,
    Download,
    Smartphone,
    MoreHorizontal,
    UserCog,
    Server,
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from 'lucide-react';
// import { dashboard, login, register } from '@/routes';
import logo from '../assets/sucerity-logo.png'
import { useState } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as any;

    const [open, setOpen] = useState(false);

    const features = [
        {
            icon: FileText,
            title: 'Transaction History',
            text: 'View and filter your full transaction history by any date.',
        },
        {
            icon: Bot,
            title: 'AI Financial Advisor',
            text: 'Get personalized financial advice from our AI assistant anytime.',
        },
        {
            icon: Headphones,
            title: 'Customer Support',
            text: 'Chat with our support team directly inside the app.',
        },
        {
            icon: Calculator,
            title: 'Savings Simulator',
            text: 'Simulate what happens when you save a set amount daily.',
        },
        {
            icon: Target,
            title: 'Savings Goals',
            text: 'Create goals, accept terms, and track your daily progress.',
        },
        {
            icon: PauseCircle,
            title: 'Emergency Stop',
            text: 'Pause or stop all active goals instantly with one click.',
        },
    ];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>

            <main className="min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900">
                {/* Ambient blobs */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />
                    <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-[100px]" />
                </div>

                {/* Navbar */}
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-5">

                        {/* LOGO */}
                        <div className="flex items-center gap-3">
                            {/* Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 64 84"
                                width="52"
                                height="64"
                                fill="none"
                            >
                                {/* OUTER ARCH */}
                                <path
                                    d="
            M11 78
            V30
            C11 26.5 12.3 23.7 14.8 21.5
            L19.4 17.4
            L22.8 13.2
            L26.1 9.1
            L29.1 5.8
            L32 3.5
            L34.9 5.8
            L37.9 9.1
            L41.2 13.2
            L44.6 17.4
            L49.2 21.5
            C51.7 23.7 53 26.5 53 30
            V78
        "
                                    stroke="#F28C28"
                                    strokeWidth="2.3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* DECORATIVE TOP INNER LINE */}
                                <path
                                    d="
            M17 29
            C17 26.4 18 24.2 19.9 22.5
            L24 18.8
            L26.8 15.2
            L29.2 12.1
            L32 9.8
            L34.8 12.1
            L37.2 15.2
            L40 18.8
            L44.1 22.5
            C46 24.2 47 26.4 47 29
        "
                                    stroke="#F28C28"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* INNER ARCH */}
                                <path
                                    d="
            M18 78
            V33
            C18 30.6 18.9 28.6 20.6 27
            L24.4 23.4
            L27 20.2
            L29.2 17.6
            L32 15.4
            L34.8 17.6
            L37 20.2
            L39.6 23.4
            L43.4 27
            C45.1 28.6 46 30.6 46 33
            V78
        "
                                    stroke="#F28C28"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* LITTLE SHOULDER DETAILS */}
                                <path
                                    d="M18 34.5H21.2"
                                    stroke="#F28C28"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M42.8 34.5H46"
                                    stroke="#F28C28"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />

                                {/* TOP SMALL STAR */}
                                <path
                                    d="
            M32 20.2
            L33.1 22.6
            L35.7 21.9
            L35 24.5
            L37.4 25.6
            L35 26.7
            L35.7 29.3
            L33.1 28.6
            L32 31
            L30.9 28.6
            L28.3 29.3
            L29 26.7
            L26.6 25.6
            L29 24.5
            L28.3 21.9
            L30.9 22.6
            Z
        "
                                    fill="#F28C28"
                                />

                                {/* FLOWER */}
                                <g transform="translate(32 53)">
                                    {/* 8 petals */}
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                    />
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                        transform="rotate(45)"
                                    />
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                        transform="rotate(90)"
                                    />
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                        transform="rotate(135)"
                                    />
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                        transform="rotate(180)"
                                    />
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                        transform="rotate(225)"
                                    />
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                        transform="rotate(270)"
                                    />
                                    <path
                                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                        stroke="#F28C28"
                                        strokeWidth="1.6"
                                        fill="none"
                                        transform="rotate(315)"
                                    />

                                    {/* center ring */}
                                    <circle
                                        cx="0"
                                        cy="0"
                                        r="2.2"
                                        stroke="#F28C28"
                                        strokeWidth="1.4"
                                        fill="none"
                                    />
                                </g>
                            </svg>
                            {/* Text */}
                            <div className="leading-tight">
                                <h1 className="text-xl font-extrabold text-slate-900 tracking-wide">
                                    BANK AL-ANDALOUS
                                </h1>
                                <p className="text-sm text-slate-500 font-medium">
                                    بنك الأندلس
                                </p>
                            </div>
                        </div>

                        {/* DESKTOP NAV */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                            {['Home', 'About Us', 'Features', 'Security', 'Contact Us'].map((item, i) => (
                                <a
                                    key={item}
                                    href={i === 0 ? '#' : `#${item.toLowerCase().replace(' ', '')}`}
                                    className={i === 0 ? 'font-bold text-orange-500' : 'hover:text-orange-500'}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* RIGHT SIDE (DESKTOP) */}
                        <div className="hidden md:flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-400"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm"
                                    >
                                        Login
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* MOBILE BUTTON */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden text-2xl text-slate-700"
                        >
                            ☰
                        </button>
                    </div>

                    {/* MOBILE MENU */}
                    {open && (
                        <div className="md:hidden w-full px-4 pb-4 space-y-4 border-t bg-white">

                            <a href="#" className="block">Home</a>
                            <a href="#aboutus" className="block">About</a>
                            <a href="#features" className="block">Features</a>
                            <a href="#security" className="block">Security</a>
                            <a href="#contactus" className="block">Contact</a>

                            <div className="pt-3 border-t flex flex-col gap-3">
                                {auth?.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-xl bg-orange-500 px-4 py-3 text-center text-white font-bold"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-center">
                                            Login
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href="/register"
                                                className="rounded-xl bg-orange-500 px-4 py-3 text-center text-white font-bold"
                                            >
                                                Get Started
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* home  */}
                <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:px-8 py-20 lg:grid-cols-2">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            Smart Banking for a Better Future
                        </span>

                        <h2 className="mt-6 max-w-xl text-3xl sm:text-4xl lg:text-6xl leading-[1.1] font-extrabold tracking-tight">
                            Welcome to{' '}
                            <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                Bank Al-Andalous
                            </span>
                            {/* 🔥 Moroccan separator */}
                            <div className="flex items-center gap-4 mt-6 mb-6 max-w-md">
                                <div className="h-px flex-1 bg-orange-200" />
                                <div className="text-orange-500 text-xl">✺</div>
                                <div className="h-px flex-1 bg-orange-200" />
                            </div>
                        </h2>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500">
                            Inspired by 12 centuries of Moroccan heritage, Bank Al-Andalous
                            combines tradition and innovation to deliver secure, modern
                            financial solutions.
                        </p>

                        <div className="mt-9 flex flex-col sm:flex-row gap-4">
                            {
                                auth?.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-400"
                                    >
                                        Go To Dashboard <ArrowRight size={18} />
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-400"
                                    >
                                        Login to Your Account <ArrowRight size={18} />
                                    </Link>
                                )
                            }

                            <a
                                href="#features"
                                className="rounded-xl border border-slate-200 px-6 py-4 font-bold text-slate-600 transition hover:border-orange-400 hover:text-orange-500"
                            >
                                Explore Features
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                            {[
                                [ShieldCheck, '100% Secure'],
                                [Headphones, '24/7 Support'],
                                [Lock, 'Your Data is Safe'],
                            ].map(([Icon, label]: any, i) => (
                                <span key={label} className="flex items-center gap-2">
                                    {i > 0 && <span className="h-4 w-px bg-slate-200" />}
                                    <Icon size={16} className="text-orange-500" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hero visual */}
                    <div className="relative flex min-h-[480px] items-center justify-center">
                        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

                        {/* Credit card */}
                        <div className="absolute top-40 left-0 z-10 hidden rotate-[-8deg] rounded-2xl bg-gradient-to-br from-slate-800 to-black p-5 text-white shadow-2xl lg:block">
                            <div className="mb-8 flex items-center gap-2">
                                <Landmark size={16} className="text-orange-500" />
                                <span className="text-sm font-bold">
                                    Bank Al-Andalous
                                </span>
                            </div>
                            <CreditCard className="mb-4 text-slate-300" />
                            <p className="text-sm tracking-[0.3em] text-slate-300">
                                1234 5678 9012 3456
                            </p>
                            <div className="mt-5 flex justify-between text-xs text-slate-400">
                                <span>CARD HOLDER</span>
                                <span className="text-base font-extrabold text-white">
                                    VISA
                                </span>
                            </div>
                        </div>

                        {/* Phone mockup */}
                        <div className="relative z-20 w-[260px] sm:w-[300px] rounded-[2.5rem] border-[10px] border-slate-800 bg-white p-4 shadow-2xl">
                            <div className="mx-auto mb-3 h-5 w-20 rounded-full bg-slate-200" />
                            <p className="text-sm font-bold text-slate-900">
                                Welcome Back!
                            </p>
                            <p className="text-xs text-slate-400">
                                مرحباً بعودتك
                            </p>

                            <div className="mt-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-lg shadow-orange-500/30">
                                <p className="text-xs text-orange-100">
                                    Total Balance
                                </p>
                                <h3 className="mt-1 text-2xl font-extrabold">
                                    25,430.85 DH
                                </h3>
                                <p className="mt-3 text-xs text-orange-100">
                                    Available Balance
                                </p>
                                <p className="text-sm font-bold">
                                    24,520.20 DH
                                </p>
                            </div>

                            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] text-slate-500">
                                {[
                                    [Send, 'Send'],
                                    [Download, 'Receive'],
                                    [Smartphone, 'Top Up'],
                                    [MoreHorizontal, 'More'],
                                ].map(([Icon, label]: any) => (
                                    <div key={label} className="rounded-xl bg-orange-50 p-2">
                                        <Icon className="mx-auto mb-1 h-4 w-4 text-orange-500" />
                                        {label}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <div className="mb-2 flex justify-between text-xs font-bold">
                                    <span className="text-slate-700">
                                        Recent Transactions
                                    </span>
                                    <span className="text-orange-500">
                                        See All
                                    </span>
                                </div>
                                {[
                                    ['Salary Deposit', '+3,500.00 DH', 'text-emerald-600'],
                                    ['Shopping', '-120.00 DH', 'text-red-500'],
                                    ['Car Saving', '-100.00 DH', 'text-red-500'],
                                    ['Electricity Bill', '-250.00 DH', 'text-red-500'],
                                ].map(([name, price, color]) => (
                                    <div key={name} className="mb-2 flex justify-between text-[10px] text-slate-500">
                                        <span>{name}</span>
                                        <span className={`font-bold ${color}`}>
                                            {price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute right-12 bottom-6 z-30 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-2xl ring-4 shadow-orange-500/40 ring-orange-500/20">
                            <ShieldCheck size={40} />
                        </div>
                    </div>
                </section>
                {/* About */}
                <section
                    id="aboutus"
                    className="border-t border-slate-100 bg-white px-4 sm:px-6 lg:px-8 py-20"
                >
                    <div className="mx-auto max-w-7xl">
                        {/* Header */}
                        <div className="mb-14 grid items-center gap-10 grid gap-10 md:grid-cols-2 lg:grid-cols-2">
                            <div>
                                <span className="text-sm font-bold tracking-widest text-orange-500 uppercase">
                                    About OrangeBank
                                </span>
                                <h2 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-slate-900">
                                    Smart Banking,{' '}
                                    <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                                        Built for You
                                    </span>
                                </h2>
                                <div className="mt-4 h-px w-20 bg-gradient-to-r from-orange-400 to-orange-600" />
                            </div>
                            <div className="space-y-4 text-slate-500">
                                <p className="leading-8">
                                    OrangeBank is a smart banking platform
                                    designed to make money management{' '}
                                    <span className="font-semibold text-slate-700">
                                        easier, faster, and safer
                                    </span>
                                    . Our goal is to help users understand their
                                    financial activity, track transactions,
                                    create saving goals, and get support when
                                    they need it.
                                </p>
                                <p className="leading-8">
                                    Unlike traditional banking apps, OrangeBank
                                    focuses on smart features such as{' '}
                                    <span className="font-semibold text-slate-700">
                                        AI financial advice
                                    </span>
                                    , savings simulation, automatic goal saving,
                                    and emergency stop control.
                                </p>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="grid gap-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Rocket,
                                    label: 'Our Mission',
                                    text: 'Help users manage and save money easily.',
                                    accent: 'bg-orange-500',
                                },
                                {
                                    icon: Eye,
                                    label: 'Our Vision',
                                    text: 'Build a smarter and safer digital banking experience.',
                                    accent: 'bg-amber-500',
                                },
                                {
                                    icon: Sparkles,
                                    label: 'Why OrangeBank?',
                                    text: 'Because it combines banking, AI advice, saving goals, and support in one platform.',
                                    accent: 'bg-orange-600',
                                },
                            ].map(({ icon: Icon, label, text, accent }) => (
                                <div
                                    key={label}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100"
                                >
                                    <div
                                        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${accent} text-white shadow-lg`}
                                    >
                                        <Icon size={26} />
                                    </div>
                                    <h3 className="mb-3 text-xl font-extrabold text-slate-900">
                                        {label}
                                    </h3>
                                    <p className="text-sm leading-7 text-slate-500">
                                        {text}
                                    </p>
                                    <div
                                        className={`absolute bottom-0 left-0 h-1 w-0 ${accent} transition-all duration-500 group-hover:w-full`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section
                    id="features"
                    className="border-t border-slate-100 bg-white px-4 sm:px-6 lg:px-8 py-20"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-14 text-center">
                            <span className="text-sm font-bold tracking-widest text-orange-400 uppercase">
                                Everything You Need
                            </span>
                            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                                Powerful Features for Your{' '}
                                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                                    Financial Freedom
                                </span>
                            </h2>
                            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <div
                                        key={feature.title}
                                        className="group rounded-2xl border border-slate-100 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50"
                                    >
                                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                                            <Icon size={26} />
                                        </div>
                                        <h3 className="mb-2 text-lg font-extrabold text-slate-900">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm leading-7 text-slate-500">
                                            {feature.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Security */}
                <section
                    id="security"
                    className="border-t border-slate-100 bg-white px-4 sm:px-6 lg:px-8 py-20"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 grid gap-10 md:grid-cols-2">
                            <div>
                                <div className="mb-6 flex items-center gap-3 text-orange-500">
                                    <ShieldCheck size={34} />
                                    <span className="text-xl font-extrabold">
                                        Your Security is Our Priority
                                    </span>
                                </div>

                                <h2 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl leading-tight font-extrabold text-slate-950">
                                    Bank with Confidence, <br />
                                    Your{' '}
                                    <span className="text-orange-500">
                                        Security
                                    </span>{' '}
                                    is Guaranteed
                                </h2>

                                <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
                                    At OrangeBank, we use advanced security
                                    technologies to protect your account,
                                    personal data, and transactions. Your trust
                                    is our top priority.
                                </p>

                                <div className="mt-12 grid  w-full gap-8 sm:grid-cols-3">
                                    {[
                                        [
                                            ShieldCheck,
                                            'Secure Login',
                                            'Email & Password protected',
                                        ],
                                        [
                                            Lock,
                                            'Data Encrypted',
                                            '256-bit SSL encryption',
                                        ],
                                        [
                                            ShieldCheck,
                                            'Always Protected',
                                            '24/7 system monitoring',
                                        ],
                                    ].map(([Icon, title, text]: any) => (
                                        <div
                                            key={title}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                                                <Icon size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-950">
                                                    {title}
                                                </h4>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="">
                                <img src={logo} alt="" className="w-full max-w-md mx-auto" />
                            </div>
                        </div>

                        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                [
                                    Lock,
                                    'Secure Login',
                                    'Your account is protected with a secure email and password authentication system.',
                                ],
                                [
                                    ShieldCheck,
                                    'Data Protection',
                                    'All your personal and financial data is encrypted and stored securely.',
                                ],
                                [
                                    Eye,
                                    'Activity Monitoring',
                                    'We monitor transactions and login activity to detect any suspicious behavior.',
                                ],
                                [
                                    UserCog,
                                    'Admin Control',
                                    'Our admin system can block accounts and stop suspicious activity instantly.',
                                ],
                                [
                                    Server,
                                    'Reliable System',
                                    'Built with modern technologies to ensure stability and the highest security.',
                                ],
                            ].map(([Icon, title, text]: any) => (
                                <div
                                    key={title}
                                    className="group rounded-2xl border border-slate-100 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50"
                                >
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                                        <Icon size={26} />
                                    </div>
                                    <h3 className="mb-2 text-lg font-extrabold text-slate-900">
                                        {title}
                                    </h3>
                                    <p className="text-sm leading-7 text-slate-500">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Contact */}
            <section id="contactus" className="border-t border-slate-100 bg-slate-50 px-4 sm:px-6 lg:px-8 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-14 text-center">
                        <span className="text-sm font-bold uppercase tracking-widest text-orange-500">Get In Touch</span>
                        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                            We're Here to{' '}
                            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Help You</span>
                        </h2>
                        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                        <p className="mx-auto mt-4 max-w-lg text-slate-500">Have a question or need support? Reach out to us and our team will get back to you as soon as possible.</p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Contact info cards */}
                        <div className="space-y-5">
                            {[
                                { icon: Mail, title: 'Email Us', value: 'support@orangebank.ma', sub: 'We reply within 24 hours' },
                                { icon: Phone, title: 'Call Us', value: '+212 5XX-XXXXXX', sub: 'Mon–Fri, 9am to 6pm' },
                                { icon: MapPin, title: 'Visit Us', value: 'Casablanca, Morocco', sub: 'OrangeBank HQ' },
                            ].map(({ icon: Icon, title, value, sub }) => (
                                <div key={title} className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-slate-900">{title}</p>
                                        <p className="mt-0.5 text-sm font-medium text-slate-700">{value}</p>
                                        <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact form */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                                        <MessageSquare size={20} />
                                    </div>
                                    <h3 className="text-lg font-extrabold text-slate-900">Send Us a Message</h3>
                                </div>

                                <form className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="Your full name"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="How can we help?"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Message</label>
                                        <textarea
                                            rows={5}
                                            placeholder="Write your message here..."
                                            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex w-full sm:w-auto items-center gap-2 rounded-xl bg-orange-500 px-4 sm:px-6 lg:px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
                                    >
                                        Send Message <ArrowRight size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
                    <div className="grid gap-10 md:grid-cols-2">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 ring-1 ring-orange-500/30">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 64 84"
                                        className="h-7 w-7"
                                        fill="none"
                                    >
                                        {/* OUTER ARCH */}
                                        <path
                                            d="M11 78V30C11 26.5 12.3 23.7 14.8 21.5L19.4 17.4L22.8 13.2L26.1 9.1L29.1 5.8L32 3.5L34.9 5.8L37.9 9.1L41.2 13.2L44.6 17.4L49.2 21.5C51.7 23.7 53 26.5 53 30V78"
                                            stroke="#F28C28"
                                            strokeWidth="2.3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {/* DECORATIVE TOP INNER LINE */}
                                        <path
                                            d="M17 29C17 26.4 18 24.2 19.9 22.5L24 18.8L26.8 15.2L29.2 12.1L32 9.8L34.8 12.1L37.2 15.2L40 18.8L44.1 22.5C46 24.2 47 26.4 47 29"
                                            stroke="#F28C28"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {/* INNER ARCH */}
                                        <path
                                            d="M18 78V33C18 30.6 18.9 28.6 20.6 27L24.4 23.4L27 20.2L29.2 17.6L32 15.4L34.8 17.6L37 20.2L39.6 23.4L43.4 27C45.1 28.6 46 30.6 46 33V78"
                                            stroke="#F28C28"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {/* LITTLE SHOULDER DETAILS */}
                                        <path
                                            d="M18 34.5H21.2"
                                            stroke="#F28C28"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M42.8 34.5H46"
                                            stroke="#F28C28"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                        />

                                        {/* TOP SMALL STAR */}
                                        <path
                                            d="M32 20.2L33.1 22.6L35.7 21.9L35 24.5L37.4 25.6L35 26.7L35.7 29.3L33.1 28.6L32 31L30.9 28.6L28.3 29.3L29 26.7L26.6 25.6L29 24.5L28.3 21.9L30.9 22.6Z"
                                            fill="#F28C28"
                                        />

                                        {/* FLOWER */}
                                        <g transform="translate(32 53)">
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <path
                                                    key={i}
                                                    d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                                                    stroke="#F28C28"
                                                    strokeWidth="1.6"
                                                    fill="none"
                                                    transform={`rotate(${i * 45})`}
                                                />
                                            ))}

                                            <circle
                                                cx="0"
                                                cy="0"
                                                r="2.2"
                                                stroke="#F28C28"
                                                strokeWidth="1.4"
                                                fill="none"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <span className="text-xl font-extrabold">
                                    Bank <span className="text-orange-500" >Al-Andalous   </span >
                                </span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-slate-500">
                                Smart banking for a better future. Manage, save, and grow your money securely.
                            </p>
                            <div className="mt-5 flex gap-3">
                                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-orange-400 hover:text-orange-500">
                                        <Icon size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="mb-5 font-extrabold text-slate-900">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                {['Home', 'About Us', 'Features', 'Security', 'Contact Us'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="transition hover:text-orange-500">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Features */}
                        <div>
                            <h4 className="mb-5 font-extrabold text-slate-900">Features</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                {['Transaction History', 'AI Financial Advisor', 'Savings Goals', 'Savings Simulator', 'Emergency Stop', 'Customer Support'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="transition hover:text-orange-500">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="mb-5 font-extrabold text-slate-900">Contact</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                {[
                                    [Mail, 'support@orangebank.ma'],
                                    [Phone, '+212 5XX-XXXXXX'],
                                    [MapPin, 'Casablanca, Morocco'],
                                ].map(([Icon, text]: any) => (
                                    <li key={text} className="flex items-center gap-3">
                                        <Icon size={15} className="shrink-0 text-orange-500" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-sm text-slate-400 sm:flex-row">
                        <p>© {new Date().getFullYear()} OrangeBank. All rights reserved.</p>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <a key={item} href="#" className="transition hover:text-orange-500">{item}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
