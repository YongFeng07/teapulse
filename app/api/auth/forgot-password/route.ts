import { NextRequest, NextResponse } from "next/server";
import { generateResetToken } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await generateResetToken(email.toLowerCase().trim());

    // Always return success to prevent email enumeration
    if (!result) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // In production, send email. For dev, return token in response.
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${result.token}`;
    console.log(`🔑 Reset link for ${result.email}: ${resetLink}`);

    return NextResponse.json({
      success: true,
      message: "Reset link sent to your email.",
      // DEV ONLY: include token for testing
      devToken: process.env.NODE_ENV !== "production" ? result.token : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
