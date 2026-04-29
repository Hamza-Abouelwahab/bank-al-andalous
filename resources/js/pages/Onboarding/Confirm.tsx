import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
    profile: { date_of_birth: string; phone: string; address: string };
    bank: {
        account_type: string; employment_status: string;
        occupation: string; monthly_income: string; source_of_funds: string;
    };
}

const labels: Record<string, string> = {
    savings: 'Savings account', current: 'Current account',
    employed: 'Employed', self_employed: 'Self-employed',
    business_owner: 'Business owner', student: 'Student',
    retired: 'Retired', unemployed: 'Unemployed',
    salary: 'Salary', business: 'Business',
    investments: 'Investments', family: 'Family support', other: 'Other',
    '0-3000': 'Under 3,000 MAD', '3000-6000': '3,000–6,000 MAD',
    '6000-12000': '6,000–12,000 MAD', '12000-25000': '12,000–25,000 MAD',
    '25000+': '25,000+ MAD',
};

function fmt(v: string) {
 return labels[v] ?? v ?? '—'; 
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between py-3 border-b border-[#EDE8E0] last:border-0">
            <span className="text-[10px] text-[#9C978F] font-medium uppercase tracking-[1.5px] mt-0.5">{label}</span>
            <span className="text-sm text-[#0F0D0B] font-medium text-right max-w-[55%]">{value}</span>
        </div>
    );
}

export default function Confirm() {
    const { profile, bank } = usePage<{ props: Props }>().props as unknown as Props;
    const [agreed, setAgreed] = useState(false);
    const { post, processing } = useForm({});

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!agreed) {
return;
}

        post('/onboarding/confirm');
    };

    return (
        <div className="min-h-screen flex bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Left panel */}
            <div className="hidden lg:flex w-[260px] flex-shrink-0 bg-[#0F0D0B] flex-col justify-between p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8632A] opacity-10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#E8632A] opacity-[0.07] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#E8632A] rounded-xl flex items-center justify-center font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>B</div>
                    <span className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>BankCo</span>
                </div>

                <div className="relative z-10">
                    <div className="text-[#E8632A] text-[10px] font-medium uppercase tracking-[2.5px] mb-5">Account setup</div>
                    {[
                        { num: '✓', label: 'Personal info', state: 'done' },
                        { num: '✓', label: 'Financial profile', state: 'done' },
                        { num: '03', label: 'Confirmation', state: 'active' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                s.state === 'done' ? 'bg-[#E8632A] text-white' : 'bg-white text-[#0F0D0B]'
                            }`} style={{ fontFamily: "'Syne', sans-serif" }}>{s.num}</div>
                            <span className={`text-sm ${s.state === 'done' ? 'text-[#E8632A]' : 'text-white font-medium'}`}>{s.label}</span>
                            {s.state === 'active' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8632A]" />}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 text-white/20 text-[10px] leading-relaxed">
                    256-bit encryption<br />Your data is never shared
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto">
                <div className="w-full h-0.5 bg-[#EDE8E0] rounded-full mb-10 overflow-hidden">
                    <div className="h-full bg-[#E8632A] rounded-full" style={{ width: '100%' }} />
                </div>

                <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
                    <div className="mb-8">
                        <div className="text-[#E8632A] text-[10px] font-medium uppercase tracking-[2.5px] mb-2">Step 3 of 3</div>
                        <h1 className="text-[28px] font-extrabold text-[#0F0D0B] leading-tight tracking-tight mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Review &<br />confirm
                        </h1>
                        <p className="text-[#9C978F] text-sm">Check your details before opening your account.</p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-5 flex-1">

                        {/* Personal info */}
                        <div className="bg-white border border-[#EDE8E0] rounded-xl p-5">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-[#0F0D0B] uppercase tracking-[1.5px]" style={{ fontFamily: "'Syne', sans-serif" }}>Personal info</span>
                                <a href="/onboarding/profile" className="text-[11px] text-[#E8632A] font-medium hover:underline">Edit</a>
                            </div>
                            <Row label="Date of birth" value={profile?.date_of_birth ?? '—'} />
                            <Row label="Phone" value={profile?.phone ?? '—'} />
                            <Row label="Address" value={profile?.address ?? '—'} />
                        </div>

                        {/* Financial profile */}
                        <div className="bg-white border border-[#EDE8E0] rounded-xl p-5">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-[#0F0D0B] uppercase tracking-[1.5px]" style={{ fontFamily: "'Syne', sans-serif" }}>Financial profile</span>
                                <a href="/onboarding/bank" className="text-[11px] text-[#E8632A] font-medium hover:underline">Edit</a>
                            </div>
                            <Row label="Account type" value={fmt(bank?.account_type)} />
                            <Row label="Employment" value={fmt(bank?.employment_status)} />
                            <Row label="Occupation" value={bank?.occupation ?? '—'} />
                            <Row label="Monthly income" value={fmt(bank?.monthly_income)} />
                            <Row label="Source of funds" value={fmt(bank?.source_of_funds)} />
                        </div>

                        {/* Checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <div className="relative mt-0.5 flex-shrink-0">
                                <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                                <div className={`w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center transition-all ${agreed ? 'bg-[#E8632A] border-[#E8632A]' : 'bg-white border-[#E8E3DA]'}`}>
                                    {agreed && (
                                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                            <path d="M1 4l3.5 3.5 5.5-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-[#5C5751] leading-relaxed">
                                I confirm the information above is accurate and I agree to the{' '}
                                <a href="/terms" className="text-[#E8632A] hover:underline">Terms of Service</a> and{' '}
                                <a href="/privacy" className="text-[#E8632A] hover:underline">Privacy Policy</a>.
                            </span>
                        </label>

                        <div className="mt-auto pt-2">
                            <button
                                type="submit"
                                disabled={processing || !agreed}
                                className="w-full h-11 bg-[#E8632A] hover:bg-[#C4501F] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                {processing ? 'Opening your account...' : 'Open my account →'}
                            </button>
                            <p className="text-center text-[10px] text-[#C5BFB6] mt-4">🔒 Protected by 256-bit encryption</p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

Confirm.layout = () => null;