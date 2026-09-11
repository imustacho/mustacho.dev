import { getProjects, getProjectById } from "@/lib/projects";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";

export async function generateStaticParams() {
    const projects = getProjects();
    return projects.map((project) => ({
        id: project.id,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const project = getProjectById(id);

    if (!project) {
        return {
            title: "Project Not Found | Mustacho",
        };
    }

    return {
        title: `${project.title} | Mustacho`,
        description: project.description,
    };
}

export default async function SingleProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = getProjectById(id);

    return <ProjectDetailClient project={project} />;
}

