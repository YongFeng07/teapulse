import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ========== Password Reset ==========

export async function generateResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null; // Don't reveal if email exists (security)

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  return { token, email: user.email, name: user.name };
}

export async function validateResetToken(token: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    return null;
  }

  return { userId: record.userId, email: record.user.email, name: record.user.name };
}

export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired token");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
  ]);

  return true;
}

// ========== Email Verification ==========

export async function generateVerificationToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours

  await prisma.verificationToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function verifyEmail(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired verification token");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    }),
    prisma.verificationToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
  ]);

  return true;
}

export async function isEmailVerified(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });
  return user?.emailVerified ?? false;
}
