import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";

const DEFAULT_ID = "default";

export async function GET() {
  let row = await prisma.siteData.findUnique({ where: { id: DEFAULT_ID } });

  if (!row) {
    const filePath = join(process.cwd(), "src", "data", "site-data.json");
    const raw = await readFile(filePath, "utf-8");
    const fallbackData = JSON.parse(raw);

    row = await prisma.siteData.upsert({
      where: { id: DEFAULT_ID },
      update: { data: fallbackData },
      create: { id: DEFAULT_ID, data: fallbackData },
    });
  }

  return NextResponse.json(row.data);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await prisma.siteData.upsert({
      where: { id: DEFAULT_ID },
      update: { data: body },
      create: { id: DEFAULT_ID, data: body },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Site data update error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
