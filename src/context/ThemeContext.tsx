"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type ColorTheme = "default" | "cream" | "red" | "blue";

interface ThemeContextValue {
    mode: ThemeMode;           // what the user selected
    theme: ResolvedTheme;      // what is actually applied
    setMode: (m: ThemeMode) => void;
    colorTheme: ColorTheme;
    setColorTheme: (t: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: "system",
    theme: "light",
    setMode: () => { },
    colorTheme: "cream",
    setColorTheme: () => { },
});

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
    if (mode === "system") return getSystemTheme();
    return mode;
}

/** Returns the smart default color theme based on resolved light/dark mode */
function getDefaultColorTheme(resolved: ResolvedTheme): ColorTheme {
    return resolved === "dark" ? "default" : "cream";
}

function applyTheme(resolved: ResolvedTheme) {
    document.documentElement.setAttribute("data-theme", resolved);
}

function applyColorTheme(ct: ColorTheme) {
    document.documentElement.setAttribute("data-color-theme", ct);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("system");
    const [theme, setTheme] = useState<ResolvedTheme>("light");
    const [colorTheme, setColorThemeState] = useState<ColorTheme>("cream");
    // Track whether user has explicitly chosen a color theme
    const [userChoseColor, setUserChoseColor] = useState(false);

    /* ── On mount: read saved preference ─────────────────────── */
    useEffect(() => {
        const stored = (localStorage.getItem("mustacho-theme-mode") as ThemeMode) ?? "system";
        const resolved = resolveTheme(stored);
        setModeState(stored);
        setTheme(resolved);
        applyTheme(resolved);

        const storedColor = localStorage.getItem("mustacho-color-theme") as ColorTheme | null;
        if (storedColor) {
            // User explicitly chose a color theme before
            setColorThemeState(storedColor);
            applyColorTheme(storedColor);
            setUserChoseColor(true);
        } else {
            // No saved preference: smart default based on light/dark
            const defaultColor = getDefaultColorTheme(resolved);
            setColorThemeState(defaultColor);
            applyColorTheme(defaultColor);
        }
    }, []);

    /* ── Listen for OS preference changes when in system mode ── */
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (mode === "system") {
                const resolved = getSystemTheme();
                setTheme(resolved);
                applyTheme(resolved);

                // If user hasn't explicitly chosen a color theme, update it
                if (!userChoseColor) {
                    const defaultColor = getDefaultColorTheme(resolved);
                    setColorThemeState(defaultColor);
                    applyColorTheme(defaultColor);
                }
            }
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [mode, userChoseColor]);

    const setMode = (m: ThemeMode) => {
        const resolved = resolveTheme(m);

        // Mark transitioning — CSS uses this to apply 0.8s color transitions
        document.documentElement.setAttribute("data-theme-transitioning", "1");
        document.documentElement.setAttribute("data-theme", resolved);

        setModeState(m);
        setTheme(resolved);
        localStorage.setItem("mustacho-theme-mode", m);

        // If user hasn't explicitly chosen a color theme, update it with the mode
        if (!userChoseColor) {
            const defaultColor = getDefaultColorTheme(resolved);
            setColorThemeState(defaultColor);
            applyColorTheme(defaultColor);
        }

        // Remove after transition completes (slightly longer than 0.8s CSS duration)
        setTimeout(() => {
            document.documentElement.removeAttribute("data-theme-transitioning");
        }, 900);
    };

    const setColorTheme = (t: ColorTheme) => {
        // Mark transitioning — CSS uses this to apply 0.8s color transitions
        document.documentElement.setAttribute("data-theme-transitioning", "1");
        applyColorTheme(t);

        setColorThemeState(t);
        setUserChoseColor(true);
        localStorage.setItem("mustacho-color-theme", t);

        // Remove after transition completes
        setTimeout(() => {
            document.documentElement.removeAttribute("data-theme-transitioning");
        }, 900);
    };

    return (
        <ThemeContext.Provider value={{ mode, theme, setMode, colorTheme, setColorTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
