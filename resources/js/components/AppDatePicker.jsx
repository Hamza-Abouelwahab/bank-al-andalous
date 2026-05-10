import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

function formatInputDate(date) {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
    if (!value) return "";

    const date = new Date(value + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function AppDatePicker({
    label = "Date",
    value,
    onChange,
    placeholder = "Select date",
    min,
    max,
    error,
}) {
    const selectedDate = value ? new Date(value + "T00:00:00") : null;

    const [open, setOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        selectedDate ? selectedDate.getMonth() : new Date().getMonth(),
    );
    const [currentYear, setCurrentYear] = useState(
        selectedDate ? selectedDate.getFullYear() : new Date().getFullYear(),
    );

    const monthName = useMemo(() => {
        return new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }, [currentMonth, currentYear]);

    const days = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const previousMonthLastDay = new Date(
            currentYear,
            currentMonth,
            0,
        ).getDate();

        const calendarDays = [];

        for (let i = startDay - 1; i >= 0; i--) {
            calendarDays.push({
                day: previousMonthLastDay - i,
                current: false,
                date: new Date(currentYear, currentMonth - 1, previousMonthLastDay - i),
            });
        }

        for (let day = 1; day <= totalDays; day++) {
            calendarDays.push({
                day,
                current: true,
                date: new Date(currentYear, currentMonth, day),
            });
        }

        while (calendarDays.length < 42) {
            const nextDay = calendarDays.length - startDay - totalDays + 1;
            calendarDays.push({
                day: nextDay,
                current: false,
                date: new Date(currentYear, currentMonth + 1, nextDay),
            });
        }

        return calendarDays;
    }, [currentMonth, currentYear]);

    function goPreviousMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }

    function goNextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    function isSameDay(dateA, dateB) {
        if (!dateA || !dateB) return false;

        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        );
    }

    function isDisabled(date) {
        const dateString = formatInputDate(date);

        if (min && dateString < min) return true;
        if (max && dateString > max) return true;

        return false;
    }

    function selectDate(date) {
        if (isDisabled(date)) return;

        onChange(formatInputDate(date));
        setOpen(false);
    }

    return (
        <div className="relative w-full">
            {label && (
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-4 text-left text-sm font-semibold shadow-sm transition dark:bg-[#1f1a17] ${
                    error
                        ? "border-red-400 text-red-600"
                        : "border-orange-100 text-slate-800 hover:border-orange-300 focus:border-orange-500 dark:border-[#7a2800]/40 dark:text-white"
                }`}
            >
                <span className={value ? "" : "text-slate-400"}>
                    {value ? formatDisplayDate(value) : placeholder}
                </span>

                <CalendarDays className="h-5 w-5 text-orange-500" />
            </button>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

            {open && (
                <>
                    <div
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40"
                    />

                    <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full max-w-[360px] overflow-hidden rounded-3xl border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-900/15 dark:border-[#7a2800]/40 dark:bg-[#1f1a17]">
                        <div className="mb-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={goPreviousMonth}
                                className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 dark:text-white/70 dark:hover:bg-white/10"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                {monthName}
                            </h3>

                            <button
                                type="button"
                                onClick={goNextMonth}
                                className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 dark:text-white/70 dark:hover:bg-white/10"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                                (day) => (
                                    <div
                                        key={day}
                                        className="py-2 text-xs font-black text-slate-400"
                                    >
                                        {day}
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days.map((item, index) => {
                                const selected = isSameDay(
                                    item.date,
                                    selectedDate,
                                );
                                const today = isSameDay(item.date, new Date());
                                const disabled = isDisabled(item.date);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => selectDate(item.date)}
                                        className={`grid h-10 place-items-center rounded-xl text-sm font-bold transition ${
                                            selected
                                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                                                : today
                                                  ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300"
                                                  : item.current
                                                    ? "text-slate-700 hover:bg-orange-50 hover:text-orange-600 dark:text-white/80 dark:hover:bg-white/10"
                                                    : "text-slate-300 dark:text-white/20"
                                        } ${
                                            disabled
                                                ? "cursor-not-allowed opacity-30 hover:bg-transparent"
                                                : ""
                                        }`}
                                    >
                                        {item.day}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4 dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setOpen(false);
                                }}
                                className="text-sm font-bold text-slate-400 transition hover:text-red-500"
                            >
                                Clear
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    onChange(formatInputDate(today));
                                    setCurrentMonth(today.getMonth());
                                    setCurrentYear(today.getFullYear());
                                    setOpen(false);
                                }}
                                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                            >
                                Today
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
