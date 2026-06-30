"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    // Mouse coordinates mapped to small translation offsets
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for liquid lag/inertia
    const smoothX = useSpring(x, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Map mouse position to offset (-20px to 20px)
            const offsetX = (e.clientX / window.innerWidth - 0.5) * 40;
            const offsetY = (e.clientY / window.innerHeight - 0.5) * 40;
            x.set(offsetX);
            y.set(offsetY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [x, y]);

    // Construct the background position inline style dynamically
    const backgroundPosition = useTransform(
        [smoothX, smoothY],
        ([ox, oy]) => `${ox}px ${oy}px, ${17.5 + (ox as number)}px ${17.5 + (oy as number)}px`
    );

    return (
        <motion.div
            style={{
                backgroundColor: "#f5efe6",
                backgroundImage: `
                  radial-gradient(circle, rgba(149,86,35,0.18) 1.6px, transparent 1.6px),
                  radial-gradient(circle, rgba(149,86,35,0.18) 1.6px, transparent 1.6px)
                `,
                backgroundSize: "35px 35px",
                backgroundPosition: backgroundPosition,
            }}
            className="min-h-screen w-full relative"
        >
            {children}
        </motion.div>
    );
}
