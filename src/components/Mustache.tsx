"use client";

import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react";
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

type Point = { x: number; y: number };
type Side = "left" | "right";
const MID_X = 769.5;
const toPoint = (x: number, y: number): Point => ({ x: x / 10, y: 1024 - y / 10 });
const REST: Point[] = POINTS.flatMap(p => p.type === "M"
    ? [toPoint(p.x, p.y)]
    : [toPoint(p.x1, p.y1), toPoint(p.x2, p.y2), toPoint(p.x, p.y)]);
const LEFT_INDEX = REST.length;
const RIGHT_INDEX = REST.length + 1;
REST.push({ x: 440, y: 498.9 }, { x: 1099, y: 499.7 });

function makePath(points: Point[]) {
    let index = 0;
    const coordinate = () => {
        const point = points[index++];
        return `${point.x} ${point.y}`;
    };
    return POINTS.map(p => p.type === "M" ? `M ${coordinate()}`
        : `C ${coordinate()}, ${coordinate()}, ${coordinate()}`).join(" ") + " Z";
}

// A continuous rubber response: no hard clamp, dead zone, or cursor attachment.
function resistPull(x: number, y: number): Point {
    const distance = Math.hypot(x, y);
    const resistance = 0.65 / (1 + distance / 360);
    return { x: x * resistance, y: y * resistance };
}

type Drag = {
    pointerId: number;
    start: Point;
    pose: Point[];
    weights: number[];
};

export default function Mustache() {
    const reducedMotion = useReducedMotion();
    const svgRef = useRef<SVGSVGElement>(null);
    const drag = useRef<Drag | null>(null);
    const shape = useMotionValue<Point[]>(REST);
    const simulation = useRef({
        target: REST,
        velocity: REST.map(() => ({ x: 0, y: 0 })),
        frame: 0,
        lastTime: 0,
    });
    const path = useTransform(shape, makePath);
    const leftCX = useTransform(shape, points => points[LEFT_INDEX].x);
    const leftCY = useTransform(shape, points => points[LEFT_INDEX].y);
    const rightCX = useTransform(shape, points => points[RIGHT_INDEX].x);
    const rightCY = useTransform(shape, points => points[RIGHT_INDEX].y);

    const setTarget = useCallback((target: Point[]) => {
        const state = simulation.current;
        state.target = target;
        if (reducedMotion) {
            cancelAnimationFrame(state.frame);
            state.frame = 0;
            state.velocity = REST.map(() => ({ x: 0, y: 0 }));
            shape.set(target);
            return;
        }
        if (state.frame) return;
        state.lastTime = performance.now();
        const tick = (now: number) => {
            // Small integration steps keep the spring stable after a slow frame.
            let remaining = Math.min((now - state.lastTime) / 1000, 0.04);
            state.lastTime = now;
            const next = shape.get().map(point => ({ ...point }));
            const stiffness = drag.current ? 900 : 300;
            const damping = drag.current ? 52 : 25;
            while (remaining > 0) {
                const dt = Math.min(remaining, 1 / 120);
                remaining -= dt;
                next.forEach((point, index) => {
                    const goal = state.target[index];
                    const velocity = state.velocity[index];
                    velocity.x += ((goal.x - point.x) * stiffness - velocity.x * damping) * dt;
                    velocity.y += ((goal.y - point.y) * stiffness - velocity.y * damping) * dt;
                    point.x += velocity.x * dt;
                    point.y += velocity.y * dt;
                });
            }
            const settled = next.every((point, index) =>
                Math.hypot(point.x - state.target[index].x, point.y - state.target[index].y) < 0.02 &&
                Math.hypot(state.velocity[index].x, state.velocity[index].y) < 0.1);
            shape.set(settled ? state.target : next);
            state.frame = settled ? 0 : requestAnimationFrame(tick);
        };
        state.frame = requestAnimationFrame(tick);
    }, [shape, reducedMotion]);

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
        setTarget(REST);
    }, [setTarget]);

    const startDrag = (event: ReactPointerEvent<SVGElement>, handle?: Side) => {
        if (drag.current || !event.isPrimary || event.button !== 0) return;
        const point = localPoint(event.clientX, event.clientY);
        if (!point || !svgRef.current) return;
        event.preventDefault();
        const pose = shape.get();
        // Locate the material being held, even while it is returning or stretched.
        let nearest = handle === "left" ? LEFT_INDEX : RIGHT_INDEX;
        if (!handle) {
            let distance = Infinity;
            pose.forEach((candidate, index) => {
                const next = Math.hypot(candidate.x - point.x, candidate.y - point.y);
                if (next < distance) { distance = next; nearest = index; }
            });
        }
        const grip = REST[nearest];
        const weights = REST.map(material => {
            const distance = Math.hypot(material.x - grip.x, (material.y - grip.y) * 0.6);
            const localInfluence = Math.exp(-(distance * distance) / (2 * 190 * 190));
            // Keep the central seam attached, while a root grab bends the surrounding hairs.
            // The influence is based on the grabbed region, never attenuated by grab distance.
            const rootDistance = Math.min(1, Math.abs(material.x - MID_X) / 45);
            const attachment = rootDistance * rootDistance * (3 - 2 * rootDistance);
            return localInfluence * attachment;
        });
        drag.current = { pointerId: event.pointerId, start: point, pose, weights };
        // Regrabbing freezes the visible pose without resetting its geometry.
        simulation.current.velocity = REST.map(() => ({ x: 0, y: 0 }));
        setTarget(pose);
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
        const pull = resistPull(point.x - current.start.x, point.y - current.start.y);
        setTarget(current.pose.map((material, index) => ({
            x: material.x + pull.x * current.weights[index],
            y: material.y + pull.y * current.weights[index],
        })));
    };

    useEffect(() => {
        const state = simulation.current;
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
            cancelAnimationFrame(state.frame);
            state.frame = 0;
        };
    }, [finishDrag]);

    return (
        <motion.svg
            ref={svgRef}
            data-mustache
            aria-label="Stretch the mustache"
            viewBox="420 412 700 200"
            className="mt-8 w-72 overflow-visible select-none touch-none md:w-96"
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
                stroke="transparent"
                strokeWidth={20}
                pointerEvents="all"
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
