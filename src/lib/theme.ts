export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type ColorTheme = "default" | "cream" | "red" | "blue";

type PreferenceKey = "mustacho-theme-mode" | "mustacho-color-theme";
const memory = new Map<PreferenceKey, string>();
const changeEvent = "mustacho-theme-change";

function readPreference(key: PreferenceKey) {
    // Keep this session functional even when browser storage is denied/full.
    if (memory.has(key)) return memory.get(key);
    try { return window.localStorage.getItem(key); } catch { return null; }
}

export function getServerThemeSnapshot() { return "system:light:cream"; }

export function getThemeSnapshot() {
    const savedMode = readPreference("mustacho-theme-mode");
    const mode = savedMode === "dark" || savedMode === "light" ? savedMode : "system";
    const theme = mode === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : mode;
    const savedColor = readPreference("mustacho-color-theme");
    const color = savedColor && ["default", "cream", "red", "blue"].includes(savedColor)
        ? savedColor : theme === "dark" ? "default" : "cream";
    return `${mode}:${theme}:${color}`;
}

export function savePreference(key: PreferenceKey, value: string) {
    memory.set(key, value);
    try { window.localStorage.setItem(key, value); } catch { /* Session preference still applies. */ }
    window.dispatchEvent(new Event(changeEvent));
}

export function subscribeToTheme(onChange: () => void) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onStorage = (event: StorageEvent) => {
        if (event.key === null) memory.clear();
        else if (event.key === "mustacho-theme-mode" || event.key === "mustacho-color-theme") memory.delete(event.key);
        else return;
        onChange();
    };
    window.addEventListener(changeEvent, onChange);
    window.addEventListener("storage", onStorage);
    media.addEventListener("change", onChange);
    return () => {
        window.removeEventListener(changeEvent, onChange);
        window.removeEventListener("storage", onStorage);
        media.removeEventListener("change", onChange);
    };
}
