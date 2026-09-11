import type { Metadata } from "next";
import SkillsClient from "./SkillsClient";

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
    },
};

export default function SkillsPage() {
    return <SkillsClient />;
}
