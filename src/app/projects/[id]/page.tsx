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

    const ogImage = project.images && project.images.length > 0 ? project.images[0] : "/mustacho.png";

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
            images: [
                {
                    url: ogImage,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${project.title} | Mustacho`,
            description: project.description,
            images: [ogImage],
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
