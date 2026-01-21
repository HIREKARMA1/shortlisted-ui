"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Calendar } from 'lucide-react';
import Image from 'next/image';

const LiveJobExecution: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // HireKarma Logo URLs based on theme
    const hirekarmaLogoUrl = mounted && resolvedTheme === "dark"
        ? "https://hirekarma.s3.us-east-1.amazonaws.com/hirekarma_ui/home_ui/HKlogoblack.png"
        : "https://hirekarma.s3.us-east-1.amazonaws.com/hirekarma_ui/home_ui/HKlogoblack.png";

    // Solviq Logo URLs based on theme
    const solviqLogoUrl = mounted && resolvedTheme === "dark"
        ? "https://solviqai.s3.ap-south-1.amazonaws.com/solviqligt.png"
        : "https://solviqai.s3.ap-south-1.amazonaws.com/solviqligt.png";

    const solviqFeatures = [
        "AI mock interviews",
        "Unlimited practice",
        "Performance tracking",
        "Feedback-driven improvement"
    ];

    const dishaFeatures = [
        "Live fresher jobs",
        "Priority campus drives",
        "Eligibility-based roles",
        "Application guidance"
    ];

    return (
        <section className="relative bg-[#F0F9F4] py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1600px]">
                {/* Header Section */}
                <div className="text-center mb-4 px-2 sm:px-0">
                    <h1 className="font-semibold text-[36px] max-[375px]:text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.1] text-gray-900 font-poppins mb-4 break-words">
                        Premium Practice + Live Job Execution
                    </h1>
                    
                    {/* Duration with Calendar Icon */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-gray-700 font-poppins" />
                        <p className="font-normal text-base max-[375px]:text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-poppins">
                            6-8 Weeks
                        </p>
                    </div>

                    {/* Phase 2 Badge */}
                    <div className="flex justify-center mb-8">
                        <span className="bg-[#00BAE8] text-white font-semibold text-sm px-3 py-1 rounded-lg">
                            Phase 2
                        </span>
                    </div>
                </div>

                {/* Premium Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
                    {/* Solviq Premium Card */}
                    <div className="bg-[#EBF9FF] border border-[#B8DCFF] rounded-2xl" style={{ padding: '8px 10px' }}>
                        <div className="p-6">
                            {/* Logo and Title/Subtitle - Vertical on small, horizontal on larger screens */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-8 mb-6">
                                {solviqLogoUrl && (
                                    <div className="relative h-8 sm:h-10 w-auto flex items-center justify-center md:justify-start flex-shrink-0">
                                        <Image
                                            src={solviqLogoUrl}
                                            alt="Solviq Logo"
                                            width={150}
                                            height={50}
                                            priority
                                            className="h-8 sm:h-10 w-auto object-contain"
                                            style={{ maxWidth: '150px', height: 'auto' }}
                                        />
                                    </div>
                                )}
                                {/* Title and Subtitle stacked vertically */}
                                <div className="flex flex-col items-center md:items-start">
                                    <h3 className="font-bold text-2xl lg:text-3xl text-gray-900 font-poppins mb-1">
                                        Solviq Premium
                                    </h3>
                                    <p className="font-normal text-base lg:text-lg text-gray-700 font-poppins">
                                        Live Job Opportunities
                                    </p>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-3">
                                {solviqFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
                                    >
                                        <div className="w-3 h-3 rounded-full bg-[#00BAE8] flex-shrink-0"></div>
                                        <p className="font-normal text-[20px] leading-relaxed text-gray-900 font-poppins">
                                            {feature}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DISHA Premium Card */}
                    <div className="bg-[#FFF3FA] border border-[#EFD3FF] rounded-2xl" style={{ padding: '8px 10px' }}>
                        <div className="p-6">
                            {/* Logo and Title/Subtitle - Vertical on small, horizontal on larger screens */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-8 mb-6">
                                {hirekarmaLogoUrl && (
                                    <div className="relative h-8 sm:h-10 w-auto flex items-center justify-center md:justify-start flex-shrink-0">
                                        <Image
                                            src={hirekarmaLogoUrl}
                                            alt="HireKarma Logo"
                                            width={150}
                                            height={50}
                                            priority
                                            className="h-8 sm:h-10 w-auto object-contain"
                                            style={{ maxWidth: '150px', height: 'auto' }}
                                        />
                                    </div>
                                )}
                                {/* Title and Subtitle stacked vertically */}
                                <div className="flex flex-col items-center md:items-start">
                                    <h3 className="font-bold text-2xl lg:text-3xl text-gray-900 font-poppins mb-1">
                                        DISHA Premium
                                    </h3>
                                    <p className="font-normal text-base lg:text-lg text-gray-700 font-poppins">
                                        Live Job Opportunities
                                    </p>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-3">
                                {dishaFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
                                    >
                                        <div className="w-3 h-3 rounded-full bg-[#B14CFF] flex-shrink-0"></div>
                                        <p className="font-normal text-[20px] leading-relaxed text-gray-900 font-poppins">
                                            {feature}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Supporting Text */}
                <div className="text-center px-2 sm:px-0">
                    <p className="font-normal text-base max-[375px]:text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-poppins">
                        Complete support from preparation to placement execution
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LiveJobExecution;
