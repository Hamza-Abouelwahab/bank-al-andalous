
import { Head } from "@inertiajs/react";
import { History as HistoryIcon, TrendingUp } from "lucide-react";

export default function History({ loans }: any) {
    return (

        <>
            <Head title="Loan History" />

            <div className="min-h-screen bg-[#F8F6F1] p-6 dark:bg-[#1A1714]">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                            <HistoryIcon className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Loan History
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                View all your loan applications and details
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {loans && loans.length > 0 ? (
                        <div className="space-y-4">
                            {loans.map((loan: any) => (
                                <div
                                    key={loan.id}
                                    className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* LEFT SECTION */}
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                                Loan Amount
                                            </p>
                                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                                                {loan.amount.toLocaleString()} MAD
                                            </p>

                                            <div className="flex gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Duration</p>
                                                    <p className="font-bold text-slate-900 dark:text-white mt-1">{loan.months} months</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rate</p>
                                                    <p className="font-bold text-[#7a2800] dark:text-orange-400 mt-1">{loan.interest_rate}%</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT SECTION */}
                                        <div className="space-y-3">
                                            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:border-orange-900/30 dark:from-orange-900/10 dark:to-orange-900/5 p-4">
                                                <p className="text-xs font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-wide">Monthly Payment</p>
                                                <p className="font-extrabold text-orange-700 dark:text-orange-400 text-xl mt-2">
                                                    {loan.monthly_payment.toFixed(2)} MAD
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 p-3">
                                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Interest</p>
                                                    <p className="font-bold text-slate-900 dark:text-white mt-1">
                                                        {loan.total_interest.toFixed(2)} MAD
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl border border-[#7a2800]/20 dark:border-[#7a2800] bg-gradient-to-br from-[#7a2800]/5 to-orange-500/5 dark:from-[#7a2800]/20 dark:to-orange-900/20 p-3">
                                                    <p className="text-xs font-semibold text-[#7a2800] dark:text-orange-400 uppercase tracking-wide">Status</p>
                                                    <p className="font-bold text-[#7a2800] dark:text-orange-400 mt-1 capitalize">
                                                        {loan.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Total Repayment Progress</p>
                                        <div className="w-full h-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300"
                                                style={{
                                                    width: `${Math.min((loan.monthly_payment / loan.total_interest) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-12 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 mx-auto mb-4">
                                <HistoryIcon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                No loans applied yet
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                Your loan history will appear here once you apply
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>

        
    );
}