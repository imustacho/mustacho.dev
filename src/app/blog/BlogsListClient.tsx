"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import type { BlogPost } from "@/lib/blogs";

interface BlogsListClientProps {
    posts: BlogPost[];
}

export default function BlogsListClient({ posts }: BlogsListClientProps) {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <div className="text-center flex flex-col items-center gap-3 mb-10">
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-heading text-5xl tracking-tight"
                        style={{ color: "var(--accent)" }}
                    >
                        Blog
                    </motion.h1>
                    <p className="text-lg max-w-lg" style={{ color: "var(--text-muted)" }}>
                        Thoughts, notes, and things I figured out.
                    </p>
                </div>

                <div className="flex flex-col gap-0 w-full mt-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                            No blog posts found.
                        </div>
                    ) : (
                        posts.map((post, idx) => (
                            <Link key={post.id} href={`/blog/${post.id}`} className="block">
                                <div
                                    className="group relative py-6 border-b cursor-pointer"
                                    style={{ borderColor: "var(--border-strong)" }}
                                >
                                    {/* Background */}
                                    <div className="absolute z-1 -inset-x-5 rounded-3xl bg-accent/60 scale-95 group-hover:scale-100 group-active:scale-95 group-active:opacity-100 opacity-0 group-hover:opacity-100 transition-[opacity,scale] ease-in-out duration-250 pointer-events-none" />
                                    {/* Content */}
                                    <div className="relative z-50 flex flex-col gap-3 ">
                                        <div className="flex justify-between items-start gap-4">
                                            {/* Meta */}
                                            <div
                                                className="flex items-center gap-3 text-xs font-semibold"
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
                                            </div>

                                            {/* Read time */}
                                            {post.readTime && (
                                                <div
                                                    className="flex items-center gap-1.5 text-xs font-mono"
                                                    style={{ color: "var(--text-faint)" }}
                                                >
                                                    <FaClock /> {post.readTime}
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h2
                                            className="font-heading text-2xl leading-tight group-hover:underline decoration-2 transition-colors"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p
                                                className="text-sm leading-relaxed"
                                                style={{ color: "var(--text-muted)" }}
                                            >
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
