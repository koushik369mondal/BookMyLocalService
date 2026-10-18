import React from "react";
import { Tag, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils/currency";

export function CheckoutOrderSummary({
  booking,
  promoInput,
  setPromoInput,
  appliedDiscount,
  promoSuccessMsg,
  promoErrorMsg,
  onApplyPromo,
  isSubmitting,
  submitError,
  submitSuccess,
  register,
  acceptTermsValue,
  setValue,
  selectedPaymentMethod,
  errors
}) {
  if (!booking) return null;

  const basePrice = booking.price || 0;
  const platformFee = booking.platformFee || 49.00;
  const tax = booking.tax || Math.round(basePrice * 0.18 * 100) / 100;
  const grandTotal = Math.max(0, Math.round((basePrice + platformFee + tax - appliedDiscount) * 100) / 100);

  return (
    <div className="card-chai p-6 space-y-6 sticky top-24">
      <div className="space-y-2 pb-4 border-b border-border/80">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Order summary</span>
        <h4 className="text-base font-heading font-medium text-foreground leading-tight">{booking.service?.title || "Booked service"}</h4>
        <div className="text-xs text-muted-foreground">
          Package: <strong className="text-foreground">{booking.plan}</strong>
        </div>
      </div>

      {/* Promo Code Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
          Promo code
        </label>
        <div className="flex gap-2">
          <Input
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                onApplyPromo(e);
              }
            }}
            placeholder="e.g. WELCOME100"
            className="h-9 text-xs rounded-xl uppercase bg-card/60"
          />
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onApplyPromo(e);
            }}
            variant="outline"
            className="h-9 px-4 text-xs font-medium rounded-xl cursor-pointer"
          >
            Apply
          </Button>
        </div>
        {promoSuccessMsg && <p className="text-[11px] text-emerald-500 font-medium">{promoSuccessMsg}</p>}
        {promoErrorMsg && <p className="text-[11px] text-rose-500 font-medium">{promoErrorMsg}</p>}
      </div>

      <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/80">
        <div className="flex justify-between">
          <span>Service price</span>
          <strong className="text-foreground font-mono">{formatPrice(basePrice, { decimals: true })}</strong>
        </div>
        <div className="flex justify-between">
          <span>Platform fee</span>
          <strong className="text-foreground font-mono">{formatPrice(platformFee, { decimals: true })}</strong>
        </div>
        <div className="flex justify-between">
          <span>GST (18%)</span>
          <strong className="text-foreground font-mono">{formatPrice(tax, { decimals: true })}</strong>
        </div>
        {appliedDiscount > 0 && (
          <div className="flex justify-between text-emerald-500">
            <span>Coupon discount</span>
            <strong className="font-mono">-{formatPrice(appliedDiscount, { decimals: true })}</strong>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-border/80">
        <span className="text-sm font-heading font-medium text-foreground">Total due</span>
        <span className="text-2xl font-mono font-medium text-foreground">{formatPrice(grandTotal, { decimals: true })}</span>
      </div>

      {/* Terms Checkbox */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTermsValue}
            onChange={(e) => setValue("acceptTerms", e.target.checked)}
            className="rounded border-border text-foreground focus:ring-ring mt-0.5"
          />
          <label htmlFor="acceptTerms" className="text-[11px] text-muted-foreground font-normal leading-tight cursor-pointer select-none">
            I agree to the Terms of Service, Cancellation Policy, and Privacy Policy.
          </label>
        </div>
        {errors.acceptTerms && <p className="text-[11px] text-rose-500 font-medium">{errors.acceptTerms.message}</p>}
      </div>

      {submitError && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl">
          Payment successful! Redirecting to confirmation page...
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="solid"
        className="w-full h-11 text-xs justify-center cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            {selectedPaymentMethod === "cash" ? "Confirming booking..." : "Processing payment..."}
          </>
        ) : (
          <>
            {selectedPaymentMethod === "cash" ? "Confirm booking" : "Complete booking and pay"} ({formatPrice(grandTotal, { decimals: true })})
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        <span>256-bit encrypted checkout</span>
      </div>
    </div>
  );
}
