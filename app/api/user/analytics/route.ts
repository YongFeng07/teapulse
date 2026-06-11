import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserAnalytics } from "@/services/user.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const analytics = await getUserAnalytics(session.user.id);
    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
