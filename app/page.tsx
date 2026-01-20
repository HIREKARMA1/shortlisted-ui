import { HeroSection } from "@/components/home/hero-section"
import WhoCanJoin from "@/components/home/WhoCanJoin"
import WhatMakesDifferent from "@/components/home/WhatMakesDifferent"
import WhatYouWalkAwayWith from "@/components/home/WhatYouWalkAwayWith"
import CTABanner from "@/components/home/CTABanner"

export default function HomePage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <HeroSection />
        </main>
    )
}

