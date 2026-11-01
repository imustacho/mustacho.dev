import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blogs";
import BlogsListClient from "./BlogsListClient";
import { getSocialImage, getTwitterMetadata } from "@/lib/social-image";

export const metadata: Metadata = {
    title: "Blog",
    description: "Read thoughts, devlogs, technical challenges, and stories written by Mustacho.",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog | Mustacho",
        description: "Read thoughts, devlogs, technical challenges, and stories written by Mustacho.",
        url: "https://mustacho.dev/blog",
        images: [getSocialImage("/blog", "Blog | Mustacho")],
    },
    twitter: getTwitterMetadata("/blog", "Blog | Mustacho", "Thoughts, devlogs, technical challenges, and stories written by Mustacho."),
};

export default function BlogsPage() {
    const posts = getBlogPosts().map(({ id, title, excerpt, date, readTime, category }) => ({ id, title, excerpt, date, readTime, category }));

    return <BlogsListClient posts={posts} />;
}
