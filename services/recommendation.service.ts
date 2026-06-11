import { prisma } from "@/lib/prisma";

export async function getRecommendations(userId: string) {
  // Find user's ordered drink IDs and categories
  const orders = await prisma.order.findMany({
    where: { userId, status: { in: ["COMPLETED", "READY"] } },
    include: { items: { include: { drink: { select: { id: true, categoryId: true } } } } },
  });

  const orderedDrinkIds = new Set<string>();
  const categoryCounts: Record<string, number> = {};

  for (const order of orders) {
    for (const item of order.items) {
      orderedDrinkIds.add(item.drink.id);
      const catId = item.drink.categoryId;
      categoryCounts[catId] = (categoryCounts[catId] || 0) + item.quantity;
    }
  }

  // Find top category
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const topCategoryId = sortedCategories[0]?.[0];

  // Recommend drinks from same category that user hasn't ordered
  const recommendations = await prisma.drink.findMany({
    where: {
      isAvailable: true,
      ...(topCategoryId ? { categoryId: topCategoryId } : {}),
      id: { notIn: Array.from(orderedDrinkIds) },
    },
    orderBy: [{ rating: "desc" }, { isPopular: "desc" }],
    take: 6,
    include: { category: { select: { name: true } } },
  });

  // If not enough, fill with popular drinks
  if (recommendations.length < 4) {
    const existingIds = new Set([...orderedDrinkIds, ...recommendations.map(r => r.id)]);
    const more = await prisma.drink.findMany({
      where: { isAvailable: true, id: { notIn: Array.from(existingIds) } },
      orderBy: { rating: "desc" },
      take: 6 - recommendations.length,
      include: { category: { select: { name: true } } },
    });
    recommendations.push(...more);
  }

  return recommendations;
}
