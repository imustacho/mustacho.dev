import { getProjectById } from "@/lib/projects";
import projectsData from "@/data/projects.json";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";
import { SITE_IMAGE_URL, SITE_OG_IMAGE } from "@/lib/site-image";

export async function generateStaticParams() {
    return projectsData.map((project) => ({
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
            images: [SITE_OG_IMAGE],
        },
        twitter: {
            card: "summary_large_image",
            title: `${project.title} | Mustacho`,
            description: project.description,
            images: [SITE_IMAGE_URL],
        },
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
