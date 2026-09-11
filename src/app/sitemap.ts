import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { getBlogPosts } from "@/lib/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://mustacho.dev";

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/skills`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];

    const projectRoutes: MetadataRoute.Sitemap = getProjects().map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: project.featured ? 0.85 : 0.7,
    }));

    const blogRoutes: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: "never",
        priority: 0.75,
    }));

    return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
