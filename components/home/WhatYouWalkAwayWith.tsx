"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Check } from 'lucide-react';

const WhatYouWalkAwayWith: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const outcomes = [
        "ATS-ready resume that passes automated screening",
        "Interview confidence backed by real practice",
        "Measurable improvement in mock performance",
        "Active applications to relevant opportunities",
        "Higher shortlisting odds with strategic targeting"
    ];

    return (
        <div className={`relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans ${mounted && resolvedTheme === 'dark'
            ? 'bg-gray-900'
            : 'bg-white'
            }`}>
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins mb-4">
                        What You Walk Away With
                    </h2>
                    <p className="font-normal text-2xl text-gray-700 dark:text-gray-300 font-poppins">
                        Tangible outcomes, not empty promises
                    </p>
                </div>

                {/* Outcomes Card */}
                <div className={`rounded-xl sm:rounded-2xl shadow-lg border transition-all duration-500 mb-8 sm:mb-12 ${mounted && resolvedTheme === 'dark'
                    ? 'bg-white border-gray-200'
                    : 'bg-white border-gray-200'
                    }`}>
                    <div className="p-6 sm:p-8 md:p-10">
                        {/* Outcomes List */}
                        <div className="space-y-4 sm:space-y-5">
                            {outcomes.map((outcome, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 p-4 sm:p-5 rounded-lg border transition-all duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'bg-[#E6F7ED] border-[#D0EDDD]'
                                        : 'bg-[#E6F7ED] border-[#D0EDDD]'
                                        }`}
                                >
                                    {/* Checkmark Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#00AA28] flex items-center justify-center">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white stroke-[3]" />
                                        </div>
                                    </div>
                                    {/* Outcome Text */}
                                    <p className={`text-sm sm:text-base md:text-lg font-medium transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-gray-800'
                                        : 'text-gray-800'
                                        }`}>
                                        {outcome}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Banner */}
                <div className={`rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-500 ${mounted && resolvedTheme === 'dark'
                    ? 'bg-[#A800FF]'
                    : 'bg-[#00BAE8]'
                    }`}>
                    <div className="text-center">
                        <p className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 transition-colors duration-500 text-white`}>
                            This is not a course. This is placementexecution
                        </p>
                        <p className={`text-base sm:text-lg md:text-xl font-normal transition-colors duration-500 text-white`}>
                            60 days of focused action to get you placed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatYouWalkAwayWith;
