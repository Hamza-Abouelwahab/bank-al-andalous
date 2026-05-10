import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarDays,
    CreditCard,
    Eye,
    EyeOff,
    Landmark,
    LockKeyhole,
    ShieldCheck,
    Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Account = {
    account_number?: string;
    account_type?: string;
    balance?: number;
    holder_name?: string;
    rip?: string;
    created_at?: string;
    status?: string;
};

type PageProps = {
    account?: Account | null;
};

export default function AccountShow() {
    const { account } = usePage<PageProps>().props;
    const [showFullNumber, setShowFullNumber] = useState(false);

    const accountNumber = account?.account_number ?? '0000000000000000';
    const formattedAccountNumber = useMemo(() => {
        const clean = String(accountNumber).replace(/\s+/g, '');

        if (showFullNumber) {
            return clean.replace(/(.{4})/g, '$1 ').trim();
        }

        if (clean.length <= 4) {
            return clean;
        }

        return `•••• •••• •••• ${clean.slice(-4)}`;
    }, [accountNumber, showFullNumber]);

    const formattedBalance = `${Number(account?.balance ?? 0).toLocaleString(
        'en-MA',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
    )} MAD`;

    const accountType = account?.account_type ?? 'current';
    const holderName = account?.holder_name ?? 'Account Holder';
    const status = account?.status ?? 'Active';

    const formattedDate = account?.created_at
        ? new Date(account.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : 'Not available';

    return (
        <>
            <Head title="My Card" />

            <div className="min-h-screen bg-[#F8F6F1] p-4 text-[#171412] lg:p-6 dark:bg-[#0F0D0B] dark:text-[#F5F0EA]">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Header */}
                    <div className="animate-fade-in mb-8">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10">
                                <CreditCard className="h-6 w-6 text-orange-600" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    My Card
                                </h1>

                                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                    View your card, RIB, balance, and account
                                    details
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Secure session • 256-bit encryption</span>
                        </div>
                    </div>

                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        {/* Card side */}
                        <div className="relative mx-auto aspect-[1.586/1] w-full max-w-[520px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-[#1f1a17] via-[#351706] to-[#7a2800] p-5 text-white shadow-2xl sm:rounded-[2rem] sm:p-7">
                            {/* background circles */}
                            <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full border-[38px] border-white/5 sm:-top-32 sm:-right-28 sm:h-80 sm:w-80 sm:border-[44px]" />
                            <div className="absolute top-16 -right-10 h-44 w-44 rounded-full border-[28px] border-orange-300/10 sm:top-20 sm:h-56 sm:w-56 sm:border-[34px]" />
                            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl" />

                            <div className="relative flex h-full flex-col justify-between">
                                {/* Top */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black tracking-[0.18em] text-white/45 uppercase sm:text-[11px] sm:tracking-[0.22em]">
                                            Account Number
                                        </p>

                                        <div className="mt-2 flex items-center gap-2 sm:gap-3">
                                            <p className="max-w-[170px] truncate font-mono text-sm font-black tracking-[0.16em] sm:max-w-none sm:text-lg sm:tracking-[0.2em]">
                                                {formattedAccountNumber}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowFullNumber(
                                                        (current) => !current,
                                                    )
                                                }
                                                className="shrink-0 rounded-full bg-white/10 p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white sm:p-2"
                                                title={
                                                    showFullNumber
                                                        ? 'Hide account number'
                                                        : 'Show account number'
                                                }
                                            >
                                                {showFullNumber ? (
                                                    <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                ) : (
                                                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-base leading-tight font-black tracking-tight sm:text-2xl">
                                            Bank Al-
                                            <br className="hidden sm:block" />
                                            Andalous
                                        </p>
                                        <p className="mt-1 text-[10px] font-bold text-orange-200/80 sm:text-xs">
                                            Secure Banking
                                        </p>
                                    </div>
                                </div>

                                {/* Chip */}
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex h-9 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-orange-500 shadow-lg shadow-orange-900/20 sm:h-11 sm:w-14">
                                        <div className="grid h-6 w-8 grid-cols-2 gap-1 rounded-lg border border-yellow-700/30 p-1 sm:h-7 sm:w-10">
                                            <span className="rounded bg-yellow-700/20" />
                                            <span className="rounded bg-yellow-700/20" />
                                            <span className="rounded bg-yellow-700/20" />
                                            <span className="rounded bg-yellow-700/20" />
                                        </div>
                                    </div>

                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 sm:h-10 sm:w-10">
                                        <ShieldCheck className="h-4 w-4 text-orange-200 sm:h-5 sm:w-5" />
                                    </div>
                                </div>

                                {/* Bottom */}
                                <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black tracking-[0.18em] text-white/40 uppercase sm:text-[11px] sm:tracking-[0.22em]">
                                            Card Holder
                                        </p>
                                        <p className="mt-1 truncate text-sm font-black uppercase sm:text-lg">
                                            {holderName}
                                        </p>

                                        <p className="mt-3 text-[9px] font-black tracking-[0.18em] text-white/40 uppercase sm:mt-4 sm:text-[11px] sm:tracking-[0.22em]">
                                            Balance
                                        </p>
                                        <p className="mt-1 truncate text-xl font-black sm:text-3xl">
                                            {formattedBalance}
                                        </p>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-[9px] font-black tracking-[0.18em] text-white/40 uppercase sm:text-[11px] sm:tracking-[0.22em]">
                                            Type
                                        </p>
                                        <p className="mt-1 text-sm font-black uppercase sm:text-lg">
                                            {accountType}
                                        </p>

                                        <p className="mt-2 text-2xl font-black text-white/80 italic sm:mt-3 sm:text-4xl">
                                            VISA
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details side */}
                        <div className="space-y-5">
                            <div className="rounded-[2rem] border border-[#ECE7DF] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black">
                                            Account details
                                        </h2>
                                        <p className="mt-1 text-sm text-[#8A837A] dark:text-[#AFA49A]">
                                            Main banking information connected
                                            to your card.
                                        </p>
                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                        <Wallet className="h-6 w-6" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <DetailRow
                                        label="Holder name"
                                        value={holderName}
                                    />
                                    <DetailRow
                                        label="Account number"
                                        value={accountNumber}
                                        mono
                                    />
                                    <DetailRow
                                        label="Account type"
                                        value={accountType}
                                        capitalize
                                    />
                                    <DetailRow
                                        label="Current balance"
                                        value={formattedBalance}
                                    />
                                    <DetailRow
                                        label="Created at"
                                        value={formattedDate}
                                    />
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-orange-200/60 bg-orange-50 p-6 dark:border-orange-500/20 dark:bg-orange-500/10">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
                                        <LockKeyhole className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <h3 className="font-black text-[#171412] dark:text-white">
                                            Security note
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-[#7B756E] dark:text-[#D8D0C8]">
                                            Never share your account number,
                                            RIB/RIP, or banking details with
                                            unknown people. Bank Al-Andalous
                                            will never ask for your password by
                                            phone or email.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <MiniStat
                                    label="Available balance"
                                    value={formattedBalance}
                                />
                                <MiniStat
                                    label="Account status"
                                    value={status}
                                    accent
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function InfoCard({
    icon,
    label,
    value,
    description,
    mono = false,
    tone = 'orange',
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    description: string;
    mono?: boolean;
    tone?: 'orange' | 'green';
}) {
    const toneClass =
        tone === 'green'
            ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
            : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400';

    return (
        <div className="rounded-[1.5rem] border border-[#ECE7DF] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
            <div className="flex items-start gap-4">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}
                >
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-black tracking-[0.18em] text-[#9A948C] uppercase">
                        {label}
                    </p>

                    <p
                        className={`mt-2 truncate text-sm font-black text-[#171412] dark:text-white ${
                            mono
                                ? 'font-mono text-orange-600 dark:text-orange-400'
                                : ''
                        }`}
                    >
                        {value}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#8A837A] dark:text-[#AFA49A]">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

function DetailRow({
    label,
    value,
    mono = false,
    capitalize = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
    capitalize?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#FFFCFA] px-4 py-4 dark:bg-[#252118]">
            <span className="text-sm font-bold text-[#8A837A] dark:text-[#AFA49A]">
                {label}
            </span>

            <span
                className={`text-right text-sm font-black text-[#171412] dark:text-white ${
                    mono ? 'font-mono' : ''
                } ${capitalize ? 'capitalize' : ''}`}
            >
                {value}
            </span>
        </div>
    );
}

function MiniStat({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="rounded-[1.5rem] border border-[#ECE7DF] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
            <p className="text-sm font-bold text-[#8A837A] dark:text-[#AFA49A]">
                {label}
            </p>

            <p
                className={`mt-2 text-xl font-black ${
                    accent
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-[#171412] dark:text-white'
                }`}
            >
                {value}
            </p>
        </div>
    );
}
