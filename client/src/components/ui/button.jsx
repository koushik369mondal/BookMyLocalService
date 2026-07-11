import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-slate-900 focus-visible:ring-slate-900/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white shadow-xs hover:bg-slate-900/90',
        destructive:
          'bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60',
        outline:
          'border bg-slate-50 shadow-xs hover:bg-amber-500 hover:text-white dark:bg-slate-200/30 dark:border-slate-200 dark:hover:bg-slate-200/50',
        secondary: 'bg-slate-700 text-white shadow-xs hover:bg-slate-700/80',
        ghost: 'hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500/50',
        link: 'text-slate-900 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  let variantClasses = buttonVariants({ variant, size });

  if (className) {
    if (className.includes("bg-")) {
      variantClasses = variantClasses.replace(/\bbg-slate-900\b/g, "");
    }
    if (className.includes("text-") && !className.includes("text-white")) {
      variantClasses = variantClasses.replace(/\btext-white\b/g, "");
    }
    if (className.includes("hover:bg-")) {
      variantClasses = variantClasses.replace(/\bhover:bg-slate-900\/90\b/g, "");
    }
  }

  const classes = cn(variantClasses, className);

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={classes}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
