import { PointsTransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateRedemptionCode } from "@/lib/utils";

export async function getActiveRewards() {
  return prisma.reward.findMany({
    where: { isActive: true },
    orderBy: { pointsCost: "asc" },
  });
}

export async function redeemReward(userId: string, rewardId: string) {
  const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
  if (!reward || !reward.isActive) {
    throw new Error("Reward not found or inactive");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.points < reward.pointsCost) {
    throw new Error("Insufficient points");
  }

  const redemption = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { points: { decrement: reward.pointsCost } },
    });

    await tx.pointsTransaction.create({
      data: {
        userId,
        amount: -reward.pointsCost,
        type: PointsTransactionType.REDEEMED,
        description: `Redeemed: ${reward.name}`,
      },
    });

    return tx.rewardRedemption.create({
      data: {
        userId,
        rewardId,
        pointsUsed: reward.pointsCost,
        code: generateRedemptionCode(),
      },
      include: { reward: true },
    });
  });

  return redemption;
}

export async function getUserRedemptions(userId: string) {
  return prisma.rewardRedemption.findMany({
    where: { userId },
    include: { reward: true },
    orderBy: { createdAt: "desc" },
  });
}
