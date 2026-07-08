"use client";

import { motion } from "motion/react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

interface Project {
    title: string;
    description: string;
    tags: string[];
    demoUrl?: string;
    codeUrl: string;
    icon: string;
}

export default function Projects() {
    const projectsList: Project[] = [
        {
            title: "Overseer",
            description: "Manage Discord with natural language.",
            tags: ["Discord", "AI", "Agent"],
            codeUrl: "https://github.com/imustacho",
            icon: "🕶"
        },
        {
            title: "Bubble",
            description: "Discord-powered AI engine generator.",
            tags: ["Discord", "AI", "Memory", "Training"],
            codeUrl: "https://github.com/imustacho",
            icon: "🐡"
        },
        {
            title: "Hungerfall",
            description: "A text-based adventure game with AI.",
            tags: ["Game", "AI", "Text-based"],
            codeUrl: "https://github.com/imustacho/hungerfall",
            icon: "🥪"
        }
    ];

    return (
        <section className="py-20 px-6 max-w-5xl mx-auto flex flex-col items-center gap-12 justify-center">
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-3">
                <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-heading text-5xl text-[#955623] tracking-tight"
                >
                    Projects Showcase
                </motion.h2>
                <p className="text-lg text-[#7a451b] max-w-lg">
                    My digital works built with love, clean code, and micro-animations.
                </p>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
                {projectsList.map((project, idx) => (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: idx * 0.1 }}
                        whileHover={{
                            y: -10,
                            rotate: idx % 2 === 0 ? 1 : -1,
                            boxShadow: "0_24px_50px_rgba(149,86,35,0.18)"
                        }}
                        className="bg-[#f5efe6] border-4 border-[#955623]/20 p-6 md:p-8 rounded-[2rem] flex flex-col gap-5 justify-between relative shadow-[0_12px_30px_rgba(149,86,35,0.08)] transition-shadow duration-300"
                    >
                        {/* Upper Section */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                {/* Project Icon Bubble */}
                                <div className="w-14 h-14 rounded-2xl bg-[#955623]/10 border border-[#955623]/20 flex items-center justify-center text-3xl">
                                    {project.icon}
                                </div>

                                {/* External Links */}
                                <div className="flex items-center gap-3 text-[#955623]">
                                    <motion.a
                                        href={project.codeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 hover:bg-[#955623]/10 rounded-full transition-colors cursor-pointer"
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaGithub size={20} />
                                    </motion.a>
                                    {project.demoUrl && (
                                        <motion.a
                                            href={project.demoUrl}
                                            className="p-2 hover:bg-[#955623]/10 rounded-full transition-colors cursor-pointer"
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaExternalLinkAlt size={18} />
                                        </motion.a>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-2xl text-[#955623] mt-2">
                                {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[#7a451b] leading-relaxed text-sm md:text-base">
                                {project.description}
                            </p>
                        </div>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-[#955623]/8 text-[#955623] border border-[#955623]/15 text-xs font-semibold rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
