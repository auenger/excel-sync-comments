import { useState, useRef, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    label?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select...", label }: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        return options.filter((opt) =>
            opt.toLowerCase().includes(query.toLowerCase())
        );
    }, [options, query]);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const removeOption = (e: React.MouseEvent, value: string) => {
        e.stopPropagation();
        onChange(selected.filter((item) => item !== value));
    };

    return (
        <div className="space-y-1.5" ref={containerRef}>
            {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">{label}</label>}
            <div className="relative">
                <div
                    className={cn(
                        "min-h-[40px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all cursor-pointer hover:bg-gray-50 flex flex-wrap gap-1.5 items-center pr-8",
                        open ? "ring-2 ring-indigo-500 border-transparent" : ""
                    )}
                    onClick={() => setOpen(!open)}
                >
                    {selected.length === 0 && (
                        <span className="text-gray-400">{placeholder}</span>
                    )}

                    {selected.length > 0 && (
                        selected.length > 2 ? (
                            <div className="flex gap-1.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {selected.length} selected
                                </span>
                            </div>
                        ) : (
                            selected.map((val) => (
                                <span key={val} className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-[120px]">
                                    <span className="truncate">{val}</span>
                                    <button
                                        className="ml-1 hover:text-indigo-900 focus:outline-none"
                                        onClick={(e) => removeOption(e, val)}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))
                        )
                    )}

                    <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                        <ChevronsUpDown className="w-4 h-4" />
                    </div>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-64 flex flex-col"
                        >
                            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="Search..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-1 p-1">
                                {filteredOptions.length === 0 ? (
                                    <div className="px-2 py-4 text-center text-xs text-gray-500">
                                        No results found.
                                    </div>
                                ) : (
                                    filteredOptions.map((option) => (
                                        <div
                                            key={option}
                                            className={cn(
                                                "flex items-center px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                                                selected.includes(option) ? "bg-indigo-50 text-indigo-900" : "text-gray-700"
                                            )}
                                            onClick={() => toggleOption(option)}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 border rounded mr-2 flex items-center justify-center transition-colors",
                                                selected.includes(option) ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"
                                            )}>
                                                {selected.includes(option) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="truncate">{option}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between">
                                <button
                                    onClick={() => onChange(options)}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => onChange([])}
                                    className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1"
                                >
                                    Clear
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
