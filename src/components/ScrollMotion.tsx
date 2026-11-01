"use client";

import { useEffect } from "react";

export default function ScrollMotion() {
    useEffect(() => {
        const root = document.documentElement;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0;
        let previousY = window.scrollY;
        let previousTime = performance.now();
        let lastFrame = previousTime;
        let energy = 0;
        let lean = 0;

        const clear = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            energy = 0;
            lean = 0;
            previousY = window.scrollY;
            previousTime = performance.now();
            root.style.removeProperty("--scroll-energy");
            root.style.removeProperty("--scroll-lean");
        };
        const tick = (time: number) => {
            const decay = Math.exp(-Math.min(time - lastFrame, 64) / 180);
            lastFrame = time;
            energy *= decay;
            lean *= decay;
            root.style.setProperty("--scroll-energy", energy.toFixed(4));
            root.style.setProperty("--scroll-lean", `${lean.toFixed(3)}deg`);
            if (energy < 0.0001 && Math.abs(lean) < 0.005) clear();
            else frame = requestAnimationFrame(tick);
        };
        const onScroll = () => {
            const time = performance.now();
            const delta = window.scrollY - previousY;
            const elapsed = Math.max(16, time - previousTime);
            previousY = window.scrollY;
            previousTime = time;
            if (reducedMotion.matches || document.hidden) return;
            const speed = Math.min(1, Math.abs(delta) / elapsed / 2);
            energy = Math.max(energy, speed * 0.018);
            lean = Math.sign(delta) * speed * 0.45;
            if (!frame) {
                lastFrame = time;
                frame = requestAnimationFrame(tick);
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", clear);
        reducedMotion.addEventListener("change", clear);
        return () => {
            clear();
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("visibilitychange", clear);
            reducedMotion.removeEventListener("change", clear);
        };
    }, []);

    return null;
}
