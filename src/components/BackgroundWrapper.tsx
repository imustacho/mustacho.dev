"use client";

import { motion, MotionConfig, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const smoothX = useSpring(x, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
        const handleMouseMove = (event: MouseEvent) => {
            const offsetX = (event.clientX / window.innerWidth - 0.5) * 40;
            const offsetY = (event.clientY / window.innerHeight - 0.5) * 40;
            x.set(offsetX);
            y.set(offsetY);
        };

        const sync = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (media.matches) window.addEventListener("mousemove", handleMouseMove, { passive: true });
            else { x.set(0); y.set(0); }
        };
        sync();
        media.addEventListener("change", sync);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            media.removeEventListener("change", sync);
        };
    }, [x, y]);

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen w-full relative isolate" style={{ backgroundColor: "var(--bg)" }}>
                <motion.div
                    aria-hidden="true"
                    style={{
                        x: smoothX,
                        y: smoothY,
                        backgroundImage: `
                          radial-gradient(circle, var(--dot-color) 0.8px, transparent 2.5px),
                          radial-gradient(circle, var(--dot-color) 0.8px, transparent 2.5px)
                        `,
                        backgroundSize: "35px 35px",
                        backgroundPosition: "0 0, 17.5px 17.5px",
                    }}
                    className="pointer-events-none fixed -inset-10 -z-10"
                />
                {children}
            </div>
        </MotionConfig>
    );
}
