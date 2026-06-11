import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUnreadCount } from "@/services/notification.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const count = await getUnreadCount(session.user.id);
    return NextResponse.json({ count });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
