"use client";

import { motion } from "motion/react";
import {
    HiMapPin,
    HiAcademicCap,
    HiCommandLine,
    HiUserGroup,
    HiCamera,
    HiMusicalNote,
    HiCpuChip,
} from "react-icons/hi2";
import { FaDiscord, FaGithub } from "react-icons/fa6";

/* ─── Data ─────────────────────────────────────────────────────── */
const facts = [
    { icon: HiMapPin, label: "Location", value: "Istanbul, Türkiye" },
    { icon: HiAcademicCap, label: "School", value: "Science High School" },
    { icon: HiCommandLine, label: "Focus", value: "Discord Bots & Web Development" },
    { icon: HiUserGroup, label: "Community", value: "Managing multiple communities" },
];

const hobbies = [
    { icon: HiCamera, label: "Photography", desc: "Capturing moments through the lens" },
    { icon: HiMusicalNote, label: "Music", desc: "Playing and listening to all genres" },
    { icon: HiCommandLine, label: "Coding", desc: "Building things that feel alive" },
];

const links = [
    { icon: FaGithub, label: "GitHub", href: "https://github.com/imustacho", color: "#f0e8dc" },
    { icon: FaDiscord, label: "Discord", href: "https://discord.gg/eJkymXBAXU", color: "#5865F2" },
];

/* ─── Component ────────────────────────────────────────────────── */
export default function AboutPage() {
    return (
        <main
            className="min-h-screen relative overflow-hidden"
            style={{ color: "var(--text-primary)" }}
        >
            <div className="pt-28 pb-24 px-5 md:px-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center gap-10">

                {/* ── Hero ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col md:flex-row items-center md:items-start gap-8"
                >
                    {/* Avatar */}
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative shrink-0"
                    >
                        <div
                            className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] overflow-hidden border-2"
                            style={{ borderColor: "var(--border-strong)", boxShadow: "0 16px 48px var(--shadow-strong)" }}
                        >
                            <img
                                src="/mustacho_wave.png"
                                alt="Mustacho"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Online badge */}
                        <span
                            className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 bg-[#3ba55d]"
                            style={{ borderColor: "var(--bg)" }}
                        />
                    </motion.div>

                    {/* Intro text */}
                    <div className="flex flex-col gap-3 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <p
                                className="text-xs font-bold uppercase tracking-widest mb-1"
                                style={{ color: "var(--accent)" }}
                            >
                                Hey, I&apos;m
                            </p>
                            <h1
                                className="font-heading text-4xl md:text-6xl tracking-tight leading-none"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Mustacho
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-base md:text-lg leading-relaxed max-w-lg"
                            style={{ color: "var(--text-muted)" }}
                        >
                            High school student from Istanbul. I build Discord bots and websites,
                            and manage a couple of online communities. Eventually I want to
                            get into electronics and hardware projects.
                        </motion.p>

                        {/* Social links */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 justify-center md:justify-start mt-1"
                        >
                            {links.map(({ icon: Icon, label, href, color }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors"
                                    style={{
                                        borderColor: "var(--border-strong)",
                                        backgroundColor: "var(--bg-elevated)",
                                        color: "var(--text-muted)",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.color = color;
                                        (e.currentTarget as HTMLElement).style.borderColor = color + "55";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
                                    }}
                                >
                                    <Icon size={15} />
                                    {label}
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── Facts grid ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                    {facts.map(({ icon: Icon, label, value }, idx) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + idx * 0.06, duration: 0.35 }}
                            whileHover={{ y: -2 }}
                            className="flex items-center gap-4 p-4 rounded-2xl border"
                            style={{
                                backgroundColor: "var(--bg-elevated)",
                                borderColor: "var(--border)",
                                boxShadow: "0 4px 20px var(--shadow)",
                            }}
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "var(--border)", color: "var(--accent)" }}
                            >
                                <Icon size={18} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                                    {label}
                                </span>
                                <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                                    {value}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── Hobbies ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.4 }}
                    className="flex flex-col gap-4"
                >
                    <h2
                        className="font-heading text-xl tracking-tight flex items-center gap-2"
                        style={{ color: "var(--accent)" }}
                    >
                        <span className="w-8 h-px" style={{ backgroundColor: "var(--border-strong)" }} />
                        Hobbies
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {hobbies.map(({ icon: Icon, label, desc }, idx) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.42 + idx * 0.07, type: "spring", stiffness: 180, damping: 18 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl border relative overflow-hidden"
                                style={{
                                    backgroundColor: "var(--bg-elevated)",
                                    borderColor: "var(--border)",
                                    boxShadow: "0 4px 20px var(--shadow)",
                                }}
                            >
                                {/* Glow on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                                    style={{ background: "radial-gradient(ellipse at top, var(--border) 0%, transparent 70%)" }}
                                />
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: "var(--border)", color: "var(--accent)" }}
                                >
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <h3 className="font-heading text-base" style={{ color: "var(--text-primary)" }}>{label}</h3>
                                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-faint)" }}>{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Future ─────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52, duration: 0.4 }}
                    className="flex items-start gap-4 p-5 rounded-2xl border"
                    style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-strong)",
                        boxShadow: "0 4px 24px var(--shadow)",
                    }}
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: "var(--border)", color: "var(--accent)" }}
                    >
                        <HiCpuChip size={20} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-heading text-base" style={{ color: "var(--accent)" }}>What&apos;s next</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            I want to move into electronics — combining code with hardware.
                            Going from writing software to designing circuits is something
                            I&apos;m genuinely excited about.
                        </p>
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
