import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return NextResponse.json(announcements);
  } catch { return NextResponse.json([], { status: 200 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const a = await prisma.announcement.create({ data: body });
    return NextResponse.json(a, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
