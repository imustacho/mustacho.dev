import { Suspense } from "react";
import type { Metadata } from "next";
import SkillsClient from "./SkillsClient";
import { SITE_OG_IMAGE } from "@/lib/site-image";

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
        images: [SITE_OG_IMAGE],
    },
};

export default function SkillsPage() {
    return (
        <Suspense fallback={null}>
            <SkillsClient />
        </Suspense>
    );
}
