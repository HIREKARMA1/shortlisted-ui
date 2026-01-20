"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MapPin, Mail, Phone, Facebook, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { OptimizedImage } from './optimized-image';

const Footer: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Logo URLs based on theme
    const logoUrl =
        mounted && theme === "dark"
            ? "https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/shortlisted-logo-dm.png"
            : "https://hirekarma.s3.us-east-1.amazonaws.com/shortlisted/shortlisted-logo-lm.png";

    const productLinks = [
        { name: "Disha", href: "#" },
        { name: "Solviq AI", href: "#" }
    ];

    const companyLinks = [
        { name: "About Us", href: "#" },
        { name: "Our Story", href: "#" },
        { name: "Mission & Value", href: "#" },
        { name: "People", href: "#" }
    ];

    const supportLinks = [
        { name: "Contact Us", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "FAQ", href: "#" }
    ];

    const legalLinks = [
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Refund Policy", href: "#" },
        { name: "Release Notes", href: "#" }
    ];

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Github, href: "#", label: "GitHub" },
        { icon: Twitter, href: "#", label: "Twitter" }
    ];

    return (
        <footer className={`relative font-sans transition-all duration-500 ${mounted && resolvedTheme === 'dark'
            ? 'bg-gray-900'
            : 'bg-white'
            }`}>
            <div className="w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
                    {/* Brand & Contact Information */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                {/* <Link href="/" className="flex items-center">
                                    <OptimizedImage
                                        src={logoUrl}
                                        alt="Shortlisted Logo"
                                        width={140}
                                        height={40}
                                        className="h-10 w-auto"
                                    />
                                </Link> */}
                                <div>
                                    <h3 className={`text-xl font-bold transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-white'
                                        : 'text-gray-900'
                                        }`}>
                                        Shortlisted
                                    </h3>
                                    <p className={`text-sm transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                                        }`}>
                                        Simplify Hiring
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                    }`} />
                                <p className={`text-sm transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                    }`}>
                                    Room No: 109, 1st Floor, Tower A, O-HUB, Bhubaneswar
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
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
                            <div className="flex items-center gap-3">
                                <Phone className={`w-5 h-5 flex-shrink-0 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                    }`} />
                                <a href="tel:+919078683876" className={`text-sm hover:underline transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                    }`}>
                                    +91 90786 83876
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
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

                    {/* Company */}
                    <div>
                        <h4 className={`text-base font-bold mb-4 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-white'
                            : 'text-gray-900'
                            }`}>
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link, index) => (
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

                    {/* Legal */}
                    <div>
                        <h4 className={`text-base font-bold mb-4 transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-white'
                            : 'text-gray-900'
                            }`}>
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {legalLinks.map((link, index) => (
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
                    <div className="text-center sm:text-left">
                        <p className={`text-sm transition-colors duration-500 ${mounted && resolvedTheme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                            }`}>
                            © 2025 Solviq AI. All rights reserved. Made with • in India
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
                                HireKarma Pvt Ltd
                            </span>
                        </p>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social, index) => {
                            const IconComponent = social.icon;
                            return (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${mounted && resolvedTheme === 'dark'
                                        ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                                        : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    <IconComponent className="w-5 h-5" />
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
