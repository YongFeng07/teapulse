import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[rgba(212,180,131,0.15)] text-[#D4B483] border border-[rgba(212,180,131,0.2)]",
        secondary: "bg-[rgba(245,239,230,0.08)] text-[#F5EFE6]/60",
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
        outline: "border border-[rgba(212,180,131,0.25)] text-[#D4B483]",
        accent: "bg-[rgba(212,180,131,0.12)] text-[#D4B483]",
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
