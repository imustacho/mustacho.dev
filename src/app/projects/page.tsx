import type { Metadata } from "next";
import Projects from "@/components/Projects";

export const metadata: Metadata = {
    title: "Projects",
    description: "Explore all projects built by Mustacho, including AI Discord bots, offline desktop applications with Tauri, and web software.",
    alternates: {
        canonical: "/projects",
    },
    openGraph: {
        title: "Projects | Mustacho",
        description: "Explore all projects built by Mustacho, including AI Discord bots, offline desktop applications with Tauri, and web software.",
        url: "https://mustacho.dev/projects",
    },
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
