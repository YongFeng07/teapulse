import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }

  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const redemption = await prisma.rewardRedemption.findFirst({
      where: {
        code: code.toUpperCase().trim(),
        userId: session.user.id,
        isUsed: false,
      },
      include: { reward: true },
    });

    if (!redemption) {
      return NextResponse.json({ valid: false, error: "Code not found, already used, or doesn't belong to your account" }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      discount: redemption.reward.value ?? 0,
      rewardName: redemption.reward.name,
      code: redemption.code,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
