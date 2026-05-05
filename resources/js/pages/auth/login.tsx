import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            {/* ✅ Success message */}
            {status && (
                <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-center text-sm font-medium text-green-500">
                    {status}
                </div>
            )}

            {/* 🔐 Security Notice */}
            <div className="mb-4 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-600">
                For your security, you may be asked to enter a verification code after login.
            </div>

            <Form
                action="/login"
                method="post"
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="border-slate-200 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-orange-500 hover:text-orange-400"
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                <PasswordInput
                                    id="password"
                                    name="password"
                                    typeof='password'
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="border-slate-200 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500/20"
                                />

                                <InputError message={errors.password} />
                            </div>

                            {/* Remember */}
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <Label htmlFor="remember" className="text-sm text-slate-600">
                                    Remember me
                                </Label>
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 disabled:opacity-60"
                            >
                                {processing && <Spinner />}
                                {processing ? 'Signing in...' : 'Log in'}
                            </button>

                            {/* 🔐 Security footer */}
                            <div className="text-center text-xs text-slate-400">
                                🔐 Protected by secure authentication
                            </div>
                        </div>

                        {/* Register */}
                        {canRegister && (
                            <div className="text-center text-sm text-slate-500">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="font-semibold text-orange-500 hover:text-orange-400"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};