import type { Metadata } from "next";
import Projects from "@/components/Projects";
import { SITE_OG_IMAGE } from "@/lib/site-image";

export const metadata: Metadata = {
    title: "Projects",
    description: "çalışıyorum...",
    alternates: {
        canonical: "/projects",
    },
    openGraph: {
        title: "Projects | Mustacho",
        description: "çalışıyorum...",
        url: "https://mustacho.dev/projects",
        images: [SITE_OG_IMAGE],
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
