"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

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

export default function Mustache() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const leftX = useMotionValue(0);
    const leftY = useMotionValue(0);
    const rightX = useMotionValue(0);
    const rightY = useMotionValue(0);

    const dragInfo = useRef({
        isDragging: false,
        weightLeft: 0,
        weightRight: 0,
        startX: 0,
        startY: 0,
        startValLX: 0,
        startValLY: 0,
        startValRX: 0,
        startValRY: 0
    });

    const path = useTransform([leftX, leftY, rightX, rightY], (values) => {
        const [lxVal, lyVal, rxVal, ryVal] = values as number[];

        const ldx = lxVal * 10;
        const ldy = -lyVal * 10;

        const rdx = rxVal * 10;
        const rdy = -ryVal * 10;

        const warpPoint = (x: number, y: number) => {
            const MID_X = 7695;

            let wL = 0;
            if (x <= 4400) {
                wL = 1;
            } else if (x < MID_X) {
                wL = (MID_X - x) / (MID_X - 4400);
                wL = Math.pow(wL, 1.8);
            }

            let wR = 0;
            if (x >= 10990) {
                wR = 1;
            } else if (x > MID_X) {
                wR = (x - MID_X) / (10990 - MID_X);
                wR = Math.pow(wR, 1.8);
            }

            return {
                x: x + ldx * wL + rdx * wR,
                y: y + ldy * wL + rdy * wR
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

    const startDrag = (
        e: React.PointerEvent<SVGPathElement | SVGCircleElement>
    ) => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const circles = svgElement.querySelectorAll("circle");
        if (circles.length < 2) return;

        const leftRect = circles[0].getBoundingClientRect();
        const rightRect = circles[1].getBoundingClientRect();

        const leftTipX = leftRect.left + leftRect.width / 2;
        const rightTipX = rightRect.left + rightRect.width / 2;
        const centerX = (leftTipX + rightTipX) / 2;

        const isLeft = e.clientX < centerX;

        dragInfo.current = {
            isDragging: true,
            weightLeft: isLeft ? 1 : 0,
            weightRight: isLeft ? 0 : 1,
            startX: e.clientX,
            startY: e.clientY,
            startValLX: leftX.get(),
            startValLY: leftY.get(),
            startValRX: rightX.get(),
            startValRY: rightY.get()
        };
    };

    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            if (!dragInfo.current.isDragging) return;

            const svgElement = svgRef.current;
            if (!svgElement) return;

            const rect = svgElement.getBoundingClientRect();
            const scale = 700 / rect.width;

            const dx = (e.clientX - dragInfo.current.startX) * scale;
            const dy = (e.clientY - dragInfo.current.startY) * scale;

            leftX.set(
                dragInfo.current.startValLX +
                dx * dragInfo.current.weightLeft
            );

            leftY.set(
                dragInfo.current.startValLY +
                dy * dragInfo.current.weightLeft
            );

            rightX.set(
                dragInfo.current.startValRX +
                dx * dragInfo.current.weightRight
            );

            rightY.set(
                dragInfo.current.startValRY +
                dy * dragInfo.current.weightRight
            );
        };

        const handleUp = () => {
            if (!dragInfo.current.isDragging) return;

            dragInfo.current.isDragging = false;

            animate(leftX, 0, {
                type: "spring",
                stiffness: 450,
                damping: 15
            });

            animate(leftY, 0, {
                type: "spring",
                stiffness: 450,
                damping: 15
            });

            animate(rightX, 0, {
                type: "spring",
                stiffness: 450,
                damping: 15
            });

            animate(rightY, 0, {
                type: "spring",
                stiffness: 450,
                damping: 15
            });
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
            initial={{
                filter: "drop-shadow(0px 6px 12px rgba(149, 86, 35, 0.12))"
            }}
            whileHover={{
                filter: "drop-shadow(0px 14px 24px rgba(149, 86, 35, 0.25))"
            }}
            transition={{ duration: 0.3 }}
        >
            <motion.g
                animate={{ y: [0, -6, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <g transform="translate(0,1024) scale(0.1,-0.1)">
                    <motion.path
                        d={path}
                        fill="#955623"
                        stroke="none"
                        className="cursor-grab touch-none active:cursor-grabbing"
                        onPointerDown={startDrag}
                    />
                </g>

                <motion.circle
                    cx={440}
                    cy={499}
                    r={10}
                    fill="#7a451b"
                    stroke="#f5efe6"
                    strokeWidth={2.5}
                    className="cursor-grab touch-none active:cursor-grabbing"
                    style={{ x: leftX, y: leftY }}
                    onPointerDown={startDrag}
                    whileHover={{ scale: 1.3, fill: "#955623" }}
                    whileTap={{ scale: 0.95 }}
                />

                <motion.circle
                    cx={1099}
                    cy={500}
                    r={10}
                    fill="#7a451b"
                    stroke="#f5efe6"
                    strokeWidth={2.5}
                    className="cursor-grab touch-none active:cursor-grabbing"
                    style={{ x: rightX, y: rightY }}
                    onPointerDown={startDrag}
                    whileHover={{ scale: 1.3, fill: "#955623" }}
                    whileTap={{ scale: 0.95 }}
                />
            </motion.g>
        </motion.svg>
    );
}