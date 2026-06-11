import { prisma } from "@/lib/prisma";
import { PointsTransactionType } from "@prisma/client";

const BASE_POINTS = 5;
const STREAK_BONUS = 20;
const STREAK_DAYS = 7;

export async function getCheckinStatus(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCheckin = await prisma.dailyCheckin.findFirst({
    where: { userId, date: { gte: today } },
  });

  // Get current streak by looking backwards
  let streak = 0;
  if (!todayCheckin) {
    // Check yesterday's streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayCheckin = await prisma.dailyCheckin.findFirst({
      where: { userId, date: { gte: yesterday, lt: today } },
    });
    streak = yesterdayCheckin?.streak ?? 0;
  } else {
    streak = todayCheckin.streak;
  }

  return {
    checkedIn: !!todayCheckin,
    streak: todayCheckin?.streak ?? 0,
    nextStreak: streak,
    points: todayCheckin?.points ?? 0,
  };
}

export async function doCheckin(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already checked in today
  const existing = await prisma.dailyCheckin.findFirst({
    where: { userId, date: { gte: today } },
  });
  if (existing) {
    return { already: true, streak: existing.streak, points: existing.points };
  }

  // Get yesterday's streak
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayCheckin = await prisma.dailyCheckin.findFirst({
    where: { userId, date: { gte: yesterday, lt: today } },
  });

  const prevStreak = yesterdayCheckin?.streak ?? 0;
  const newStreak = prevStreak + 1;
  const isStreakBonus = newStreak > 0 && newStreak % STREAK_DAYS === 0;
  const points = isStreakBonus ? BASE_POINTS + STREAK_BONUS : BASE_POINTS;

  const result = await prisma.$transaction(async (tx) => {
    const checkin = await tx.dailyCheckin.create({
      data: {
        userId,
        date: today,
        streak: newStreak,
        points,
      },
    });

    // Award points to user
    await tx.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });

    // Record transaction
    await tx.pointsTransaction.create({
      data: {
        userId,
        amount: points,
        type: PointsTransactionType.BONUS,
        description: isStreakBonus
          ? `Daily check-in + ${STREAK_DAYS}-day streak bonus! 🔥`
          : `Daily check-in (Day ${newStreak})`,
      },
    });

    return checkin;
  });

  return {
    already: false,
    streak: result.streak,
    points: result.points,
    isStreakBonus,
  };
}
