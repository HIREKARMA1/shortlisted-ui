"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MapPin, Mail, Phone, Facebook, Github, Twitter, Linkedin, InstagramIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Logo URLs based on theme
    const logoUrl = mounted && resolvedTheme === "dark"
        ? "https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/shortlisted-logo-dm.png"
        : "https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/shortlisted-logo-lm.png";

    const productLinks = [
        { name: "Disha", href: "https://disha.hirekarma.in/auth/login" },
        { name: "Solviq AI", href: "https://www.solviqai.in/" }
    ];

    const aboutUsLinks = [
        { name: "Our Story", href: "https://www.hirekarma.in/about-us/our-story" },
        { name: "Mission & Value", href: "https://www.hirekarma.in/about-us/mission-value" },
        { name: "People", href: "https://www.hirekarma.in/about-us/people" }
    ];

    const contactLinks = [
        { name: "Contact Us", href: "https://forms.gle/oDq7HQkzx6zk3Nz76" }
    ];

    const privacyPolicyLinks = [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Cookie Policy", href: "cookie-policy" },
        { name: "Release Notes", href: "/release-notes" }
    ];

    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/Hirekarma/", label: "Facebook" },
        { icon: Linkedin, href: "https://www.linkedin.com/company/hirekarma-pvt-ltd", label: "Linkedin" },
        { icon: Twitter, href: "https://x.com/hirekarma", label: "Twitter" },
        { icon: InstagramIcon, href: "https://www.instagram.com/hirekarma/", label: "Instagram"}
    ];

    return (
        <footer className={`relative font-sans transition-all duration-500 ${mounted && resolvedTheme === 'dark'
            ? 'bg-gray-900'
            : 'bg-white'
            }`}>
            <div className="w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-6 lg:gap-12 xl:gap-[103px]">
                    {/* Brand & Contact Information */}
                    <div className="col-span-1 lg:col-span-2 text-center sm:text-left">
                        <div className="mb-6">
                            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                                <Link href="/" className="flex items-center h-full">
                                    {logoUrl ? (
                                        <div className="relative h-10 w-auto flex items-center">
                                            <Image
                                                src={logoUrl}
                                                alt="Shortlisted Logo"
                                                width={140}
                                                height={40}
                                                priority
                                                className="h-10 w-auto object-contain"
                                                style={{ maxWidth: '200px', height: '100px' }}
                                            />
                                        </div>
                                    ) : (
                                        <span className={`text-xl font-bold transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                            ? 'text-white'
                                            : 'text-gray-900'
                                            } font-poppins`}>
                                            Shortlisted
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-center sm:justify-start gap-1 sm:gap-3">
                                <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                    }`} />
                                <p className={`text-sm transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                    }`}>
                                    Room No: 109, 1st Floor, <br /> Tower A, O-HUB, Bhubaneswar
                                </p>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-3">
                                <Mail className={`w-5 h-5 flex-shrink-0 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                    }`} />
                                <a href="mailto:info@hirekarma.in" className={`text-sm hover:underline transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                    }`}>
                                    info@hirekarma.in
                                </a>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-3">
                                <Phone className={`w-5 h-5 flex-shrink-0 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                    }`} />
                                <a href="tel:+919078683876" className={`text-sm hover:underline transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                    }`}>
                                    +91 91246 17797
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* About Us */}
                    <div className="text-center sm:text-left">
                        <h4 className={`text-base font-bold mb-4 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-white'
                            : 'text-gray-900'
                            }`}>
                            About Us
                        </h4>
                        <ul className="space-y-3">
                            {aboutUsLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className={`text-sm hover:underline transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-gray-300 hover:text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                        }`}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products */}
                    <div className="text-center sm:text-left">
                        <h4 className={`text-base font-bold mb-4 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-white'
                            : 'text-gray-900'
                            }`}>
                            Products
                        </h4>
                        <ul className="space-y-3">
                            {productLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className={`text-sm hover:underline transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-gray-300 hover:text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                        }`}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="text-center sm:text-left">
                        <h4 className={`text-base font-bold mb-4 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-white'
                            : 'text-gray-900'
                            }`}>
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            {contactLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className={`text-sm hover:underline transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-gray-300 hover:text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                        }`}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Privacy Policy */}
                    <div className="text-center sm:text-left">
                        <h4 className={`text-base font-bold mb-4 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-white'
                            : 'text-gray-900'
                            }`}>
                            Important Links
                        </h4>
                        <ul className="space-y-3">
                            {privacyPolicyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className={`text-sm hover:underline transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-gray-300 hover:text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                        }`}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className={`h-[1px] my-8 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                    ? 'bg-white'
                    : 'bg-gray-900'
                    }`}></div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left sm:ml-[10px]">
                        <p className={`text-sm transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                            }`}>
                            © 2026 Shortlisted. All rights reserved.
                        </p>
                        <p className={`text-sm mt-1 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                            }`}>
                            Powered by{' '}
                            <span className={`font-semibold transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                ? 'text-[#00BAE8]'
                                : 'text-[#00BAE8]'
                                }`}>
                                <Link href="https://www.hirekarma.in/">HireKarma Pvt Ltd</Link>
                            </span>
                        </p>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-4 sm:mr-[10px]">
                        {socialLinks.map((social, index) => {
                            const IconComponent = social.icon;
                            const isGoogle = (social as any).isGoogle;
                            return (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full border border-black bg-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                                >
                                    {isGoogle ? (
                                        <span className="text-base font-bold text-black">G</span>
                                    ) : IconComponent ? (
                                        <IconComponent className="w-5 h-5 text-black" />
                                    ) : null}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
