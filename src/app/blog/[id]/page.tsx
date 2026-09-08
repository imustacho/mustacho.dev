import { getBlogPostById, getBlogPosts } from "@/lib/blogs";
import BlogDetailClient from "./BlogDetailClient";

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        id: post.id,
    }));
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
