import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
}

const blogsDirectory = path.join(process.cwd(), "blogs");

export function getBlogPosts(): BlogPost[] {
    if (!fs.existsSync(blogsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(blogsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
        .map((fileName) => {
            const idFromFileName = fileName.replace(/\.mdx?$/, "");
            const fullPath = path.join(blogsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            return {
                id: data.id || idFromFileName,
                title: data.title || "",
                excerpt: data.excerpt || "",
                date: data.date || "",
                readTime: data.readTime || "",
                category: data.category || "",
                content: content.trim(),
            } as BlogPost;
        });

    return allPostsData;
}

export function getBlogPostById(id: string): BlogPost | null {
    const posts = getBlogPosts();
    return posts.find((post) => post.id === id) || null;
}
