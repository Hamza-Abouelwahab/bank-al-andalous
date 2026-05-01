import { useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Profile() {
    const {profile} = usePage().props as any
    const { data, setData, post, processing, errors } = useForm({
        date_of_birth: profile?.date_of_birth ?? '',
        cin: profile?.cin?? '',
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/onboarding/profile');
    };

    return (
        <div
            className="flex min-h-screen bg-[#FFFCF9]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <div className="relative hidden w-[260px] flex-shrink-0 flex-col justify-between overflow-hidden bg-[#0F0D0B] p-8 lg:flex">
                <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8632A] opacity-10" />
                <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#E8632A] opacity-[0.07]" />

                <div className="relative z-10 flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8632A] text-base font-bold text-white"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        B
                    </div>
                    <span
                        className="text-base font-bold text-white"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        BankCo
                    </span>
                </div>

                <div className="relative z-10">
                    <div className="mb-5 text-[10px] font-medium tracking-[2.5px] text-[#E8632A] uppercase">
                        Account setup
                    </div>
                    {[
                        { num: '01', label: 'Personal info', state: 'active' },
                        {
                            num: '02',
                            label: 'Financial profile',
                            state: 'inactive',
                        },
                        { num: '03', label: 'Confirmation', state: 'inactive' },
                    ].map((s) => (
                        <div
                            key={s.num}
                            className="mb-4 flex items-center gap-3"
                        >
                            <div
                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    s.state === 'active'
                                        ? 'bg-white text-[#0F0D0B]'
                                        : 'border border-white/10 bg-white/[0.07] text-white/20'
                                }`}
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                {s.num}
                            </div>
                            <span
                                className={`text-sm ${s.state === 'active' ? 'font-medium text-white' : 'text-white/25'}`}
                            >
                                {s.label}
                            </span>
                            {s.state === 'active' && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#E8632A]" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 text-[10px] leading-relaxed text-white/20">
                    256-bit encryption
                    <br />
                    Your data is never shared
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-8 lg:p-12">
                <div className="mb-10 h-0.5 w-full overflow-hidden rounded-full bg-[#EDE8E0]">
                    <div
                        className="h-full rounded-full bg-[#E8632A] transition-all duration-500"
                        style={{ width: '33%' }}
                    />
                </div>

                <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8632A] text-sm font-bold text-white">
                            B
                        </div>
                        <span
                            className="font-bold text-[#0F0D0B]"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            BankCo
                        </span>
                    </div>

                    <div className="mb-8">
                        <div className="mb-2 text-[10px] font-medium tracking-[2.5px] text-[#E8632A] uppercase">
                            Step 1 of 3
                        </div>
                        <h1
                            className="mb-2 text-[28px] leading-tight font-extrabold tracking-tight text-[#0F0D0B]"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            Personal
                            <br />
                            details
                        </h1>
                        <p className="text-sm text-[#9C978F]">
                            We need a few details to verify your identity.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="flex flex-1 flex-col gap-5"
                    >
                        <div>
                            <label className="mb-2 block text-[10px] font-medium tracking-[2px] text-[#9C978F] uppercase">
                                CIN
                            </label>

                            <input
                                type="text"
                                name="cin"
                                autoComplete="off"
                                maxLength={8}
                                value={data.cin}
                                onChange={(e) => {
                                    let value = e.target.value.toUpperCase();
                                    value = value.replace(/[^A-Z0-9]/g, '');
                                    setData('cin', value);
                                }}
                                placeholder="AB123456"
                                className="h-11 w-full rounded-xl border-[1.5px] border-[#E8E3DA] bg-white px-4 text-sm text-[#0F0D0B] placeholder-[#C5BFB6] transition-colors focus:border-[#E8632A] focus:outline-none"
                            />

                            {errors.cin && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    Format: AB123456
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-medium tracking-[2px] text-[#9C978F] uppercase">
                                Phone number
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                placeholder="+212 6XX XXX XXX"
                                className="h-11 w-full rounded-xl border-[1.5px] border-[#E8E3DA] bg-white px-4 text-sm text-[#0F0D0B] placeholder-[#C5BFB6] transition-colors focus:border-[#E8632A] focus:outline-none"
                            />
                            {errors.phone && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-[10px] font-medium tracking-[2px] text-[#9C978F] uppercase">
                                Date of birth
                            </label>
                            <input
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) =>
                                    setData('date_of_birth', e.target.value)
                                }
                                className="h-11 w-full rounded-xl border-[1.5px] border-[#E8E3DA] bg-white px-4 text-sm text-[#0F0D0B] transition-colors focus:border-[#E8632A] focus:outline-none"
                            />
                            {errors.date_of_birth && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.date_of_birth}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-medium tracking-[2px] text-[#9C978F] uppercase">
                                Address
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                rows={3}
                                placeholder="Your full residential address"
                                className="w-full resize-none rounded-xl border-[1.5px] border-[#E8E3DA] bg-white px-4 py-3 text-sm text-[#0F0D0B] placeholder-[#C5BFB6] transition-colors focus:border-[#E8632A] focus:outline-none"
                            />
                            {errors.address && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div className="mt-auto pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="h-11 w-full rounded-xl bg-[#E8632A] text-sm font-bold text-white transition-colors hover:bg-[#C4501F] disabled:opacity-50"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                {processing
                                    ? 'Saving...'
                                    : 'Continue to step 2 →'}
                            </button>
                            <p className="mt-4 text-center text-[10px] text-[#C5BFB6]">
                                🔒 Protected by 256-bit encryption
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

Profile.layout = () => null;
