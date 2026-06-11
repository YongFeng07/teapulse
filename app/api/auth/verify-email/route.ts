import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await verifyEmail(token);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
