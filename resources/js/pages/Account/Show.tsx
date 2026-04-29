import { Head, usePage } from '@inertiajs/react';

export default function AccountShow() {
    const { account } = usePage().props as any;

    const num = account?.account_number ?? '0000000000000000';
    // format as groups of 4
    const formatted = num.replace(/(.{4})/g, '$1 ').trim();

    return (
        <>
            <Head title="My Account" />
            <div className="min-h-screen bg-[#FFFCF9] p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div className="max-w-xl mx-auto">

                    {/* Credit Card */}
                    <div className="relative w-full rounded-2xl overflow-hidden text-white"
                        style={{
                            aspectRatio: '1.586',
                            background: 'linear-gradient(135deg, #1a2a4a 0%, #0d1b35 40%, #1a3a5c 100%)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                        }}>

                        {/* Wave decoration */}
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
                            <ellipse cx="320" cy="80" rx="200" ry="180" fill="none" stroke="#4a90d9" strokeWidth="60" />
                            <ellipse cx="300" cy="100" rx="160" ry="140" fill="none" stroke="#3a7abf" strokeWidth="40" />
                            <ellipse cx="280" cy="120" rx="120" ry="100" fill="none" stroke="#2a6aaf" strokeWidth="20" />
                        </svg>

                        {/* Card content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">

                            {/* Top row */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-[10px] uppercase tracking-[2px] mb-0.5">Account Number</p>
                                    <p className="font-mono text-sm tracking-widest text-white">{formatted}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold text-lg tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>BankCo</p>
                                </div>
                            </div>

                            {/* Chip */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-8 rounded-md bg-yellow-400/80 flex items-center justify-center">
                                    <div className="w-7 h-5 rounded-sm border border-yellow-600/50 grid grid-cols-2 gap-0.5 p-0.5">
                                        <div className="bg-yellow-600/40 rounded-sm" />
                                        <div className="bg-yellow-600/40 rounded-sm" />
                                        <div className="bg-yellow-600/40 rounded-sm" />
                                        <div className="bg-yellow-600/40 rounded-sm" />
                                    </div>
                                </div>
                                {/* Contactless icon */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/60">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                    <path d="M8 12c0-2.21 1.79-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M5 12c0-3.87 3.13-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>

                            {/* Bottom row */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-white/40 text-[9px] uppercase tracking-[2px] mb-0.5">Card Holder</p>
                                    <p className="text-white font-medium text-sm tracking-wide uppercase">
                                        {account?.holder_name ?? 'Account Holder'}
                                    </p>
                                    <p className="text-white/40 text-[9px] uppercase tracking-[2px] mt-2 mb-0.5">Balance</p>
                                    <p className="text-white font-bold text-base">
                                        {account ? `${account.balance.toLocaleString()} MAD` : '0 MAD'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/40 text-[9px] uppercase tracking-[2px] mb-0.5">Type</p>
                                    <p className="text-white text-sm font-semibold uppercase tracking-wider">
                                        {account?.account_type ?? 'N/A'}
                                    </p>
                                    {/* Visa-style logo */}
                                    <p className="text-white/70 font-bold text-xl italic mt-1" style={{ fontFamily: 'serif' }}>VISA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIP below card */}
                    <div className="mt-4 bg-white border border-[#EDE8E0] rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-0.5">RIP</p>
                            <p className="font-mono text-sm text-[#E8632A] font-semibold">{account?.rip ?? '—'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-[#9C978F] uppercase tracking-[2px] mb-0.5">Status</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <span className="text-xs text-green-600 font-medium">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <a href="/dashboard" className="text-[#E8632A] text-sm hover:underline">← Back to dashboard</a>
                    </div>
                </div>
            </div>
        </>
    );
}