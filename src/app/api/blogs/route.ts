import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthorized } from "@/lib/auth";

const dataPath = path.join(process.cwd(), "src/data/blogs.json");

async function readDB() {
    const fileContent = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(fileContent);
}

async function writeDB(data: unknown) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 4), "utf-8");
}

export async function GET() {
    try {
        const blogs = await readDB();
        return NextResponse.json(blogs);
    } catch {
        return NextResponse.json({ error: "Failed to read blogs data." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await isAdminAuthorized())) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.title || !body.content) {
            return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
        }

        const blogs = await readDB();

        const id = (typeof body.title === "string" ? body.title : "blog")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const newPost = {
            id,
            title: body.title,
            excerpt: body.excerpt || body.content.slice(0, 120) + "...",
            content: body.content,
            date: body.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            readTime: body.readTime || "3 min read",
            category: body.category || "General"
        };

        if (blogs.some((b: { id: string }) => b.id === id)) {
            return NextResponse.json({ error: "A blog post with this title already exists." }, { status: 400 });
        }

        blogs.push(newPost);
        await writeDB(blogs);

        return NextResponse.json(newPost, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create blog post." }, { status: 500 });
    }
}
