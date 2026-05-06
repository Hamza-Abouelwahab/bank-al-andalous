import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

export default function LoanSimulation() {
    const [amount, setAmount] = useState(130000);
    const [months, setMonths] = useState(36);
    const [rate, setRate] = useState(5);

    const [result, setResult] = useState({
        monthly: 0,
        total: 0,
        interest: 0,
    });

    useEffect(() => {
        axios.post("/loan/simulate", {
            amount,
            months,
            rate,
        }).then(res => setResult(res.data));
    }, [amount, months, rate]);

    // ✅ REAL PERCENTAGE
    const percentage =
        result.total > 0
            ? (result.interest / result.total) * 100
            : 0;

    return (
        <div className="p-6 bg-[#F8F6F1] h-full overflow-auto">
            <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">

                {/* LEFT CARD */}
                <div className="bg-white p-6 rounded-3xl border border-[#EDE8E0]">

                    <h2 className="text-xl font-bold mb-2">
                        Loan Calculator
                    </h2>

                    <p className="text-sm text-[#9C978F] mb-6">
                        Calculate your loan and see real monthly payments
                    </p>

                    {/* ICONS */}
                    <div className="flex gap-4 mb-6">
                        {["🏠", "🚗", "✈️", "➕"].map((icon, i) => (
                            <div
                                key={i}
                                className="w-14 h-14 bg-[#F8F6F1] rounded-xl flex items-center justify-center text-xl border border-[#EDE8E0]"
                            >
                                {icon}
                            </div>
                        ))}
                    </div>

                    {/* AMOUNT */}
                    <div className="mb-6">
                        <label className="flex justify-between text-sm mb-2">
                            <span>Loan Amount</span>
                            <span className="font-semibold">
                                {amount.toLocaleString()} MAD
                            </span>
                        </label>

                        <input
                            type="range"
                            min="10000"
                            max="500000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full accent-[#E8632A]"
                        />
                    </div>

                    {/* TERM */}
                    <div className="mb-6">
                        <label className="flex justify-between text-sm mb-2">
                            <span>Loan Term</span>
                            <span className="font-semibold">
                                {months} months
                            </span>
                        </label>

                        <input
                            type="range"
                            min="6"
                            max="120"
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="w-full accent-[#E8632A]"
                        />
                    </div>

                    {/* RATE */}
                    <div className="mb-6">
                        <label className="flex justify-between text-sm mb-2">
                            <span>Interest Rate</span>
                            <span className="font-semibold">{rate}%</span>
                        </label>

                        <input
                            type="range"
                            min="1"
                            max="15"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full accent-[#E8632A]"
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col gap-6">

                    {/* DONUT CARD */}
                    <div className="bg-white p-6 rounded-3xl border border-[#EDE8E0] flex items-center justify-between">

                        {/* ✅ REAL DONUT */}
                        <div className="relative w-40 h-40 flex items-center justify-center">

                            <div
                                className="absolute w-full h-full rounded-full"
                                style={{
                                    background: `conic-gradient(
                                        #E8632A ${percentage}%,
                                        #F3D2C4 ${percentage}%
                                    )`,
                                    transition: "all 0.4s ease"
                                }}
                            />

                            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                                <div className="text-center">
                                    <p className="text-xs text-[#9C978F]">
                                        Monthly
                                    </p>
                                    <p className="font-bold text-sm">
                                        {result.monthly.toFixed(2)} MAD
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="text-sm">
                            <p className="mb-2">
                                <span className="font-semibold">
                                    Total Payment
                                </span><br />
                                {result.total.toFixed(2)} MAD
                            </p>

                            <p className="mb-2">
                                <span className="text-[#E8632A]">●</span> Interest<br />
                                {result.interest.toFixed(2)} MAD
                            </p>

                            <p>
                                <span className="text-gray-300">●</span> Loan Amount<br />
                                {amount.toLocaleString()} MAD
                            </p>
                        </div>
                    </div>

                    {/* ACTION CARD */}
                    <div className="bg-white p-6 rounded-3xl border border-[#EDE8E0]">

                        {/* HISTORY LINK */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href="/loan/history"
                                className="text-sm font-semibold text-[#E8632A] hover:underline"
                            >
                                View History →
                            </Link>
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                            <div>
                                <p className="text-[#9C978F]">Start date</p>
                                <p className="font-medium">Today</p>
                            </div>
                            <div>
                                <p className="text-[#9C978F]">End date</p>
                                <p className="font-medium">
                                    {months} months later
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button className="flex-1 py-3 rounded-xl bg-[#F8F6F1] border border-[#EDE8E0]">
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    axios.post("/loan/apply", {
                                        amount,
                                        months,
                                        rate
                                    }).then(() => {
                                        alert("Loan applied ✅");
                                    });
                                }}
                                className="flex-1 py-3 rounded-xl bg-[#E8632A] text-white font-semibold hover:opacity-90"
                            >
                                Apply Loan
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}