import { prisma } from "@/lib/prisma";
import { generateRedemptionCode } from "@/lib/utils";

export async function getReferralInfo(userId: string) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });

  if (!user) throw new Error("User not found");

  // Generate code if not exists
  if (!user.referralCode) {
    const code = `TP${userId.slice(0, 6).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    user = await prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
      select: { referralCode: true },
    });
  }

  // Count referrals
  const referralCount = await prisma.user.count({
    where: { referredBy: userId },
  });

  // Total bonus points from referrals
  const bonusPoints = await prisma.pointsTransaction.aggregate({
    where: {
      userId,
      type: "BONUS",
      description: { contains: "referral" },
    },
    _sum: { amount: true },
  });

  return {
    code: user.referralCode,
    referralCount,
    totalBonusPoints: bonusPoints._sum.amount ?? 0,
  };
}

export async function processReferral(newUserId: string, referralCode: string) {
  const referrer = await prisma.user.findUnique({
    where: { referralCode: referralCode.toUpperCase().trim() },
  });

  if (!referrer || referrer.id === newUserId) return null;

  // Check if already referred
  const existing = await prisma.user.findFirst({
    where: { id: newUserId, referredBy: { not: null } },
  });
  if (existing) return null;

  const BONUS = 50;

  await prisma.$transaction(async (tx) => {
    // Mark new user as referred
    await tx.user.update({
      where: { id: newUserId },
      data: { referredBy: referrer.id },
    });

    // Award points to referrer
    await tx.user.update({
      where: { id: referrer.id },
      data: { points: { increment: BONUS } },
    });
    await tx.pointsTransaction.create({
      data: {
        userId: referrer.id,
        amount: BONUS,
        type: "BONUS",
        description: `Referral bonus - friend joined! 🎉`,
      },
    });

    // Award points to new user
    await tx.user.update({
      where: { id: newUserId },
      data: { points: { increment: BONUS } },
    });
    await tx.pointsTransaction.create({
      data: {
        userId: newUserId,
        amount: BONUS,
        type: "BONUS",
        description: `Welcome referral bonus! 🎁`,
      },
    });
  });

  return { referrerName: referrer.name, bonus: BONUS };
}
