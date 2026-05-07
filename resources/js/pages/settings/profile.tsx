import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    CreditCard,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
} from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import TwoFactorSettings from '@/components/two-factor-settings';

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
    profile?: { phone?: string; address?: string } | null;
    bankAccount?: { account_number?: string; account_type?: string } | null;
    financialProfile?: { occupation?: string; employment_status?: string } | null;
};

const inputClass =
    'w-full rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] px-4 py-2.5 text-sm text-[#1f1a17] outline-none transition placeholder:text-[#1f1a17]/35 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-[#2A2520] dark:bg-[#241b16] dark:text-white dark:placeholder:text-white/35';

const readonlyClass =
    'w-full cursor-not-allowed select-none rounded-xl border border-[#EDE8E0] bg-[#f8f6f1]/70 px-4 py-2.5 text-sm text-[#1f1a17]/55 dark:border-[#2A2520] dark:bg-[#241b16]/70 dark:text-white/50';

export default function Profile({
    mustVerifyEmail,
    status,
    profile,
    bankAccount,
    financialProfile,
}: Props) {
    const { auth, user } = usePage().props as any;

    return (
        <>
            <Head title="Profile settings" />
            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-8 text-[#1f1a17] dark:text-white">
                {/* Header */}
                <div className="flex items-center gap-4">
                    {auth.user.avatar ? (
                        <div className="h-14 w-14 overflow-hidden rounded-2xl border border-[#EDE8E0] dark:border-[#2A2520]">
                            <img
                                src={`/storage/${auth.user.avatar}`}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20">
                            <User size={24} className="text-orange-500" />
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-bold text-[#1f1a17] dark:text-white">
                            Profile Information
                        </h2>
                        <p className="text-sm text-[#1f1a17]/55 dark:text-white/55">
                            Manage your personal and account details
                        </p>
                    </div>
                </div>

                {/* Read-only info cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1f1a17]/45 dark:text-white/45">
                            <CreditCard size={13} className="text-orange-500" />
                            Account Number
                        </div>
                        <p className="font-mono text-sm font-semibold text-[#1f1a17] dark:text-white">
                            {bankAccount?.account_number ?? (
                                <span className="text-[#1f1a17]/40 dark:text-white/40">
                                    —
                                </span>
                            )}
                        </p>
                        <p className="mt-1 text-xs capitalize text-[#1f1a17]/45 dark:text-white/45">
                            {bankAccount?.account_type ?? ''}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1f1a17]/45 dark:text-white/45">
                            <Briefcase size={13} className="text-orange-500" />
                            Occupation
                        </div>
                        <p className="text-sm font-semibold text-[#1f1a17] dark:text-white">
                            {financialProfile?.occupation ?? (
                                <span className="text-[#1f1a17]/40 dark:text-white/40">
                                    —
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#EDE8E0] bg-white p-5 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1f1a17]/45 dark:text-white/45">
                            <Building2 size={13} className="text-orange-500" />
                            Employment
                        </div>
                        <p className="text-sm font-semibold capitalize text-[#1f1a17] dark:text-white">
                            {financialProfile?.employment_status ?? (
                                <span className="text-[#1f1a17]/40 dark:text-white/40">
                                    —
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Editable form */}
                <div className="rounded-2xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-[#1f1a17]/45 dark:text-white/45">
                        Editable fields
                    </p>

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="name"
                                        className="flex items-center gap-2 text-sm font-medium text-[#1f1a17]/75 dark:text-white/75"
                                    >
                                        <User size={14} className="text-orange-500" />
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        defaultValue={auth.user.name}
                                        placeholder="Full name"
                                        className={inputClass}
                                    />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="email"
                                        className="flex items-center gap-2 text-sm font-medium text-[#1f1a17]/75 dark:text-white/75"
                                    >
                                        <Mail size={14} className="text-orange-500" />
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="username"
                                        defaultValue={auth.user.email}
                                        placeholder="Email address"
                                        className={inputClass}
                                    />
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="phone"
                                        className="flex items-center gap-2 text-sm font-medium text-[#1f1a17]/75 dark:text-white/75"
                                    >
                                        <Phone size={14} className="text-orange-500" />
                                        Phone number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        defaultValue={profile?.phone ?? ''}
                                        placeholder="+212 6XX XXX XXX"
                                        className={inputClass}
                                    />
                                    <InputError
                                        className="mt-1"
                                        message={(errors as any).phone}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="address"
                                        className="flex items-center gap-2 text-sm font-medium text-[#1f1a17]/75 dark:text-white/75"
                                    >
                                        <MapPin size={14} className="text-orange-500" />
                                        Address
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        autoComplete="street-address"
                                        defaultValue={profile?.address ?? ''}
                                        placeholder="123 Street, City, Country"
                                        className={inputClass}
                                    />
                                    <InputError
                                        className="mt-1"
                                        message={(errors as any).address}
                                    />
                                </div>

                                {/* Read-only fields */}
                                <div className="grid gap-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-[#1f1a17]/45 dark:text-white/45">
                                        <CreditCard size={14} />
                                        Account number
                                        <Lock
                                            size={11}
                                            className="ml-auto text-[#1f1a17]/30 dark:text-white/30"
                                        />
                                    </label>
                                    <div className={readonlyClass}>
                                        {bankAccount?.account_number ?? '—'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-[#1f1a17]/45 dark:text-white/45">
                                            <Briefcase size={14} />
                                            Occupation
                                            <Lock
                                                size={11}
                                                className="ml-auto text-[#1f1a17]/30 dark:text-white/30"
                                            />
                                        </label>
                                        <div className={readonlyClass}>
                                            {financialProfile?.occupation ?? '—'}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-[#1f1a17]/45 dark:text-white/45">
                                            <Building2 size={14} />
                                            Employment
                                            <Lock
                                                size={11}
                                                className="ml-auto text-[#1f1a17]/30 dark:text-white/30"
                                            />
                                        </label>
                                        <div className={readonlyClass + ' capitalize'}>
                                            {financialProfile?.employment_status ?? '—'}
                                        </div>
                                    </div>
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-semibold underline underline-offset-4 hover:text-amber-500"
                                                >
                                                    Resend verification email
                                                </Link>
                                            </p>

                                            {status === 'verification-link-sent' && (
                                                <p className="mt-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
                                                    A new verification link has been sent
                                                    to your email address.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-3 pt-1">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#7a2800] disabled:opacity-60"
                                    >
                                        {processing ? <Spinner /> : <Save size={15} />}
                                        Save changes
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Two Factor Authentication */}
                <div className="rounded-2xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                    <div className="mb-4 flex items-center gap-2">
                        <Shield size={16} className="text-orange-500" />
                        <h3 className="text-sm font-semibold text-[#1f1a17] dark:text-white">
                            Security
                        </h3>
                    </div>

                    <TwoFactorSettings user={user} />
                </div>

                {/* Danger zone */}
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-500/30 dark:bg-red-950/20">
                    <div className="mb-4 flex items-center gap-2">
                        <Shield size={16} className="text-red-500" />
                        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                            Danger Zone
                        </h3>
                    </div>

                    <DeleteUser />
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};