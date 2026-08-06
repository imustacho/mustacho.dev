"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

// Original SVG coordinate space (before scale(0.1,-0.1) + translate)
// Points are in the 10x scaled system that gets rendered via transform
const POINTS = [
    { type: "M", x: 6720, y: 5963 },
    { type: "C", x1: 6454, y1: 5937, x2: 6305, y2: 5881, x: 5870, y: 5644 },
    { type: "C", x1: 5431, y1: 5405, x2: 5163, y2: 5332, x: 4690, y: 5323 },
    { type: "C", x1: 4405, y1: 5317, x2: 4400, y2: 5316, x: 4400, y: 5251 },
    { type: "C", x1: 4401, y1: 5125, x2: 4506, y2: 4922, x: 4652, y: 4765 },
    { type: "C", x1: 5120, y1: 4264, x2: 5975, y2: 4062, x: 6730, y: 4275 },
    { type: "C", x1: 7009, y1: 4353, x2: 7253, y2: 4481, x: 7538, y: 4697 },
    { type: "C", x1: 7716, y1: 4832, x2: 7682, y2: 4830, x: 7827, y: 4715 },
    { type: "C", x1: 7970, y1: 4602, x2: 8153, y2: 4485, x: 8293, y: 4415 },
    { type: "C", x1: 8791, y1: 4170, x2: 9373, y2: 4124, x: 9925, y: 4286 },
    { type: "C", x1: 10280, y1: 4391, x2: 10586, y2: 4579, x: 10774, y: 4809 },
    { type: "C", x1: 10890, y1: 4951, x2: 10990, y2: 5152, x: 10990, y: 5243 },
    { type: "C", x1: 10990, y1: 5321, x2: 10990, y2: 5321, x: 10688, y: 5324 },
    { type: "C", x1: 10393, y1: 5327, x2: 10294, y2: 5340, x: 10073, y: 5404 },
    { type: "C", x1: 9879, y1: 5461, x2: 9750, y2: 5519, x: 9415, y: 5701 },
    { type: "C", x1: 9091, y1: 5876, x2: 8936, y2: 5934, x: 8716, y: 5960 },
    { type: "C", x1: 8467, y1: 5990, x2: 8199, y2: 5923, x: 7962, y: 5773 },
    { type: "C", x1: 7897, y1: 5732, x2: 7750, y2: 5619, x: 7730, y: 5595 },
    { type: "C", x1: 7708, y1: 5569, x2: 7683, y2: 5578, x: 7601, y: 5644 },
    { type: "C", x1: 7299, y1: 5888, x2: 7012, y2: 5992, x: 6720, y: 5963 }
] as const;

// ViewBox: "420 412 700 200"
// SVG display space (after scale 0.1,-0.1 + translate 0,1024):
//   x_display = raw_x * 0.1
//   y_display = 1024 - raw_y * 0.1
// Left tip:  x=440, y=499  (raw 4400, 5249)
// Right tip: x=1099, y=500 (raw 10990, 5240)
// Mid X in display space: ~770

const VIEWBOX_W = 700;
const SVG_LEFT_X = 440;   // left circle cx in SVG display units
const SVG_RIGHT_X = 1099; // right circle cx in SVG display units
const SVG_MID_X = (SVG_LEFT_X + SVG_RIGHT_X) / 2; // ~769.5

// Spring config for snap-back
const SPRING = { type: "spring" as const, stiffness: 420, damping: 18 };

export default function Mustache() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const leftX = useMotionValue(0);
    const leftY = useMotionValue(0);
    const rightX = useMotionValue(0);
    const rightY = useMotionValue(0);

    const dragInfo = useRef({
        isDragging: false,
        /** 0–1: how much the left side is influenced */
        wL: 0,
        /** 0–1: how much the right side is influenced */
        wR: 0,
        startClientX: 0,
        startClientY: 0,
        startLX: 0,
        startLY: 0,
        startRX: 0,
        startRY: 0,
    });

    const path = useTransform([leftX, leftY, rightX, rightY], (values) => {
        const [lxVal, lyVal, rxVal, ryVal] = values as number[];

        // Scale pixel offsets into the raw coordinate space (10× scale, Y flipped)
        const ldx = lxVal * 10;
        const ldy = -lyVal * 10;
        const rdx = rxVal * 10;
        const rdy = -ryVal * 10;

        const warpPoint = (x: number, y: number) => {
            const MID_X = 7695;
            const LEFT_EDGE = 4400;
            const RIGHT_EDGE = 10990;

            let wL = 0;
            if (x <= LEFT_EDGE) {
                wL = 1;
            } else if (x < MID_X) {
                const t = (MID_X - x) / (MID_X - LEFT_EDGE);
                wL = Math.pow(t, 1.5); // softer falloff
            }

            let wR = 0;
            if (x >= RIGHT_EDGE) {
                wR = 1;
            } else if (x > MID_X) {
                const t = (x - MID_X) / (RIGHT_EDGE - MID_X);
                wR = Math.pow(t, 1.5);
            }

            return {
                x: x + ldx * wL + rdx * wR,
                y: y + ldy * wL + rdy * wR,
            };
        };

        let pathString = "";

        for (const p of POINTS) {
            if (p.type === "M") {
                const pt = warpPoint(p.x, p.y);
                pathString += `M ${pt.x} ${pt.y} `;
            } else {
                const pt1 = warpPoint(p.x1, p.y1);
                const pt2 = warpPoint(p.x2, p.y2);
                const pt = warpPoint(p.x, p.y);
                pathString += `C ${pt1.x} ${pt1.y}, ${pt2.x} ${pt2.y}, ${pt.x} ${pt.y} `;
            }
        }

        pathString += "Z";
        return pathString;
    });

    const startDrag = (e: React.PointerEvent<SVGPathElement | SVGCircleElement>) => {
        const svgEl = svgRef.current;
        if (!svgEl) return;

        // Capture pointer so drag continues even if cursor leaves the element
        e.currentTarget.setPointerCapture(e.pointerId);

        // Convert client X to SVG display space using the rendered bounding rect
        const rect = svgEl.getBoundingClientRect();
        // ViewBox starts at x=420, width=700 → scale factor
        const svgScale = VIEWBOX_W / rect.width;
        const svgX = (e.clientX - rect.left) * svgScale + 420;

        // Smooth weight: distance from midpoint, clamped 0–1
        // Points closer to an end get higher weight for that side
        const rangeL = SVG_MID_X - SVG_LEFT_X;   // ~329.5
        const rangeR = SVG_RIGHT_X - SVG_MID_X;  // ~329.5

        let wL = 0;
        let wR = 0;

        if (svgX <= SVG_MID_X) {
            // Left half: left weight goes 0→1 as x approaches left tip
            wL = Math.min(1, (SVG_MID_X - svgX) / rangeL);
            wR = 0;
        } else {
            // Right half
            wR = Math.min(1, (svgX - SVG_MID_X) / rangeR);
            wL = 0;
        }

        dragInfo.current = {
            isDragging: true,
            wL,
            wR,
            startClientX: e.clientX,
            startClientY: e.clientY,
            startLX: leftX.get(),
            startLY: leftY.get(),
            startRX: rightX.get(),
            startRY: rightY.get(),
        };
    };

    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            const info = dragInfo.current;
            if (!info.isDragging) return;

            const svgEl = svgRef.current;
            if (!svgEl) return;

            const rect = svgEl.getBoundingClientRect();
            // Pixel offset mapped to SVG display units
            const scale = VIEWBOX_W / rect.width;

            const dx = (e.clientX - info.startClientX) * scale;
            const dy = (e.clientY - info.startClientY) * scale;

            leftX.set(info.startLX + dx * info.wL);
            leftY.set(info.startLY + dy * info.wL);
            rightX.set(info.startRX + dx * info.wR);
            rightY.set(info.startRY + dy * info.wR);
        };

        const handleUp = () => {
            if (!dragInfo.current.isDragging) return;
            dragInfo.current.isDragging = false;

            animate(leftX, 0, SPRING);
            animate(leftY, 0, SPRING);
            animate(rightX, 0, SPRING);
            animate(rightY, 0, SPRING);
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
        window.addEventListener("pointercancel", handleUp);

        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
            window.removeEventListener("pointercancel", handleUp);
        };
    }, [leftX, leftY, rightX, rightY]);

    return (
        <motion.svg
            ref={svgRef}
            viewBox="420 412 700 200"
            className="mt-8 w-72 overflow-visible select-none md:w-96"
            initial={{ filter: "drop-shadow(0px 6px 12px var(--shadow))" }}
            whileHover={{ filter: "drop-shadow(0px 14px 24px var(--shadow-strong))" }}
            transition={{ duration: 0.3 }}
        >
            <motion.g
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <g transform="translate(0,1024) scale(0.1,-0.1)">
                    <motion.path
                        d={path}
                        fill="var(--accent)"
                        stroke="none"
                        className="cursor-grab touch-none active:cursor-grabbing"
                        onPointerDown={startDrag}
                    />
                </g>

                {/* Left tip handle */}
                <motion.circle
                    cx={SVG_LEFT_X}
                    cy={499}
                    r={10}
                    fill="var(--accent-hover)"
                    stroke="var(--bg)"
                    strokeWidth={2.5}
                    className="cursor-grab touch-none active:cursor-grabbing"
                    style={{ x: leftX, y: leftY }}
                    onPointerDown={startDrag}
                    whileHover={{ scale: 1.35, fill: "var(--accent)" }}
                    whileTap={{ scale: 0.9 }}
                />

                {/* Right tip handle */}
                <motion.circle
                    cx={SVG_RIGHT_X}
                    cy={500}
                    r={10}
                    fill="var(--accent-hover)"
                    stroke="var(--bg)"
                    strokeWidth={2.5}
                    className="cursor-grab touch-none active:cursor-grabbing"
                    style={{ x: rightX, y: rightY }}
                    onPointerDown={startDrag}
                    whileHover={{ scale: 1.35, fill: "var(--accent)" }}
                    whileTap={{ scale: 0.9 }}
                />
            </motion.g>
        </motion.svg>
    );
}
