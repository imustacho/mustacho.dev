"use client";

import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import ScrollMotion from "@/components/ScrollMotion";

const markRegions = [
    { left: [8, 20], top: [18, 39] },
    { left: [8, 20], top: [65, 85] },
    { left: [80, 92], top: [24, 55] },
] as const;

function bendMark(source: string, amount: number) {
    const points = source.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const warped: string[] = [];
    for (let index = 0; index < points.length; index += 2) {
        const x = points[index];
        const y = points[index + 1];
        const t = (x - 210) / 250;
        // Bend the ends and the inner loop at different rates, like a loose ribbon.
        const nextX = x + Math.sin(t * Math.PI) * amount * 25;
        const nextY = y + (t * t * 65 + Math.sin(t * Math.PI * 2) * 18) * amount;
        warped.push(`${nextX.toFixed(2)} ${nextY.toFixed(2)}`);
    }
    return `M ${warped[0]} C ${warped.slice(1).join(" ")}`;
}

const markPaths = [
    { className: "paper-ribbon", d: "M-34 237C62 274 141 242 143 171C145 100 76 78 89 125C103 178 230 178 285 84C314 33 370 49 450 80" },
    { className: "paper-ink", d: "M-31 253C72 289 159 249 159 169C159 101 67 60 73 126C80 204 240 191 301 92C337 34 389 62 451 69" },
    { className: "paper-ink paper-ink-faint", d: "M59 309C139 323 214 286 250 241C294 184 373 190 436 218" },
].map(path => ({
    className: path.className,
    d: bendMark(path.d, 0),
    frames: [0, 0.75, 0, -0.65, 0].map(amount => bendMark(path.d, amount)),
}));

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    const backdropRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const marks = backdropRef.current?.querySelectorAll<SVGSVGElement>(".paper-flourish-scattered");
        marks?.forEach((mark, index) => {
            const region = markRegions[index];
            const between = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min);
            mark.style.setProperty("--mark-left", `${between(region.left)}%`);
            mark.style.setProperty("--mark-top", `${between(region.top)}%`);
            mark.style.setProperty("--mark-rotation", `${Math.round(Math.random() * 100 - 50)}deg`);
            mark.style.setProperty("--mark-scale", (0.75 + Math.random() * 0.45).toFixed(2));
            mark.classList.add("is-ready");
        });
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <ScrollMotion />
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
                            <g className="paper-mark-drift" style={{ animationDuration: `${14 + index * 3}s`, animationDelay: `${-index * 4}s` }}>
                                {markPaths.map(path => (
                                    <motion.path
                                        key={path.className}
                                        className={path.className}
                                        d={path.d}
                                        initial={false}
                                        animate={{ d: reducedMotion === false ? path.frames : path.d }}
                                        transition={{
                                            duration: reducedMotion === false ? 15 + index * 4 : 0,
                                            repeat: reducedMotion === false ? Infinity : 0,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </g>
                        </svg>
                    ))}
                </div>
                {children}
            </div>
        </MotionConfig>
    );
}
