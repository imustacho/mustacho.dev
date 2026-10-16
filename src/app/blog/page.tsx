import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blogs";
import BlogsListClient from "./BlogsListClient";
import { SITE_OG_IMAGE } from "@/lib/site-image";

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
        images: [SITE_OG_IMAGE],
    },
};

export default function BlogsPage() {
    const posts = getBlogPosts();

    return <BlogsListClient posts={posts} />;
}
