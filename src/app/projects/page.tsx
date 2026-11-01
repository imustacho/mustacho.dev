import type { Metadata } from "next";
import Projects from "@/components/Projects";
import { getSocialImage, getTwitterMetadata } from "@/lib/social-image";

export const metadata: Metadata = {
    title: "Projects",
    description: "New projects are coming soon.",
    alternates: {
        canonical: "/projects",
    },
    openGraph: {
        title: "Projects | Mustacho",
        description: "New projects are coming soon.",
        url: "https://mustacho.dev/projects",
        images: [getSocialImage("/projects", "Projects | Mustacho")],
    },
    twitter: getTwitterMetadata("/projects", "Projects | Mustacho", "New projects are coming soon."),
};

export default function ProjectsPage() {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "var(--text-primary)" }}>
            <div className="pt-24 min-h-screen w-full flex flex-col justify-center">
                <Projects />
            </div>
        </main>
    );
}
