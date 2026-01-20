import { HeroSection } from "@/components/home/hero-section"
import { WhyShortlistedSection } from "@/components/home/why-shortlisted-section"
import WhoCanJoin from "@/components/home/WhoCanJoin"
import WhatMakesDifferent from "@/components/home/WhatMakesDifferent"

export default function HomePage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <HeroSection />
            <WhyShortlistedSection />
            <WhoCanJoin />
            <WhatMakesDifferent />
        </main>
    )
}

