import projectsData from "@/data/projects.json";

export interface Project {
    id: string;
    title: string;
    category?: string;
    description: string;
    longDescription?: string;
    features?: string[];
    tags: string[];
    codeUrl: string;
    demoUrl?: string;
    icon: string;
    status?: "active" | "archived" | "wip";
    featured?: boolean;
    images?: string[];
}

export function getProjects(): Project[] {
    return projectsData as Project[];
}

export function getProjectById(id: string): Project | null {
    const projects = getProjects();
    return projects.find((p) => p.id === id) || null;
}

