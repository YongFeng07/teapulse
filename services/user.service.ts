import { prisma } from "@/lib/prisma";
import { getTierProgress } from "@/lib/utils";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      points: true,
      avatar: true,
      birthday: true,
      createdAt: true,
      _count: {
        select: { orders: true, reviews: true },
      },
    },
  });

  if (!user) return null;

  const tierInfo = getTierProgress(user.points);

  return {
    ...user,
    tier: tierInfo.tier,
    nextTier: tierInfo.nextTier,
    pointsToNextTier: tierInfo.pointsToNextTier,
    tierProgress: tierInfo.progress,
    totalOrders: user._count.orders,
    totalReviews: user._count.reviews,
  };
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string; avatar?: string; birthday?: string }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      points: true,
      avatar: true,
      birthday: true,
    },
  });
}

export async function getPointsHistory(userId: string) {
  return prisma.pointsTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getUserAnalytics(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId, status: { in: ["COMPLETED", "READY"] } },
    include: { items: { include: { drink: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
  const totalOrders = orders.length;

  // Favorite drink
  const drinkCounts: Record<string, { name: string; count: number }> = {};
  for (const o of orders) {
    for (const item of o.items) {
      const d = item.drink;
      if (!drinkCounts[d.id]) drinkCounts[d.id] = { name: d.name, count: 0 };
      drinkCounts[d.id].count += item.quantity;
    }
  }
  const favoriteDrink = Object.values(drinkCounts).sort((a, b) => b.count - a.count)[0] || null;

  // Favorite store
  const storeCounts: Record<string, { name: string; count: number }> = {};
  for (const o of orders) {
    const s = o.storeId;
    if (!storeCounts[s]) storeCounts[s] = { name: "", count: 0 };
    storeCounts[s].count++;
  }
  const stores = await prisma.store.findMany();
  for (const s of stores) {
    if (storeCounts[s.id]) storeCounts[s.id].name = s.name;
  }
  const favoriteStore = Object.values(storeCounts).sort((a, b) => b.count - a.count)[0] || null;

  // Orders this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const ordersThisMonth = orders.filter(o => new Date(o.createdAt) >= monthStart).length;

  // Monthly totals (last 6 months)
  const monthlyTotals: { month: string; total: number; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("en", { month: "short" });
    const monthOrders = orders.filter(o => {
      const od = new Date(o.createdAt);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    });
    monthlyTotals.push({
      month: label,
      total: monthOrders.reduce((s, o) => s + o.total, 0),
      count: monthOrders.length,
    });
  }

  return {
    totalSpent: Math.round(totalSpent * 100) / 100,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    totalOrders,
    ordersThisMonth,
    favoriteDrink,
    favoriteStore,
    monthlyTotals,
  };
}
