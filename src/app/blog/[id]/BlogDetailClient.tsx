"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blogs";

interface BlogDetailClientProps {
    post: Omit<BlogPost, "content">;
    children: ReactNode;
}

export default function BlogDetailClient({ post, children }: BlogDetailClientProps) {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto flex flex-col justify-center min-h-screen">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2"
                            whileHover={{ x: -4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaArrowLeft /> Go Back
                        </motion.span>
                    </Link>
                </div>

                {!post ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <div className="text-6xl">⚠️</div>
                        <h2
                            className="font-heading text-2xl"
                            style={{ color: "var(--accent)" }}
                        >
                            Article Not Found
                        </h2>
                    </div>
                ) : (
                    <motion.article
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="w-full flex flex-col"
                    >
                        {/* Meta Tags */}
                        <div
                            className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold mb-5"
                            style={{ color: "var(--accent)" }}
                        >
                            {post.category && (
                                <span
                                    className="px-2.5 py-0.5 rounded-full border"
                                    style={{
                                        backgroundColor: "var(--border)",
                                        borderColor: "var(--border-strong)",
                                    }}
                                >
                                    {post.category}
                                </span>
                            )}
                            {post.date && (
                                <span
                                    className="flex items-center gap-1 font-mono"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    <FaCalendarAlt /> {post.date}
                                </span>
                            )}
                            {post.readTime && (
                                <span
                                    className="flex items-center gap-1 font-mono"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    <FaClock /> {post.readTime}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1
                            className="font-heading text-4xl md:text-6xl leading-tight mb-8"
                            style={{ color: "var(--accent)" }}
                        >
                            {post.title}
                        </h1>

                        {/* Divider */}
                        <div
                            className="w-full h-px mb-8"
                            style={{ backgroundColor: "var(--border-strong)" }}
                        />

                        {/* Content Body */}
                        <div
                            className="leading-relaxed text-base md:text-lg"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {children}
                        </div>
                    </motion.article>
                )}
            </div>
        </main>
    );
}
