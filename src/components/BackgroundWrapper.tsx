"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useRef } from "react";

const markRegions = [
    { left: [8, 20], top: [18, 39] },
    { left: [8, 20], top: [65, 85] },
    { left: [80, 92], top: [24, 55] },
] as const;

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const backdrop = backdropRef.current;
        if (!backdrop) return;
        const marks = Array.from(backdrop.querySelectorAll<SVGSVGElement>(".paper-flourish-scattered"), (mark, index) => {
            const region = markRegions[index];
            const between = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min);
            const left = between(region.left);
            const top = between(region.top);
            const rotation = Math.round(Math.random() * 100 - 50);
            mark.style.setProperty("--mark-left", `${left}%`);
            mark.style.setProperty("--mark-top", `${top}%`);
            mark.style.setProperty("--mark-rotation", `${rotation}deg`);
            mark.style.setProperty("--mark-scale", (0.75 + Math.random() * 0.45).toFixed(2));
            mark.classList.add("is-ready");
            return { mark, left, top, rotation };
        });

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0;
        let pointer: { x: number; y: number } | null = null;
        const update = () => {
            frame = 0;
            const bounds = backdrop.getBoundingClientRect();
            for (const { mark, left, top, rotation } of marks) {
                let x = 0;
                let y = 0;
                let turn = 0;
                if (pointer && !reducedMotion.matches) {
                    // Measure from the spawn position, never the moving artwork.
                    const dx = pointer.x - (bounds.left + bounds.width * left / 100);
                    const dy = pointer.y - (bounds.top + bounds.height * top / 100);
                    const distance = Math.hypot(dx, dy);
                    const pull = 24 / (distance + 180);
                    x = dx * pull;
                    y = dy * pull;
                    // A small turn toward the cursor, with no angle-wrap snapping.
                    const heading = (rotation - 20) * Math.PI / 180;
                    turn = (Math.cos(heading) * dy - Math.sin(heading) * dx) / (distance + 80) * 16;
                }
                mark.style.setProperty("--mark-pull-x", `${x.toFixed(2)}px`);
                mark.style.setProperty("--mark-pull-y", `${y.toFixed(2)}px`);
                mark.style.setProperty("--mark-turn", `${turn.toFixed(2)}deg`);
            }
        };
        const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
        const onMove = (event: PointerEvent) => {
            if (event.pointerType === "touch" || reducedMotion.matches) return;
            pointer = { x: event.clientX, y: event.clientY };
            scheduleUpdate();
        };
        const reset = () => { pointer = null; scheduleUpdate(); };
        const onLeave = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
        const onVisibility = () => { if (document.hidden) reset(); };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerout", onLeave);
        window.addEventListener("blur", reset);
        window.addEventListener("resize", reset);
        document.addEventListener("visibilitychange", onVisibility);
        reducedMotion.addEventListener("change", reset);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerout", onLeave);
            window.removeEventListener("blur", reset);
            window.removeEventListener("resize", reset);
            document.removeEventListener("visibilitychange", onVisibility);
            reducedMotion.removeEventListener("change", reset);
        };
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <div className="site-paper min-h-screen w-full relative isolate">
                <div ref={backdropRef} className="paper-backdrop" aria-hidden="true">
                    <div className="paper-grain" />
                    <svg className="paper-flourish paper-flourish-top" viewBox="0 0 520 640" fill="none">
                        <path className="paper-ribbon" d="M-95 20C285-70 414 109 230 216C49 322 42 403 179 418C303 432 353 318 262 299C164 279 112 465-30 565" />
                        <path className="paper-ink" d="M-89 5C296-81 435 111 244 230C63 343 60 388 176 401C280 412 330 337 270 317C176 285 129 480-16 581" />
                        <path className="paper-ink paper-ink-faint" d="M-35 110C88 64 160 99 144 156C121 238-22 252-46 352" />
                    </svg>
                    <svg className="paper-flourish paper-flourish-bottom" viewBox="0 0 540 500" fill="none">
                        <path className="paper-ribbon" d="M601 467C327 524 136 435 221 324C301 218 430 252 391 330C351 410 137 283 186 164C211 102 304 103 328 50" />
                        <path className="paper-ink" d="M604 486C316 548 113 438 205 310C287 195 449 244 407 339C363 440 111 289 168 156C194 95 286 89 308 35" />
                        <path className="paper-ink paper-ink-faint" d="M569 144C455 112 386 161 431 209C471 250 561 221 574 290" />
                    </svg>
                    {markRegions.map((_, index) => (
                        <svg key={index} className="paper-flourish paper-flourish-scattered" viewBox="0 0 420 340" fill="none">
                            <path className="paper-ribbon" d="M-34 237C62 274 141 242 143 171C145 100 76 78 89 125C103 178 230 178 285 84C314 33 370 49 450 80" />
                            <path className="paper-ink" d="M-31 253C72 289 159 249 159 169C159 101 67 60 73 126C80 204 240 191 301 92C337 34 389 62 451 69" />
                            <path className="paper-ink paper-ink-faint" d="M59 309C139 323 214 286 250 241C294 184 373 190 436 218" />
                        </svg>
                    ))}
                </div>
                {children}
            </div>
        </MotionConfig>
    );
}
