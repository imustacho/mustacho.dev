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
        <main className="min-h-screen relative overflow-hidden" style={{ color: "#955623" }}>
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto flex flex-col justify-center min-h-screen">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#955623] hover:text-[#7a451b] cursor-pointer select-none"
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
                    <div className="flex items-center justify-center py-20 font-heading text-2xl text-[#955623]">
                        Yükleniyor... / Loading...
                    </div>
                ) : !post ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <div className="text-6xl">⚠️</div>
                        <h2 className="font-heading text-2xl text-[#955623]">Yazı Bulunamadı / Article Not Found</h2>
                    </div>
                ) : (
                    <motion.article
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="w-full flex flex-col justify-between"
                    >
                        <div>
                            {/* Meta Tags */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-[#955623] mb-4">
                                <span className="px-2.5 py-0.5 bg-[#955623]/10 border border-[#955623]/15 rounded-full">
                                    {post.category}
                                </span>
                                <span className="flex items-center gap-1 text-[#7a451b]/70 font-mono">
                                    <FaCalendarAlt /> {post.date}
                                </span>
                                <span className="flex items-center gap-1 text-[#7a451b]/70 font-mono">
                                    <FaClock /> {post.readTime}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="font-heading text-4xl md:text-6xl text-[#955623] leading-tight mb-8">
                                {post.title}
                            </h1>

                            {/* Divider Line */}
                            <div className="w-full h-[2px] bg-[#955623]/15 mb-8" />

                            {/* Content Body */}
                            <div className="leading-relaxed text-[#7a451b] text-base md:text-lg">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ children }) => <h1 className="font-heading text-3xl md:text-4xl text-[#955623] mt-8 mb-4">{children}</h1>,
                                        h2: ({ children }) => <h2 className="font-heading text-2xl md:text-3xl text-[#955623] mt-8 mb-3">{children}</h2>,
                                        h3: ({ children }) => <h3 className="font-heading text-xl md:text-2xl text-[#955623] mt-6 mb-2">{children}</h3>,
                                        p: ({ children }) => <p className="leading-relaxed mb-5 text-[#7a451b]/95">{children}</p>,
                                        a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-[#955623] underline hover:text-[#7a451b] font-medium">{children}</a>,
                                        ul: ({ children }) => <ul className="list-disc pl-6 mb-5 flex flex-col gap-2">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 flex flex-col gap-2">{children}</ol>,
                                        li: ({ children }) => <li className="pl-1 text-[#7a451b]/90 text-sm md:text-base">{children}</li>,
                                        blockquote: ({ children }) => <blockquote className="border-l-4 border-[#955623]/30 pl-4 py-1 italic my-5 text-[#7a451b]/80 bg-[#955623]/4 rounded-r-lg">{children}</blockquote>,
                                        code: ({ className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || "");
                                            return match ? (
                                                <pre className="bg-[#1e0f08] border border-[#955623]/20 text-[#f5efe6] p-4 rounded-xl font-mono text-xs md:text-sm overflow-x-auto my-5 w-full leading-normal">
                                                    <code className={className} {...props}>{children}</code>
                                                </pre>
                                            ) : (
                                                <code className="bg-[#955623]/8 border border-[#955623]/15 text-[#955623] px-1.5 py-0.5 rounded font-mono text-xs md:text-sm font-semibold" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </motion.article>
                )}
            </div>
        </main>
    );
}
