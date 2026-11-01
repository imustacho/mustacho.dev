import { Suspense } from "react";
import type { Metadata } from "next";
import SkillsClient from "./SkillsClient";
import { getSocialImage, getTwitterMetadata } from "@/lib/social-image";

export const metadata: Metadata = {
    title: "Skills",
    description: "Technical skills and technologies used by Mustacho — TypeScript, React, Next.js, Node.js, Tailwind CSS, AI integrations, Tauri, and more.",
    alternates: {
        canonical: "/skills",
    },
    openGraph: {
        title: "Skills | Mustacho",
        description: "Technical skills and technologies used by Mustacho — TypeScript, React, Next.js, Node.js, Tailwind CSS, AI integrations, Tauri, and more.",
        url: "https://mustacho.dev/skills",
        images: [getSocialImage("/skills", "Skills | Mustacho")],
    },
    twitter: getTwitterMetadata("/skills", "Skills | Mustacho", "The tools and technologies I use to bring ideas to life."),
};

export default function SkillsPage() {
    return (
        <Suspense fallback={null}>
            <SkillsClient />
        </Suspense>
    );
}
