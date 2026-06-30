"use client";

import Projects from "../projects";

export default function ProjectsPage() {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "#955623" }}>
            <div className="pt-24 min-h-screen w-full flex flex-col justify-center">
                <Projects />
            </div>
        </main>
    );
}
