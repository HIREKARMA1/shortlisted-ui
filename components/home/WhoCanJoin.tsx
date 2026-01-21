"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Check, Users } from 'lucide-react';

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
            <div className="max-w-[1000px] mx-auto px-2 sm:px-0">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-semibold text-[36px] max-[375px]:text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins mb-4 break-words">
                        Who Can Join
                    </h2>
                    <p className="font-normal text-base max-[375px]:text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 font-poppins">
                        This program is built for students ready to execute
                    </p>
                </div>

                {/* Eligibility Criteria Card */}
                <div className="bg-white border border-[#E6E7EB] rounded-2xl shadow-lg">
                    <div className="py-5 px-[10px]">
                        {/* Eligibility List */}
                        <div className="space-y-4 mb-6">
                            {eligibilityCriteria.map((criterion, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 h-[70px] p-[10px] bg-white border border-[#E6E7EB] rounded-2xl"
                                >
                                    {/* Checkmark Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-[#00BAE8] flex items-center justify-center">
                                            <Check className="w-5 h-5 text-white stroke-[2.5]" />
                                        </div>
                                    </div>
                                    {/* Criterion Text */}
                                    <p className="text-base font-medium text-gray-800">
                                        {criterion}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-[#E6E7EB] mb-6" />

                        {/* Limited Seats Call-out */}
                        <div className="bg-[#FFF8EC] border border-[#FFD4A1] rounded-2xl h-[70px] p-[10px] flex items-center gap-4">
                            {/* Users Icon */}
                            <div className="flex-shrink-0">
                                <Users className="w-6 h-6 text-[#FFD4A1]" />
                            </div>
                            {/* Limited Seats Text */}
                            <p className="text-base font-semibold text-gray-800">
                                Limited Seats: Only 12 per Batch
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhoCanJoin;
