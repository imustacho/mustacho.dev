"use client";

import { MotionConfig } from "motion/react";

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    return (
        <MotionConfig reducedMotion="user">
            <div className="site-paper min-h-screen w-full relative isolate">
                <div className="paper-backdrop" aria-hidden="true">
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
                </div>
                {children}
            </div>
        </MotionConfig>
    );
}
