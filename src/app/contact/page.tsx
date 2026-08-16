"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface HistoryItem {
    type: "input" | "output" | "error" | "info";
    text: string;
}

const BOOT_MESSAGES: HistoryItem[] = [
    { type: "info",   text: "mustacho@dev:~$ ./terminal --init" },
    { type: "output", text: "" },
    { type: "output", text: "  Mustacho Terminal v2.0" },
    { type: "output", text: "  Istanbul, TR" },
    { type: "output", text: "" },
    { type: "output", text: "  Type 'help' to see available commands." },
    { type: "output", text: "" },
];

export default function ContactPage() {
    const { theme } = useTheme();
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [cmdIndex, setCmdIndex] = useState(-1);

    // Use ref (not state) to guard boot so it never causes a re-render loop
    const hasBooted = useRef(false);
    const inputRef  = useRef<HTMLInputElement>(null);
    const endRef    = useRef<HTMLDivElement>(null);

    /* ── Boot sequence (runs exactly once) ──────────────────── */
    useEffect(() => {
        if (hasBooted.current) return;
        hasBooted.current = true;

        let i = 0;
        let cancelled = false;

        const tick = () => {
            if (cancelled || i >= BOOT_MESSAGES.length) return;
            const msg = BOOT_MESSAGES[i];
            i++;
            setHistory((prev) => [...prev, msg]);
            setTimeout(tick, i < 2 ? 120 : 40);
        };

        const timer = setTimeout(tick, 150);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, []); // empty — runs once on mount

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleContainerClick = () => inputRef.current?.focus();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const next = Math.min(cmdIndex + 1, cmdHistory.length - 1);
            setCmdIndex(next);
            setInput(cmdHistory[next] ?? "");
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = Math.max(cmdIndex - 1, -1);
            setCmdIndex(next);
            setInput(next === -1 ? "" : cmdHistory[next]);
            return;
        }
        if (e.key !== "Enter") return;

        const raw     = input.trim();
        const command = raw.toLowerCase();

        const newHistory: HistoryItem[] = [
            ...history,
            { type: "input", text: `visitor@mustacho:~$ ${raw}` },
        ];

        if (raw) {
            setCmdHistory((prev) => [raw, ...prev]);
            setCmdIndex(-1);
        }

        if (!command) {
            setHistory(newHistory);
            setInput("");
            return;
        }

        let out: HistoryItem[] = [];

        switch (command) {
            case "help":
                out = [
                    { type: "output", text: "  whoami   - A bit about me." },
                    { type: "output", text: "  socials  - All my links." },
                    { type: "output", text: "  github   - Open GitHub profile." },
                    { type: "output", text: "  discord  - Open Discord server." },
                    { type: "output", text: "  spotify  - Open Spotify profile." },
                    { type: "output", text: "  mail     - Send me an email." },
                    { type: "output", text: "  clear    - Clear the screen." },
                ];
                break;

            case "whoami":
                out = [
                    { type: "output", text: "  Mustacho — high school student from Istanbul." },
                    { type: "output", text: "  I build Discord bots and websites." },
                    { type: "output", text: "  I manage a couple of online communities." },
                    { type: "output", text: "" },
                    { type: "output", text: "  Location  : Istanbul, Turkey" },
                    { type: "output", text: "  School    : Science high school" },
                    { type: "output", text: "  Hobbies   : Photography, Music" },
                    { type: "output", text: "  Next      : Electronics & hardware" },
                ];
                break;

            case "socials":
                out = [
                    { type: "output", text: "  GitHub   ->  github.com/imustacho" },
                    { type: "output", text: "  Discord  ->  discord.gg/eJkymXBAXU" },
                    { type: "output", text: "  Email    ->  mail@mustacho.dev" },
                    { type: "output", text: "  Spotify  ->  open.spotify.com/user/..." },
                    { type: "output", text: "" },
                    { type: "info",   text: "  Tip: run 'github' or 'discord' to open them." },
                ];
                break;

            case "github":
                window.open("https://github.com/imustacho", "_blank");
                out = [{ type: "info", text: "  Opening github.com/imustacho..." }];
                break;

            case "discord":
                window.open("https://discord.gg/eJkymXBAXU", "_blank");
                out = [{ type: "info", text: "  Opening discord.gg/eJkymXBAXU..." }];
                break;

            case "spotify":
                window.open("https://open.spotify.com/user/31ouiktnesnmb4l555pdsjevaqcm", "_blank");
                out = [{ type: "info", text: "  Opening Spotify profile..." }];
                break;

            case "mail":
                window.open("mailto:mail@mustacho.dev", "_self");
                out = [{ type: "info", text: "  Opening mail client..." }];
                break;

            case "clear":
                setHistory([]);
                setInput("");
                return;

            default:
                out = [
                    { type: "error", text: `  ${command}: command not found` },
                    { type: "info",  text: "  Type 'help' to see available commands." },
                ];
        }

        setHistory([...newHistory, ...out, { type: "output", text: "" }]);
        setInput("");
    };

    /* ── Theme-aware palette ────────────────────────────────── */
    const isDark = theme === "dark";

    // Terminal always uses a dark surface regardless of light/dark mode
    const termBg      = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.88)";
    const termSurface = isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.92)";
    const termBorder  = isDark
        ? "rgba(255,255,255,0.06)"
        : "var(--border-strong)";
    const termShadow  = isDark
        ? "0 24px 80px rgba(0,0,0,0.6)"
        : "0 24px 80px var(--shadow-strong)";

    // Warm-tinted terminal text palette
    const colorMap = {
        output:  "#a09890",
        input:   "var(--accent)",
        error:   "#e07060",
        info:    isDark ? "#7090a0" : "#7eb8c9",
    };

    const dotColors = isDark
        ? ["#555", "#555", "#555"]
        : ["#ff5f57", "#febc2e", "#28c840"];

    return (
        <main
            className="min-h-screen relative overflow-hidden"
            style={{ color: "var(--text-primary)" }}
        >
            <div className="pt-24 pb-20 min-h-screen w-full flex flex-col justify-center">
                <section className="py-16 px-5 md:px-8 max-w-3xl mx-auto flex flex-col items-center gap-8 w-full">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="text-center flex flex-col items-center gap-2"
                    >
                        <h1
                            className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-tight"
                            style={{ color: "var(--accent)" }}
                        >
                            Get in Touch
                        </h1>
                        <p className="text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
                            Type a command and hit Enter. Try{" "}
                            <code
                                className="px-1.5 py-0.5 rounded text-xs font-mono font-bold border"
                                style={{
                                    backgroundColor: "var(--border)",
                                    borderColor: "var(--border-strong)",
                                    color: "var(--accent)",
                                }}
                            >
                                help
                            </code>
                            {" "}to get started.
                        </p>
                    </motion.div>

                    {/* Terminal Window */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.1 }}
                        onClick={handleContainerClick}
                        className="w-full rounded-3xl overflow-hidden cursor-text flex flex-col"
                        style={{
                            backgroundColor: termBg,
                            border: `1px solid ${termBorder}`,
                            boxShadow: termShadow,
                            height: "clamp(320px, 55vh, 480px)",
                        }}
                    >
                        {/* Title Bar */}
                        <div
                            className="flex items-center justify-between px-5 py-3.5 select-none border-b shrink-0"
                            style={{
                                backgroundColor: termSurface,
                                borderColor: termBorder,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {dotColors.map((c, i) => (
                                    <div
                                        key={i}
                                        className="w-3 h-3 rounded-full transition-colors duration-300"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>

                            <span
                                className="text-[10px] font-mono uppercase tracking-[0.25em]"
                                style={{ color: "rgba(200,196,190,0.25)" }}
                            >
                                mustacho@dev — terminal
                            </span>

                            <div className="w-14" />
                        </div>

                        {/* Output area */}
                        <div
                            className="flex-1 overflow-y-auto px-5 py-4 font-mono text-[11px] sm:text-xs leading-relaxed flex flex-col gap-0.5 no-scrollbar"
                            style={{ color: colorMap.output }}
                        >
                            {history.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="whitespace-pre-wrap"
                                    style={{ color: colorMap[item.type] }}
                                >
                                    {item.text}
                                </div>
                            ))}

                            {/* Active prompt */}
                            <div
                                className="flex items-center gap-2 relative mt-0.5"
                                style={{ color: colorMap.input }}
                            >
                                <span className="shrink-0 select-none hidden sm:inline">visitor@mustacho:~$</span>
                                <span className="shrink-0 select-none sm:hidden">~$</span>

                                <div className="flex flex-wrap items-center flex-1 font-mono" style={{ color: colorMap.output }}>
                                    <span className="whitespace-pre-wrap break-all">{input}</span>
                                    <span
                                        className="w-[7px] h-[14px] ml-0.5 animate-blink rounded-[1px] shrink-0"
                                        style={{ backgroundColor: colorMap.input }}
                                    />
                                </div>

                                {/* Hidden real input */}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="absolute inset-0 w-full bg-transparent border-none outline-none text-transparent caret-transparent focus:ring-0 opacity-0 cursor-text"
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                />
                            </div>

                            <div ref={endRef} />
                        </div>
                    </motion.div>

                </section>
            </div>
        </main>
    );
}
