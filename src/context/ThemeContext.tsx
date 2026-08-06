"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
    mode: ThemeMode;           // what the user selected
    theme: ResolvedTheme;      // what is actually applied
    setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: "system",
    theme: "light",
    setMode: () => {},
});

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
    if (mode === "system") return getSystemTheme();
    return mode;
}

function applyTheme(resolved: ResolvedTheme) {
    document.documentElement.setAttribute("data-theme", resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("system");
    const [theme, setTheme] = useState<ResolvedTheme>("light");

    /* ── On mount: read saved preference ─────────────────────── */
    useEffect(() => {
        const stored = (localStorage.getItem("mustacho-theme-mode") as ThemeMode) ?? "system";
        const resolved = resolveTheme(stored);
        setModeState(stored);
        setTheme(resolved);
        applyTheme(resolved);
    }, []);

    /* ── Listen for OS preference changes when in system mode ── */
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (mode === "system") {
                const resolved = getSystemTheme();
                setTheme(resolved);
                applyTheme(resolved);
            }
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [mode]);

    const setMode = (m: ThemeMode) => {
        const resolved = resolveTheme(m);

        // Mark transitioning — CSS uses this to apply 0.8s color transitions
        document.documentElement.setAttribute("data-theme-transitioning", "1");
        document.documentElement.setAttribute("data-theme", resolved);

        setModeState(m);
        setTheme(resolved);
        localStorage.setItem("mustacho-theme-mode", m);

        // Remove after transition completes (slightly longer than 0.8s CSS duration)
        setTimeout(() => {
            document.documentElement.removeAttribute("data-theme-transitioning");
        }, 900);
    };

    return (
        <ThemeContext.Provider value={{ mode, theme, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
