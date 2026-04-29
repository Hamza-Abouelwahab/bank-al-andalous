import { Link } from '@inertiajs/react';
import { Landmark } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-orange-50 p-6 md:p-10">
            {/* Background glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

            <div className="relative z-10 w-full max-w-sm">
                {/* Logo */}
                <Link
                    href={home()}
                    className="mb-8 flex items-center justify-center gap-2.5 font-bold text-slate-800"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/30">
                        <Landmark size={18} className="text-white" />
                    </div>
                    <span className="text-lg tracking-tight">OrangeBank</span>
                </Link>

                {/* Card */}
                <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50">
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                        <p className="mt-1.5 text-sm text-slate-500">{description}</p>
                    </div>
                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} OrangeBank. All rights reserved.
                </p>
            </div>
        </div>
    );
}
