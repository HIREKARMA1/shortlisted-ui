"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CTABanner: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const infoPoints = [
        "Next batch starts soon",
        "Limited seats available",
        "Eligibility-based admission"
    ];

    return (
        <div className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans bg-[#00BAE8]">
            <div className="w-full text-center">
                {/* Main Heading */}
                <div className="w-full max-w-[95vw] mx-auto mb-4 sm:mb-6 px-2">
                    <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-[1] text-white font-poppins text-center">
                        This is not a course. This is placementexecution
                    </h2>
                </div>

                {/* Sub-headings */}
                <div className="max-w-4xl mx-auto px-4">
                    <p className="font-medium text-lg sm:text-xl md:text-2xl lg:text-[32px] leading-[1] text-white font-poppins mb-2">
                        Not another course. Not more videos.
                    </p>
                    <p className="font-medium text-lg sm:text-xl md:text-2xl lg:text-[32px] leading-[1] text-white font-poppins mb-6 sm:mb-8 md:mb-10">
                        Only 12 seats per batch
                    </p>

                    {/* Call-to-Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-12">
                        <Button 
                            className="bg-black hover:bg-gray-900 text-white h-[50px] px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 flex items-center gap-[10px] w-full sm:w-auto"
                        >
                           <Link href="https://forms.gle/oDq7HQkzx6zk3Nz76">Register Now</Link>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Link 
                            href="tel:+919078683876"
                            className="bg-transparent border border-white text-white hover:bg-white/10 h-[50px] px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-[10px] w-full sm:w-auto whitespace-nowrap"
                        >
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            Talk to Placement Advisor
                        </Link>
                    </div>

                    {/* Informational Bullet Points */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-[30px]">
                        {infoPoints.map((point, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#00AA28] flex-shrink-0"></div>
                                <p className="text-xs sm:text-sm md:text-base font-normal text-white whitespace-nowrap">
                                    {point}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CTABanner;
