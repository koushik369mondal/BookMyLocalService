import React from "react";
import { ShieldCheck, Loader2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/currency";

export function BookingSummaryCard({
  service,
  selectedPlan,
  pricingBreakdown,
  selectedDate,
  selectedTimeSlot,
  isSubmitting,
  onSubmit,
}) {
  if (!service) return null;

  return (
    <div className="card-chai p-6 space-y-5 sticky top-24">
      <div className="space-y-2 pb-4 border-b border-border/70">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
          Booking summary
        </span>
        <h4 className="font-display text-base font-semibold text-foreground leading-tight">
          {service.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{service.provider?.fullName || "Verified provider"}</span>
          <span>•</span>
          <span className="rounded border border-border px-2 py-0.5 text-[11px]">
            {typeof service.category === "object"
              ? service.category?.name || "Service"
              : service.category || "Service"}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex justify-between py-1 border-b border-border/50">
          <span>Selected package</span>
          <strong className="text-foreground font-display">{selectedPlan.name}</strong>
        </div>
        <div className="flex justify-between py-1 border-b border-border/50">
          <span>Package base price</span>
          <strong className="text-foreground font-mono">
            {formatPrice(pricingBreakdown.basePrice, { decimals: true })}
          </strong>
        </div>
        <div className="flex justify-between py-1 border-b border-border/50">
          <span>Platform fee</span>
          <strong className="text-foreground font-mono">
            {formatPrice(pricingBreakdown.platformFee, { decimals: true })}
          </strong>
        </div>
        <div className="flex justify-between py-1 border-b border-border/50">
          <span>Tax (18% GST)</span>
          <strong className="text-foreground font-mono">
            {formatPrice(pricingBreakdown.tax, { decimals: true })}
          </strong>
        </div>
        {selectedDate && (
          <div className="flex justify-between py-1 border-b border-border/50">
            <span>Scheduled date</span>
            <strong className="text-foreground font-mono">{selectedDate}</strong>
          </div>
        )}
        {selectedTimeSlot && (
          <div className="flex justify-between py-1 border-b border-border/50">
            <span>Scheduled time</span>
            <strong className="text-foreground font-mono">{selectedTimeSlot}</strong>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-sm font-semibold text-foreground">Total payable</span>
        <span className="font-display text-2xl font-semibold text-foreground tracking-tight">
          {formatPrice(pricingBreakdown.total, { decimals: true })}
        </span>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        variant="solid"
        size="lg"
        className="w-full justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Proceeding to checkout...</span>
          </>
        ) : (
          <span>Proceed to checkout</span>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
        <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
        <span>Guaranteed satisfaction and secure checkout</span>
      </div>
    </div>
  );
}
