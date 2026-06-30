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
        { type: "output", text: "Mustacho Terminal OS [Version 1.0.0]" },
        { type: "output", text: "(c) 2026 Mustacho Corp. All rights reserved." },
        { type: "output", text: "Type a command to initiate contact. Write 'help' to get started." },
        { type: "output", text: "" }
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
            const newHistory = [...history, { type: "input" as const, text: `visitor@mustacho:~$ ${input}` }];

            if (command === "") {
                setHistory(newHistory);
                setInput("");
                return;
            }

            let outputText = "";
            let type: "output" | "error" = "output";

            switch (command) {
                case "help":
                    outputText = `Available Commands:
  whoami   - Who is the developer and what do they do?
  socials  - List all social media handles.
  github   - Open GitHub profile in a new tab.
  discord  - Open Discord server.
  spotify  - Open Spotify profile.
  mail     - Open email client.
  clear    - Clear terminal screen.`;
                    break;
                case "whoami":
                    outputText = "Mustacho - Creative Coder & Frontend Developer. I combine visual aesthetics with math and physics to deliver smooth, playful browser interfaces. My biggest hobby is stretching mustaches and creating micro-animations.";
                    break;
                case "socials":
                    outputText = `Social Links:
  GitHub: github.com/imustacho
  Discord: discord.gg/eJkymXBAXU
  Email: mail@mustacho.dev
(You can run commands like 'github' or 'discord' to open these links immediately.)`;
                    break;
                case "github":
                    outputText = "GitHub opening in a new tab...";
                    window.open("https://github.com/imustacho", "_blank");
                    break;
                case "discord":
                    outputText = "Discord opening in a new tab...";
                    window.open("https://discord.gg/eJkymXBAXU", "_blank");
                    break;
                case "mail":
                    outputText = "Opening email client...";
                    window.open("mailto:mail@mustacho.dev", "_self");
                    break;
                case "clear":
                    setHistory([]);
                    setInput("");
                    return;
                default:
                    outputText = `Command not found: '${command}'. Type 'help' for assistance.`;
                    type = "error";
                    break;
            }

            setHistory([...newHistory, { type, text: outputText }]);
            setInput("");
        }
    };

    return (
        <section className="py-20 px-6 max-w-3xl mx-auto flex flex-col items-center gap-8 min-h-screen justify-center">
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-3">
                <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-heading text-5xl text-[#955623] tracking-tight"
                >
                    Get in Touch
                </motion.h2>
                <p className="text-lg text-[#7a451b]">
                    Use the terminal CLI below to communicate with me.
                </p>
            </div>

            {/* Terminal Window */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                onClick={handleContainerClick}
                className="w-full bg-[#2c1a12] border-4 border-[#955623]/35 rounded-2xl shadow-[0_20px_50px_rgba(149,86,35,0.22)] overflow-hidden cursor-text flex flex-col h-96"
            >
                {/* Terminal Title Bar */}
                <div className="bg-[#1f120c] px-4 py-3 flex items-center justify-between border-b border-[#955623]/20">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ea4335]" />
                        <div className="w-3 h-3 rounded-full bg-[#fbbc05]" />
                        <div className="w-3 h-3 rounded-full bg-[#34a853]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#f5efe6]/40 uppercase tracking-widest select-none">
                        Mustacho CLI v1.0.0
                    </span>
                    <div className="w-14" />
                </div>

                {/* Terminal Output Area */}
                <div className="p-4 overflow-y-auto flex-1 font-mono text-sm leading-relaxed text-[#f5efe6] flex flex-col gap-2">
                    {history.map((item, idx) => (
                        <div
                            key={idx}
                            className={`whitespace-pre-wrap ${item.type === "input" ? "text-[#fdbc84]" :
                                item.type === "error" ? "text-[#ea4335]" : "text-[#f5efe6]/90"
                                }`}
                        >
                            {item.text}
                        </div>
                    ))}

                    {/* Prompt Line */}
                    <div className="flex items-center gap-2 text-[#fdbc84]">
                        <span className="shrink-0 select-none">visitor@mustacho:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-[#f5efe6] flex-1 p-0 m-0 font-mono caret-transparent focus:ring-0 focus:border-none"
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                        {/* Custom Blinking Cursor */}
                        <span className="w-2.5 h-4 bg-[#fdbc84] -ml-2 animate-blink" />
                    </div>
                    <div ref={terminalEndRef} />
                </div>
            </motion.div>
        </section>
    );
}
