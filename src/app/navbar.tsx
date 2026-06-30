"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MustacheSvg from "@/components/mustachesvg";

const NAV_ITEMS = [
    { label: "About", href: "/about", view: "about" },
    { label: "Projects", href: "/projects", view: "projects" },
    { label: "Blog", href: "/blogs", view: "blogs" },
    { label: "Contact", href: "/contact", view: "contact" }
];

export default function Navbar() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname() || "";

    const getActiveView = () => {
        if (pathname === "/about") return "about";
        if (pathname === "/projects") return "projects";
        if (pathname.startsWith("/blogs")) return "blogs";
        if (pathname === "/contact") return "contact";
        return "home";
    };

    const activeView = getActiveView();

    // SVG path helper for morphing hamburger
    const Path = (props: any) => (
        <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="#955623"
            strokeLinecap="round"
            {...props}
        />
    );

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg md:max-w-2xl">
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.15 }}
                className="flex items-center justify-between gap-4 px-6 py-2.5 rounded-full bg-[#f5efe6]/85 border border-[#955623]/15 shadow-[0_12px_40px_rgba(149,86,35,0.15)] backdrop-blur-md w-full relative"
            >
                {/* Logo (Home Link) */}
                <Link href="/" className="font-heading text-lg font-bold tracking-tight text-[#955623] flex items-center gap-1.5 cursor-pointer shrink-0">
                    <motion.span 
                        className="flex items-center gap-1 md:gap-1.5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MustacheSvg className="w-9 h-auto md:w-12 shrink-0 translate-y-[1px]" />
                        <span>Mustacho</span>
                    </motion.span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden sm:flex items-center gap-0.5 md:gap-2">
                    {NAV_ITEMS.map((item, idx) => {
                        const isActive = activeView === item.view;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                className={`relative px-3 py-1.5 text-xs md:text-sm font-medium transition-colors duration-200 rounded-full cursor-pointer select-none whitespace-nowrap ${
                                    isActive ? "text-[#955623] font-semibold" : "text-[#7a451b] hover:text-[#955623]"
                                }`}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Hover Background Pill Effect */}
                                {hoveredIndex === idx && (
                                    <motion.span
                                        layoutId="navHover"
                                        className="absolute inset-0 bg-[#955623]/8 rounded-full -z-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    />
                                )}

                                {/* Active Dot indicator */}
                                {isActive && (
                                    <motion.span
                                        layoutId="activeDot"
                                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#955623]"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                )}
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Hamburger Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="sm:hidden flex items-center justify-center w-8 h-8 p-1 text-[#955623] cursor-pointer bg-transparent border-none outline-none select-none"
                    aria-label="Toggle Menu"
                >
                    <svg width="23" height="23" viewBox="0 0 23 23">
                        <Path
                            variants={{
                                closed: { d: "M 2 2.5 L 20 2.5" },
                                open: { d: "M 3 16.5 L 17 2.5" }
                            }}
                            animate={isMenuOpen ? "open" : "closed"}
                            transition={{ duration: 0.2 }}
                        />
                        <Path
                            d="M 2 9.423 L 20 9.423"
                            variants={{
                                closed: { opacity: 1 },
                                open: { opacity: 0 }
                            }}
                            transition={{ duration: 0.1 }}
                            animate={isMenuOpen ? "open" : "closed"}
                        />
                        <Path
                            variants={{
                                closed: { d: "M 2 16.346 L 20 16.346" },
                                open: { d: "M 3 2.5 L 17 16.346" }
                            }}
                            animate={isMenuOpen ? "open" : "closed"}
                            transition={{ duration: 0.2 }}
                        />
                    </svg>
                </button>
            </motion.nav>

            {/* Mobile Dropdown Panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-16 left-0 right-0 bg-[#f5efe6]/95 border border-[#955623]/15 rounded-3xl p-4 flex flex-col gap-2 shadow-[0_12px_40px_rgba(149,86,35,0.18)] backdrop-blur-md sm:hidden origin-top z-40"
                    >
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeView === item.view;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 text-center text-sm font-semibold rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
                                        isActive 
                                            ? "bg-[#955623]/10 text-[#955623] shadow-sm" 
                                            : "text-[#7a451b] hover:bg-[#955623]/5"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
