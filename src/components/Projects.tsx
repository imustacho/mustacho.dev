"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
    FaArrowLeft,
    FaArrowRight,
    FaExternalLinkAlt,
    FaGithub,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { getProjects, type Project } from "@/lib/projects";
import { getSkillsForProject } from "@/lib/skills";
import SkillIcon from "@/components/SkillIcon";

const projects = getProjects();

function getWrappedIndex(index: number) {
    return (index + projects.length) % projects.length;
}

function getRelativePosition(index: number, activeIndex: number) {
    let position = index - activeIndex;

    if (position > projects.length / 2) position -= projects.length;
    if (position < -projects.length / 2) position += projects.length;

    return position;
}

function ProjectVisual({ project, active }: { project: Project; active: boolean }) {
    const logo = project.carouselLogo;
    const background = project.carouselBackground;
    const preview = logo ? undefined : project.images?.[0];

    return (
        <div
            className="relative min-h-64 overflow-hidden border-b md:min-h-full md:w-[48%] md:border-b-0 md:border-r"
            style={{
                borderColor: "var(--border-strong)",
                background: preview || background
                    ? "var(--bg-surface)"
                    : "linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))",
            }}
        >
            {background && (
                <Image
                    src={background}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 767px) 82vw, 40vw"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}
            {logo ? (
                <div className={`relative flex h-full min-h-64 flex-col items-center justify-center gap-4 p-10 md:min-h-full ${background ? "bg-black/20" : ""}`}>
                    {!background && (
                        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:28px_28px]" />
                    )}
                    <Image
                        src={logo}
                        alt={`${project.title} logo`}
                        width={256}
                        height={256}
                        draggable={false}
                        unoptimized={logo.endsWith(".svg")}
                        className={`relative h-36 w-36 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110 sm:h-44 sm:w-44 ${project.id === "hungerfall" ? "rounded-2xl" : ""}`}
                    />
                    {!background && (
                        <span className="relative font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--text-muted)" }}>
                            {project.category}
                        </span>
                    )}
                </div>
            ) : preview ? (
                <Image
                    src={preview}
                    alt={`${project.title} preview`}
                    fill
                    draggable={false}
                    sizes="(max-width: 767px) 82vw, 40vw"
                    unoptimized={/\.gif$/i.test(preview)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <>
                    <div
                        className="absolute -right-14 -top-16 h-48 w-48 rounded-full blur-3xl"
                        style={{ backgroundColor: "var(--accent)", opacity: 0.14 }}
                    />
                    <div
                        className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full blur-3xl"
                        style={{ backgroundColor: "var(--accent)", opacity: 0.1 }}
                    />
                    <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:28px_28px]" />
                    <div className="relative flex h-full min-h-64 flex-col items-center justify-center gap-4 p-10 md:min-h-full">
                        <span className="text-7xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                            {project.icon}
                        </span>
                        <span
                            className="font-mono text-[10px] uppercase tracking-[0.32em]"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {project.category}
                        </span>
                    </div>
                </>
            )}

            {preview && (
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            )}

            <span
                className="absolute left-5 top-5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md"
                style={{
                    borderColor: "var(--border-strong)",
                    backgroundColor: "color-mix(in srgb, var(--bg) 72%, transparent)",
                    color: (preview || background) && active ? "white" : "var(--accent)",
                }}
            >
                {project.category}
            </span>
        </div>
    );
}

function ProjectSlide({
    project,
    position,
    onSelect,
}: {
    project: Project;
    position: number;
    onSelect: () => void;
}) {
    const active = position === 0;
    const visible = Math.abs(position) <= 2;
    const scale = active ? 1 : Math.abs(position) === 1 ? 0.88 : 0.78;
    const shift = position * 560;
    const mobileShift = position * 310;

    if (!visible) return null;

    const status = project.status ?? "active";
    const skills = getSkillsForProject(project).slice(0, 4);

    return (
        <motion.article
            aria-hidden={!active}
            initial={false}
            animate={{
                opacity: active ? 1 : Math.abs(position) === 1 ? 0.42 : 0.18,
                filter: active ? "blur(0px)" : "blur(1px)",
            }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className={`group flex w-[min(82vw,800px)] flex-col overflow-hidden rounded-[2rem] border shadow-[0_24px_80px_var(--shadow-strong)] transition-[transform] duration-500 ease-out md:flex-row ${active ? "projects-carousel-active relative mx-auto min-h-[450px] cursor-grab" : "projects-carousel-slide absolute left-1/2 top-0 h-full cursor-pointer"}`}
            style={{
                zIndex: 20 - Math.abs(position),
                backgroundColor: "var(--bg-elevated)",
                borderColor: active ? "var(--border-strong)" : "var(--border)",
                ["--slide-shift" as string]: `${shift}px`,
                ["--slide-mobile-shift" as string]: `${mobileShift}px`,
                ["--slide-scale" as string]: scale,
            }}
            onClick={onSelect}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect();
                }
            }}
            role="button"
            tabIndex={active ? 0 : -1}
        >
            <ProjectVisual project={project} active={active} />

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-7 p-6 sm:p-8 md:p-9">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-3">
                        <span
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${status === "wip" ? "bg-amber-500" : status === "archived" ? "bg-zinc-400" : "bg-emerald-500"}`}
                            />
                            {status === "wip" ? "In progress" : status}
                        </span>
                        {project.featured && (
                            <span
                                className="inline-flex items-center gap-1.5 text-xs font-bold"
                                style={{ color: "var(--accent)" }}
                            >
                                <HiSparkles /> Featured
                            </span>
                        )}
                    </div>

                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            {project.carouselLogo ? (
                                <Image
                                    src={project.carouselLogo}
                                    alt=""
                                    width={32}
                                    height={32}
                                    unoptimized={project.carouselLogo.endsWith(".svg")}
                                    className={`h-8 w-8 object-contain ${project.id === "charged" ? "rounded-md bg-slate-950 p-1" : project.id === "hungerfall" ? "rounded-md" : ""}`}
                                />
                            ) : (
                                <span className="text-3xl" aria-hidden="true">{project.icon}</span>
                            )}
                            <span
                                className="font-mono text-xs tracking-[0.18em]"
                                style={{ color: "var(--text-faint)" }}
                            >
                                {project.id.toUpperCase()}
                            </span>
                        </div>
                        <h3
                            className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl"
                            style={{ color: "var(--accent)" }}
                        >
                            {project.title}
                        </h3>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-muted)" }}>
                            {project.description}
                        </p>
                    </div>

                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill.name}
                                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                                    style={{
                                        borderColor: "var(--border-strong)",
                                        backgroundColor: "var(--border)",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    <SkillIcon name={skill.icon} size={11} />
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {active && (
                    <div className="flex flex-wrap items-center gap-3 border-t pt-5" style={{ borderColor: "var(--border)" }}>
                        <Link
                            href={`/projects/${project.id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
                            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                        >
                            View project <FaArrowRight size={12} />
                        </Link>
                        {project.codeUrl && (
                            <a
                                href={project.codeUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors hover:bg-[var(--border)]"
                                style={{ borderColor: "var(--border-strong)", color: "var(--accent)" }}
                            >
                                <FaGithub /> Code
                            </a>
                        )}
                        {project.demoUrl && (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                aria-label={`Open ${project.title} demo`}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:bg-[var(--border)]"
                                style={{ borderColor: "var(--border-strong)", color: "var(--accent)" }}
                            >
                                <FaExternalLinkAlt size={13} />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.article>
    );
}

export default function Projects() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const dragStart = useRef<{ pointerId: number; x: number; y: number; dragging: boolean } | null>(null);
    const suppressClick = useRef(false);

    const goTo = useCallback((index: number) => {
        setActiveIndex(getWrappedIndex(index));
    }, []);

    const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
    const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || event.button !== 0) return;
        dragStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, dragging: false };
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const start = dragStart.current;
        if (!start || start.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;

        if (!start.dragging) {
            if (Math.abs(deltaX) < 10) return;
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                dragStart.current = null;
                return;
            }
            start.dragging = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
        }

        setDragOffset(Math.max(-220, Math.min(220, deltaX)));
    };

    const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
        const start = dragStart.current;
        if (!start || start.pointerId !== event.pointerId) return;

        if (start.dragging) {
            suppressClick.current = true;
            window.setTimeout(() => { suppressClick.current = false; }, 0);

            const deltaX = event.clientX - start.x;
            if (!cancelled && Math.abs(deltaX) >= 70) {
                setActiveIndex((index) => getWrappedIndex(index + (deltaX < 0 ? 1 : -1)));
            }

            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }
        }

        dragStart.current = null;
        setDragOffset(0);
        setIsDragging(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.key === "ArrowRight") next();
            if (event.key === "ArrowLeft") previous();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [next, previous]);

    useEffect(() => {
        if (isPaused || isDragging || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const interval = window.setInterval(() => {
            if (document.visibilityState === "visible") {
                setActiveIndex((index) => getWrappedIndex(index + 1));
            }
        }, 6500);

        return () => window.clearInterval(interval);
    }, [activeIndex, isPaused, isDragging]);

    const activeProject = projects[activeIndex];

    return (
        <section
            className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-20"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
            }}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p
                        className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.28em]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Selected work
                    </p>
                    <h2 className="font-heading text-5xl tracking-tight sm:text-6xl" style={{ color: "var(--accent)" }}>
                        Projects
                    </h2>
                    <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        A rotating look at the things I&apos;m building, exploring, and shipping.
                    </p>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-faint)" }}>
                    {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </p>
            </div>

            <div className="relative -mx-5 overflow-hidden px-5 pb-2 sm:-mx-8 sm:px-8">
                <div
                    className="projects-carousel-stage relative mx-auto max-w-[1220px] touch-pan-y"
                    data-dragging={isDragging}
                    style={{ ["--drag-offset" as string]: `${dragOffset}px` }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={(event) => finishDrag(event)}
                    onPointerCancel={(event) => finishDrag(event, true)}
                    onClickCapture={(event) => {
                        if (!suppressClick.current) return;
                        event.preventDefault();
                        event.stopPropagation();
                        suppressClick.current = false;
                    }}
                >
                    <div
                        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                        style={{ backgroundColor: "var(--accent)", opacity: 0.08 }}
                    />

                    {projects.map((project, index) => (
                        <ProjectSlide
                            key={project.id}
                            project={project}
                            position={getRelativePosition(index, activeIndex)}
                            onSelect={() => goTo(index)}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2" aria-label="Choose a project">
                    {projects.map((project, index) => (
                        <button
                            key={project.id}
                            type="button"
                            aria-label={`Show ${project.title}`}
                            aria-current={index === activeIndex}
                            onClick={() => goTo(index)}
                            className="group flex h-6 items-center"
                        >
                            <span
                                className="block h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    width: index === activeIndex ? 28 : 7,
                                    backgroundColor: index === activeIndex ? "var(--accent)" : "var(--border-strong)",
                                }}
                            />
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={previous}
                        aria-label="Previous project"
                        className="flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:-translate-x-1 hover:bg-[var(--border)]"
                        style={{ borderColor: "var(--border-strong)", color: "var(--accent)" }}
                    >
                        <FaArrowLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        aria-label="Next project"
                        className="flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:translate-x-1 hover:bg-[var(--border)]"
                        style={{ borderColor: "var(--border-strong)", color: "var(--accent)" }}
                    >
                        <FaArrowRight size={14} />
                    </button>
                </div>
            </div>

            <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
                Drag to browse, or use the arrows or your keyboard · currently viewing {activeProject.title}
            </p>
        </section>
    );
}
