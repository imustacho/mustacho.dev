import BlogContent from "@/components/BlogContent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostById, getBlogPosts } from "@/lib/blogs";
import BlogDetailClient from "./BlogDetailClient";
import { getSocialImage, getTwitterMetadata } from "@/lib/social-image";

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
            images: [getSocialImage(`/blog/${post.id}`, post.title)],
        },
        twitter: getTwitterMetadata(`/blog/${post.id}`, `${post.title} | Mustacho`, post.excerpt),
    };
}

export default async function SingleBlogPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = getBlogPostById(id);

    if (!post) notFound();
    const { content, ...summary } = post;
    return <BlogDetailClient post={summary}><BlogContent content={content} /></BlogDetailClient>;
}
