"use client";

import { motion } from "motion/react";
import { FaGithub, FaExternalLinkAlt, FaRobot, FaDesktop } from "react-icons/fa";
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
    category?: string;
}

const projects = projectsData as Project[];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Discord Bots": <FaRobot />,
    "Desktop Applications": <FaDesktop />,
};

export default function Projects() {
    // Group projects by category preserving standard order
    const categories = Array.from(new Set(projects.map((p) => p.category || "Other")));

    return (
        <section className="py-20 px-6 max-w-6xl mx-auto flex flex-col items-center gap-14">
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
                    Things I&apos;ve built, categorized by platform.
                </p>
            </div>

            {/* Category Groups */}
            <div className="flex flex-col gap-12 w-full">
                {categories.map((category) => {
                    const categoryProjects = projects.filter((p) => (p.category || "Other") === category);
                    const categoryIcon = CATEGORY_ICONS[category] || null;

                    return (
                        <div key={category} className="flex flex-col gap-5 w-full">
                            {/* Category Section Title */}
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2.5 pb-2 border-b"
                                style={{ borderColor: "var(--border-strong)" }}
                            >
                                <span className="text-lg" style={{ color: "var(--accent)" }}>
                                    {categoryIcon}
                                </span>
                                <h3 className="font-heading text-2xl tracking-tight" style={{ color: "var(--accent)" }}>
                                    {category}
                                </h3>
                                <span
                                    className="text-xs font-mono px-2 py-0.5 rounded-full border"
                                    style={{
                                        backgroundColor: "var(--border)",
                                        borderColor: "var(--border-strong)",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    {categoryProjects.length}
                                </span>
                            </motion.div>

                            {/* 3-Column Compact Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                                {categoryProjects.map((project, idx) => {
                                    const status = project.status ?? "active";

                                    return (
                                        <motion.div
                                            key={project.id}
                                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: idx * 0.06 }}
                                            className="group hover:scale-105 active:scale-100 cursor-pointer relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-250"
                                            style={{
                                                backgroundColor: "var(--bg-surface)",
                                                borderColor: "var(--border-strong)",
                                                boxShadow: "0 4px 16px var(--shadow)",
                                            }}
                                        >
                                            <div className="flex flex-col gap-4">
                                                {/* Top Bar: Badges + Links */}
                                                <div className="flex items-center justify-between gap-2 w-full">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {/* Featured Badge */}
                                                        {project.featured && (
                                                            <span
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs"
                                                                style={{
                                                                    backgroundColor: "var(--accent)",
                                                                    color: "var(--bg)",
                                                                }}
                                                            >
                                                                <HiSparkles size={11} /> Featured
                                                            </span>
                                                        )}

                                                        {/* Status Badge */}
                                                        <span
                                                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                                                            style={{
                                                                backgroundColor: "var(--border)",
                                                                borderColor: "var(--border-strong)",
                                                                color: "var(--accent)",
                                                            }}
                                                        >
                                                            {status === "active" && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            )}
                                                            {status === "wip" && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                            )}
                                                            {status === "archived" && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                                            )}
                                                            <span className="capitalize">{status}</span>
                                                        </span>
                                                    </div>

                                                    {/* Code & Demo Links */}
                                                    <div className="flex items-center gap-1.5">
                                                        {project.codeUrl && (
                                                            <motion.a
                                                                href={project.codeUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer"
                                                                style={{
                                                                    backgroundColor: "var(--border)",
                                                                    borderColor: "var(--border-strong)",
                                                                    color: "var(--accent)",
                                                                }}
                                                                whileHover={{ scale: 1.06, backgroundColor: "var(--border-strong)" }}
                                                                whileTap={{ scale: 0.94 }}
                                                                title="Source Code"
                                                            >
                                                                <FaGithub size={12} />
                                                                <span>Code</span>
                                                            </motion.a>
                                                        )}

                                                        {project.demoUrl && (
                                                            <motion.a
                                                                href={project.demoUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer"
                                                                style={{
                                                                    backgroundColor: "var(--border)",
                                                                    borderColor: "var(--border-strong)",
                                                                    color: "var(--accent)",
                                                                }}
                                                                whileHover={{ scale: 1.06, backgroundColor: "var(--border-strong)" }}
                                                                whileTap={{ scale: 0.94 }}
                                                                title="Live Demo"
                                                            >
                                                                <FaExternalLinkAlt size={10} />
                                                                <span>Demo</span>
                                                            </motion.a>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Emoji & Title */}
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shrink-0 shadow-xs"
                                                        style={{
                                                            backgroundColor: "var(--border)",
                                                            borderColor: "var(--border-strong)",
                                                        }}
                                                    >
                                                        {project.icon}
                                                    </div>
                                                    <h4
                                                        className="font-heading text-xl tracking-tight leading-tight group-hover:underline decoration-2 transition-all"
                                                        style={{ color: "var(--accent)" }}
                                                    >
                                                        {project.title}
                                                    </h4>
                                                </div>

                                                {/* Description */}
                                                <p
                                                    className="text-xs sm:text-sm leading-relaxed min-h-10.5"
                                                    style={{ color: "var(--text-muted)" }}
                                                >
                                                    {project.description}
                                                </p>
                                            </div>

                                            {/* Tech Tags */}
                                            <div
                                                className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t"
                                                style={{ borderColor: "var(--border)" }}
                                            >
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 text-[11px] font-semibold rounded-full border transition-all"
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
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
