import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A46A]/30 focus-visible:ring-offset-1 select-none shadow-xs",
  {
    variants: {
      variant: {
        default: 'bg-[#C9A46A] text-white hover:bg-[#b89359] border border-[#E8DCC3]',
        destructive: 'bg-[#B2563B] text-white hover:bg-[#9e4a32] border border-[#E8DCC3]',
        outline: 'border border-[#E8DCC3] bg-[#FAF6F0] text-[#1F1D1A] hover:bg-[#F0E7D5]',
        secondary: 'bg-[#F0E7D5] text-[#1F1D1A] hover:bg-[#E8DCC3] border border-[#E8DCC3]',
        ghost: 'text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#1F1D1A] shadow-none',
        link: 'text-[#C9A46A] underline-offset-4 hover:underline shadow-none',
        terracotta: 'bg-[#B2563B] text-white hover:bg-[#9e4a32] border border-[#E8DCC3]',
      },
      size: {
        default: 'h-10 px-4.5 py-2.5 has-[>svg]:px-3.5',
        xs: 'h-7 rounded-lg text-xs px-2.5',
        sm: 'h-8.5 rounded-lg text-xs px-3 has-[>svg]:px-2.5',
        lg: 'h-11 rounded-xl px-6 text-base has-[>svg]:px-4.5',
        icon: 'size-10 rounded-xl',
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
      variantClasses = variantClasses.replace(/\bbg-\[#C9A46A\]\b/g, "");
    }
    if (className.includes("text-") && !className.includes("text-white")) {
      variantClasses = variantClasses.replace(/\btext-white\b/g, "");
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
