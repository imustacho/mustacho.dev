"use client";

import { motion } from "motion/react";
import { FaDiscord, FaGithub, FaSpotify } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Mustache from "@/components/Mustache";
import { FaYoutube } from "react-icons/fa";

const socials = [
    { name: "GitHub", href: "https://github.com/imustacho", icon: FaGithub, hover: "hover:bg-[#181717]" },
    { name: "Discord", href: "https://discord.gg/eJkymXBAXU", icon: FaDiscord, hover: "hover:bg-[#5865F2]" },
    { name: "Youtube", href: "https://www.youtube.com/@imustachoo", icon: FaYoutube, hover: "hover:bg-[#FF0000]" },
    { name: "Spotify", href: "https://open.spotify.com/user/31ouiktnesnmb4l555pdsjevaqcm", icon: FaSpotify, hover: "hover:bg-[#1DB954]" },
    { name: "Mail", href: "mailto:mail@mustacho.dev", icon: MdEmail, hover: "hover:bg-[#EA4335]" },
];

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="pt-24 min-h-screen w-full flex flex-col justify-center">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="mx-auto flex flex-col items-center justify-center px-6 max-w-6xl w-full text-center"
                >
                    <div className="flex flex-col items-center text-center">
                        <h1
                            className="font-heading text-5xl sm:text-7xl tracking-tight drop-shadow-sm md:text-9xl"
                            style={{ color: "var(--accent)" }}
                        >
                            Mustacho
                        </h1>

                        <p className="mt-5 max-w-2xl text-base md:text-lg" style={{ color: "var(--text-muted)" }}>
                            Developer in progress. Building things on the internet.
                        </p>

                        <Mustache />

                        {/* Social Icons */}
                        <div className="mt-10 grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-5 place-items-center">
                            {socials.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={social.name}
                                        className={`
                                            group flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center rounded-full
                                            shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm
                                            transition-all duration-300 ease-out
                                            hover:-translate-y-2 hover:scale-110 md:hover:scale-125 hover:border-transparent hover:text-white
                                            hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]
                                            ${social.hover}
                                        `}
                                        style={{
                                            border: "1px solid var(--border-strong)",
                                            backgroundColor: "var(--border)",
                                            color: "var(--accent)",
                                        }}
                                    >
                                        <Icon className="text-xl sm:text-2xl md:text-3xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>
            </div>
        </main>
    );
}