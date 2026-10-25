"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { getThemeSnapshot, getServerThemeSnapshot, subscribeToTheme, savePreference } from "@/lib/theme";
import type { ThemeMode, ResolvedTheme, ColorTheme } from "@/lib/theme";
export type { ThemeMode, ResolvedTheme, ColorTheme } from "@/lib/theme";

interface ThemeContextValue {
    mode: ThemeMode;
    theme: ResolvedTheme;
    setMode: (mode: ThemeMode) => void;
    colorTheme: ColorTheme;
    setColorTheme: (color: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: "system", theme: "light", colorTheme: "cream",
    setMode: () => {}, setColorTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const snapshot = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
    const [mode, theme, colorTheme] = snapshot.split(":") as [ThemeMode, ResolvedTheme, ColorTheme];
    const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = theme;
        root.dataset.colorTheme = colorTheme;
        root.style.colorScheme = theme;
    }, [theme, colorTheme]);

    useEffect(() => () => {
        if (transitionTimer.current) clearTimeout(transitionTimer.current);
        document.documentElement.removeAttribute("data-theme-transitioning");
    }, []);

    const value = useMemo(() => {
        const transition = () => {
            if (transitionTimer.current) clearTimeout(transitionTimer.current);
            document.documentElement.dataset.themeTransitioning = "1";
            transitionTimer.current = setTimeout(() => {
                document.documentElement.removeAttribute("data-theme-transitioning");
            }, 900);
        };
        return {
            mode, theme, colorTheme,
            setMode: (nextMode: ThemeMode) => {
                transition();
                savePreference("mustacho-theme-mode", nextMode);
            },
            setColorTheme: (nextColor: ColorTheme) => {
                transition();
                savePreference("mustacho-color-theme", nextColor);
            },
        };
    }, [mode, theme, colorTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
