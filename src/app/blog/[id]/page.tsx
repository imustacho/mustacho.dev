import type { Metadata } from "next";
import { getBlogPostById, getBlogPosts } from "@/lib/blogs";
import BlogDetailClient from "./BlogDetailClient";

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        id: post.id,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const post = getBlogPostById(id);

    if (!post) {
        return {
            title: "Article Not Found | Mustacho",
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `/blog/${post.id}`,
        },
        openGraph: {
            title: `${post.title} | Mustacho`,
            description: post.excerpt,
            url: `https://mustacho.dev/blog/${post.id}`,
            type: "article",
            publishedTime: post.date,
            authors: ["Mustacho"],
        },
        twitter: {
            card: "summary_large_image",
            title: `${post.title} | Mustacho`,
            description: post.excerpt,
        },
    };
}

export default async function SingleBlogPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = getBlogPostById(id);

    return <BlogDetailClient post={post} />;
}
