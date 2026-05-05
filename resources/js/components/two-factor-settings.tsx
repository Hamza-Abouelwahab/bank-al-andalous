import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function TwoFactorSettings({ user }: any) {
    const { post, processing } = useForm();

    const enable = () => {
        post('/user/two-factor-authentication');
    };

    const confirm = (code: string) => {
        post('/user/confirmed-two-factor-authentication', {
            data: { code },
        });
    };

    return (
        <div className="rounded-2xl border p-6">
            <h3 className="text-lg font-bold">Two-Factor Authentication</h3>

            {!user.two_factor_secret && (
                <div className="mt-4">
                    <p className="text-sm text-slate-500">
                        Add extra security to your account.
                    </p>

                    <Button
                        onClick={enable}
                        disabled={processing}
                        className="mt-4 bg-orange-500"
                    >
                        Enable 2FA
                    </Button>
                </div>
            )}

            {user.two_factor_secret && !user.two_factor_confirmed_at && (
                <div className="mt-4">
                    <p className="text-sm text-slate-500">
                        Scan this QR code with Google Authenticator
                    </p>

                    {/* QR CODE */}
                    <div
                        className="mt-4"
                        dangerouslySetInnerHTML={{
                            __html: user.two_factor_qr_code,
                        }}
                    />

                    {/* CONFIRM INPUT */}
                    <input
                        type="text"
                        placeholder="Enter code"
                        className="mt-4 w-full rounded-lg border p-2"
                        onBlur={(e) => confirm(e.target.value)}
                    />
                </div>
            )}


            {user.two_factor_confirmed_at && user.two_factor_recovery_codes?.length > 0 && (
                <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700">
                        Recovery Codes
                    </p>

                    <p className="mb-2 text-xs text-slate-500">
                        Save these codes somewhere safe. Each code can be used once.
                    </p>

                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-3">
                        {user.two_factor_recovery_codes.map((code: string, i: number) => (
                            <div
                                key={i}
                                className="font-mono text-xs text-slate-700"
                            >
                                {code}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {user.two_factor_confirmed_at && (
                <p className="mt-4 text-green-600">
                    2FA is enabled ✅
                </p>
            )}
        </div>
    );
}