"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useRef } from "react";

const markRegions = [
    { left: [8, 20], top: [18, 39] },
    { left: [8, 20], top: [65, 85] },
    { left: [80, 92], top: [24, 55] },
] as const;

function curlPath(points: number[], bendX: number, bendY: number) {
    const warped: string[] = [];
    for (let index = 0; index < points.length; index += 2) {
        const x = points[index];
        const y = points[index + 1];
        const t = (x - 210) / 250;
        // Vary the bend along the stroke: the middle stays put while the ends curl.
        const wave = Math.sin(t * Math.PI);
        const nextX = x + bendX * wave * 32 - bendY * (y - 170) * t * 0.35;
        const nextY = y + bendY * t * t * 100 + bendX * wave * 38;
        warped.push(`${nextX.toFixed(2)} ${nextY.toFixed(2)}`);
    }
    return `M ${warped[0]} C ${warped.slice(1).join(" ")}`;
}

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
            const paths = Array.from(mark.querySelectorAll("path"), path => {
                const original = path.getAttribute("d")!;
                // These authored paths contain one move followed by cubic curves.
                const points = original.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
                return { path, original, points };
            });
            return { mark, paths, x: 0, y: 0, targetX: 0, targetY: 0 };
        });

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0;
        let lastTime = 0;
        let targetDirty = false;
        let pointer: { x: number; y: number } | null = null;
        const update = (time: number) => {
            frame = 0;
            const elapsed = Math.min(time - lastTime, 64);
            lastTime = time;
            const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 160);
            let moving = false;
            for (const state of marks) {
                if (targetDirty) {
                    state.targetX = 0;
                    state.targetY = 0;
                    const matrix = state.mark.getScreenCTM();
                    if (pointer && !reducedMotion.matches && matrix) {
                        // Convert into each randomly rotated mark's own coordinates.
                        const local = new DOMPoint(pointer.x, pointer.y).matrixTransform(matrix.inverse());
                        const dx = local.x - 210;
                        const dy = local.y - 170;
                        const resistance = Math.hypot(dx, dy) + 180;
                        state.targetX = dx / resistance;
                        state.targetY = dy / resistance;
                    }
                }
                state.x += (state.targetX - state.x) * blend;
                state.y += (state.targetY - state.y) * blend;
                const settled = Math.hypot(state.targetX - state.x, state.targetY - state.y) < 0.001;
                if (settled) { state.x = state.targetX; state.y = state.targetY; }
                else moving = true;
                for (const { path, original, points } of state.paths) {
                    path.setAttribute("d", state.x === 0 && state.y === 0
                        ? original : curlPath(points, state.x, state.y));
                }
            }
            targetDirty = false;
            if (moving) frame = requestAnimationFrame(update);
        };
        const scheduleUpdate = () => {
            targetDirty = true;
            if (!frame) {
                lastTime = performance.now();
                frame = requestAnimationFrame(update);
            }
        };
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
            for (const { paths } of marks) {
                for (const { path, original } of paths) path.setAttribute("d", original);
            }
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
