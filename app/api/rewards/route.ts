import { NextResponse } from "next/server";
import { getActiveRewards } from "@/services/reward.service";

export async function GET() {
  try {
    const rewards = await getActiveRewards();
    return NextResponse.json(rewards);
  } catch {
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}
