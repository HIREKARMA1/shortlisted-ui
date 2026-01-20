import { HeroSection } from "@/components/home/hero-section"
import { WhyShortlistedSection } from "@/components/home/why-shortlisted-section"

export default function HomePage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <HeroSection />
            <WhyShortlistedSection />
        </main>
    )
}

