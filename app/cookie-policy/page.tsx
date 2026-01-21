import Footer from "@/components/ui/Footer"

export default function CookiePolicyPage() {
    return (
        <main className="bg-white dark:bg-[#1a1f2e] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1200px] py-12 lg:py-16">
                {/* Main Title */}
                <h1 className="font-semibold text-[64px] leading-[1.1] text-gray-900 dark:text-white font-poppins">
                    Cookie Policy
                </h1>

                {/* Last Updated */}
                <p className="text-[#00a2e5] text-base lg:text-lg font-poppins mb-8">
                    Last updated: January 21, 2026
                </p>

                {/* Introduction */}
                <div className="mb-8">
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        This Cookie Policy explains how Shortlisted, a sub-brand of HireKarma Private Limited, uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are, why we use them, and your rights to control our use of them.
                    </p>
                </div>

                {/* Section 1 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        1. What are Cookies?
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their platforms work more efficiently, provide reporting information, and enhance the user experience.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        2. Why We Use Cookies
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        At Shortlisted, we use cookies for several reasons:
                    </p>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>
                            <span className="font-semibold">Essential Cookies:</span> These are strictly necessary to provide you with services available through our platform and to use some of its features, such as accessing secure areas (e.g., candidate dashboards).
                        </li>
                        <li>
                            <span className="font-semibold">Performance & Analytics:</span> These cookies help us understand how visitors interact with the platform by collecting and reporting information anonymously. This helps us improve the &quot;shortlisting&quot; algorithm and user flow.
                        </li>
                        <li>
                            <span className="font-semibold">Functionality Cookies:</span> These allow the platform to remember choices you make (such as your username or language) and provide enhanced, more personal features.
                        </li>
                        <li>
                            <span className="font-semibold">Security Cookies:</span> We use these to identify and prevent security risks, such as protecting your account from unauthorized access.
                        </li>
                    </ul>
                </div>

                {/* Section 3 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        3. Types of Cookies We Use
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-bold text-base lg:text-lg text-gray-900 dark:text-white font-poppins">
                                        Cookie Type
                                    </th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-bold text-base lg:text-lg text-gray-900 dark:text-white font-poppins">
                                        Purpose
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-base lg:text-lg text-gray-900 dark:text-white font-poppins">
                                        Session Cookies
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins">
                                        Temporary cookies that expire when you close your browser. Used for maintaining your login state.
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 dark:bg-gray-900">
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-base lg:text-lg text-gray-900 dark:text-white font-poppins">
                                        Persistent Cookies
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins">
                                        Stay on your device for a set period. Used to remember your preferences (like &quot;Remember Me&quot;).
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-base lg:text-lg text-gray-900 dark:text-white font-poppins">
                                        Third-Party Cookies
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins">
                                        Placed by services that appear on our pages (e.g., Google Analytics) to help us track site performance.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        4. How Can You Control Cookies?
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        You have the right to decide whether to accept or reject cookies.
                    </p>
                    <ul className="space-y-3 font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed list-disc list-inside">
                        <li>
                            <span className="font-semibold">Browser Settings:</span> You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted.
                        </li>
                        <li>
                            <span className="font-semibold">Mobile Settings:</span> You can manage cookies on your mobile device through the device settings.
                        </li>
                    </ul>
                </div>

                {/* Section 5 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        5. Updates to This Policy
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed">
                        We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Please re-visit this Cookie Policy regularly to stay informed about our use of cookies.
                    </p>
                </div>

                {/* Section 6 */}
                <div className="mb-8">
                    <h2 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white font-poppins mb-4">
                        6. More Information
                    </h2>
                    <p className="font-normal text-base lg:text-lg text-gray-700 dark:text-gray-300 font-poppins leading-relaxed mb-3">
                        If you have any questions about our use of cookies or other technologies, please email us at:
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

