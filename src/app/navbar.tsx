"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MustacheSvg from "@/components/mustachesvg";
import { HiXMark } from "react-icons/hi2";

const NAV_ITEMS = [
    { label: "About", href: "/about", view: "about" },
    { label: "Skills", href: "/skills", view: "skills" },
    { label: "Projects", href: "/projects", view: "projects" },
    { label: "Blog", href: "/blog", view: "blog" },
    { label: "Contact", href: "/contact", view: "contact" }
];

export default function Navbar() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname() || "";

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    const getActiveView = () => {
        if (pathname === "/about") return "about";
        if (pathname === "/skills") return "skills";
        if (pathname === "/projects") return "projects";
        if (pathname.startsWith("/blog")) return "blog";
        if (pathname === "/contact") return "contact";
        return "home";
    };

    const activeView = getActiveView();

    // SVG path helper for morphing hamburger
    const Path = (props: any) => (
        <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="var(--accent)"
            strokeLinecap="round"
            {...props}
        />
    );

    return (
        <>
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg md:max-w-2xl">
                <motion.nav 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.15 }}
                    className="flex items-center justify-between gap-4 px-6 py-2.5 rounded-full bg-[var(--navbar-bg)] border border-[var(--border)] shadow-[0_12px_40px_var(--shadow-strong)] backdrop-blur-md w-full relative"
                >
                    {/* Logo (Home Link) */}
                    <Link href="/" className="font-heading text-lg font-bold tracking-tight text-[var(--accent)] flex items-center gap-1.5 cursor-pointer shrink-0">
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
                                        isActive ? "text-[var(--accent)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--accent)]"
                                    }`}
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {/* Hover Background Pill Effect */}
                                    {hoveredIndex === idx && (
                                        <motion.span
                                            layoutId="navHover"
                                            className="absolute inset-0 bg-[var(--border)] rounded-full -z-10"
                                            style={{ opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        />
                                    )}

                                    {/* Active Dot indicator */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeDot"
                                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                                            style={{ opacity: 1 }}
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
                        onClick={() => setIsMenuOpen(true)} 
                        className="sm:hidden flex items-center justify-center w-8 h-8 p-1 text-[var(--accent)] cursor-pointer bg-transparent border-none outline-none select-none"
                        aria-label="Open Menu"
                    >
                        <svg width="23" height="23" viewBox="0 0 23 23">
                            <Path d="M 2 2.5 L 20 2.5" />
                            <Path d="M 2 9.423 L 20 9.423" />
                            <Path d="M 2 16.346 L 20 16.346" />
                        </svg>
                    </button>
                </motion.nav>
            </div>

            {/* Fullscreen Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 32 }}
                        className="fixed inset-0 z-[100] w-screen h-[100dvh] flex flex-col justify-between px-6 py-8 sm:hidden"
                        style={{
                            backgroundColor: "var(--bg)",
                            color: "var(--text-primary)",
                        }}
                    >
                        {/* Top Header Row inside Fullscreen Menu */}
                        <div className="flex items-center justify-between w-full pt-2">
                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="font-heading text-lg font-bold tracking-tight text-[var(--accent)] flex items-center gap-1.5 shrink-0"
                            >
                                <MustacheSvg className="w-8 h-auto shrink-0 translate-y-[1px]" />
                                <span>Mustacho</span>
                            </Link>

                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center w-9 h-9 cursor-pointer bg-transparent border-none outline-none text-[var(--accent)]"
                                aria-label="Close Menu"
                            >
                                <HiXMark size={28} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 flex flex-col justify-center w-full my-auto">
                            <div className="flex flex-col border-t border-[var(--border)]">
                                {NAV_ITEMS.map((item, idx) => {
                                    const isActive = activeView === item.view;
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.04 * idx + 0.1, duration: 0.2 }}
                                            className="border-b border-[var(--border)]"
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center justify-between py-5 text-3xl font-heading font-bold transition-all cursor-pointer select-none active:scale-[0.98]"
                                                style={{
                                                    color: isActive ? "var(--accent)" : "var(--text-primary)",
                                                }}
                                            >
                                                <span>{item.label}</span>
                                                {isActive && (
                                                    <span
                                                        className="w-3 h-3 rounded-full bg-[var(--accent)]"
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="w-full pt-4 border-t border-[var(--border)]">
                            <a
                                href="mailto:mail@mustacho.dev"
                                className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                            >
                                mail@mustacho.dev
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

