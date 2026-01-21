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
            <div className="max-w-[1000px] mx-auto">
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
                <div className="bg-white border border-[#E6E7EB] rounded-2xl shadow-lg mb-8 sm:mb-12">
                    <div className="py-5 px-[10px]">
                        {/* Outcomes List */}
                        <div className="space-y-4">
                            {outcomes.map((outcome, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 h-[70px] p-[10px] bg-[#E6F7ED] border border-[#D0EDDD] rounded-2xl"
                                >
                                    {/* Checkmark Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-[#00AA28] flex items-center justify-center">
                                            <Check className="w-5 h-5 text-white stroke-[2.5]" />
                                        </div>
                                    </div>
                                    {/* Outcome Text */}
                                    <p className="text-base font-medium text-gray-800">
                                        {outcome}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Banner
                <div className="bg-[#00BAE8] rounded-lg py-[9px] px-6 max-w-[1000px] mx-auto text-center">
                    <p className="text-3xl font-bold mb-2 text-white">
                        This is not a course. This is placementexecution
                    </p>
                    <p className="text-xl font-normal text-white">
                        60 days of focused action to get you placed
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default WhatYouWalkAwayWith;
