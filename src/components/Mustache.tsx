"use client";

import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

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

const LEFT = { x: 440, y: 498.9 };
const RIGHT = { x: 1099, y: 499.7 };
const MID_X = (LEFT.x + RIGHT.x) / 2;
const SPRING = { type: "spring" as const, stiffness: 320, damping: 26, velocity: 0 };
type Side = "left" | "right";
type Drag = {
    pointerId: number;
    side: Side;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
};

export default function Mustache() {
    const reducedMotion = useReducedMotion();
    const svgRef = useRef<SVGSVGElement>(null);
    const drag = useRef<Drag | null>(null);
    const leftX = useMotionValue(0);
    const leftY = useMotionValue(0);
    const rightX = useMotionValue(0);
    const rightY = useMotionValue(0);
    const leftCX = useTransform(leftX, x => LEFT.x + x);
    const leftCY = useTransform(leftY, y => LEFT.y + y);
    const rightCX = useTransform(rightX, x => RIGHT.x + x);
    const rightCY = useTransform(rightY, y => RIGHT.y + y);

    // The path and handles share SVG coordinates; no CSS transform origins can drift.
    const path = useTransform([leftX, leftY, rightX, rightY], values => {
        const [lx, ly, rx, ry] = values as number[];
        const warp = (rawX: number, rawY: number) => {
            const x = rawX / 10;
            const y = 1024 - rawY / 10;
            const leftWeight = Math.pow(Math.max(0, Math.min(1, (MID_X - x) / (MID_X - LEFT.x))), 1.5);
            const rightWeight = Math.pow(Math.max(0, Math.min(1, (x - MID_X) / (RIGHT.x - MID_X))), 1.5);
            return `${x + lx * leftWeight + rx * rightWeight} ${y + ly * leftWeight + ry * rightWeight}`;
        };
        return POINTS.map(p => p.type === "M"
            ? `M ${warp(p.x, p.y)}`
            : `C ${warp(p.x1, p.y1)}, ${warp(p.x2, p.y2)}, ${warp(p.x, p.y)}`
        ).join(" ") + " Z";
    });

    const localPoint = (clientX: number, clientY: number) => {
        const matrix = svgRef.current?.getScreenCTM();
        return matrix ? new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse()) : null;
    };

    const finishDrag = useCallback((pointerId?: number) => {
        const current = drag.current;
        if (!current || (pointerId !== undefined && current.pointerId !== pointerId)) return;
        drag.current = null;
        const svg = svgRef.current;
        if (svg?.hasPointerCapture(current.pointerId)) svg.releasePointerCapture(current.pointerId);
        const offsets = current.side === "left" ? [leftX, leftY] : [rightX, rightY];
        for (const offset of offsets) {
            offset.stop();
            if (reducedMotion) offset.set(0);
            else animate(offset, 0, SPRING);
        }
    }, [leftX, leftY, rightX, rightY, reducedMotion]);

    const startDrag = (event: ReactPointerEvent<SVGElement>, handle?: Side) => {
        if (drag.current || !event.isPrimary || event.button !== 0) return;
        const point = localPoint(event.clientX, event.clientY);
        if (!point || !svgRef.current) return;
        event.preventDefault();
        // A handle keeps its identity even when pulled across the center.
        const side = handle ?? (point.x <= MID_X ? "left" : "right");
        const [x, y] = side === "left" ? [leftX, leftY] : [rightX, rightY];
        x.stop();
        y.stop();
        drag.current = {
            pointerId: event.pointerId, side,
            startX: point.x, startY: point.y,
            offsetX: x.get(), offsetY: y.get(),
        };
        svgRef.current.setPointerCapture(event.pointerId);
    };

    const moveDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
        const current = drag.current;
        if (!current || event.pointerId !== current.pointerId) return;
        if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
            finishDrag(event.pointerId);
            return;
        }
        const point = localPoint(event.clientX, event.clientY);
        if (!point) return;
        const [x, y] = current.side === "left" ? [leftX, leftY] : [rightX, rightY];
        x.set(current.offsetX + point.x - current.startX);
        y.set(current.offsetY + point.y - current.startY);
    };

    useEffect(() => {
        const reset = () => finishDrag();
        const onVisibilityChange = () => { if (document.hidden) reset(); };
        window.addEventListener("blur", reset);
        window.addEventListener("resize", reset);
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            window.removeEventListener("blur", reset);
            window.removeEventListener("resize", reset);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            drag.current = null;
            for (const offset of [leftX, leftY, rightX, rightY]) offset.stop();
        };
    }, [finishDrag, leftX, leftY, rightX, rightY]);

    return (
        <motion.svg
            ref={svgRef}
            data-mustache
            aria-label="Drag the mustache"
            viewBox="420 412 700 200"
            className="mt-8 w-72 overflow-visible select-none md:w-96"
            initial={{ filter: "drop-shadow(0px 6px 12px var(--shadow))" }}
            whileHover={{ filter: "drop-shadow(0px 14px 24px var(--shadow-strong))" }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            onPointerMove={moveDrag}
            onPointerUp={event => finishDrag(event.pointerId)}
            onPointerCancel={event => finishDrag(event.pointerId)}
            onLostPointerCapture={event => finishDrag(event.pointerId)}
        >
            <motion.path
                d={path}
                fill="var(--accent)"
                className="cursor-grab touch-none active:cursor-grabbing"
                onPointerDown={event => startDrag(event)}
            />
            {(["left", "right"] as const).map(side => (
                <g
                    key={side}
                    data-mustache-handle={side}
                    className="group cursor-grab touch-none active:cursor-grabbing"
                    onPointerDown={event => startDrag(event, side)}
                >
                    <motion.circle
                        cx={side === "left" ? leftCX : rightCX}
                        cy={side === "left" ? leftCY : rightCY}
                        r={30}
                        fill="transparent"
                        pointerEvents="all"
                    />
                    <motion.circle
                        cx={side === "left" ? leftCX : rightCX}
                        cy={side === "left" ? leftCY : rightCY}
                        r={10}
                        fill="var(--accent-hover)"
                        stroke="var(--bg)"
                        strokeWidth={2.5}
                        pointerEvents="none"
                        className="group-hover:fill-[var(--accent)]"
                    />
                </g>
            ))}
        </motion.svg>
    );
}
