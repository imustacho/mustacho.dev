import BlogContent from "@/components/BlogContent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostById, getBlogPosts } from "@/lib/blogs";
import BlogDetailClient from "./BlogDetailClient";
import { SITE_IMAGE_URL, SITE_OG_IMAGE } from "@/lib/site-image";

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
            images: [SITE_OG_IMAGE],
        },
        twitter: {
            card: "summary_large_image",
            title: `${post.title} | Mustacho`,
            description: post.excerpt,
            images: [SITE_IMAGE_URL],
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

    if (!post) notFound();
    const { content, ...summary } = post;
    return <BlogDetailClient post={summary}><BlogContent content={content} /></BlogDetailClient>;
}
