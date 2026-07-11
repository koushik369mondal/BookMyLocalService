import { cn } from '@/lib/utils';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-slate-900 placeholder:text-[#64748B] placeholder:opacity-100 selection:bg-slate-900 selection:text-white border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-[#FFFFFF] text-[#111827] px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-slate-900 focus-visible:ring-slate-900/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500',
        className
      )}
      {...props}
    />
  );
}

export { Input };
