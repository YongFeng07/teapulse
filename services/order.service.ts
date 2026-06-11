import { OrderStatus, PointsTransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import type { CartItemInput } from "@/types";
import { TOPPING_PRICE } from "@/types";

const SST_RATE = 0.06;

function calculateItemSubtotal(item: CartItemInput): number {
  const toppingsCost = item.toppings.length * TOPPING_PRICE;
  return (item.price + toppingsCost) * item.quantity;
}

export async function createOrder(
  userId: string,
  storeId: string,
  items: CartItemInput[],
  notes?: string,
  redemptionCode?: string
) {
  const subtotal = items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
  const sst = Math.round(subtotal * SST_RATE * 100) / 100;

  // Apply reward discount if code provided
  let discount = 0;
  let redemptionId: string | undefined;

  if (redemptionCode) {
    const redemption = await prisma.rewardRedemption.findFirst({
      where: { code: redemptionCode.toUpperCase().trim(), isUsed: false },
      include: { reward: true },
    });
    if (redemption) {
      discount = redemption.reward.value ?? 0;
      redemptionId = redemption.id;
    }
  }

  const total = Math.max(0, subtotal + sst - discount);
  const pointsPerRm = parseInt(process.env.POINTS_PER_RM || "1", 10);
  const pointsEarned = Math.floor(total * pointsPerRm);

  // Use timeout: 15000ms to avoid 5s default timeout
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        storeId,
        subtotal,
        sst,
        discount,
        total,
        pointsEarned,
        notes: notes || null,
        status: OrderStatus.PENDING,
        items: {
          create: items.map((item) => {
            const toppingsCost = item.toppings.length * TOPPING_PRICE;
            const unitPrice = item.price + toppingsCost;
            return {
              drinkId: item.drinkId,
              quantity: item.quantity,
              unitPrice,
              sugarLevel: item.sugarLevel,
              iceLevel: item.iceLevel,
              toppings: item.toppings.join(", ") || "none",
              subtotal: unitPrice * item.quantity,
            };
          }),
        },
      },
      include: {
        store: true,
        items: { include: { drink: true } },
      },
    });

    // Add points
    if (pointsEarned > 0) {
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: pointsEarned } },
      });
      await tx.pointsTransaction.create({
        data: {
          userId,
          amount: pointsEarned,
          type: PointsTransactionType.EARNED,
          description: `Earned from order #${newOrder.orderNumber}`,
          orderId: newOrder.id,
        },
      });
    }

    // Mark redemption as used
    if (redemptionId) {
      await tx.rewardRedemption.update({
        where: { id: redemptionId },
        data: { isUsed: true },
      });
    }

    return newOrder;
  }, {
    timeout: 15000, // 15s timeout
    maxWait: 5000,
  });

  return { ...order, discount, sst };
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      store: true,
      items: { include: { drink: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      store: true,
      items: { include: { drink: true } },
    },
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function cancelOrder(orderId: string, userId: string) {
  // Verify ownership and that order is still pending
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new Error("Only pending orders can be cancelled");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
    include: {
      store: true,
      items: { include: { drink: true } },
    },
  });
}
