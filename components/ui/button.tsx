import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B483] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#D4B483] text-[#0E0E0E] hover:bg-[#E8D5B0] shadow-[0_0_20px_rgba(212,180,131,0.2)]",
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
        outline: "border border-[rgba(212,180,131,0.25)] bg-transparent text-[#D4B483] hover:bg-[rgba(212,180,131,0.08)] hover:border-[rgba(212,180,131,0.5)]",
        secondary: "bg-[rgba(212,180,131,0.08)] text-[#F5EFE6]/80 hover:bg-[rgba(212,180,131,0.15)]",
        ghost: "text-[#F5EFE6]/70 hover:bg-[rgba(212,180,131,0.06)] hover:text-[#D4B483]",
        link: "text-[#D4B483] underline-offset-4 hover:underline",
        accent: "bg-[#D4B483]/15 text-[#D4B483] hover:bg-[#D4B483]/25 border border-[rgba(212,180,131,0.2)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
