import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 200 });
  try {
    const redemptions = await prisma.rewardRedemption.findMany({
      where: { userId: session.user.id },
      include: { reward: { select: { name: true, type: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(redemptions);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
