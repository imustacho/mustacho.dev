import type { Metadata } from "next";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

export function getSocialImage(path: string, title: string) {
    return {
        url: `/og/${path === "/" ? "home" : path.replace(/^\//, "")}`,
        ...SOCIAL_IMAGE_SIZE,
        type: "image/png",
        alt: `${title} — Mustacho`,
    };
}

export function getTwitterMetadata(path: string, title: string, description: string): Metadata["twitter"] {
    return {
        card: "summary_large_image",
        title,
        description,
        images: [getSocialImage(path, title)],
        creator: "@imustachoo",
    };
}
