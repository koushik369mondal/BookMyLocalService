import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-border bg-neutral-100 text-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-200",
        secondary:
          "border-border bg-transparent text-muted-foreground",
        outline:
          "border-border/80 text-foreground bg-transparent",
        success:
          "border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5",
        warning:
          "border-amber-500/20 text-amber-700 dark:text-amber-400 bg-amber-500/5",
        destructive:
          "border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5",
        special:
          "border-purple-500/20 text-purple-600 dark:text-purple-400 bg-purple-500/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
