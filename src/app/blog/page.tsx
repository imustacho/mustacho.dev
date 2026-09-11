import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blogs";
import BlogsListClient from "./BlogsListClient";

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
    },
};

export default function BlogsPage() {
    const posts = getBlogPosts();

    return <BlogsListClient posts={posts} />;
}
