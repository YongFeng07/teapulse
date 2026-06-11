"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, SugarLevel, IceLevel, Topping } from "@/types";
import { TOPPING_PRICE } from "@/types";

interface CartStore {
  items: CartItem[];
  selectedStoreId: string | null;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  setStore: (storeId: string) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

function generateCartId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// item.price = base drink price (no toppings). Toppings are stored in item.toppings[]
export function calculateCartItemPrice(item: CartItem): number {
  const toppingsCost = item.toppings.length * TOPPING_PRICE;
  return (item.price + toppingsCost) * item.quantity;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedStoreId: null,

      addItem: (item) => {
        // Check if identical item exists (same drink + same customisation)
        const existing = get().items.find(
          (i) =>
            i.drinkId === item.drinkId &&
            i.sugarLevel === item.sugarLevel &&
            i.iceLevel === item.iceLevel &&
            JSON.stringify(i.toppings.sort()) === JSON.stringify([...item.toppings].sort())
        );
        if (existing) {
          // Just increment quantity
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id ? { ...i, quantity: Math.min(9, i.quantity + item.quantity) } : i
            ),
          }));
        } else {
          const newItem: CartItem = { ...item, id: generateCartId() };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
      },

      clearCart: () => set({ items: [], selectedStoreId: null }),

      setStore: (storeId) => set({ selectedStoreId: storeId }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + calculateCartItemPrice(item), 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "teapulse-cart", version: 1 }
  )
);

export type { CartItem, SugarLevel, IceLevel, Topping };
