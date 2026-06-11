import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPointsHistory } from "@/services/user.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const history = await getPointsHistory(session.user.id);
    return NextResponse.json(history);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
