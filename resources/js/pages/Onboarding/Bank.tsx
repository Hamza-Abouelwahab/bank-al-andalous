import { useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Bank() {
    const {bank} = usePage().props as any
    const { data, setData, post, processing, errors } = useForm({
        account_type: bank?.account_type ??  '',
        employment_status: bank?.employment_status ?? '',
        occupation: bank?.occupation ?? '',
        monthly_income: bank?.monthly_income ?? '',
        source_of_funds: bank?.source_of_funds ?? '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/onboarding/bank');
    };

    const selectStyle = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%239C978F' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat' as const,
        backgroundPosition: 'right 12px center',
    };

    return (
        <div className="min-h-screen flex bg-[#FFFCF9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            <div className="hidden lg:flex w-[260px] flex-shrink-0 bg-[#0F0D0B] flex-col justify-between p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8632A] opacity-10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#E8632A] opacity-[0.07] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#E8632A] rounded-xl flex items-center justify-center font-bold text-white text-base" style={{ fontFamily: "'Syne', sans-serif" }}>B</div>
                    <span className="text-white font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>BankCo</span>
                </div>

                <div className="relative z-10">
                    <div className="text-[#E8632A] text-[10px] font-medium uppercase tracking-[2.5px] mb-5">Account setup</div>
                    {[
                        { num: '✓', label: 'Personal info', state: 'done' },
                        { num: '02', label: 'Financial profile', state: 'active' },
                        { num: '03', label: 'Confirmation', state: 'inactive' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                s.state === 'done' ? 'bg-[#E8632A] text-white' :
                                s.state === 'active' ? 'bg-white text-[#0F0D0B]' :
                                'bg-white/[0.07] text-white/20 border border-white/10'
                            }`} style={{ fontFamily: "'Syne', sans-serif" }}>
                                {s.num}
                            </div>
                            <span className={`text-sm ${
                                s.state === 'done' ? 'text-[#E8632A]' :
                                s.state === 'active' ? 'text-white font-medium' : 'text-white/25'
                            }`}>{s.label}</span>
                            {s.state === 'active' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8632A]" />}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 text-white/20 text-[10px] leading-relaxed">
                    256-bit encryption<br />Your data is never shared
                </div>
            </div>

            <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto">
                <div className="w-full h-0.5 bg-[#EDE8E0] rounded-full mb-10 overflow-hidden">
                    <div className="h-full bg-[#E8632A] rounded-full transition-all duration-500" style={{ width: '66%' }} />
                </div>

                <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-[#E8632A] rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
                        <span className="font-bold text-[#0F0D0B]" style={{ fontFamily: "'Syne', sans-serif" }}>BankCo</span>
                    </div>

                    <div className="mb-8">
                        <div className="text-[#E8632A] text-[10px] font-medium uppercase tracking-[2.5px] mb-2">Step 2 of 3</div>
                        <h1 className="text-[28px] font-extrabold text-[#0F0D0B] leading-tight tracking-tight mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Financial<br />profile
                        </h1>
                        <p className="text-[#9C978F] text-sm">Required by banking regulations. Never shared with third parties.</p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-5 flex-1">

                        <div>
                            <label className="block text-[10px] font-medium text-[#9C978F] uppercase tracking-[2px] mb-3">Account type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'savings', label: 'Savings', icon: '🏦', desc: 'Earn interest on balance' },
                                    { value: 'current', label: 'Current', icon: '💳', desc: 'Day-to-day transactions' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setData('account_type', opt.value)}
                                        className={`p-4 rounded-xl border-[1.5px] text-left transition-all ${
                                            data.account_type === opt.value
                                                ? 'border-[#E8632A] bg-[#FFF0E8]'
                                                : 'border-[#E8E3DA] bg-white hover:border-[#C5BFB6]'
                                        }`}
                                    >
                                        <span className="text-xl">{opt.icon}</span>
                                        <div className="font-bold text-sm text-[#0F0D0B] mt-2" style={{ fontFamily: "'Syne', sans-serif" }}>{opt.label}</div>
                                        <div className="text-xs text-[#9C978F] mt-0.5">{opt.desc}</div>
                                    </button>
                                ))}
                            </div>
                            {errors.account_type && <p className="text-red-500 text-xs mt-1.5">{errors.account_type}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-medium text-[#9C978F] uppercase tracking-[2px] mb-2">Employment</label>
                                <select value={data.employment_status} onChange={e => setData('employment_status', e.target.value)}
                                    className="w-full h-11 border-[1.5px] border-[#E8E3DA] rounded-xl px-3 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-white transition-colors appearance-none"
                                    style={selectStyle}>
                                    <option value="">Select...</option>
                                    <option value="employed">Employed</option>
                                    <option value="self_employed">Self employed</option>
                                    <option value="business_owner">Business owner</option>
                                    <option value="student">Student</option>
                                    <option value="retired">Retired</option>
                                    <option value="unemployed">Unemployed</option>
                                </select>
                                {errors.employment_status && <p className="text-red-500 text-xs mt-1.5">{errors.employment_status}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-[#9C978F] uppercase tracking-[2px] mb-2">Occupation</label>
                                <input type="text" value={data.occupation} onChange={e => setData('occupation', e.target.value)}
                                    placeholder="e.g. Engineer"
                                    className="w-full h-11 border-[1.5px] border-[#E8E3DA] rounded-xl px-4 text-sm text-[#0F0D0B] placeholder-[#C5BFB6] focus:outline-none focus:border-[#E8632A] bg-white transition-colors"
                                />
                                {errors.occupation && <p className="text-red-500 text-xs mt-1.5">{errors.occupation}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-medium text-[#9C978F] uppercase tracking-[2px] mb-2">Monthly income</label>
                                <select value={data.monthly_income} onChange={e => setData('monthly_income', e.target.value)}
                                    className="w-full h-11 border-[1.5px] border-[#E8E3DA] rounded-xl px-3 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-white transition-colors appearance-none"
                                    style={selectStyle}>
                                    <option value="">Select...</option>
                                    <option value="3000">Under 3,000 MAD</option>
                                    <option value="6000">3,000–6,000 MAD</option>
                                    <option value="12000">6,000–12,000 MAD</option>
                                    <option value="25000">12,000–25,000 MAD</option>
                                    <option value="30000">25,000+ MAD</option>
                                </select>
                                {errors.monthly_income && <p className="text-red-500 text-xs mt-1.5">{errors.monthly_income}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-[#9C978F] uppercase tracking-[2px] mb-2">Source of funds</label>
                                <select value={data.source_of_funds} onChange={e => setData('source_of_funds', e.target.value)}
                                    className="w-full h-11 border-[1.5px] border-[#E8E3DA] rounded-xl px-3 text-sm text-[#0F0D0B] focus:outline-none focus:border-[#E8632A] bg-white transition-colors appearance-none"
                                    style={selectStyle}>
                                    <option value="">Select...</option>
                                    <option value="salary">Salary</option>
                                    <option value="business">Business</option>
                                    <option value="investments">Investments</option>
                                    <option value="savings">Savings</option>
                                    <option value="freelance">freelance</option>
                                    <option value="family_support">Family support</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.source_of_funds && <p className="text-red-500 text-xs mt-1.5">{errors.source_of_funds}</p>}
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-[#E8632A] hover:bg-[#C4501F] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                {processing ? 'Saving...' : 'Review & confirm →'}
                            </button>
                            <p className="text-center text-[10px] text-[#C5BFB6] mt-4">🔒 Protected by 256-bit encryption</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

Bank.layout = () => null;
