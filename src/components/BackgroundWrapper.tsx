"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useRef } from "react";

const markRegions = [
    { left: [16, 30], top: [18, 39] },
    { left: [43, 59], top: [59, 81] },
    { left: [70, 84], top: [18, 43] },
] as const;

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    const backdropRef = useRef<HTMLDivElement>(null);

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
