import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';
import { useState } from 'react';
import { useRef } from 'react';





export default function Register() {

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

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
                        <div className="flex flex-col items-center gap-3">

                            {/* PREVIEW (CLICKABLE) */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border cursor-pointer hover:opacity-80 transition"
                            >
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                        Photo
                                    </div>
                                )}
                            </div>

                            {/* HIDDEN INPUT */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="avatar"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            {/* OPTIONAL TEXT */}
                            <span className="text-xs text-slate-500">
                                Click image to upload
                            </span>

                        </div>

                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-slate-700">Full name</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">Confirm password</label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <button
                                type="submit"
                                tabIndex={5}
                                data-test="register-user-button"
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 disabled:opacity-60"
                            >
                                {processing && <Spinner />}
                                Create account
                            </button>
                        </div>

                        <div className="text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" tabIndex={6} className="font-semibold text-orange-500 hover:text-orange-400">
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
