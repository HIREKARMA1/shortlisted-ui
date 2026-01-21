"use client"

import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
export function HeroSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const vectorFill = mounted && theme === "dark" ? "#2a3441" : "#EEF7FF"
  const features = [
    "Live jobs & campus drives",
    "Offline + online execution",
    "Solviq + DISHA premium access",
    "Only 12 students per batch",
  ]

  return (
    <section className="relative min-h-screen flex items-center bg-white dark:bg-[#1a1f2e] overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (min-width: 1024px) {
          .hero-image-right {
            right: max(48px, calc((100vw - 1600px) / 2 + 48px));
          }
        }
        @media (min-width: 1280px) {
          .hero-image-right {
            right: max(64px, calc((100vw - 1600px) / 2 + 64px));
          }
        }
      `}} />
      {/* Right Section - Vector Background - positioned absolutely to align with navbar logo */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 left-1/2 pointer-events-none">
        {/* SVG Vector Background - extends from navbar to bottom */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1375 913"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M399.897 912.201L1374.79 903.158L1377.61 0H173.918C179.003 18.0858 73.3577 227.202 38.3307 295.589C-112.171 620.229 216.666 841.93 399.897 912.201Z"
              fill={vectorFill}
            />
          </svg>
        </div>
        {/* Circular Image - positioned to align with navbar Register Now button right edge */}
        <div
          className="hero-image-right absolute top-1/2 transform -translate-y-1/2 w-[500px] xl:w-[550px] aspect-square z-10 pointer-events-auto"
        >
          <OptimizedImage
            src="https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/homepage2.jpeg"
            alt="Students working on laptops"
            fill
            className="rounded-full object-cover"
            priority
            sizes="(max-width: 1280px) 500px, 550px"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1600px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Section - Content */}
          <div className="flex flex-col space-y-6 lg:space-y-8 z-10 px-2 sm:px-0">
            {/* Main Heading */}
            <h1 className="font-semibold text-[36px] max-[375px]:text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins break-words">
              Get Shortlisted
              <br />
              Faster. Get Placed
              <br />
              Smarter.
            </h1>

            {/* Sub Heading */}
            <p className="font-normal text-base max-[375px]:text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 font-poppins">
              60-day premium placement acceleration program for unplaced students.
            </p>

            {/* Features - 2 columns grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#00a2e5]">
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  </div>
                  <span className="font-normal text-[20px] leading-relaxed text-gray-900 dark:text-white font-poppins">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className={cn(
                  "bg-[#00a2e5] hover:bg-[#0091cc] text-white rounded-lg",
                  "px-5 py-2 font-semibold text-[20px] font-poppins",
                  "flex items-center justify-center gap-2 h-auto"
                )}
              >
                <Link href="https://forms.gle/oDq7HQkzx6zk3Nz76">Register Now</Link>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                >
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <div className="relative group">
                <Button
                  variant="outline"
                  className={cn(
                    "border-2 border-gray-900 dark:border-white",
                    "text-gray-900 dark:text-white",
                    "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
                    "rounded-lg px-5 py-2 font-semibold text-[20px] font-poppins h-auto"
                  )}
                >
                  Check Eligibility
                </Button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-poppins rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  For 2025 & 2026 Graduates
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Mobile/Tablet - Image with Vector Background */}
          <div className="relative flex items-center justify-center lg:hidden min-h-[500px]">
            {/* SVG Vector Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1375 913"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  d="M399.897 912.201L1374.79 903.158L1377.61 0H173.918C179.003 18.0858 73.3577 227.202 38.3307 295.589C-112.171 620.229 216.666 841.93 399.897 912.201Z"
                  fill={vectorFill}
                />
              </svg>
            </div>

            {/* Circular Image */}
            <div className="relative z-10 w-full max-w-[400px] sm:max-w-[500px] aspect-square">
              <OptimizedImage
                src="https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/heropage1.jpeg"
                alt="Students working on laptops"
                fill
                className="rounded-full object-cover"
                priority
                sizes="(max-width: 640px) 400px, 500px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

