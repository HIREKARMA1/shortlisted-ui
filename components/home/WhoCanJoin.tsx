"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { CheckCircle,Check, Users } from 'lucide-react';

const WhoCanJoin: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const eligibilityCriteria = [
        "2025 / 2026 batch student",
        "Currently not placed",
        "Eligibility criteria met",
        "Ready to commit for 60 days"
    ];

    return (
        <div className={`relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans ${mounted && resolvedTheme === 'dark'
            ? 'bg-gray-900'
            : 'bg-white'
            }`}>
            <div className="w-[60vw] max-w-[60vw] mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins mb-4">
                        Who Can Join
                    </h2>
                    <p className="font-normal text-2xl text-gray-700 dark:text-gray-300 font-poppins">
                        This program is built for students ready to execute
                    </p>
                </div>

                {/* Eligibility Criteria Card */}
                <div className={`rounded-xl sm:rounded-2xl shadow-lg border transition-all duration-500 ${mounted && resolvedTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    }`}>
                    <div className="p-6 sm:p-8 md:p-10">
                        {/* Eligibility List */}
                        <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                            {eligibilityCriteria.map((criterion, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 p-4 sm:p-5 rounded-lg border transition-all duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'bg-gray-800/50 border-gray-700'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    {/* Checkmark Icon */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                            ? 'bg-[#A800FF]'
                                            : 'bg-[#00BAE8]'
                                            }`}>
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                    </div>
                                    {/* Criterion Text */}
                                    <p className={`text-sm sm:text-base md:text-lg font-medium transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-gray-200'
                                        : 'text-gray-800'
                                        }`}>
                                        {criterion}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Separator */}
                        <div className={`h-px mb-6 sm:mb-8 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'bg-gray-700'
                            : 'bg-gray-200'
                            }`} />

                        {/* Limited Seats Call-out */}
                        <div className={`rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 transition-all duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'bg-orange-500/20 border-orange-500/50'
                            : 'bg-orange-50 border-orange-200'
                            }`}>
                            <div className="flex items-center gap-3 sm:gap-4">
                                {/* Users Icon */}
                                <div className={`flex-shrink-0 p-2 sm:p-3 rounded-lg ${mounted && resolvedTheme === 'dark'
                                    ? 'bg-orange-500/30'
                                    : 'bg-orange-100'
                                    }`}>
                                    <Users className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-orange-400'
                                        : 'text-orange-600'
                                        }`} />
                                </div>
                                {/* Limited Seats Text */}
                                <p className={`text-sm sm:text-base md:text-lg font-semibold transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-orange-300'
                                    : 'text-orange-700'
                                    }`}>
                                    Limited Seats: Only 12 per Batch
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhoCanJoin;
