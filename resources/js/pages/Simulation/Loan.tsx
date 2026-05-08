import { useState, useEffect } from "react";
import axios from "axios";
import { Head, Link } from "@inertiajs/react";
import { Calculator, TrendingUp, ArrowRight } from "lucide-react";

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
        
        <>
            <Head title="Loan Simulator" />

            <div className="min-h-screen bg-[#F8F6F1] p-6 dark:bg-[#1A1714]">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                            <Calculator className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Loan Simulator
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                Calculate your loan and see real monthly payments
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">

                    {/* LEFT CARD */}
                    <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">

                        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
                            Loan Amount
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Choose your loan amount between 10K and 500K MAD
                        </p>

                        {/* LOAN PURPOSE ICONS */}
                        <div className="flex gap-3 mb-8">
                            {[{ icon: "🏠", label: "Home" }, { icon: "🚗", label: "Car" }, { icon: "✈️", label: "Travel" }].map((item, i) => (
                                <button
                                    key={i}
                                    className="flex-1 h-14 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-900/10 dark:to-orange-900/5 rounded-2xl flex flex-col items-center justify-center text-2xl border border-orange-200 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
                                >
                                    <span>{item.icon}</span>
                                </button>
                            ))}
                        </div>

                        {/* AMOUNT SLIDER */}
                        <div className="mb-8">
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="text-sm font-bold text-slate-900 dark:text-white">
                                    Loan Amount
                                </label>
                                <span className="text-xl font-bold text-orange-600 dark:text-orange-500">
                                    {amount.toLocaleString()} MAD
                                </span>
                            </div>

                            <input
                                type="range"
                                min="10000"
                                max="500000"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full h-2 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg appearance-none cursor-pointer accent-orange-600 dark:accent-orange-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                                <span>10K MAD</span>
                                <span>500K MAD</span>
                            </div>
                        </div>

                        {/* TERM SLIDER */}
                        <div className="mb-8">
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="text-sm font-bold text-slate-900 dark:text-white">
                                    Loan Term
                                </label>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    {months} months
                                </span>
                            </div>

                            <input
                                type="range"
                                min="6"
                                max="120"
                                value={months}
                                onChange={(e) => setMonths(Number(e.target.value))}
                                className="w-full h-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-600 dark:accent-orange-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                                <span>6 months</span>
                                <span>10 years</span>
                            </div>
                        </div>

                        {/* RATE SLIDER */}
                        <div>
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="text-sm font-bold text-slate-900 dark:text-white">
                                    Interest Rate
                                </label>
                                <span className="text-xl font-bold text-[#7a2800] dark:text-orange-400">
                                    {rate.toFixed(1)}%
                                </span>
                            </div>

                            <input
                                type="range"
                                min="1"
                                max="15"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full h-2 bg-gradient-to-r from-[#7a2800]/20 to-orange-200/50 dark:from-[#7a2800]/30 dark:to-orange-900/20 rounded-lg appearance-none cursor-pointer accent-orange-600 dark:accent-orange-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                                <span>1%</span>
                                <span>15%</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col gap-6">

                        {/* DONUT CARD */}
                        <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714] animate-fade-in">
                            <div className="flex flex-col items-center justify-center gap-6">
                                {/* ✅ REAL DONUT */}
                                <div className="relative w-40 h-40 flex items-center justify-center">

                                    <div
                                        className="absolute w-full h-full rounded-full"
                                        style={{
                                            background: `conic-gradient(
                                            #ea580c ${percentage}%,
                                            #f3d2c4 ${percentage}%
                                        )`,
                                            transition: "all 0.4s ease"
                                        }}
                                    />

                                    <div className="w-28 h-28 bg-white dark:bg-[#1A1714] rounded-full flex items-center justify-center shadow-lg z-10">
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                Monthly
                                            </p>
                                            <p className="font-extrabold text-2xl text-orange-600 dark:text-orange-500 mt-1">
                                                {result.monthly.toFixed(0)}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">MAD</p>
                                        </div>
                                    </div>
                                </div>

                                {/* LEGEND */}
                                <div className="w-full grid grid-cols-2 gap-4 text-center">
                                    <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-900/10 dark:to-orange-900/5 p-3 border border-orange-200 dark:border-orange-900/30">
                                        <p className="text-xs font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-wide">Interest</p>
                                        <p className="font-bold text-orange-700 dark:text-orange-400 mt-1">{result.interest.toFixed(0)} MAD</p>
                                    </div>
                                    <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 p-3 border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Principal</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-300 mt-1">{amount.toLocaleString()} MAD</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SUMMARY CARD */}
                        <div className="fintech-card rounded-3xl border border-[#EDE8E0] bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">

                            {/* SUMMARY */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">
                                    Loan Summary
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Total Amount to Pay</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{result.total.toFixed(2)} MAD</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-orange-900/10 dark:to-orange-900/5">
                                        <span className="text-sm text-orange-700 dark:text-orange-400">Interest Cost</span>
                                        <span className="font-bold text-orange-700 dark:text-orange-500">{result.interest.toFixed(2)} MAD</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-2xl bg-gradient-to-r from-[#7a2800]/5 to-[#7a2800]/5 dark:from-[#7a2800]/20 dark:to-[#7a2800]/10">
                                        <span className="text-sm text-[#7a2800] dark:text-orange-300 font-semibold">Interest Percentage</span>
                                        <span className="font-bold text-[#7a2800] dark:text-orange-300">{percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* TIMELINE */}
                            <div className="mb-6 flex gap-4 items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Start Date</p>
                                    <p className="font-bold text-slate-900 dark:text-white mt-1">Today</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-slate-400 dark:text-slate-600" />
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">End Date</p>
                                    <p className="font-bold text-slate-900 dark:text-white mt-1">{months} months</p>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg">
                                    Save Plan
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
                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold hover:-translate-y-0.5 transition-all duration-200 hover:shadow-xl shadow-orange-600/30"
                                >
                                    Apply Loan
                                </button>
                            </div>

                            {/* VIEW HISTORY LINK */}
                            <div className="flex justify-center mt-4">
                                <Link
                                    href="/loan/history"
                                    className="text-sm font-semibold text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors flex items-center gap-1"
                                >
                                    View Loan History <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>


        
    );
}