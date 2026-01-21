import { HeroSection } from "@/components/home/hero-section"
import { WhyShortlistedSection } from "@/components/home/why-shortlisted-section"
import { HowProgramWorksSection } from "@/components/home/how-program-works-section"
import WhoCanJoin from "@/components/home/WhoCanJoin"
import WhatMakesDifferent from "@/components/home/WhatMakesDifferent"
import WhatYouWalkAwayWith from "@/components/home/WhatYouWalkAwayWith"

export default function HomePage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <HeroSection />
            <WhyShortlistedSection />
            <HowProgramWorksSection />
            <WhoCanJoin />
            <WhatMakesDifferent />
            <WhatYouWalkAwayWith />
        </main>
    )
}

