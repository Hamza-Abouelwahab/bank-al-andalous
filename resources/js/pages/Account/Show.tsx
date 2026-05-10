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

            <div className="min-h-screen bg-[#F8F6F1] p-4 text-[#171412] dark:bg-[#0F0D0B] dark:text-[#F5F0EA] lg:p-6">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Header */}
<div className="mb-8 animate-fade-in">
    <div className="mb-2 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10">
            <CreditCard className="h-6 w-6 text-orange-600" />
        </div>

        <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                My Card
            </h1>

            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                View your card, RIB, balance, and account details
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
                        <div className="space-y-5">
                            <div className="relative overflow-hidden rounded-[2rem] border border-orange-200/40 bg-[#171412] p-6 shadow-2xl shadow-orange-900/10 dark:border-orange-500/20">
                                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
                                <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#7a2800]/40 blur-3xl" />

                                {/* Card */}
                                <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-[#1f1a17] via-[#351706] to-[#7a2800] p-6 text-white shadow-2xl">
                                    <div className="absolute -right-28 -top-32 h-80 w-80 rounded-full border-[44px] border-white/5" />
                                    <div className="absolute -right-10 top-20 h-56 w-56 rounded-full border-[34px] border-orange-300/10" />
                                    <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />

                                    <div className="relative flex min-h-[310px] flex-col justify-between">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">
                                                    Account Number
                                                </p>

                                                <div className="mt-2 flex items-center gap-3">
                                                    <p className="font-mono text-lg font-black tracking-[0.2em]">
                                                        {formattedAccountNumber}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowFullNumber(
                                                                (current) =>
                                                                    !current,
                                                            )
                                                        }
                                                        className="rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
                                                        title={
                                                            showFullNumber
                                                                ? 'Hide account number'
                                                                : 'Show account number'
                                                        }
                                                    >
                                                        {showFullNumber ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl font-black tracking-tight">
                                                    Bank Al-Andalous
                                                </p>
                                                <p className="mt-1 text-xs font-bold text-orange-200/80">
                                                    Secure Banking
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-orange-500 shadow-lg shadow-orange-900/20">
                                                <div className="grid h-7 w-10 grid-cols-2 gap-1 rounded-lg border border-yellow-700/30 p-1">
                                                    <span className="rounded bg-yellow-700/20" />
                                                    <span className="rounded bg-yellow-700/20" />
                                                    <span className="rounded bg-yellow-700/20" />
                                                    <span className="rounded bg-yellow-700/20" />
                                                </div>
                                            </div>

                                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
                                                <ShieldCheck className="h-5 w-5 text-orange-200" />
                                            </div>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                                                    Card Holder
                                                </p>
                                                <p className="mt-1 text-lg font-black uppercase">
                                                    {holderName}
                                                </p>

                                                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                                                    Balance
                                                </p>
                                                <p className="mt-1 text-2xl font-black">
                                                    {formattedBalance}
                                                </p>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                                                    Type
                                                </p>
                                                <p className="mt-1 text-lg font-black uppercase">
                                                    {accountType}
                                                </p>

                                                <p className="mt-3 text-3xl font-black italic text-white/80">
                                                    VISA
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIB/RIP */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <InfoCard
                                    icon={<Landmark className="h-5 w-5" />}
                                    label="RIB / RIP"
                                    value={account?.rip ?? 'Not available'}
                                    description="Used for bank transfers and account identification."
                                    mono
                                />

                                <InfoCard
                                    icon={<BadgeCheck className="h-5 w-5" />}
                                    label="Card Status"
                                    value={status}
                                    description="Your card is currently active and ready to use."
                                    tone="green"
                                />
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
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9A948C]">
                        {label}
                    </p>

                    <p
                        className={`mt-2 truncate text-sm font-black text-[#171412] dark:text-white ${
                            mono ? 'font-mono text-orange-600 dark:text-orange-400' : ''
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
