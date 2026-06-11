import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redeemReward } from "@/services/reward.service";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to redeem rewards" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rewardId } = body;
    
    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID required" }, { status: 400 });
    }

    const redemption = await redeemReward(session.user.id, rewardId);
    return NextResponse.json(redemption, { status: 201 });
  } catch (error) {
    console.error("Redeem error:", error);
    const message = error instanceof Error ? error.message : "Redemption failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
