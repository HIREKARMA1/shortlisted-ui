import Footer from "@/components/ui/Footer"

export default function TermsOfServicePage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1200px] py-12 lg:py-16">
                {/* Main Title */}
                <h1 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins">
                    Terms of Service
                </h1>

                {/* Last Updated */}
                <p className="text-[#00a2e5] text-base lg:text-lg font-poppins mb-8">
                    Last updated: January 21, 2026
                </p>

                {/* Introduction */}
                <div className="mb-8">
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        Welcome to Shortlisted. These Terms of Service ("Terms") govern your access to and use of the Shortlisted website and services, a specialized sub-brand owned and operated by HireKarma Private Limited. By using our platform, you agree to be bound by these Terms.
                    </p>
                </div>

                {/* Section 1 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        1. Acceptance of Terms
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        By accessing Shortlisted, you confirm that you are at least 18 years of age and possess the legal authority to enter into this agreement. If you are using the platform on behalf of a company, you represent that you have the authority to bind that entity to these Terms.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        2. Description of Service
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        Shortlisted provides an advanced recruitment and candidate evaluation platform designed to streamline the hiring process through assessments, skill verification, and job matching. We act as a bridge between talent and opportunity but do not guarantee employment or the selection of any candidate.
                    </p>
                </div>

                {/* Section 3 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        3. User Accounts
                    </h2>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>
                            <span className="font-semibold">Registration:</span> You must provide accurate and complete information when creating an account.
                        </li>
                        <li>
                            <span className="font-semibold">Security:</span> You are responsible for maintaining the confidentiality of your login credentials. All activities occurring under your account are your responsibility.
                        </li>
                        <li>
                            <span className="font-semibold">Termination:</span> We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.
                        </li>
                    </ul>
                </div>

                {/* Section 4 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        4. User Conduct & Content
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        Users agree not to:
                    </p>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>Post false, misleading, or defamatory information.</li>
                        <li>Use the platform for any illegal purpose or to transmit malware.</li>
                        <li>Attempt to scrape data or bypass any security measures of the platform.</li>
                        <li>Impersonate any person or entity, including HireKarma employees.</li>
                    </ul>
                </div>

                {/* Section 5 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        5. Intellectual Property
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        All content, trademarks, logos, and software associated with Shortlisted are the exclusive property of HireKarma Private Limited. You are granted a limited, non-exclusive license to use the platform for its intended recruitment purposes. You may not reproduce or distribute our intellectual property without prior written consent.
                    </p>
                </div>

                {/* Section 6 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        6. Payments and Refunds
                    </h2>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>
                            <span className="font-semibold">Fees:</span> Certain features of Shortlisted may require payment. All fees are clearly stated at the point of purchase.
                        </li>
                        <li>
                            <span className="font-semibold">Processing:</span> Payments are handled via secure third-party gateways.
                        </li>
                        <li>
                            <span className="font-semibold">Refunds:</span> Refund policies are governed by the specific service level agreement selected at the time of purchase. Generally, fees for completed assessments or job postings are non-refundable.
                        </li>
                    </ul>
                </div>

                {/* Section 7 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        7. Limitation of Liability
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        To the maximum extent permitted by law, Shortlisted and HireKarma Private Limited shall not be liable for any indirect, incidental, or consequential damages resulting from:
                    </p>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>Your use or inability to use the service.</li>
                        <li>Unauthorized access to your data.</li>
                        <li>The conduct or content of any third party (employers or candidates) on the platform.</li>
                    </ul>
                </div>

                {/* Section 8 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        8. Third-Party Links
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        Our platform may contain links to third-party websites (e.g., portfolio sites or external job boards). We do not endorse or assume responsibility for the content or practices of these external sites.
                    </p>
                </div>

                {/* Section 9 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        9. Governing Law
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bhubaneswar, Odisha.
                    </p>
                </div>

                {/* Section 10 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        10. Changes to Terms
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        We may modify these Terms at any time. Significant changes will be notified via email or a prominent notice on our website. Continued use of Shortlisted after updates constitutes acceptance of the new Terms.
                    </p>
                </div>

                {/* Contact Us */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        Contact Us
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        If you have any questions regarding these Terms, please contact:
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
                </div>
            </div>

            <Footer />
        </main>
    )
}

