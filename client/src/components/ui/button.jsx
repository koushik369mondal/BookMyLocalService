import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-200 active:scale-[0.99] cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-ring select-none",
  {
    variants: {
      variant: {
        // ChaiUI Solid: The one main action on a screen (asymmetric corners)
        solid:
          "btn-asym bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-medium px-4",
        // ChaiUI Outline: Beside the main action (mirrored asymmetric corners)
        outline:
          "btn-asym-mirror border border-border/80 bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900/60 font-medium px-4",
        // ChaiUI Soft / Default: Used on cards and secondary actions
        default:
          "rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4",
        soft:
          "rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold px-4",
        // Ghost & Link
        ghost:
          "rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
        link:
          "text-foreground underline-offset-4 hover:underline hover:text-brand",
        // Destructive / Danger (for dialog confirms)
        destructive:
          "rounded-md bg-destructive text-white hover:bg-destructive/90 font-semibold px-4",
        danger:
          "rounded-md bg-destructive text-white hover:bg-destructive/90 font-semibold px-4",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 text-xs px-2.5 rounded-sm",
        sm: "h-8 text-xs px-3 rounded-md",
        md: "h-9 text-sm px-4 rounded-md",
        lg: "h-10 text-base px-5",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, iconRight, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {variant === "solid" && iconRight === undefined && !asChild && (
          <ArrowUpRight className="-ml-1 size-4" aria-hidden="true" />
        )}
        {iconRight}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
