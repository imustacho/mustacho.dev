import projectsData from "@/data/projects.json";

const PROJECT_ORDER = ["charged", "recast", "overseer", "hungerfall", "pearl", "evliyacelebi"];

export interface Project {
    id: string;
    title: string;
    category?: string;
    description: string;
    longDescription?: string;
    features?: string[];
    tags: string[];
    skills?: string[];
    codeUrl: string;
    demoUrl?: string;
    icon: string;
    status?: "active" | "archived" | "wip";
    featured?: boolean;
    images?: string[];
    carouselLogo?: string;
    carouselBackground?: string;
    carouselPreview?: string;
    carouselIconOnly?: boolean;
}

export function getProjects(): Project[] {
    const projects = projectsData as Project[];
    return PROJECT_ORDER.map((id) => projects.find((project) => project.id === id)).filter(
        (project): project is Project => Boolean(project)
    );
}

export function getProjectById(id: string): Project | null {
    return (projectsData as Project[]).find((project) => project.id === id) || null;
}

