import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateVerificationToken } from "@/services/auth.service";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await generateVerificationToken(session.user.id);
    const verifyLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
    console.log(`📧 Verification link: ${verifyLink}`);

    return NextResponse.json({
      success: true,
      message: "Verification email sent!",
      devToken: process.env.NODE_ENV !== "production" ? token : undefined,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
