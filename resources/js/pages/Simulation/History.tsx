

export default function History({ loans }: any) {
    return (
        <div className="p-6 bg-[#F8F6F1] min-h-screen">
            <h1 className="text-2xl font-bold mb-6">
                My Loans
            </h1>

            {loans.length === 0 ? (
                <p className="text-gray-500">
                    No loans applied yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {loans.map((loan: any) => (
                        <div
                            key={loan.id}
                            className="bg-white p-5 rounded-2xl border border-[#EDE8E0] shadow-sm"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">
                                        {loan.amount.toLocaleString()} MAD
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {loan.months} months • {loan.interest_rate}%
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[#E8632A] font-semibold">
                                        {loan.monthly_payment.toFixed(2)} MAD / month
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Interest: {loan.total_interest.toFixed(2)} MAD
                                    </p>
                                    <p className="text-xs mt-1">
                                        Status: <span className="font-semibold">
                                            {loan.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}