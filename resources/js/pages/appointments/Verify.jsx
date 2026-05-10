import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    AlertTriangle,
    CalendarDays,
    Clock,
    UserRound,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function VerifyAppointment() {
    const { appointment, errors, flash } = usePage().props;

    const confirmCheckIn = () => {
        router.post(`/appointments/check-in/${appointment.id}`, {}, {
        preserveScroll: true,
        onSuccess: () => {
            router.reload();
        },
        onError: (errors) => {
            console.log(errors);
        },
    });
    };
    const formatService = (service) => {
    switch (service) {
        case 'account_opening':
            return 'Account Opening';
        case 'loan_request':
            return 'Loan Request';
        case 'card_service':
            return 'Card Service';
        case 'customer_support':
            return 'Customer Support';
        case 'financial_advice':
            return 'Financial Advice';
        default:
            return service || 'Not selected';
    }
};

    return (
        <>
            <Head title="Verify Appointment" />

            <div className="min-h-screen bg-[#F8F6F1] p-6 text-[#171412] dark:bg-[#0F0D0B] dark:text-white">
                <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#ECE7DF] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                            <CheckCircle2 />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black">
                                Appointment Verification
                            </h1>
                            <p className="text-sm text-slate-500">
                                Confirm customer appointment before check-in.
                            </p>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {errors?.qr && (
                        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                            {errors.qr}
                        </div>
                    )}

                    <div className="space-y-4">
                        <InfoRow
                            icon={<UserRound />}
                            label="Customer"
                            value={appointment.user_name}
                        />
                        <InfoRow
                            icon={<CalendarDays />}
                            label="Date"
                            value={appointment.date}
                        />
                        <InfoRow
                            icon={<Clock />}
                            label="Time"
                            value={appointment.time}
                        />
                        <InfoRow
                            label="Type"
                            value={formatService(appointment.type)}
                        />
                        <InfoRow
                            label="Branch"
                            value={appointment.agent_name ?? 'No branch'}
                        />
                        <InfoRow label="Status" value={appointment.status} />
                    </div>

                    <div className="mt-6 flex justify-center rounded-3xl border border-orange-100 bg-white p-6 dark:border-orange-500/20">
                        <QRCodeSVG value={window.location.href} size={180} />
                    </div>

                    <div className="mt-6 rounded-2xl border p-4">
                        {appointment.is_valid ? (
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-black">
                                    Valid appointment
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-700">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="font-black">
                                    Invalid or already used appointment
                                </span>
                            </div>
                        )}
                    </div>

                    {appointment.can_check_in ? (
                        <button
                            onClick={confirmCheckIn}
                            disabled={!appointment.is_valid}
                            className="mt-6 w-full rounded-2xl bg-orange-600 px-5 py-4 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            Confirm Check-in
                        </button>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center text-sm font-bold text-orange-700">
                            Show this appointment QR/link to the bank staff
                            when you arrive at your branch.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-[#FFFCFA] p-4 dark:bg-[#252118]">
            <div className="flex items-center gap-3">
                {icon && <span className="text-orange-600">{icon}</span>}
                <span className="text-sm font-bold text-slate-500">
                    {label}
                </span>
            </div>

            <span className="font-black capitalize">{value}</span>
        </div>
    );
}
