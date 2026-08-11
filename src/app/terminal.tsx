"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";

interface HistoryItem {
    type: "input" | "output" | "error";
    text: string;
}

export default function Terminal() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([
        { type: "output", text: "Mustacho Terminal v2.0" },
        { type: "output", text: "Istanbul, TR" },
        { type: "output", text: "" },
        { type: "output", text: "Type 'help' to see available commands." },
    ]);

    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const command = input.trim().toLowerCase();
            const newHistory = [...history, { type: "input" as const, text: `$ ${input}` }];

            if (command === "") {
                setHistory(newHistory);
                setInput("");
                return;
            }

            let outputText = "";
            let type: "output" | "error" = "output";

            switch (command) {
                case "help":
                    outputText = `  whoami    Who am I?
  socials   Social media links
  github    Open GitHub profile
  discord   Join Discord server
  spotify   Open Spotify
  mail      Send an email
  clear     Clear the screen`;
                    break;
                case "whoami":
                    outputText = "  Mustacho — Creative coder & frontend dev from Istanbul.\n  I combine visual aesthetics with math and physics to\n  build smooth, playful browser experiences.";
                    break;
                case "socials":
                    outputText = `  GitHub    github.com/imustacho
  Discord   discord.gg/eJkymXBAXU
  Email     mail@mustacho.dev

  Run a command directly to open it.`;
                    break;
                case "github":
                    outputText = "  Opening GitHub...";
                    window.open("https://github.com/imustacho", "_blank");
                    break;
                case "discord":
                    outputText = "  Opening Discord...";
                    window.open("https://discord.gg/eJkymXBAXU", "_blank");
                    break;
                case "spotify":
                    outputText = "  Opening Spotify...";
                    window.open("https://open.spotify.com/user/imustacho", "_blank");
                    break;
                case "mail":
                    outputText = "  Opening mail client...";
                    window.open("mailto:mail@mustacho.dev", "_self");
                    break;
                case "clear":
                    setHistory([]);
                    setInput("");
                    return;
                default:
                    outputText = `  Unknown command: '${command}'\n  Type 'help' for a list of commands.`;
                    type = "error";
                    break;
            }

            setHistory([...newHistory, { type, text: outputText }]);
            setInput("");
        }
    };

    return (
        <section className="py-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-8 min-h-screen justify-center">
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-3">
                <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-heading text-5xl tracking-tight"
                    style={{ color: "var(--accent)" }}
                >
                    Get in Touch
                </motion.h2>
                <p className="text-lg" style={{ color: "var(--text-muted)" }}>
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
                    </code>{" "}
                    to get started.
                </p>
            </div>

            {/* Terminal Window */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                onClick={handleContainerClick}
                className="w-full rounded-2xl border overflow-hidden cursor-text flex flex-col"
                style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-strong)",
                    boxShadow: "0 20px 60px var(--shadow-strong)",
                    height: "380px",
                }}
            >
                {/* Title Bar */}
                <div
                    className="px-4 py-3 flex items-center justify-between border-b"
                    style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(234,67,53,0.7)" }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(251,188,5,0.7)" }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(52,168,83,0.7)" }} />
                    </div>
                    <span
                        className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] select-none"
                        style={{ color: "var(--text-faint)" }}
                    >
                        mustacho@dev — terminal
                    </span>
                    <div className="w-14" />
                </div>

                {/* Output Area */}
                <div
                    className="p-5 overflow-y-auto flex-1 font-mono text-sm leading-relaxed flex flex-col gap-1 no-scrollbar"
                    style={{ color: "var(--text-muted)" }}
                >
                    {history.map((item, idx) => (
                        <div
                            key={idx}
                            className="whitespace-pre-wrap"
                            style={{
                                color: item.type === "input"
                                    ? "var(--accent)"
                                    : item.type === "error"
                                        ? "rgba(234,67,53,0.85)"
                                        : "var(--text-muted)",
                                fontWeight: item.type === "input" ? 600 : 400,
                            }}
                        >
                            {item.text}
                        </div>
                    ))}

                    {/* Prompt Line */}
                    <div className="flex items-center gap-2 mt-1" style={{ color: "var(--accent)" }}>
                        <span className="shrink-0 select-none font-semibold">$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none flex-1 p-0 m-0 font-mono caret-transparent focus:ring-0 focus:border-none"
                            style={{ color: "var(--text-primary)" }}
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                        {/* Blinking Cursor */}
                        <span
                            className="w-2 h-4 -ml-2 animate-blink rounded-sm"
                            style={{ backgroundColor: "var(--accent)" }}
                        />
                    </div>
                    <div ref={terminalEndRef} />
                </div>
            </motion.div>
        </section>
    );
}
