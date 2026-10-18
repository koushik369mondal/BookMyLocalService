import { cn } from '@/lib/utils';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 h-10 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-border/80 bg-card/60 text-foreground placeholder:text-muted-foreground transition-all duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-foreground/40 focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:bg-card',
        'aria-invalid:border-rose-500/80 aria-invalid:ring-rose-500/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
