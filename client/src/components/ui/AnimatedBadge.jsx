import React from "react";
import { cn } from "@/lib/utils";

export function AnimatedBadge({ children, className }) {
  return (
    <span className={cn("relative inline-flex w-fit overflow-hidden rounded-full p-px select-none", className)}>
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-5 w-[320px] rounded-full bg-gradient-to-r from-transparent via-transparent to-orange-500 motion-safe:animate-[chai-spin_4s_linear_infinite] pointer-events-none"
        style={{ transform: "translate(-50%,-50%)" }}
      />
      <span className="relative z-10 flex items-center gap-2 rounded-full bg-neutral-100/90 px-3.5 py-1.5 text-xs font-medium text-neutral-800 backdrop-blur-md dark:bg-neutral-900/90 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-800/80">
        {children}
      </span>
    </span>
  );
}

export default AnimatedBadge;
