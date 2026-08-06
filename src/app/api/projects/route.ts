import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthorized } from "@/lib/auth";

const dataPath = path.join(process.cwd(), "src/data/projects.json");

async function readDB() {
    const fileContent = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(fileContent);
}

async function writeDB(data: unknown) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 4), "utf-8");
}

// GET is public — anyone can fetch projects
export async function GET() {
    try {
        const projects = await readDB();
        return NextResponse.json(projects);
    } catch {
        return NextResponse.json({ error: "Failed to read projects data." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await isAdminAuthorized())) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.title || !body.description) {
            return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
        }

        const projects = await readDB();

        const id = body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        if (projects.some((p: { id: string }) => p.id === id)) {
            return NextResponse.json({ error: "A project with this title already exists." }, { status: 400 });
        }

        const newProject = {
            id,
            title: body.title,
            description: body.description,
            tags: Array.isArray(body.tags) ? body.tags : [],
            codeUrl: body.codeUrl || "",
            demoUrl: body.demoUrl || "",
            icon: body.icon || "✨",
            status: body.status || "active",
            featured: body.featured || false
        };

        projects.push(newProject);
        await writeDB(projects);

        return NextResponse.json(newProject, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
    }
}
