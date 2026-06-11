import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCheckinStatus } from "@/services/checkin.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getCheckinStatus(session.user.id);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Checkin status error:", error);
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
  }
}
