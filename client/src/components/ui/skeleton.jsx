import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-neutral-800/50 animate-pulse rounded-xl border border-white/5', className)}
      {...props}
    />
  );
}

export { Skeleton };
