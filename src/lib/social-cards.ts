import { getBlogPosts } from "@/lib/blogs";
import { getProjects } from "@/lib/projects";

export interface SocialCard {
    path: string;
    title: string;
    description: string;
    label: string;
    detail: string;
    symbol: string;
}

const pages: SocialCard[] = [
    {
        path: "/",
        title: "Mustacho",
        description: "Developer, student & curious builder.\nMaking ideas work, one project at a time.",
        label: "PERSONAL PORTFOLIO",
        detail: "Code. Create. Keep learning.",
        symbol: "</>",
    },
    {
        path: "/about",
        title: "About me",
        description: "A student from Istanbul with a soft spot for code, electronics & making things.",
        label: "THE PERSON BEHIND THE MUSTACHE",
        detail: "A little curiosity goes a long way.",
        symbol: "hi!",
    },
    {
        path: "/skills",
        title: "Skills & tools",
        description: "From TypeScript & React to AI integrations.\nThe tools I use to bring ideas to life.",
        label: "MY DEVELOPER TOOLBOX",
        detail: "Always a work in progress.",
        symbol: "{ }",
    },
    {
        path: "/projects",
        title: "Projects",
        description: "A place for the things I build.\nNew projects are coming soon.",
        label: "IDEAS INTO REALITY",
        detail: "Something new is taking shape.",
        symbol: "+",
    },
    {
        path: "/blog",
        title: "The blog",
        description: "Thoughts, devlogs & lessons learned\nwhile figuring things out.",
        label: "NOTES FROM MY DESK",
        detail: "A few things worth writing down.",
        symbol: "Aa",
    },
    {
        path: "/contact",
        title: "Let's talk.",
        description: "Have an idea, a question, or just a hello?\nMy inbox is open.",
        label: "GET IN TOUCH",
        detail: "hi@mustacho.dev",
        symbol: ">_",
    },
];

export function getSocialCards(): SocialCard[] {
    return [
        ...pages,
        ...getBlogPosts().map(post => ({
            path: `/blog/${post.id}`,
            title: post.title,
            description: post.excerpt,
            label: `BLOG / ${post.category || "NOTES"}`.toUpperCase(),
            detail: [post.date, post.readTime].filter(Boolean).join("  /  "),
            symbol: "Aa",
        })),
        ...getProjects().map(project => ({
            path: `/projects/${project.id}`,
            title: project.title,
            description: project.description,
            label: `PROJECT / ${project.category || "BUILT BY MUSTACHO"}`.toUpperCase(),
            detail: project.tags.slice(0, 4).join("  /  "),
            symbol: "+",
        })),
    ];
}
