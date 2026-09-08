"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MustacheSvg from "@/components/mustachesvg";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeMode, ColorTheme } from "@/context/ThemeContext";
import { HiSun, HiMoon, HiComputerDesktop } from "react-icons/hi2";

const NAV_ITEMS = [
    { label: "About", href: "/about", view: "about" },
    { label: "Skills", href: "/skills", view: "skills" },
    { label: "Projects", href: "/projects", view: "projects" },
    { label: "Blog", href: "/blog", view: "blog" },
    { label: "Contact", href: "/contact", view: "contact" },
];

/* Color theme display config */
const COLOR_THEME_CONFIG: Record<ColorTheme, { label: string; dot: string }> = {
    default: { label: "Default", dot: "#111111" },
    cream:   { label: "Cream",   dot: "#955623" },
    red:     { label: "Red",     dot: "#d44040" },
    blue:    { label: "Blue",    dot: "#2e6bc4" },
};

export default function Navbar() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname() || "";
    const { theme, mode, setMode, colorTheme, setColorTheme } = useTheme();

    const CYCLE: ThemeMode[] = ["system", "dark", "light"];
    const cycleMode = () => {
        const idx = CYCLE.indexOf(mode);
        setMode(CYCLE[(idx + 1) % CYCLE.length]);
    };
    const ModeIcon = mode === "dark" ? HiMoon : mode === "light" ? HiSun : HiComputerDesktop;
    const modeLabel = mode === "dark" ? "Dark" : mode === "light" ? "Light" : "System";

    /* Color theme cycle */
    const COLOR_CYCLE: ColorTheme[] = ["default", "cream", "red", "blue"];
    const cycleColorTheme = () => {
        const idx = COLOR_CYCLE.indexOf(colorTheme);
        setColorTheme(COLOR_CYCLE[(idx + 1) % COLOR_CYCLE.length]);
    };
    const colorConfig = COLOR_THEME_CONFIG[colorTheme];

    const getActiveView = () => {
        if (pathname === "/about") return "about";
        if (pathname === "/skills") return "skills";
        if (pathname === "/projects") return "projects";
        if (pathname.startsWith("/blog")) return "blog";
        if (pathname === "/contact") return "contact";
        return "home";
    };

    const activeView = getActiveView();

    const Path = (props: Record<string, unknown>) => (
        <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="var(--accent)"
            strokeLinecap="round"
            {...props}
        />
    );

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg md:max-w-3xl">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.15 }}
                className="flex items-center justify-between gap-2 px-4 py-2 rounded-full border backdrop-blur-xl w-full relative"
                style={{
                    backgroundColor: "var(--navbar-bg)",
                    borderColor: "var(--border)",
                    boxShadow: `0 12px 40px var(--shadow-strong)`,
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="font-heading text-base font-bold tracking-tight flex items-center gap-1 shrink-0"
                    style={{ color: "var(--accent)" }}
                >
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Mustacho
                    </motion.span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden sm:flex items-center gap-0.5">
                    {NAV_ITEMS.map((item, idx) => {
                        const isActive = activeView === item.view;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative px-2.5 py-1.5 text-xs font-medium transition-colors duration-200 rounded-full cursor-pointer select-none whitespace-nowrap"
                                style={{
                                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                                    fontWeight: isActive ? 600 : 500,
                                }}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {hoveredIndex === idx && (
                                    <motion.span
                                        layoutId="navHover"
                                        className="absolute inset-0 rounded-full -z-10"
                                        style={{ backgroundColor: "var(--border)" }}
                                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                    />
                                )}

                                {isActive && (
                                    <motion.span
                                        layoutId="activeDot"
                                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                        style={{ backgroundColor: "var(--accent)" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                    />
                                )}
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right controls: Color Theme + Dark Mode Toggle + Hamburger */}
                <div className="flex items-center gap-2">
                    {/* Color theme cycle button */}
                    <motion.button
                        onClick={cycleColorTheme}
                        className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer border"
                        style={{
                            borderColor: "var(--border)",
                            backgroundColor: "var(--border)",
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Switch color theme"
                        title={`Theme: ${colorConfig.label} — click to cycle`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={colorTheme}
                                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.18 }}
                                className="flex items-center justify-center"
                            >
                                <span
                                    className="w-3.5 h-3.5 rounded-full border-2"
                                    style={{
                                        backgroundColor: colorConfig.dot,
                                        borderColor: theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)",
                                    }}
                                />
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>

                    {/* Theme mode cycle button */}
                    <motion.button
                        onClick={cycleMode}
                        className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer border"
                        style={{
                            color: "var(--accent)",
                            borderColor: "var(--border)",
                            backgroundColor: "var(--border)",
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle theme"
                        title={`Current: ${modeLabel} — click to cycle`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={mode}
                                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.18 }}
                                className="flex items-center justify-center"
                            >
                                <ModeIcon size={15} />
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="sm:hidden flex items-center justify-center w-8 h-8 p-1 cursor-pointer bg-transparent border-none outline-none select-none"
                        style={{ color: "var(--accent)" }}
                        aria-label="Toggle Menu"
                    >
                        <svg width="22" height="22" viewBox="0 0 23 23">
                            <Path
                                variants={{
                                    closed: { d: "M 2 2.5 L 20 2.5" },
                                    open: { d: "M 3 16.5 L 17 2.5" },
                                }}
                                animate={isMenuOpen ? "open" : "closed"}
                                transition={{ duration: 0.2 }}
                            />
                            <Path
                                d="M 2 9.423 L 20 9.423"
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 },
                                }}
                                transition={{ duration: 0.1 }}
                                animate={isMenuOpen ? "open" : "closed"}
                            />
                            <Path
                                variants={{
                                    closed: { d: "M 2 16.346 L 20 16.346" },
                                    open: { d: "M 3 2.5 L 17 16.346" },
                                }}
                                animate={isMenuOpen ? "open" : "closed"}
                                transition={{ duration: 0.2 }}
                            />
                        </svg>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.95 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute top-16 left-0 right-0 border rounded-3xl p-3 flex flex-col gap-1 backdrop-blur-xl sm:hidden origin-top z-40"
                        style={{
                            backgroundColor: "var(--navbar-bg-solid)",
                            borderColor: "var(--border)",
                            boxShadow: `0 12px 40px var(--shadow-strong)`,
                        }}
                    >
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeView === item.view;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-3 text-center text-sm font-semibold rounded-2xl transition-all cursor-pointer select-none active:scale-95"
                                    style={{
                                        backgroundColor: isActive ? "var(--border)" : "transparent",
                                        color: isActive ? "var(--accent)" : "var(--text-muted)",
                                    }}
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
