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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "rgba(52,168,83,0.85)" },
    archived: { label: "Archived", color: "rgba(149,86,35,0.5)" },
    wip: { label: "WIP", color: "rgba(251,188,5,0.9)" },
};

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
                    Some things I&apos;ve worked on.
                </p>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {projects.map((project, idx) => {
                    const statusInfo = STATUS_LABELS[project.status ?? "active"];
                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: idx * 0.08 }}
                            whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                            className="group relative flex flex-col gap-5 p-6 md:p-7 rounded-3xl border overflow-hidden"
                            style={{
                                backgroundColor: "var(--bg-elevated)",
                                borderColor: "var(--border)",
                                boxShadow: `0 8px 32px var(--shadow)`,
                            }}
                        >
                            {/* Subtle gradient hover overlay */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                                style={{
                                    background: `radial-gradient(ellipse at top left, var(--border) 0%, transparent 70%)`,
                                }}
                            />

                            {/* Featured badge */}
                            {project.featured && (
                                <div
                                    className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: "var(--border)",
                                        color: "var(--accent)",
                                    }}
                                >
                                    <HiSparkles size={10} /> Featured
                                </div>
                            )}

                            {/* Top Row */}
                            <div className="flex justify-between items-start">
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border"
                                    style={{
                                        backgroundColor: "var(--border)",
                                        borderColor: "var(--border-strong)",
                                    }}
                                >
                                    {project.icon}
                                </div>

                                {/* Status + Links */}
                                <div className="flex items-center gap-2 mt-1">
                                    {/* Status dot */}
                                    <span
                                        className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                                        style={{ backgroundColor: statusInfo.color }}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                                            style={{ opacity: 0.85 }}
                                        />
                                        {statusInfo.label}
                                    </span>

                                    {/* GitHub */}
                                    {project.codeUrl && (
                                        <motion.a
                                            href={project.codeUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 rounded-xl border transition-colors cursor-pointer"
                                            style={{
                                                color: "var(--accent)",
                                                borderColor: "var(--border)",
                                                backgroundColor: "transparent",
                                            }}
                                            whileHover={{ scale: 1.15, backgroundColor: "var(--border)" }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaGithub size={16} />
                                        </motion.a>
                                    )}

                                    {/* Demo */}
                                    {project.demoUrl && (
                                        <motion.a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 rounded-xl border transition-colors cursor-pointer"
                                            style={{
                                                color: "var(--accent)",
                                                borderColor: "var(--border)",
                                            }}
                                            whileHover={{ scale: 1.15, backgroundColor: "var(--border)" }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaExternalLinkAlt size={14} />
                                        </motion.a>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="font-heading text-2xl" style={{ color: "var(--accent)" }}>
                                    {project.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                    {project.description}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-0.5 text-xs font-semibold rounded-full border"
                                        style={{
                                            color: "var(--accent)",
                                            borderColor: "var(--border-strong)",
                                            backgroundColor: "var(--border)",
                                        }}
                                    >
                                        {tag}
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
