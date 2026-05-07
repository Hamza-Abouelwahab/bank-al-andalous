import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] =
        useState<boolean>(false);

    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="-m-6 min-h-screen space-y-8 bg-[#f8f6f1] p-6 text-[#1f1a17] dark:bg-[#0F0D0B] dark:text-white sm:-m-8 sm:p-8">

                {/* Password Section */}
                <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                    <Heading
                        variant="small"
                        title="Update password"
                        description="Ensure your account is using a long, random password to stay secure"
                    />

                    <Form
                        {...SecurityController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="mt-6 space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="current_password"
                                        className="text-[#1f1a17] dark:text-white"
                                    >
                                        Current password
                                    </Label>

                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="mt-1 block w-full rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] dark:border-[#2A2520] dark:bg-[#241b16]"
                                        autoComplete="current-password"
                                        placeholder="Current password"
                                    />

                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-[#1f1a17] dark:text-white"
                                    >
                                        New password
                                    </Label>

                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="mt-1 block w-full rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] dark:border-[#2A2520] dark:bg-[#241b16]"
                                        autoComplete="new-password"
                                        placeholder="New password"
                                    />

                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-[#1f1a17] dark:text-white"
                                    >
                                        Confirm password
                                    </Label>

                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="mt-1 block w-full rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] dark:border-[#2A2520] dark:bg-[#241b16]"
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="cursor-pointer rounded-xl bg-orange-600 text-white hover:bg-[#7a2800]"
                                    >
                                        Save password
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Two Factor */}
                {canManageTwoFactor && (
                    <div className="rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                        <Heading
                            variant="small"
                            title="Two-factor authentication"
                            description="Manage your two-factor authentication settings"
                        />

                        <div className="mt-6">
                            {twoFactorEnabled ? (
                                <div className="flex flex-col items-start justify-start space-y-4">
                                    <p className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                        You will be prompted for a secure,
                                        random pin during login.
                                    </p>

                                    <div className="relative inline">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <Button
                                                    variant="destructive"
                                                    type="submit"
                                                    disabled={processing}
                                                    className="cursor-pointer bg-orange-600 hover:bg-[#7a2800]"
                                                >
                                                    Disable 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    </div>

                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={errors}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-start justify-start space-y-4">
                                    <p className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                        When you enable two-factor
                                        authentication, you will be prompted
                                        for a secure pin during login.
                                    </p>

                                    <div>
                                        {hasSetupData ? (
                                            <Button
                                                onClick={() =>
                                                    setShowSetupModal(true)
                                                }
                                                className="cursor-pointer bg-orange-600 hover:bg-[#7a2800]"
                                            >
                                                <ShieldCheck />
                                                Continue setup
                                            </Button>
                                        ) : (
                                            <Form
                                                {...enable.form()}
                                                onSuccess={() =>
                                                    setShowSetupModal(true)
                                                }
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="cursor-pointer bg-orange-600 hover:bg-[#7a2800]"
                                                    >
                                                        Enable 2FA
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};