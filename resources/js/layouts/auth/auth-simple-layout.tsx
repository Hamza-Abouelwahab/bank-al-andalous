import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

// Inline logo SVG
function BankLogo({ size = 48, color = '#F97316' }: { size?: number; color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 84" width={size} height={size} fill="none">
            <path d="M11 78 V30 C11 26.5 12.3 23.7 14.8 21.5 L19.4 17.4 L22.8 13.2 L26.1 9.1 L29.1 5.8 L32 3.5 L34.9 5.8 L37.9 9.1 L41.2 13.2 L44.6 17.4 L49.2 21.5 C51.7 23.7 53 26.5 53 30 V78"
                stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 29 C17 26.4 18 24.2 19.9 22.5 L24 18.8 L26.8 15.2 L29.2 12.1 L32 9.8 L34.8 12.1 L37.2 15.2 L40 18.8 L44.1 22.5 C46 24.2 47 26.4 47 29"
                stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 78 V33 C18 30.6 18.9 28.6 20.6 27 L24.4 23.4 L27 20.2 L29.2 17.6 L32 15.4 L34.8 17.6 L37 20.2 L39.6 23.4 L43.4 27 C45.1 28.6 46 30.6 46 33 V78"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 34.5H21.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M42.8 34.5H46"  stroke={color} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M32 20.2 L33.1 22.6 L35.7 21.9 L35 24.5 L37.4 25.6 L35 26.7 L35.7 29.3 L33.1 28.6 L32 31 L30.9 28.6 L28.3 29.3 L29 26.7 L26.6 25.6 L29 24.5 L28.3 21.9 L30.9 22.6 Z"
                fill={color} />
            <g transform="translate(32 53)">
                {[0,45,90,135,180,225,270,315].map((r) => (
                    <path key={r} d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                        stroke={color} strokeWidth="1.6" fill="none" transform={`rotate(${r})`} />
                ))}
                <circle cx="0" cy="0" r="2.2" stroke={color} strokeWidth="1.4" fill="none" />
            </g>
        </svg>
    );
}

const FEATURES = [
    { icon: '🔒', text: 'Bank-grade 256-bit encryption' },
    { icon: '🤖', text: 'AI-powered financial insights' },
    { icon: '📊', text: 'Real-time spending analytics' },
    { icon: '🎯', text: 'Smart savings goals & challenges' },
];

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh bg-[#F8F6F1] dark:bg-[#0F0D0B]">

            {/* ── Left Brand Panel (hidden on mobile) ── */}
            <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-[#1a0f0a] via-[#2d1408] to-[#0f0806] lg:flex lg:flex-col lg:justify-between p-10 xl:p-14">

                {/* Background decoration */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-400/5 blur-2xl" />
                </div>

                {/* Logo */}
                <Link href={home()} className="relative flex items-center gap-3">
                    <BankLogo size={52} color="#F97316" />
                    <div className="leading-tight">
                        <p className="text-sm font-extrabold tracking-widest text-white/90 uppercase">Bank Al-Andalous</p>
                        <p className="text-xs font-medium text-orange-300/70">بنك الأندلس</p>
                    </div>
                </Link>

                {/* Hero text */}
                <div className="relative">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                        <span className="text-xs font-semibold text-orange-300">Smart Banking • Since 711 AD Heritage</span>
                    </div>
                    <h1 className="mt-4 text-3xl xl:text-4xl font-black leading-tight text-white">
                        Your finances,{' '}
                        <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                            reimagined.
                        </span>
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">
                        Inspired by 12 centuries of Moroccan heritage, Bank Al-Andalous
                        combines tradition with modern financial technology.
                    </p>

                    {/* Feature bullets */}
                    <ul className="mt-8 space-y-3">
                        {FEATURES.map((f) => (
                            <li key={f.text} className="flex items-center gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-sm">
                                    {f.icon}
                                </span>
                                <span className="text-sm text-white/60">{f.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <p className="relative text-xs text-white/25">
                    © {new Date().getFullYear()} Bank Al-Andalous. All rights reserved.
                </p>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
                {/* Mobile logo */}
                <Link href={home()} className="mb-8 flex items-center gap-2.5 lg:hidden">
                    <BankLogo size={36} />
                    <span className="text-base font-extrabold tracking-wide text-slate-900 dark:text-white">
                        Bank Al-Andalous
                    </span>
                </Link>

                {/* Card */}
                <div className="w-full max-w-sm animate-scale-in">
                    <div className="rounded-2xl border border-[#EDE8E0] bg-white p-8 shadow-xl shadow-black/5 dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                        </div>
                        {children}
                    </div>

                    <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-600">
                        🔐 Protected by 256-bit bank-grade encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
