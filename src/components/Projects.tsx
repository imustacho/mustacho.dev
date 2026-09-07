"use client";

import { motion } from "motion/react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import projectsData from "@/data/projects.json";

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    demoUrl?: string;
    codeUrl: string;
    icon: string;
    status?: "active" | "archived" | "wip";
    featured?: boolean;
}

const projects = projectsData as Project[];

export default function Projects() {
    return (
        <section className="py-20 px-6 max-w-5xl mx-auto flex flex-col items-center gap-12">
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-3">
                <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-heading text-5xl tracking-tight"
                    style={{ color: "var(--accent)" }}
                >
                    Projects
                </motion.h2>
                <p className="text-lg max-w-lg" style={{ color: "var(--text-muted)" }}>
                    Some things I&apos;ve built and worked on.
                </p>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {projects.map((project, idx) => {
                    const status = project.status ?? "active";

                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: idx * 0.08 }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="group relative flex flex-col justify-between p-6 md:p-7 rounded-3xl border transition-all duration-300"
                            style={{
                                backgroundColor: "var(--bg-surface)",
                                borderColor: "var(--border-strong)",
                                boxShadow: "0 8px 24px var(--shadow)",
                            }}
                        >
                            <div className="flex flex-col gap-5">
                                {/* Top Row: Badges on left, Links on right */}
                                <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                                    {/* Badges Container */}
                                    <div className="flex items-center flex-wrap gap-2">
                                        {/* Featured Tag */}
                                        {project.featured && (
                                            <span
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-xs"
                                                style={{
                                                    backgroundColor: "var(--accent)",
                                                    color: "var(--bg)",
                                                }}
                                            >
                                                <HiSparkles size={13} /> Featured
                                            </span>
                                        )}

                                        {/* Status Tag */}
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
                                            style={{
                                                backgroundColor: "var(--border)",
                                                borderColor: "var(--border-strong)",
                                                color: "var(--accent)",
                                            }}
                                        >
                                            {status === "active" && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            )}
                                            {status === "wip" && (
                                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            )}
                                            {status === "archived" && (
                                                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                                            )}
                                            <span className="capitalize">{status}</span>
                                        </span>
                                    </div>

                                    {/* Action Links */}
                                    <div className="flex items-center gap-2">
                                        {project.codeUrl && (
                                            <motion.a
                                                href={project.codeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer"
                                                style={{
                                                    backgroundColor: "var(--border)",
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--accent)",
                                                }}
                                                whileHover={{ scale: 1.05, backgroundColor: "var(--border-strong)" }}
                                                whileTap={{ scale: 0.95 }}
                                                title="View Source Code"
                                            >
                                                <FaGithub size={14} />
                                                <span>Code</span>
                                            </motion.a>
                                        )}

                                        {project.demoUrl && (
                                            <motion.a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer"
                                                style={{
                                                    backgroundColor: "var(--border)",
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--accent)",
                                                }}
                                                whileHover={{ scale: 1.05, backgroundColor: "var(--border-strong)" }}
                                                whileTap={{ scale: 0.95 }}
                                                title="View Live Demo"
                                            >
                                                <FaExternalLinkAlt size={12} />
                                                <span>Demo</span>
                                            </motion.a>
                                        )}
                                    </div>
                                </div>

                                {/* Title & Emoji Header */}
                                <div className="flex items-center gap-4 mt-1">
                                    <div
                                        className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl border shrink-0 shadow-xs"
                                        style={{
                                            backgroundColor: "var(--border)",
                                            borderColor: "var(--border-strong)",
                                        }}
                                    >
                                        {project.icon}
                                    </div>
                                    <h3
                                        className="font-heading text-2xl tracking-tight leading-tight group-hover:underline decoration-2 transition-all"
                                        style={{ color: "var(--accent)" }}
                                    >
                                        {project.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {project.description}
                                </p>
                            </div>

                            {/* Tech Stack Tags */}
                            <div
                                className="flex flex-wrap gap-2 mt-5 pt-4 border-t"
                                style={{ borderColor: "var(--border)" }}
                            >
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs font-semibold rounded-full border transition-all"
                                        style={{
                                            backgroundColor: "var(--border)",
                                            borderColor: "var(--border-strong)",
                                            color: "var(--accent)",
                                        }}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
