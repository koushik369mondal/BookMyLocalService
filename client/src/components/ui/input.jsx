import { cn } from '@/lib/utils';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 h-10 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-[#E8DCC3] bg-[#FAF6F0] text-[#1F1D1A] placeholder:text-[#7A7266] shadow-2xs transition-all duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#F0E7D5] disabled:text-[#7A7266]',
        'focus-visible:border-[#C9A46A] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:bg-white',
        'aria-invalid:border-[#B2563B] aria-invalid:ring-[#B2563B]/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
