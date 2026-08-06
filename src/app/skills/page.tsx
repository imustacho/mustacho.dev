"use client";

import { motion } from "motion/react";
import skillsData from "@/data/skills.json";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

interface Skill {
    name: string;
    repoUrl?: string;
}

interface SkillCategory {
    category: string;
    icon: string;
    skills: Skill[];
}

const categories: SkillCategory[] = skillsData;

export default function SkillsPage() {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen flex flex-col">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-center mb-16 flex flex-col items-center gap-3"
                >
                    <h1 className="font-heading text-5xl md:text-6xl tracking-tight" style={{ color: "var(--accent)" }}>
                        Skills
                    </h1>
                    <p className="text-lg max-w-lg" style={{ color: "var(--text-muted)" }}>
                        Tools and technologies I use to bring ideas to life.
                    </p>
                </motion.div>

                {/* Skill Categories */}
                <div className="flex flex-col gap-10">
                    {categories.map((cat, catIdx) => (
                        <motion.div
                            key={cat.category}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 16, delay: catIdx * 0.06 }}
                        >
                            {/* Category header */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">{cat.icon}</span>
                                <h2
                                    className="font-heading text-xl tracking-tight"
                                    style={{ color: "var(--accent)" }}
                                >
                                    {cat.category}
                                </h2>
                                <div
                                    className="flex-1 h-px ml-2"
                                    style={{ backgroundColor: "var(--border)" }}
                                />
                            </div>

                            {/* Skills grid */}
                            <div className="flex flex-wrap gap-3">
                                {cat.skills.map((skill, sIdx) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, scale: 0.88 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 18,
                                            delay: catIdx * 0.06 + sIdx * 0.04
                                        }}
                                        whileHover={{ y: -3, scale: 1.04 }}
                                        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-shadow duration-200 cursor-default"
                                        style={{
                                            backgroundColor: "var(--bg-elevated)",
                                            borderColor: "var(--border-strong)",
                                            color: "var(--text-muted)",
                                            boxShadow: `0 4px 16px var(--shadow)`,
                                        }}
                                    >
                                        <span className="text-sm font-semibold">{skill.name}</span>

                                        {skill.repoUrl && (
                                            <Link
                                                href={skill.repoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                style={{ color: "var(--accent)" }}
                                                aria-label={`${skill.name} repository`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaGithub size={13} />
                                            </Link>
                                        )}

                                        {/* Hover glow */}
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
                                            style={{
                                                background: `radial-gradient(ellipse at center, var(--border) 0%, transparent 80%)`,
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
