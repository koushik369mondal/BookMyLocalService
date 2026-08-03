import React from "react";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/currency";

export function BookingSummaryCard({
  service,
  selectedPlan,
  pricingBreakdown,
  selectedDate,
  selectedTimeSlot,
  isSubmitting,
  onSubmit
}) {
  if (!service) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E8DCC3] shadow-sm space-y-6 sticky top-24">
      <div className="space-y-3 pb-4 border-b border-[#E8DCC3]">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8C4B3E]">Booking Summary</span>
        <h4 className="text-lg font-black text-[#1F1D1A] leading-tight">{service.title}</h4>
        <div className="flex items-center gap-2 text-xs text-[#5A5146]">
          <span className="font-bold text-[#1F1D1A]">{service.provider?.fullName || "Verified Provider"}</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-full bg-[#FAF6F0] border border-[#E8DCC3] text-[10px] font-bold text-[#8C4B3E]">{service.category}</span>
        </div>
      </div>

      <div className="space-y-2 text-xs text-[#5A5146]">
        <div className="flex justify-between py-1 border-b border-[#E8DCC3]/50">
          <span>Selected Package</span>
          <strong className="text-[#1F1D1A]">{selectedPlan.name}</strong>
        </div>
        <div className="flex justify-between py-1 border-b border-[#E8DCC3]/50">
          <span>Package Base Price</span>
          <strong className="text-[#1F1D1A]">{formatPrice(pricingBreakdown.basePrice, { decimals: true })}</strong>
        </div>
        <div className="flex justify-between py-1 border-b border-[#E8DCC3]/50">
          <span>Platform Service Fee</span>
          <strong className="text-[#1F1D1A]">{formatPrice(pricingBreakdown.platformFee, { decimals: true })}</strong>
        </div>
        <div className="flex justify-between py-1 border-b border-[#E8DCC3]/50">
          <span>GST (18%)</span>
          <strong className="text-[#1F1D1A]">{formatPrice(pricingBreakdown.tax, { decimals: true })}</strong>
        </div>
        {selectedDate && (
          <div className="flex justify-between py-1 border-b border-[#E8DCC3]/50">
            <span>Scheduled Date</span>
            <strong className="text-[#8C4B3E]">{selectedDate}</strong>
          </div>
        )}
        {selectedTimeSlot && (
          <div className="flex justify-between py-1 border-b border-[#E8DCC3]/50">
            <span>Scheduled Time</span>
            <strong className="text-[#8C4B3E]">{selectedTimeSlot}</strong>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-sm font-extrabold text-[#1F1D1A]">Total Payable</span>
        <span className="text-2xl font-black text-[#8C4B3E]">{formatPrice(pricingBreakdown.total, { decimals: true })}</span>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full h-12 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            Initializing Checkout...
          </>
        ) : (
          <>
            Proceed to Secure Checkout
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A7266] font-medium pt-2">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>100% Satisfaction Guarantee & Secure Payment</span>
      </div>
    </div>
  );
}
