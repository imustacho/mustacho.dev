import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/blogs.json");

async function readDB() {
    const fileContent = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(fileContent);
}

async function writeDB(data: any) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 4), "utf-8");
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blogs = await readDB();
        const blog = blogs.find((b: any) => b.id === id);

        if (!blog) {
            return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: "Failed to retrieve blog post." }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const blogs = await readDB();
        const index = blogs.findIndex((b: any) => b.id === id);

        if (index === -1) {
            return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
        }

        blogs[index] = {
            ...blogs[index],
            title: body.title || blogs[index].title,
            excerpt: body.excerpt || blogs[index].excerpt,
            content: body.content || blogs[index].content,
            date: body.date || blogs[index].date,
            readTime: body.readTime || blogs[index].readTime,
            category: body.category || blogs[index].category
        };

        await writeDB(blogs);
        return NextResponse.json(blogs[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog post." }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blogs = await readDB();
        const filteredBlogs = blogs.filter((b: any) => b.id !== id);

        if (blogs.length === filteredBlogs.length) {
            return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
        }

        await writeDB(filteredBlogs);
        return NextResponse.json({ message: "Blog post deleted successfully." });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete blog post." }, { status: 500 });
    }
}
