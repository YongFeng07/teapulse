import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/services/auth.service";
import { processReferral } from "@/services/referral.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, referralCode } = body;

    // Basic validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: "This email is already registered. Please sign in instead." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: phone?.trim() || null,
        points: 50, // welcome bonus
      },
      select: { id: true, email: true, name: true, points: true },
    });

    // Process referral
    if (referralCode) {
      await processReferral(user.id, referralCode);
    }

    // Generate verification token
    const verifyToken = await generateVerificationToken(user.id);
    const verifyLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verifyToken}`;
    console.log(`📧 Verification link: ${verifyLink}`);

    return NextResponse.json({
      user,
      message: "Account created! You received 50 welcome points.",
      devVerifyToken: process.env.NODE_ENV !== "production" ? verifyToken : undefined,
    }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    // Check for Prisma unique constraint error
    if ((error as any)?.code === "P2002") {
      return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    }
    return NextResponse.json({ 
      error: "Registration failed. Please check your database connection and try again." 
    }, { status: 500 });
  }
}
