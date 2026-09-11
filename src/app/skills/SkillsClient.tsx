"use client";

import { motion } from "motion/react";
import skillsData from "@/data/skills.json";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
    SiTypescript, SiJavascript, SiHtml5,
    SiNextdotjs, SiReact, SiFramer, SiTailwindcss,
    SiNodedotjs, SiPostman, SiDiscord,
    SiHuggingface,
    SiGit, SiVercel,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaBrain, FaWandMagicSparkles, FaRobot } from "react-icons/fa6";
import { LuBrainCircuit, LuSparkles, LuBot } from "react-icons/lu";
import { TbApi } from "react-icons/tb";
import type { IconType } from "react-icons";

/* ─── Icon registry ──────────────────────────────────────────── */
const iconMap: Record<string, IconType> = {
    // Languages
    SiTypescript,
    SiJavascript,
    SiHtml5,
    // Frameworks & Libraries
    SiNextdotjs,
    SiReact,
    SiFramer,
    SiTailwindcss,
    // Backend & APIs
    SiNodedotjs,
    SiPostman,
    TbApi,
    SiDiscord,
    // AI & Machine Learning
    SiHuggingface,
    FaBrain,
    FaWandMagicSparkles,
    FaRobot,
    LuBrainCircuit,
    LuSparkles,
    LuBot,
    // Tools & DevOps
    SiGit,
    SiVercel,
    VscVscode,
    // Fallback aliases
    SiVscodium: VscVscode,
};

/* ─── Types ──────────────────────────────────────────────────── */
interface Skill {
    name: string;
    icon: string;
    repoUrl?: string;
}

interface SkillCategory {
    category: string;
    icon: string;
    skills: Skill[];
}

const categories: SkillCategory[] = skillsData;

/* ─── Skill Chip ─────────────────────────────────────────────── */
function SkillChip({ skill, delay }: { skill: Skill; delay: number }) {
    const Icon = iconMap[skill.icon];
    const hasLink = skill.repoUrl && skill.repoUrl.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 18,
                delay,
            }}
            className="group relative"
        >
            <div
                className="skill-chip"
                style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-strong)",
                    color: "var(--text-muted)",
                    boxShadow: `0 4px 16px var(--shadow)`,
                }}
            >
                {/* Icon */}
                {Icon && (
                    <span
                        className="skill-chip-icon"
                        style={{ color: "var(--accent)" }}
                    >
                        <Icon size={16} />
                    </span>
                )}

                {/* Label */}
                <span className="skill-chip-label">{skill.name}</span>

                {/* Expandable link area */}
                {hasLink && (
                    <a
                        href={skill.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="skill-chip-link"
                        style={{
                            color: "var(--accent)",
                            borderColor: "var(--border)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${skill.name} repository`}
                    >
                        <FaExternalLinkAlt size={10} />
                        <span>Repo</span>
                    </a>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Skills Component ───────────────────────────────────────── */
export default function SkillsClient() {
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
                        Things I&apos;ve picked up along the way.
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
                                    <SkillChip
                                        key={skill.name}
                                        skill={skill}
                                        delay={catIdx * 0.06 + sIdx * 0.04}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
