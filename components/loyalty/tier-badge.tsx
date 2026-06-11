import { cn, tierColors } from "@/lib/utils";
import type { MembershipTier } from "@/types";

interface TierBadgeProps {
  tier: MembershipTier;
  className?: string;
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        tierColors[tier],
        className
      )}
    >
      {tier}
    </span>
  );
}
