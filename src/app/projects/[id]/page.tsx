import { notFound } from "next/navigation";
import { getProjectById, getProjects } from "@/lib/projects";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";
import { getSocialImage, getTwitterMetadata } from "@/lib/social-image";

export async function generateStaticParams() {
    return getProjects().map((project) => ({
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
        title: project.title,
        description: project.description,
        alternates: {
            canonical: `/projects/${project.id}`,
        },
        openGraph: {
            title: `${project.title} | Mustacho`,
            description: project.description,
            url: `https://mustacho.dev/projects/${project.id}`,
            type: "website",
            images: [getSocialImage(`/projects/${project.id}`, project.title)],
        },
        twitter: getTwitterMetadata(`/projects/${project.id}`, `${project.title} | Mustacho`, project.description),
    };
}

export default async function SingleProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = getProjectById(id);

    if (!project) notFound();
    return <ProjectDetailClient project={project} />;
}
