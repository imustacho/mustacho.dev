"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FaArrowRight, FaTimes, FaFolderOpen, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import SkillIcon from "@/components/SkillIcon";
import {
    getSkillCategories,
    getProjectsForSkill,
    getAllSkills,
    type Skill,
    type SkillCategory,
} from "@/lib/skills";
import type { Project } from "@/lib/projects";

const categories: SkillCategory[] = getSkillCategories();

/* ─── Skill Chip ─────────────────────────────────────────────── */
function SkillChip({
    skill,
    delay,
    onSelect,
}: {
    skill: Skill;
    delay: number;
    onSelect: (skill: Skill) => void;
}) {
    const relatedProjects = getProjectsForSkill(skill.name);
    const hasProjects = relatedProjects.length > 0;
    const isSingleProject = relatedProjects.length === 1;

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
                onClick={() => {
                    if (hasProjects) onSelect(skill);
                }}
                className={`skill-chip ${hasProjects ? "cursor-pointer" : ""}`}
                style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-strong)",
                    color: "var(--text-muted)",
                    boxShadow: "0 4px 16px var(--shadow)",
                }}
                title={
                    hasProjects
                        ? `Click to view ${relatedProjects.length} related project${
                              relatedProjects.length > 1 ? "s" : ""
                          }`
                        : undefined
                }
            >
                {/* Icon */}
                <span className="skill-chip-icon" style={{ color: "var(--accent)" }}>
                    <SkillIcon name={skill.icon} size={16} />
                </span>

                {/* Label */}
                <span className="skill-chip-label">{skill.name}</span>

                {/* Project count indicator badge */}
                {hasProjects && (
                    <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border transition-all"
                        style={{
                            backgroundColor: "var(--border)",
                            borderColor: "var(--border-strong)",
                            color: "var(--accent)",
                        }}
                    >
                        {relatedProjects.length}
                    </span>
                )}

                {/* Expandable link area on hover */}
                {hasProjects && (
                    <>
                        {isSingleProject ? (
                            <Link
                                href={`/projects/${relatedProjects[0].id}`}
                                className="skill-chip-link"
                                style={{
                                    color: "var(--accent)",
                                    borderColor: "var(--border)",
                                }}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`View ${relatedProjects[0].title} project`}
                            >
                                <span>{relatedProjects[0].title}</span>
                                <FaArrowRight size={9} />
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className="skill-chip-link cursor-pointer bg-transparent border-none"
                                style={{
                                    color: "var(--accent)",
                                    borderColor: "var(--border)",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(skill);
                                }}
                                aria-label={`View ${relatedProjects.length} related projects`}
                            >
                                <span>Projects</span>
                                <FaFolderOpen size={10} />
                            </button>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Related Projects Modal ─────────────────────────────────── */
function RelatedProjectsModal({
    skill,
    onClose,
}: {
    skill: Skill;
    onClose: () => void;
}) {
    const projects = getProjectsForSkill(skill.name);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
            <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 16 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border overflow-hidden shadow-2xl"
                style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-strong)",
                    color: "var(--text-primary)",
                }}
            >
                {/* Modal Header */}
                <div
                    className="p-5 sm:p-6 border-b flex items-start justify-between gap-4 shrink-0"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div className="flex items-center gap-3.5">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shrink-0 shadow-sm"
                            style={{
                                backgroundColor: "var(--bg-surface)",
                                borderColor: "var(--border-strong)",
                                color: "var(--accent)",
                            }}
                        >
                            <SkillIcon name={skill.icon} size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-heading text-2xl tracking-tight" style={{ color: "var(--accent)" }}>
                                    {skill.name}
                                </h3>
                                <span
                                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-full border"
                                    style={{
                                        backgroundColor: "var(--border)",
                                        borderColor: "var(--border-strong)",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    {projects.length} {projects.length === 1 ? "Project" : "Projects"}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                                Projects built with or powered by {skill.name}.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl border transition-all hover:scale-105 cursor-pointer"
                        style={{
                            backgroundColor: "var(--border)",
                            borderColor: "var(--border-strong)",
                            color: "var(--accent)",
                        }}
                        aria-label="Close modal"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Projects List */}
                <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 no-scrollbar">
                    {projects.map((project) => {
                        const status = project.status ?? "active";

                        return (
                            <div
                                key={project.id}
                                className="p-4 sm:p-5 rounded-xl border flex flex-col gap-3 transition-all hover:border-[var(--accent)]"
                                style={{
                                    backgroundColor: "var(--bg-surface)",
                                    borderColor: "var(--border-strong)",
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{project.icon}</span>
                                        <div>
                                            <h4
                                                className="font-heading text-lg font-bold tracking-tight"
                                                style={{ color: "var(--accent)" }}
                                            >
                                                {project.title}
                                            </h4>
                                            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {project.featured && (
                                            <span
                                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                style={{
                                                    backgroundColor: "var(--accent)",
                                                    color: "var(--bg)",
                                                }}
                                            >
                                                <HiSparkles size={10} /> Featured
                                            </span>
                                        )}
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize"
                                            style={{
                                                backgroundColor: "var(--border)",
                                                borderColor: "var(--border-strong)",
                                                color: "var(--accent)",
                                            }}
                                        >
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                    {project.description}
                                </p>

                                {/* Tags & Action button */}
                                <div
                                    className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t mt-1"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 text-[10px] font-semibold rounded-md border"
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

                                    <div className="flex items-center gap-2">
                                        {project.codeUrl && (
                                            <a
                                                href={project.codeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded-lg border text-xs transition-transform hover:scale-105"
                                                style={{
                                                    backgroundColor: "var(--border)",
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--accent)",
                                                }}
                                                title="View Source Code"
                                            >
                                                <FaGithub size={12} />
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded-lg border text-xs transition-transform hover:scale-105"
                                                style={{
                                                    backgroundColor: "var(--border)",
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--accent)",
                                                }}
                                                title="Live Demo"
                                            >
                                                <FaExternalLinkAlt size={11} />
                                            </a>
                                        )}
                                        <Link
                                            href={`/projects/${project.id}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-transform hover:scale-105 shadow-xs"
                                            style={{
                                                backgroundColor: "var(--accent)",
                                                color: "var(--bg)",
                                            }}
                                        >
                                            <span>Details</span>
                                            <FaArrowRight size={10} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Skills Component ───────────────────────────────────────── */
export default function SkillsClient() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Check if ?skill= URL param is provided and open modal automatically
    useEffect(() => {
        const skillQuery = searchParams.get("skill");
        if (skillQuery) {
            const allSkills = getAllSkills();
            const foundSkill = allSkills.find(
                (s) => s.name.toLowerCase().trim() === skillQuery.toLowerCase().trim()
            );
            if (foundSkill) {
                setSelectedSkill(foundSkill);
            }
        }
    }, [searchParams]);

    const handleCloseModal = useCallback(() => {
        setSelectedSkill(null);
        if (searchParams.get("skill")) {
            router.replace("/skills", { scroll: false });
        }
    }, [searchParams, router]);

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
                        Things I&apos;ve picked up along the way. Click any skill to explore related projects.
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
                                        onSelect={setSelectedSkill}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Related Projects Modal */}
            <AnimatePresence>
                {selectedSkill && (
                    <RelatedProjectsModal
                        skill={selectedSkill}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
