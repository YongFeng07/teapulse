import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MembershipTier } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

export function getMembershipTier(points: number): MembershipTier {
  if (points >= 1000) return "VIP";
  if (points >= 500) return "Gold";
  if (points >= 200) return "Silver";
  return "Bronze";
}

export function getTierProgress(points: number): {
  tier: MembershipTier;
  nextTier: MembershipTier | null;
  pointsToNextTier: number | null;
  progress: number;
} {
  const tier = getMembershipTier(points);

  const thresholds: Record<MembershipTier, { min: number; max: number | null; next: MembershipTier | null }> = {
    Bronze: { min: 0, max: 199, next: "Silver" },
    Silver: { min: 200, max: 499, next: "Gold" },
    Gold: { min: 500, max: 999, next: "VIP" },
    VIP: { min: 1000, max: null, next: null },
  };

  const config = thresholds[tier];
  const pointsToNextTier = config.next
    ? (config.max ?? 0) + 1 - points
    : null;

  let progress = 100;
  if (config.max !== null) {
    const range = config.max - config.min + 1;
    progress = Math.min(100, ((points - config.min) / range) * 100);
  }

  return { tier, nextTier: config.next, pointsToNextTier, progress };
}

export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TP${dateStr}${random}`;
}

export function generateRedemptionCode(): string {
  return `RW${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export const tierColors: Record<MembershipTier, string> = {
  Bronze: "bg-amber-700 text-white",
  Silver: "bg-slate-400 text-white",
  Gold: "bg-yellow-500 text-amber-900",
  VIP: "bg-gradient-to-r from-purple-600 to-pink-500 text-white",
};

export const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-gray-100 text-gray-700" },
  PREPARING: { label: "Preparing", color: "bg-amber-100 text-amber-800" },
  READY: { label: "Ready for Pickup", color: "bg-green-100 text-green-800" },
  COMPLETED: { label: "Completed", color: "bg-teal-100 text-teal-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};
