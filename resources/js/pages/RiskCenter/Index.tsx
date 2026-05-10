import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Fingerprint,
    Lock,
    PiggyBank,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
    WalletCards,
} from 'lucide-react';

type RiskFlag = {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
};

type RiskScore = {
    id: number;
    score: number;
    level: 'excellent' | 'low' | 'medium' | 'high';
    identity_score: number;
    security_score: number;
    transaction_score: number;
    loan_score: number;
    saving_score: number;
    flags?: RiskFlag[] | string | null;
    recommendations?: string[] | string | null;
    calculated_at?: string | null;
};

type Props = {
    riskScore: RiskScore;
};

const parseJsonArray = <T,>(value: T[] | string | null | undefined): T[] => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    try {
        return JSON.parse(value);
    } catch {
        return [];
    }
};

const levelConfig = {
    excellent: {
        label: 'Excellent',
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        ring: 'ring-emerald-500/20',
        message: 'Your account looks very safe and financially stable.',
    },
    low: {
        label: 'Low Risk',
        text: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-950/30',
        ring: 'ring-green-500/20',
        message: 'Your account is in good standing.',
    },
    medium: {
        label: 'Medium Risk',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        ring: 'ring-amber-500/20',
        message: 'Some improvements can make your account safer.',
    },
    high: {
        label: 'High Risk',
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-950/30',
        ring: 'ring-red-500/20',
        message: 'Your account needs attention to improve security and trust.',
    },
};

const breakdownItems = [
    {
        key: 'identity_score',
        label: 'Identity',
        max: 25,
        icon: Fingerprint,
        description: 'CIN, profile and phone verification',
    },
    {
        key: 'security_score',
        label: 'Security',
        max: 25,
        icon: Lock,
        description: 'Email verification and 2FA protection',
    },
    {
        key: 'transaction_score',
        label: 'Transactions',
        max: 20,
        icon: WalletCards,
        description: 'Transfer and withdrawal behavior',
    },
    {
        key: 'loan_score',
        label: 'Loans',
        max: 15,
        icon: TrendingUp,
        description: 'Loan exposure and repayment risk',
    },
    {
        key: 'saving_score',
        label: 'Savings',
        max: 15,
        icon: PiggyBank,
        description: 'Saving goals and financial stability',
    },
] as const;

export default function RiskCenterIndex({ riskScore }: Props) {
    const flags = parseJsonArray<RiskFlag>(riskScore.flags);
    const recommendations = parseJsonArray<string>(riskScore.recommendations);

    const currentLevel = levelConfig[riskScore.level] ?? levelConfig.medium;
    const score = Number(riskScore.score ?? 0);
    const progressDegree = Math.min(100, Math.max(0, score)) * 3.6;

    const recalculate = () => {
        router.post(
            '/risk-center/recalculate',
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Aman Score" />

            <div
                className="min-h-screen bg-[#F8F6F1] p-4 text-[#1f1a17] sm:p-6 lg:p-8 dark:bg-[#0f0d0b] dark:text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="overflow-hidden rounded-[2rem] bg-[#15110D] shadow-xl">
                        <div className="relative p-6 sm:p-8 lg:p-10">
                            <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-orange-500/20 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-52 w-52 -translate-x-20 translate-y-20 rounded-full bg-orange-500/10 blur-3xl" />

                            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-2xl">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-300">
                                        <ShieldCheck size={14} />
                                        Bank Al-Andalous Risk Intelligence
                                    </div>

                                    <h1
                                        className="text-3xl font-black tracking-tight text-white sm:text-4xl"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        Aman Score
                                    </h1>

                                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                                        Your smart banking trust score based on identity,
                                        security, transaction behavior, loans, and savings.
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${currentLevel.bg} ${currentLevel.text} ring-1 ${currentLevel.ring}`}
                                        >
                                            <CheckCircle2 size={15} />
                                            {currentLevel.label}
                                        </span>

                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/70 ring-1 ring-white/10">
                                            <Clock size={15} />
                                            Updated{' '}
                                            {riskScore.calculated_at
                                                ? new Date(riskScore.calculated_at).toLocaleDateString()
                                                : 'just now'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    <div
                                        className="relative flex h-48 w-48 items-center justify-center rounded-full"
                                        style={{
                                            background: `conic-gradient(#FF4B00 ${progressDegree}deg, rgba(255,255,255,0.12) 0deg)`,
                                        }}
                                    >
                                        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-[#15110D] ring-1 ring-white/10">
                                            <span
                                                className="text-5xl font-black text-white"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                {score}
                                            </span>
                                            <span className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-white/40">
                                                / 100
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={recalculate}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-[#D83A00]"
                                    >
                                        <RefreshCw size={16} />
                                        Recalculate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                        {breakdownItems.map((item) => {
                            const Icon = item.icon;
                            const value = Number(riskScore[item.key] ?? 0);
                            const percent = Math.round((value / item.max) * 100);

                            return (
                                <div
                                    key={item.key}
                                    className="rounded-3xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10">
                                            <Icon size={20} className="text-orange-500" />
                                        </div>

                                        <span className="text-sm font-black text-[#1f1a17] dark:text-white">
                                            {value}/{item.max}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-[#1f1a17] dark:text-white">
                                        {item.label}
                                    </h3>

                                    <p className="mt-1 min-h-[36px] text-xs leading-relaxed text-[#1f1a17]/50 dark:text-white/50">
                                        {item.description}
                                    </p>

                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F1ECE4] dark:bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-orange-600"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10">
                                    <AlertTriangle size={20} className="text-red-500" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold">Risk Flags</h2>
                                    <p className="text-sm text-[#1f1a17]/50 dark:text-white/50">
                                        Items that may reduce your Aman Score.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {flags.length > 0 ? (
                                    flags.map((flag, index) => (
                                        <div
                                            key={`${flag.type}-${index}`}
                                            className="rounded-2xl border border-red-200 bg-red-50/60 p-4 dark:border-red-500/20 dark:bg-red-950/20"
                                        >
                                            <div className="mb-1 flex items-center justify-between gap-3">
                                                <span className="text-sm font-bold capitalize text-red-700 dark:text-red-300">
                                                    {flag.type.replaceAll('_', ' ')}
                                                </span>

                                                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 dark:text-red-300">
                                                    {flag.severity}
                                                </span>
                                            </div>

                                            <p className="text-sm text-red-700/70 dark:text-red-200/70">
                                                {flag.message}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-300">
                                        No active risk flags. Your account looks healthy.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10">
                                    <ShieldCheck size={20} className="text-orange-500" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold">Recommendations</h2>
                                    <p className="text-sm text-[#1f1a17]/50 dark:text-white/50">
                                        Improve your score with these actions.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {recommendations.length > 0 ? (
                                    recommendations.map((recommendation, index) => (
                                        <div
                                            key={`${recommendation}-${index}`}
                                            className="flex gap-3 rounded-2xl border border-[#EDE8E0] bg-[#F8F6F1] p-4 dark:border-[#2A2520] dark:bg-[#241b16]"
                                        >
                                            <CheckCircle2
                                                size={18}
                                                className="mt-0.5 flex-shrink-0 text-orange-500"
                                            />

                                            <p className="text-sm leading-relaxed text-[#1f1a17]/70 dark:text-white/70">
                                                {recommendation}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-300">
                                        Great work. No recommendations right now.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold">Score meaning</h2>
                                <p className="mt-1 text-sm text-[#1f1a17]/50 dark:text-white/50">
                                    Aman Score is an internal trust indicator. It helps you
                                    understand your banking profile, but it is not a final loan
                                    decision.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                                <span className="rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    90-100 Excellent
                                </span>
                                <span className="rounded-xl bg-green-50 px-3 py-2 font-bold text-green-700 dark:bg-green-950/30 dark:text-green-300">
                                    70-89 Low
                                </span>
                                <span className="rounded-xl bg-amber-50 px-3 py-2 font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                                    50-69 Medium
                                </span>
                                <span className="rounded-xl bg-red-50 px-3 py-2 font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">
                                    0-49 High
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

RiskCenterIndex.layout = {
    breadcrumbs: [
        {
            title: 'Aman Score',
            href: '/risk-center',
        },
    ],
};