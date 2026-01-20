"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className={`relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-500 ${mounted && resolvedTheme === 'dark'
            ? 'bg-black'
            : 'bg-[#00BAE8]'
            }`}>
            <div className="w-full text-center">
                {/* Main Heading */}
                <div className="w-[95vw] mx-auto mb-4 sm:mb-6">
                    <h2 className="font-semibold text-[64px] leading-[1.1] text-white font-poppins text-center">
                        This is not a course. This is placementexecution
                    </h2>
                </div>

                {/* Sub-headings */}
                <div className="max-w-4xl mx-auto">
                    <p className="font-normal text-2xl text-white font-poppins mb-2">
                        Not another course. Not more videos.
                    </p>
                    <p className="font-normal text-2xl text-white font-poppins mb-8 sm:mb-10">
                        Only 12 seats per batch
                    </p>

                    {/* Call-to-Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                        <Button 
                            className="bg-black hover:bg-gray-900 text-white px-6 sm:px-8 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                            Register Now
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button 
                            variant="outline"
                            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            Talk to Placement Advisor
                        </Button>
                    </div>

                    {/* Informational Bullet Points */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
                        {infoPoints.map((point, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#00AA28]"></div>
                                <p className={`text-sm sm:text-base font-normal transition-colors duration-500 text-white`}>
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
