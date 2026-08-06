"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
}

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/blogs")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "#955623" }}>
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <div className="text-center flex flex-col items-center gap-3 mb-10">
                    <motion.h2
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-heading text-5xl text-[#955623] tracking-tight"
                    >
                        Mustacho Blogs
                    </motion.h2>
                    <p className="text-lg text-[#7a451b] max-w-lg">
                        My cozy blog.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 font-heading text-2xl text-[#955623]">
                        Loading...
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 w-full mt-4">
                        {posts.map((post, idx) => (
                            <Link key={post.id} href={`/blogs/${post.id}`} className="block">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: idx * 0.08 }}
                                    whileHover={{ x: 6 }}
                                    className="py-6 border-b border-[#955623]/15 flex flex-col gap-3 cursor-pointer group transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        {/* Meta Info */}
                                        <div className="flex items-center gap-3 text-xs font-semibold text-[#955623]">
                                            <span className="px-2.5 py-0.5 bg-[#955623]/10 border border-[#955623]/15 rounded-full">
                                                {post.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-[#7a451b]/70 font-mono">
                                                <FaCalendarAlt /> {post.date}
                                            </span>
                                        </div>

                                        {/* Read Time Info */}
                                        <div className="flex items-center gap-1.5 text-xs text-[#7a451b]/60 font-mono">
                                            <FaClock /> {post.readTime}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-heading text-2xl text-[#955623] group-hover:text-[#7a451b] transition-colors leading-tight group-hover:underline decoration-2">
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-sm text-[#7a451b]/95 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
