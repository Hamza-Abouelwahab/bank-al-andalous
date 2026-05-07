import { Wallet } from "lucide-react";

export default function Loans({ loans }: any) {
    return (
        <div className="min-h-screen bg-[#F8F6F1] p-6 dark:bg-[#1A1714]">
            {/* Page Header */}
            <div className="mb-8 animate-fade-in max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                        <Wallet className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            My Loans
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                            Manage and track your active loans
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {loans && loans.length > 0 ? (
                    <div className="grid gap-4">
                        {loans.map((loan: any) => (
                            <div
                                key={loan.id}
                                className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] hover:shadow-lg transition-all duration-200"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                            Loan Amount
                                        </p>
                                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                            {loan.amount.toLocaleString()} MAD
                                        </p>
                                    </div>

                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wide mb-1">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                                                loan.status === 'approved'
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                                    : loan.status === 'pending'
                                                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-500'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-12 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 mx-auto mb-4">
                            <Wallet className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                            No loans applied yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}