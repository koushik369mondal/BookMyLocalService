import { cn } from '@/lib/utils';

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border border-[#E8DCC3] placeholder:text-[#7A7266] focus-visible:border-[#C9A46A] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 aria-invalid:ring-[#8C4B3E]/20 aria-invalid:border-[#8C4B3E] flex field-sizing-content min-h-16 w-full rounded-xl bg-[#FAF6F0] focus-visible:bg-white px-3.5 py-2.5 text-sm font-medium text-[#1F1D1A] shadow-2xs transition-all duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
