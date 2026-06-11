import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserAddresses, createAddress } from "@/services/address.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const addresses = await getUserAddresses(session.user.id);
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const addr = await createAddress(session.user.id, body);
    return NextResponse.json(addr, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
