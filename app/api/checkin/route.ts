import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { doCheckin } from "@/services/checkin.service";

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await doCheckin(session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkin error:", error);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
