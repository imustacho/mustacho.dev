"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FaArrowRight, FaTimes, FaFolderOpen, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import SkillIcon from "@/components/SkillIcon";
import {
    getSkillCategories,
    getProjectsForSkill,
    getAllSkills,
    type Skill,
    type SkillCategory,
} from "@/lib/skills";

const categories: SkillCategory[] = getSkillCategories();
const subscribeToMount = () => () => {};
const isClient = () => true;
const isServer = () => false;

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
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const mounted = useSyncExternalStore(subscribeToMount, isClient, isServer);

    useEffect(() => {
        if (!mounted) return;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [onClose, mounted]);

    if (!mounted) return null;
    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4 backdrop-blur-[6px] sm:p-6"
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="related-projects-title"
                initial={{ scale: 0.97, opacity: 0, y: 18 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0, y: 18 }}
                transition={{ type: "spring", stiffness: 240, damping: 27 }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[min(84vh,760px)] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border shadow-[0_28px_90px_var(--shadow-strong)]"
                style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-strong)",
                    color: "var(--text-primary)",
                }}
            >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-5 sm:px-8 sm:py-7" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-4">
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border sm:h-14 sm:w-14"
                            style={{
                                backgroundColor: "var(--bg-surface)",
                                borderColor: "var(--border-strong)",
                                color: "var(--accent)",
                            }}
                        >
                            <SkillIcon name={skill.icon} size={26} />
                        </div>
                        <div>
                            <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
                                Skill / {String(projects.length).padStart(2, "0")} projects
                            </p>
                            <h2 id="related-projects-title" className="font-heading text-2xl tracking-tight sm:text-3xl" style={{ color: "var(--accent)" }}>
                                {skill.name}
                            </h2>
                        </div>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors hover:bg-[var(--bg-surface)]"
                        style={{
                            borderColor: "var(--border-strong)",
                            color: "var(--accent)",
                        }}
                        aria-label="Close modal"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                <div className="skill-modal-scrollbar overflow-y-auto px-5 py-3 sm:px-8 sm:py-4">
                    {projects.map((project) => {
                        const status = project.status ?? "active";

                        return (
                            <article
                                key={project.id}
                                className="flex flex-col gap-3 border-b py-5 last:border-b-0 sm:gap-4 sm:py-6"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border text-2xl sm:h-14 sm:w-14" style={{ backgroundColor: project.id === "charged" ? "#0b1020" : "var(--bg-surface)", borderColor: "var(--border)" }}>
                                        {project.carouselLogo ? (
                                            <Image src={project.carouselLogo} alt="" width={44} height={44} unoptimized={project.carouselLogo.endsWith(".svg")} className="h-10 w-10 object-contain" />
                                        ) : (
                                            <span aria-hidden="true">{project.icon}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <h3 className="font-heading text-xl tracking-tight sm:text-2xl" style={{ color: "var(--accent)" }}>{project.title}</h3>
                                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${status === "wip" ? "bg-amber-500" : status === "archived" ? "bg-zinc-400" : "bg-emerald-500"}`} />
                                                {status === "wip" ? "In progress" : status}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>{project.category}</p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-transform hover:-translate-y-0.5"
                                        style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                                    >
                                        View project <FaArrowRight size={10} />
                                    </Link>
                                        {project.codeUrl && (
                                            <a
                                                href={project.codeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors hover:bg-[var(--bg-surface)]"
                                                style={{
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--accent)",
                                                }}
                                                aria-label={`View ${project.title} source code`}
                                            >
                                                <FaGithub size={12} /> Code
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors hover:bg-[var(--bg-surface)]"
                                                style={{
                                                    borderColor: "var(--border-strong)",
                                                    color: "var(--accent)",
                                                }}
                                                aria-label={`Open ${project.title} live demo`}
                                            >
                                                <FaExternalLinkAlt size={11} /> Live
                                            </a>
                                        )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}

/* ─── Skills Component ───────────────────────────────────────── */
export default function SkillsClient() {
    const searchParams = useSearchParams();
    const skillQuery = searchParams.get("skill");

    return <SkillsContent key={skillQuery ?? ""} skillQuery={skillQuery} />;
}

function SkillsContent({ skillQuery }: { skillQuery: string | null }) {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(() =>
        skillQuery
            ? getAllSkills().find(
                (skill) => skill.name.toLowerCase().trim() === skillQuery.toLowerCase().trim()
            ) ?? null
            : null
    );
    const handleCloseModal = useCallback(() => {
        setSelectedSkill(null);
        if (skillQuery) {
            // Closing client-only UI needs no server navigation. Next synchronizes
            // useSearchParams with the native history API.
            const url = new URL(window.location.href);
            url.searchParams.delete("skill");
            window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
        }
    }, [skillQuery]);

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
