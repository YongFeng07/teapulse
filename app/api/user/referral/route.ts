import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReferralInfo } from "@/services/referral.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const info = await getReferralInfo(session.user.id);
    return NextResponse.json(info);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
