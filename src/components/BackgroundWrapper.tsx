"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const smoothX = useSpring(x, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const offsetX = (e.clientX / window.innerWidth - 0.5) * 40;
            const offsetY = (e.clientY / window.innerHeight - 0.5) * 40;
            x.set(offsetX);
            y.set(offsetY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [x, y]);

    const backgroundPosition = useTransform(
        [smoothX, smoothY],
        ([ox, oy]) => `${ox}px ${oy}px, ${17.5 + (ox as number)}px ${17.5 + (oy as number)}px`
    );

    return (
        <motion.div
            style={{
                backgroundColor: "var(--bg)",
                backgroundImage: `
                  radial-gradient(circle, var(--dot-color) 0.8px, transparent 2.5px),
                  radial-gradient(circle, var(--dot-color) 0.8px, transparent 2.5px)
                `,
                backgroundSize: "35px 35px",
                backgroundPosition: backgroundPosition,
            }}
            className="min-h-screen w-full relative transition-colors duration-300"
        >
            {children}
        </motion.div>
    );
}
