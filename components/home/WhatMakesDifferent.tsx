"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Users, Laptop, Zap, Briefcase, Calendar, MessageSquare } from 'lucide-react';

interface Feature {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const WhatMakesDifferent: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const features: Feature[] = [
        {
            icon: Users,
            title: "12 Students Only",
            description: "Personalized attention for maximum impact"
        },
        {
            icon: Laptop,
            title: "Offline + Online",
            description: "Hybrid model combining best of both"
        },
        {
            icon: Zap,
            title: "Solviq + DISHA",
            description: "Premium platform access included"
        },
        {
            icon: Briefcase,
            title: "Live Jobs",
            description: "Real opportunities, not practice drills"
        },
        {
            icon: Calendar,
            title: "Live Campus Drives",
            description: "Priority access to hiring events"
        },
        {
            icon: MessageSquare,
            title: "Continuous Mentoring",
            description: "Support throughout your journey"
        }
    ];

    return (
        <div className={`relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${mounted && resolvedTheme === 'dark'
            ? 'bg-gray-900'
            : 'bg-white'
            }`}>
            <div className="max-w-[90%] mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins mb-4">
                        What Makes SHORTLISTED Different
                    </h2>
                    <p className="font-normal text-2xl text-gray-700 dark:text-gray-300 font-poppins">
                        Premium, focused, and outcome-driven
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        const isSolviqDisha = feature.title === "Solviq + DISHA";
                        return (
                            <div
                                key={index}
                                className="bg-white border border-[#D0D0D0] rounded-2xl p-4 h-[185px] flex flex-col hover:shadow-lg transition-all duration-500"
                            >
                                {/* Icon */}
                                <div className="mb-4 relative">
                                    <div className="w-[45px] h-[45px] rounded-md bg-[#00BAE8] flex items-center justify-center">
                                        <IconComponent className="w-7 h-7 text-white" />
                                    </div>
                          
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-medium text-black font-poppins mb-2 leading-[24px]">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 font-poppins flex-grow">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WhatMakesDifferent;
