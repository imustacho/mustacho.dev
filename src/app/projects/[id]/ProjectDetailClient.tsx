"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCheckCircle, FaImages, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import type { Project } from "@/lib/projects";

interface ProjectDetailClientProps {
    project: Project | null;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!project) {
        return (
            <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
                <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
                    <div className="text-6xl">🔍</div>
                    <h1 className="font-heading text-3xl sm:text-4xl" style={{ color: "var(--accent)" }}>
                        Project Not Found
                    </h1>
                    <p className="text-base max-w-md" style={{ color: "var(--text-muted)" }}>
                        The project you are looking for doesn&apos;t exist or has been moved.
                    </p>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-105"
                        style={{
                            backgroundColor: "var(--bg-surface)",
                            borderColor: "var(--border-strong)",
                            color: "var(--accent)",
                        }}
                    >
                        <FaArrowLeft /> Back to Projects
                    </Link>
                </div>
            </main>
        );
    }

    const status = project.status ?? "active";
    const hasImages = project.images && project.images.length > 0;

    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen flex flex-col">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2"
                            whileHover={{ x: -4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaArrowLeft /> Back to Projects
                        </motion.span>
                    </Link>
                </div>

                {/* Hero Header */}
                <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col gap-8"
                >
                    {/* Badges & Meta */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                        {project.category && (
                            <span
                                className="px-3 py-1 rounded-full border"
                                style={{
                                    backgroundColor: "var(--border)",
                                    borderColor: "var(--border-strong)",
                                    color: "var(--accent)",
                                }}
                            >
                                {project.category}
                            </span>
                        )}

                        {project.featured && (
                            <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold shadow-xs"
                                style={{
                                    backgroundColor: "var(--accent)",
                                    color: "var(--bg)",
                                }}
                            >
                                <HiSparkles size={13} /> Featured Project
                            </span>
                        )}

                        {/* Status Badge */}
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border"
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

                    {/* Title + Icon */}
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border shrink-0 shadow-md"
                            style={{
                                backgroundColor: "var(--bg-surface)",
                                borderColor: "var(--border-strong)",
                            }}
                        >
                            {project.icon}
                        </div>
                        <h1
                            className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight"
                            style={{ color: "var(--accent)" }}
                        >
                            {project.title}
                        </h1>
                    </div>

                    {/* Tagline / Excerpt */}
                    <p className="text-lg md:text-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {project.description}
                    </p>

                    {/* Action Links Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {project.codeUrl && (
                            <motion.a
                                href={project.codeUrl}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors"
                                style={{
                                    backgroundColor: "var(--bg-surface)",
                                    borderColor: "var(--border-strong)",
                                    color: "var(--accent)",
                                }}
                            >
                                <FaGithub size={15} />
                                <span>Source Code</span>
                            </motion.a>
                        )}

                        {project.demoUrl && (
                            <motion.a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-xs transition-colors"
                                style={{
                                    backgroundColor: "var(--accent)",
                                    color: "var(--bg)",
                                }}
                            >
                                <FaExternalLinkAlt size={13} />
                                <span>Live Demo / Invite</span>
                            </motion.a>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px my-2" style={{ backgroundColor: "var(--border-strong)" }} />

                    {/* Detailed Overview */}
                    {project.longDescription && (
                        <section className="flex flex-col gap-3">
                            <h2
                                className="font-heading text-2xl tracking-tight"
                                style={{ color: "var(--accent)" }}
                            >
                                About the Project
                            </h2>
                            <p
                                className="text-base leading-relaxed whitespace-pre-line"
                                style={{ color: "var(--text-muted)" }}
                            >
                                {project.longDescription}
                            </p>
                        </section>
                    )}

                    {/* Key Features */}
                    {project.features && project.features.length > 0 && (
                        <section className="flex flex-col gap-4 mt-2">
                            <h2
                                className="font-heading text-2xl tracking-tight"
                                style={{ color: "var(--accent)" }}
                            >
                                Key Features
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {project.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl border flex items-start gap-3"
                                        style={{
                                            backgroundColor: "var(--bg-surface)",
                                            borderColor: "var(--border-strong)",
                                        }}
                                    >
                                        <FaCheckCircle
                                            size={16}
                                            className="shrink-0 mt-0.5"
                                            style={{ color: "var(--accent)" }}
                                        />
                                        <span className="text-sm leading-snug" style={{ color: "var(--text-muted)" }}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Screenshots & Media Gallery */}
                    <section className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center justify-between">
                            <h2
                                className="font-heading text-2xl tracking-tight"
                                style={{ color: "var(--accent)" }}
                            >
                                Previews & Demos
                            </h2>
                            {hasImages && (
                                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                                    {project.images!.length} preview{project.images!.length > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        {hasImages ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {project.images!.map((mediaSrc, idx) => {
                                    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaSrc);

                                    return (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setSelectedImage(mediaSrc)}
                                            className="relative aspect-video rounded-2xl overflow-hidden border cursor-pointer group shadow-sm bg-black/40 min-h-[180px]"
                                            style={{
                                                aspectRatio: "16 / 9",
                                                borderColor: "var(--border-strong)",
                                                backgroundColor: "var(--bg-surface)",
                                            }}
                                        >
                                            {isVideo ? (
                                                <video
                                                    src={mediaSrc}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={mediaSrc}
                                                    alt={`${project.title} preview ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-semibold pointer-events-none">
                                                Click to Enlarge
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Placeholder Box for Media */
                            <div
                                className="p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-3"
                                style={{
                                    backgroundColor: "var(--bg-surface)",
                                    borderColor: "var(--border)",
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                    style={{
                                        backgroundColor: "var(--border)",
                                        color: "var(--accent)",
                                    }}
                                >
                                    <FaImages />
                                </div>
                                <h3 className="font-heading text-lg" style={{ color: "var(--accent)" }}>
                                    Previews Coming Soon
                                </h3>
                                <p className="text-xs sm:text-sm max-w-md" style={{ color: "var(--text-muted)" }}>
                                    Visual previews, demos, and screenshots for this project will be added here.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Tech Stack / Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <section className="flex flex-col gap-3 mt-2">
                            <h2
                                className="font-heading text-2xl tracking-tight"
                                style={{ color: "var(--accent)" }}
                            >
                                Technologies Used
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs font-semibold rounded-full border"
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
                        </section>
                    )}

                    {/* Bottom Back Button */}
                    <div className="pt-10 border-t mt-4 flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
                            style={{ color: "var(--accent)" }}
                        >
                            <FaArrowLeft /> Back to all projects
                        </Link>
                    </div>
                </motion.article>
            </div>

            {/* Lightbox / Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 p-2 text-white hover:text-[var(--accent)] transition-colors text-xl"
                                aria-label="Close image preview"
                            >
                                <FaTimes />
                            </button>
                            {/\.(mp4|webm|ogg)$/i.test(selectedImage) ? (
                                <video
                                    src={selectedImage}
                                    controls
                                    autoPlay
                                    loop
                                    className="max-w-full max-h-[85vh] rounded-xl border"
                                    style={{ borderColor: "var(--border-strong)" }}
                                />
                            ) : (
                                <img
                                    src={selectedImage}
                                    alt="Expanded project preview"
                                    className="max-w-full max-h-[85vh] object-contain rounded-xl border"
                                    style={{ borderColor: "var(--border-strong)" }}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

