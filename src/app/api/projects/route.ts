import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

const PROJECTS_FILE = path.join(process.cwd(), "src/data/data/projects.json");
const UNDERDEV_FILE = path.join(process.cwd(), "src/data/data/underdev.json");

async function readJSON(filePath: string) {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function writeJSON(filePath: string, data: unknown[]) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const [projects, underDev] = await Promise.all([
    readJSON(PROJECTS_FILE),
    readJSON(UNDERDEV_FILE),
  ]);
  return NextResponse.json({ projects, underDevelopment: underDev });
}

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const body = await request.json();
  const { type, data } = body;

  if (type === "projects") {
    const existing = await readJSON(PROJECTS_FILE);
    const newProject = { ...data, id: Date.now().toString() };
    await writeJSON(PROJECTS_FILE, [...existing, newProject]);
    return NextResponse.json({ success: true, project: newProject });
  }

  if (type === "underDevelopment") {
    const existing = await readJSON(UNDERDEV_FILE);
    const newProject = { ...data, id: Date.now().toString() };
    await writeJSON(UNDERDEV_FILE, [...existing, newProject]);
    return NextResponse.json({ success: true, project: newProject });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function PUT(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const body = await request.json();
  const { type, id, data } = body;

  if (type === "projects") {
    const existing = await readJSON(PROJECTS_FILE);
    const index = existing.findIndex((p: { id?: string }) => p.id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    existing[index] = { ...existing[index], ...data };
    await writeJSON(PROJECTS_FILE, existing);
    return NextResponse.json({ success: true });
  }

  if (type === "underDevelopment") {
    const existing = await readJSON(UNDERDEV_FILE);
    const index = existing.findIndex((p: { id?: string }) => p.id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    existing[index] = { ...existing[index], ...data };
    await writeJSON(UNDERDEV_FILE, existing);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (!id || !type) {
    return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
  }

  if (type === "projects") {
    const existing = await readJSON(PROJECTS_FILE);
    await writeJSON(PROJECTS_FILE, existing.filter((p: { id?: string }) => p.id !== id));
    return NextResponse.json({ success: true });
  }

  if (type === "underDevelopment") {
    const existing = await readJSON(UNDERDEV_FILE);
    await writeJSON(UNDERDEV_FILE, existing.filter((p: { id?: string }) => p.id !== id));
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
