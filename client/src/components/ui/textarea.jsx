import { cn } from '@/lib/utils';

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border border-border/80 placeholder:text-muted-foreground focus-visible:border-foreground/40 focus-visible:ring-1 focus-visible:ring-foreground/20 aria-invalid:ring-rose-500/20 aria-invalid:border-rose-500/80 flex field-sizing-content min-h-16 w-full rounded-xl bg-card/60 focus-visible:bg-card px-3.5 py-2.5 text-sm font-medium text-foreground transition-all duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
