import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await resetPassword(token, password);

    return NextResponse.json({
      success: true,
      message: "Password has been reset. You can now sign in.",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
