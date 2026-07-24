import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors focus:outline-none select-none",
  {
    variants: {
      variant: {
        default:
          "border-[#E8DCC3] bg-[#C9A46A] text-white",
        secondary:
          "border-[#E8DCC3] bg-[#F0E7D5] text-[#5A5146]",
        mustard:
          "border-[#E8DCC3] bg-[#C9A46A] text-white",
        terracotta:
          "border-[#E8DCC3] bg-[#B2563B] text-white",
        destructive:
          "border-[#E8DCC3] bg-[#B2563B] text-white",
        outline:
          "border-[#E8DCC3] text-[#5A5146] bg-[#FAF6F0]",
        success:
          "border-[#7DAB7D]/40 bg-[#7DAB7D]/20 text-[#2B522B]",
        warning:
          "border-[#C9A46A]/40 bg-[#C9A46A]/20 text-[#5C451F]",
        info:
          "border-[#5A95C9]/40 bg-[#5A95C9]/20 text-[#1E4B75]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
