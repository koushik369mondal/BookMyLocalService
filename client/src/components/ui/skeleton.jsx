import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return <div data-slot="skeleton" className={cn('bg-[#F0E7D5] animate-pulse rounded-xl border border-[#E8DCC3]/60', className)} {...props} />;
}

export { Skeleton };
