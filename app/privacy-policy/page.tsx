import Footer from "@/components/ui/Footer"

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1200px] py-12 lg:py-16">
                {/* Main Title */}
                <h1 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins">
                    Privacy Policy
                </h1>

                {/* Last Updated */}
                <p className="text-[#00a2e5] text-base lg:text-lg font-poppins mb-8">
                    Last updated: January 21, 2026
                </p>

                {/* Section 1 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        1. Introduction
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        Welcome to Shortlisted, a specialized sub-brand of HireKarma Private Limited. We are dedicated to protecting your privacy and ensuring that your personal information is handled with transparency and care. This Privacy Policy outlines how Shortlisted collects, uses, and safeguards your data when you interact with our recruitment and evaluation services.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        2. Information We Collect
                    </h2>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>
                            <span className="font-semibold">Candidate Information:</span> Details such as your name, email address, contact number, and professional history shared during the "shortlisting" or application process.
                        </li>
                        <li>
                            <span className="font-semibold">Performance Data:</span> Information generated through the Shortlisted platform, including assessment results, interview recordings, or skill evaluations.
                        </li>
                        <li>
                            <span className="font-semibold">Technical Information:</span> Data such as your IP address, browser type, and device information to optimize platform performance.
                        </li>
                        <li>
                            <span className="font-semibold">Cookies:</span> Tracking technologies used to enhance your navigation experience and remember your preferences.
                        </li>
                    </ul>
                </div>

                {/* Section 3 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        3. How We Use Your Information
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        Your data is used specifically to:
                    </p>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>Facilitate the recruitment and selection process for Shortlisted users.</li>
                        <li>Match candidates with the most relevant career opportunities within the HireKarma network.</li>
                        <li>Process payments for premium features and manage user accounts.</li>
                        <li>Communicate updates, evaluation results, and service notifications.</li>
                        <li>Comply with legal requirements and maintain platform integrity.</li>
                    </ul>
                </div>

                {/* Section 4 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        4. Sharing of Your Information
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        Shortlisted does not sell or rent personal information. We share data only with:
                    </p>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>
                            <span className="font-semibold">Employers and Recruiters:</span> To support hiring decisions and job placement activities.
                        </li>
                        <li>
                            <span className="font-semibold">Service Providers:</span> For technical tasks like analytics or payment processing under strict confidentiality.
                        </li>
                        <li>
                            <span className="font-semibold">Legal Authorities:</span> To comply with lawful requests or Indian regulations.
                        </li>
                    </ul>
                </div>

                {/* Section 5 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        5. Data Security & Retention
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        We employ appropriate organizational and technical safeguards to protect your data from unauthorized access. Shortlisted retains your personal information only as long as necessary to provide our services or as required by applicable law.
                    </p>
                </div>

                {/* Section 6 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        6. Your Rights
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        You may exercise the following rights regarding your data on Shortlisted:
                    </p>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside mb-4">
                        <li>
                            <span className="font-semibold">Access:</span> Request a copy of the personal data we hold.
                        </li>
                        <li>
                            <span className="font-semibold">Correction:</span> Ask for updates to inaccurate or incomplete information.
                        </li>
                        <li>
                            <span className="font-semibold">Deletion:</span> Request the removal of your data, subject to legal obligations.
                        </li>
                        <li>
                            <span className="font-semibold">Objection:</span> Object to specific types of data processing.
                        </li>
                    </ul>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        For any requests, please contact: <a href="mailto:info@hirekarma.in" className="text-[#00a2e5] hover:underline">info@hirekarma.in</a>
                    </p>
                </div>

                {/* Section 7 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        7. Contact Us
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        For any queries or concerns regarding this Privacy Policy for Shortlisted, you may contact us at:
                    </p>
                    <ul className="space-y-2 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        <li>
                            <span className="font-semibold">Email:</span> <a href="mailto:info@hirekarma.in" className="text-[#00a2e5] hover:underline">info@hirekarma.in</a>
                        </li>
                        <li>
                            <span className="font-semibold">Phone:</span> <a href="tel:+919078683876" className="text-[#00a2e5] hover:underline">+91 90786 83876</a>
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

