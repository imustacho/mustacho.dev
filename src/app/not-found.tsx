"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
    return (
        <main className="min-h-screen relative overflow-hidden flex items-center justify-center">
            {/* Subtle warm glow — top right */}
            <div
                className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at top right, rgba(149,86,35,0.15) 0%, transparent 70%)",
                }}
            />

            <div className="flex flex-col items-center justify-center px-6 gap-6 text-center relative z-10">
                {/* 404 label */}
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-sm font-mono tracking-[0.4em] uppercase"
                    style={{ color: "var(--text-faint)" }}
                >
                    4 0 4
                </motion.span>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
                    className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight"
                    style={{ color: "var(--accent)" }}
                >
                    Nothing here.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
                    className="text-base md:text-lg max-w-md leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                >
                    The page you&apos;re looking for has been moved or never existed. Let&apos;s head back home.
                </motion.p>

                {/* Home button */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.35 }}
                    className="mt-2"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm border transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: "var(--bg-elevated)",
                            borderColor: "var(--border-strong)",
                            color: "var(--accent)",
                        }}
                    >
                        <FaArrowLeft size={12} />
                        Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
