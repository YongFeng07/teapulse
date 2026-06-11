import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { walletBalance: true } });
  const transactions = await prisma.walletTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ balance: user?.walletBalance || 0, transactions });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { amount } = await req.json();
    if (!amount || amount < 10) return NextResponse.json({ error: "Minimum RM 10 topup" }, { status: 400 });

    await prisma.$transaction([
      prisma.user.update({ where: { id: session.user.id }, data: { walletBalance: { increment: amount } } }),
      prisma.walletTransaction.create({
        data: { userId: session.user.id, amount, type: "TOPUP", description: `Wallet topup RM ${amount}` },
      }),
    ]);

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { walletBalance: true } });
    return NextResponse.json({ balance: user?.walletBalance || 0, message: "Topup successful!" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
