"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
}

export default function SingleBlogPage() {
    const params = useParams();
    const id = params?.id as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/blogs/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Blog not found");
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto flex flex-col justify-center min-h-screen">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/blogs"
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

                {loading ? (
                    <div
                        className="flex items-center justify-center py-20 font-heading text-2xl"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Loading...
                    </div>
                ) : !post ? (
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
                            <span
                                className="px-2.5 py-0.5 rounded-full border"
                                style={{
                                    backgroundColor: "var(--border)",
                                    borderColor: "var(--border-strong)",
                                }}
                            >
                                {post.category}
                            </span>
                            <span
                                className="flex items-center gap-1 font-mono"
                                style={{ color: "var(--text-muted)" }}
                            >
                                <FaCalendarAlt /> {post.date}
                            </span>
                            <span
                                className="flex items-center gap-1 font-mono"
                                style={{ color: "var(--text-muted)" }}
                            >
                                <FaClock /> {post.readTime}
                            </span>
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
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => (
                                        <h1
                                            className="font-heading text-3xl md:text-4xl mt-8 mb-4"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2
                                            className="font-heading text-2xl md:text-3xl mt-8 mb-3"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3
                                            className="font-heading text-xl md:text-2xl mt-6 mb-2"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            {children}
                                        </h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
                                            {children}
                                        </p>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="underline font-medium transition-opacity hover:opacity-70"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            {children}
                                        </a>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc pl-6 mb-5 flex flex-col gap-2">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal pl-6 mb-5 flex flex-col gap-2">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="pl-1 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
                                            {children}
                                        </li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote
                                            className="border-l-4 pl-4 py-1 italic my-5 rounded-r-lg"
                                            style={{
                                                borderColor: "var(--border-strong)",
                                                backgroundColor: "var(--border)",
                                                color: "var(--text-faint)",
                                            }}
                                        >
                                            {children}
                                        </blockquote>
                                    ),
                                    code: ({ className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return match ? (
                                            <pre
                                                className="p-4 rounded-xl font-mono text-xs md:text-sm overflow-x-auto my-5 w-full leading-normal border"
                                                style={{
                                                    backgroundColor: "var(--bg-surface)",
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--text-primary)",
                                                }}
                                            >
                                                <code className={className} {...props}>{children}</code>
                                            </pre>
                                        ) : (
                                            <code
                                                className="px-1.5 py-0.5 rounded font-mono text-xs md:text-sm font-semibold border"
                                                style={{
                                                    backgroundColor: "var(--border)",
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--accent)",
                                                }}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </motion.article>
                )}
            </div>
        </main>
    );
}
