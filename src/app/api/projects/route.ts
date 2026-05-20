import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/site-data.json");

async function readData() {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeData(data: unknown) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = await readData();
  const projects = data.projects.filter((p: { status: string }) => p.status === "completed");
  const underDevelopment = data.projects.filter((p: { status: string }) => p.status === "under-development");
  return NextResponse.json({ projects, underDevelopment });
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

  const siteData = await readData();
  const newProject = { ...data, id: Date.now().toString(), status: type === "projects" ? "completed" : "under-development" };
  siteData.projects.push(newProject);
  await writeData(siteData);
  return NextResponse.json({ success: true, project: newProject });
}

export async function PUT(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const body = await request.json();
  const { id, data } = body;

  const siteData = await readData();
  const index = siteData.projects.findIndex((p: { id?: string }) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  siteData.projects[index] = { ...siteData.projects[index], ...data };
  await writeData(siteData);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const siteData = await readData();
  siteData.projects = siteData.projects.filter((p: { id?: string }) => p.id !== id);
  await writeData(siteData);
  return NextResponse.json({ success: true });
}
