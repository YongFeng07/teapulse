import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 200 });
  try {
    const favs = await prisma.favourite.findMany({
      where: { userId: session.user.id },
      include: { drink: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(favs.map(f => f.drink));
  } catch { return NextResponse.json([], { status: 200 }); }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { drinkId } = await req.json();
    const existing = await prisma.favourite.findUnique({
      where: { userId_drinkId: { userId: session.user.id, drinkId } },
    });
    if (existing) {
      await prisma.favourite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favourited: false });
    }
    await prisma.favourite.create({ data: { userId: session.user.id, drinkId } });
    return NextResponse.json({ favourited: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
