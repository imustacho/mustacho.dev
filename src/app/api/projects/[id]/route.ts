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

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const projects = await readDB();
        const project = projects.find((p: { id: string }) => p.id === id);

        if (!project) {
            return NextResponse.json({ error: "Project not found." }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch {
        return NextResponse.json({ error: "Failed to retrieve project." }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAdminAuthorized())) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const projects = await readDB();
        const index = projects.findIndex((p: { id: string }) => p.id === id);

        if (index === -1) {
            return NextResponse.json({ error: "Project not found." }, { status: 404 });
        }

        projects[index] = {
            ...projects[index],
            title: body.title ?? projects[index].title,
            description: body.description ?? projects[index].description,
            tags: Array.isArray(body.tags) ? body.tags : projects[index].tags,
            codeUrl: body.codeUrl ?? projects[index].codeUrl,
            demoUrl: body.demoUrl ?? projects[index].demoUrl,
            icon: body.icon ?? projects[index].icon,
            status: body.status ?? projects[index].status,
            featured: body.featured ?? projects[index].featured
        };

        await writeDB(projects);
        return NextResponse.json(projects[index]);
    } catch {
        return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAdminAuthorized())) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const { id } = await params;
        const projects = await readDB();
        const filtered = projects.filter((p: { id: string }) => p.id !== id);

        if (projects.length === filtered.length) {
            return NextResponse.json({ error: "Project not found." }, { status: 404 });
        }

        await writeDB(filtered);
        return NextResponse.json({ message: "Project deleted successfully." });
    } catch {
        return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
    }
}
