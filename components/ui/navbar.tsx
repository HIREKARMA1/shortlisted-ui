"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "./button"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavbarProps {
  className?: string
}

// const navigationItems = [
//   { label: "Program", href: "#program" },
//   { label: "How It Works", href: "#how-it-works" },
//   { label: "Outcomes", href: "#outcomes" },
//   { label: "Eligibility", href: "#eligibility" },
// ]

export function Navbar({ className }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Logo URLs based on theme - always provide a default
  const logoUrl = mounted && theme === "dark"
    ? "https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/shortlisted-logo-dm.png"
    : "https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/shortlisted-logo-lm.png"

  return (
    <>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20" />

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] w-full transition-colors",
          "bg-white dark:bg-[#1a1f2e]",
          "shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
          className
        )}
        style={{ position: 'fixed', top: 0, left: 0, right: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1600px]">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center h-full">
              {logoUrl ? (
                <div className="relative h-16 w-auto flex items-center">
                  <Image
                    src={logoUrl}
                    alt="Shortlisted Logo"
                    width={140}
                    height={40}
                    priority
                    className="h-16 w-auto object-contain"
                    style={{ maxWidth: '200px', height: '100px' }}
                  />
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900 dark:text-white font-poppins">
                  Shortlisted
                </span>
              )}
            </Link>

            {/* Desktop Navigation - Centered */}
            {/* <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-[#00a2e5] dark:hover:text-[#00a2e5] transition-colors whitespace-nowrap font-poppins"
                >
                  {item.label}
                </Link>
              ))}
            </div> */}

            {/* Right side - Theme Toggle & Register Button */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Theme Toggle */}
              <ThemeToggle className="hidden sm:flex" />

              {/* Register Now Button */}
              <Button
                className="hidden sm:flex bg-[#00a2e5] hover:bg-[#0091cc] text-white rounded-lg px-6 py-2 font-medium text-sm"
              >
                <Link href="https://forms.gle/oDq7HQkzx6zk3Nz76">Register Now</Link>
              </Button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="md:hidden p-2 text-gray-900 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-[#2a3441] bg-white dark:bg-[#1a1f2e]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1600px] py-4 space-y-4">
              {/* {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-[#00a2e5] dark:hover:text-[#00a2e5] transition-colors py-2 font-poppins"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))} */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#2a3441]">
                <ThemeToggle />
                <Button
                  className="bg-[#00a2e5] hover:bg-[#0091cc] text-white rounded-lg px-6 py-2 font-medium text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

