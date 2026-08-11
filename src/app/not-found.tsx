"use client";

import { motion } from "motion/react";
import Link from "next/link";
import MustacheSvg from "@/components/mustachesvg";

export default function NotFound() {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-6 text-center">
                {/* Mustache icon */}
                <motion.div
                    initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                    animate={{ opacity: 0.15, rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 80, damping: 14 }}
                >
                    <MustacheSvg className="w-32 md:w-40" />
                </motion.div>

                {/* 404 */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                    className="font-heading text-7xl md:text-9xl tracking-tight"
                    style={{ color: "var(--accent)" }}
                >
                    404
                </motion.h1>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                    className="text-lg max-w-md"
                    style={{ color: "var(--text-muted)" }}
                >
                    This page doesn&apos;t exist. Maybe it never did.
                </motion.p>

                {/* Back home button */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
                        style={{
                            backgroundColor: "var(--accent)",
                            color: "var(--bg)",
                        }}
                    >
                        Go Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
