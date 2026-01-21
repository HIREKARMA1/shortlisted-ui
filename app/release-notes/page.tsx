import Footer from "@/components/ui/Footer"

export default function ReleaseNotesPage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1200px] py-12 lg:py-16">
                {/* Main Title */}
                <h1 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins">
                    Release Notes
                </h1>

                {/* Last Updated */}
                <p className="text-[#00a2e5] text-base lg:text-lg font-poppins mb-8">
                    Last updated: January 21, 2026
                </p>

                {/* Introduction */}
                <div className="mb-8">
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        Welcome to the Shortlisted Release Notes. This page documents all updates, improvements, and new features added to our platform. We&apos;re committed to continuously enhancing your experience with better performance, new capabilities, and bug fixes.
                    </p>
                </div>

                {/* Version 1.0.0 */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h2 className="font-bold text-2xl lg:text-3xl text-gray-900 dark:text-white font-poppins mb-2">
                            Version 1.0.0
                        </h2>
                        <p className="text-[#00a2e5] text-sm lg:text-base font-poppins">
                            January 21, 2026
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-lg lg:text-xl text-gray-900 dark:text-white font-poppins mb-3">
                            Initial Release
                        </h3>
                        <ul className="space-y-2 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                            <li>Launched Shortlisted platform with modern, responsive design</li>
                            <li>Implemented comprehensive hero section with call-to-action buttons and vector background</li>
                            <li>Created &quot;How the Program Works&quot; section with Phase 1 details and interactive cards</li>
                            <li>Added &quot;Why Shortlisted Exists&quot; section highlighting platform value proposition</li>
                            <li>Implemented &quot;Who Can Join&quot; eligibility section with clear criteria</li>
                            <li>Created &quot;What Makes Us Different&quot; section showcasing unique features</li>
                            <li>Added &quot;What You Walk Away With&quot; outcomes section</li>
                            <li>Integrated CTA banner for user engagement</li>
                            <li>Created navigation bar with theme toggle and mobile menu support</li>
                            <li>Built footer component with contact information and social media links</li>
                            <li>Added comprehensive Privacy Policy, Cookie Policy, and Terms of Service pages</li>
                            <li>Implemented Release Notes page to keep users informed about platform updates</li>
                            <li>Integrated dark mode and light mode support with system preference detection</li>
                            <li>Set up AWS S3 integration for optimized image delivery</li>
                            <li>Implemented component library with reusable UI components (Button, Card, Input, etc.)</li>
                            <li>Added form handling capabilities with React Hook Form and Zod validation</li>
                            <li>Optimized image loading with lazy loading strategies</li>
                            <li>Configured TypeScript for full type safety across the application</li>
                            <li>Set up Tailwind CSS with custom configuration for consistent styling</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg lg:text-xl text-gray-900 dark:text-white font-poppins mb-3">
                            Technical Foundation
                        </h3>
                        <ul className="space-y-2 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                            <li>Next.js 14 App Router architecture for optimal performance</li>
                            <li>React 18 with server-side rendering capabilities</li>
                            <li>Tailwind CSS for utility-first styling approach</li>
                            <li>Radix UI primitives for accessible component building</li>
                            <li>next-themes for seamless theme management</li>
                            <li>ESLint and TypeScript configured for code quality</li>
                            <li>Vercel-ready deployment configuration</li>
                            <li>OptimizedImage component for better image handling</li>
                            <li>Poppins font family for consistent typography</li>
                        </ul>
                    </div>
                </div>

                {/* Upcoming Features */}
                <div className="mb-8">
                    <h2 className="font-bold text-2xl lg:text-3xl text-gray-900 dark:text-white font-poppins mb-4">
                        Upcoming Features
                    </h2>
                    <ul className="space-y-2 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>User authentication and registration system</li>
                        <li>Candidate dashboard with profile management</li>
                        <li>Assessment and evaluation tools integration</li>
                        <li>Job matching algorithm and recommendations</li>
                        <li>Real-time notifications system</li>
                        <li>Advanced search and filtering capabilities</li>
                        <li>Analytics dashboard for tracking progress</li>
                        <li>Multi-language support (i18n)</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        Feedback & Support
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        We value your feedback! If you have suggestions, encounter issues, or want to report bugs, please reach out to us:
                    </p>
                    <ul className="space-y-2 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        <li>
                            <span className="font-semibold">Email:</span> <a href="mailto:info@hirekarma.in" className="text-[#00a2e5] hover:underline">info@hirekarma.in</a>
                        </li>
                        <li>
                            <span className="font-semibold">Address:</span> Room No: 109, 1st Floor, Tower A, O-HUB, Bhubaneswar
                        </li>
                    </ul>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-normal text-sm lg:text-base text-gray-600 dark:text-gray-400 font-poppins mb-2">
                        Copyright © 2026 HireKarma Private Limited. All Rights Reserved.
                    </p>
                    <p className="font-normal text-sm lg:text-base text-gray-600 dark:text-gray-400 font-poppins">
                        Shortlisted is powered by HireKarma Pvt Ltd.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    )
}

