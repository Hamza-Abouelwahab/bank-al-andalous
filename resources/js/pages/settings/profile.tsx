import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, Building2, CreditCard, Lock, Mail, MapPin, Phone, Save, Shield, User } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
    profile?: { phone?: string; address?: string } | null;
    bankAccount?: { account_number?: string; account_type?: string } | null;
    financialProfile?: { occupation?: string; employment_status?: string } | null;
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500';
const readonlyClass = 'w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 cursor-not-allowed select-none';

export default function Profile({ mustVerifyEmail, status, profile, bankAccount, financialProfile }: Props) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />
            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20">
                        <User size={24} className="text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h2>
                        <p className="text-sm text-slate-500">Manage your personal and account details</p>
                    </div>
                </div>

                {/* Read-only info cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <CreditCard size={13} className="text-orange-400" />
                            Account Number
                        </div>
                        <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {bankAccount?.account_number ?? <span className="text-slate-400">—</span>}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 capitalize">{bankAccount?.account_type ?? ''}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <Briefcase size={13} className="text-orange-400" />
                            Occupation
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {financialProfile?.occupation ?? <span className="text-slate-400">—</span>}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <Building2 size={13} className="text-orange-400" />
                            Employment
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">
                            {financialProfile?.employment_status ?? <span className="text-slate-400">—</span>}
                        </p>
                    </div>
                </div>

                {/* Editable form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">Editable fields</p>
                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <User size={14} className="text-orange-400" /> Full name
                                    </label>
                                    <input id="name" name="name" type="text" required autoComplete="name"
                                        defaultValue={auth.user.name} placeholder="Full name"
                                        className={inputClass} />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <Mail size={14} className="text-orange-400" /> Email address
                                    </label>
                                    <input id="email" name="email" type="email" required autoComplete="username"
                                        defaultValue={auth.user.email} placeholder="Email address"
                                        className={inputClass} />
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <Phone size={14} className="text-orange-400" /> Phone number
                                    </label>
                                    <input id="phone" name="phone" type="tel" autoComplete="tel"
                                        defaultValue={profile?.phone ?? ''} placeholder="+212 6XX XXX XXX"
                                        className={inputClass} />
                                    <InputError className="mt-1" message={(errors as any).phone} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <MapPin size={14} className="text-orange-400" /> Address
                                    </label>
                                    <input id="address" name="address" type="text" autoComplete="street-address"
                                        defaultValue={profile?.address ?? ''} placeholder="123 Street, City, Country"
                                        className={inputClass} />
                                    <InputError className="mt-1" message={(errors as any).address} />
                                </div>

                                {/* Read-only fields */}
                                <div className="grid gap-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                        <CreditCard size={14} /> Account number
                                        <Lock size={11} className="ml-auto text-slate-300" />
                                    </label>
                                    <div className={readonlyClass}>{bankAccount?.account_number ?? '—'}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                            <Briefcase size={14} /> Occupation
                                            <Lock size={11} className="ml-auto text-slate-300" />
                                        </label>
                                        <div className={readonlyClass}>{financialProfile?.occupation ?? '—'}</div>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                            <Building2 size={14} /> Employment
                                            <Lock size={11} className="ml-auto text-slate-300" />
                                        </label>
                                        <div className={readonlyClass + ' capitalize'}>{financialProfile?.employment_status ?? '—'}</div>
                                    </div>
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                                        <p className="text-sm text-amber-600 dark:text-amber-400">
                                            Your email address is unverified.{' '}
                                            <Link href={send()} as="button"
                                                className="font-semibold underline underline-offset-4 hover:text-amber-500">
                                                Resend verification email
                                            </Link>
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <p className="mt-1.5 text-sm font-medium text-green-600">
                                                A new verification link has been sent to your email address.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-1">
                                    <button type="submit" disabled={processing} data-test="update-profile-button"
                                        className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 disabled:opacity-60">
                                        {processing ? <Spinner /> : <Save size={15} />}
                                        Save changes
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Danger zone */}
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
                    <div className="mb-4 flex items-center gap-2">
                        <Shield size={16} className="text-red-500" />
                        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
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
