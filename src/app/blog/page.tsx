import { getBlogPosts } from "@/lib/blogs";
import BlogsListClient from "./BlogsListClient";

export default function BlogsPage() {
    const posts = getBlogPosts();

    return <BlogsListClient posts={posts} />;
}
