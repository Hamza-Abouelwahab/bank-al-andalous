import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';
import { useState, useRef } from 'react';

export default function Register() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

    const labelClass =
        'text-sm font-medium text-slate-700 dark:text-slate-300';

    const inputClass =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-[#2A2520] dark:bg-[#241b16] dark:text-white dark:placeholder:text-white/40';

    return (
        <>
            <Head title="Register" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-3">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-20 w-20 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-slate-100 transition hover:opacity-80 dark:border-[#2A2520] dark:bg-[#241b16]"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-white/40">
                                        Photo
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                name="avatar"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                        setPreview(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />

                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Click image to upload
                            </span>
                        </div>

                        {/* Form */}
                        <div className="grid gap-5">
                            {/* Name */}
                            <div className="grid gap-2">
                                <label
                                    htmlFor="name"
                                    className={labelClass}
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className={inputClass}
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <label
                                    htmlFor="email"
                                    className={labelClass}
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className={inputClass}
                                />

                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <label
                                    htmlFor="password"
                                    className={labelClass}
                                >
                                    Password
                                </label>

                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 dark:border-[#2A2520] dark:bg-[#241b16] dark:text-white dark:placeholder:text-white/40"
                                />

                                <InputError
                                    message={errors.password}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-2">
                                <label
                                    htmlFor="password_confirmation"
                                    className={labelClass}
                                >
                                    Confirm password
                                </label>

                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 dark:border-[#2A2520] dark:bg-[#241b16] dark:text-white dark:placeholder:text-white/40"
                                />

                                <InputError
                                    message={
                                        errors.password_confirmation
                                    }
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                tabIndex={5}
                                data-test="register-user-button"
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-bold text-white transition hover:bg-[#7a2800] disabled:opacity-60"
                            >
                                {processing && <Spinner />}
                                Create account
                            </button>
                        </div>

                        {/* Login */}
                        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                tabIndex={6}
                                className="font-semibold text-orange-500 hover:text-orange-400"
                            >
                                Log in
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};