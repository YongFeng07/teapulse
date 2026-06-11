import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-[rgba(212,180,131,0.15)] bg-[rgba(212,180,131,0.04)] px-4 py-2 text-sm text-[#F5EFE6] ring-offset-transparent placeholder:text-[#F5EFE6]/25 focus-visible:outline-none focus-visible:border-[rgba(212,180,131,0.5)] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
