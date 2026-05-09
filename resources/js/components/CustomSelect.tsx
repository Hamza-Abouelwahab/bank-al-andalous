import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Option = {
    value: string | number;
    label: string;
    description?: string;
};

type CustomSelectProps = {
    label?: string;
    value: string | number | null;
    placeholder?: string;
    options: Option[];
    error?: string;
    onChange: (value: string) => void;
};

export default function CustomSelect({
    label,
    value,
    placeholder = 'Select an option',
    options,
    error,
    onChange,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = options.find(
        (option) => String(option.value) === String(value),
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={wrapperRef} className="relative">
            {label && (
                <label className="mb-2 block text-sm font-bold text-[#1f1a17] dark:text-white">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-4 text-left text-sm font-bold text-[#1f1a17] outline-none transition dark:bg-[#241b16] dark:text-white ${
                    error
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-orange-200/70 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-[#7a2800]/40'
                }`}
            >
                <span
                    className={
                        selectedOption
                            ? 'text-[#1f1a17] dark:text-white'
                            : 'text-[#1f1a17]/50 dark:text-white/40'
                    }
                >
                    {selectedOption?.label || placeholder}
                </span>

                <ChevronDown
                    className={`mr-1 h-4 w-4 text-orange-600 transition ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-orange-200 bg-white p-2 shadow-xl dark:border-[#7a2800]/40 dark:bg-[#241b16]">
                    {options.length > 0 ? (
                        options.map((option) => {
                            const active =
                                String(value) === String(option.value);

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(String(option.value));
                                        setOpen(false);
                                    }}
                                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                                        active
                                            ? 'bg-orange-600 text-white'
                                            : 'text-[#1f1a17] hover:bg-orange-50 hover:text-orange-700 dark:text-white dark:hover:bg-orange-500/10'
                                    }`}
                                >
                                    <span>{option.label}</span>

                                    {option.description && (
                                        <span
                                            className={`mt-1 block text-xs ${
                                                active
                                                    ? 'text-white/70'
                                                    : 'text-[#1f1a17]/50 dark:text-white/50'
                                            }`}
                                        >
                                            {option.description}
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="rounded-xl px-4 py-3 text-sm font-bold text-red-600">
                            No options found
                        </div>
                    )}
                </div>
            )}

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}
