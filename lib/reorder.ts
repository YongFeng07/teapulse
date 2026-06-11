import type { OrderWithDetails, CartItemInput, Topping } from "@/types";
import { TOPPING_PRICE } from "@/types";

/**
 * Converts an order's items back to CartItemInput format for quick reorder.
 * Computes the base drink price by subtracting topping costs from unitPrice.
 */
export function orderToCartItems(order: OrderWithDetails): CartItemInput[] {
  return order.items.map((item) => {
    // Parse toppings from comma-separated string back to array
    const toppingsRaw = item.toppings === "none" || !item.toppings ? [] : item.toppings.split(",").map(t => t.trim());
    const toppings = toppingsRaw.filter((t): t is Topping => ["pearls", "jelly", "pudding"].includes(t as Topping));
    const toppingsCost = toppings.length * TOPPING_PRICE;
    const basePrice = item.unitPrice - toppingsCost;

    return {
      drinkId: item.drink.id,
      name: item.drink.name,
      image: item.drink.image,
      price: Math.max(0, basePrice),
      quantity: item.quantity,
      sugarLevel: item.sugarLevel,
      iceLevel: item.iceLevel,
      toppings,
    };
  });
}
