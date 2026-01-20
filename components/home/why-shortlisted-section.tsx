"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const problems = [
  "Applying daily, no interview calls",
  "Missing campus drives",
  "No clarity, no structure",
  "Resume getting rejected automatically",
]

export function WhyShortlistedSection() {
  return (
    <section className="relative bg-white dark:bg-[#1a1f2e] py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1600px]">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins mb-4">
            Why SHORTLISTED Exists
          </h1>
          <p className="font-normal text-2xl text-gray-700 dark:text-gray-300 font-poppins">
            You&apos;re stuck in a loop. We&apos;re here to break it.
          </p>
        </div>



        {/* Problems Grid - 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={cn(
                "bg-[#fef2f2] dark:bg-[#FFE1E2] rounded-lg p-4",
                "flex items-center gap-4",
                "border border-pink-200 dark:border-pink-900/30"
              )}
            >
              {/* Red X Icon */}
              <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-red-500">
                <X className="w-3 h-3 text-white stroke-[3]" />
              </div>
              {/* Problem Text */}
              <p className="font-medium text-[20px] leading-relaxed text-gray-900 dark:text-[#474747] font-poppins">
                {problem}
              </p>
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-gray-600 dark:bg-gray-700 my-8 lg:my-12" />

        {/* Concluding Statement */}
        <div className="text-center">
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold font-poppins">
            <span className="text-gray-900 dark:text-white font-poppins">It&apos;s time for execution </span>
            <span className="text-[#00a2e5]">over effort</span>
          </p>
        </div>
      </div>
    </section>
  )
}

