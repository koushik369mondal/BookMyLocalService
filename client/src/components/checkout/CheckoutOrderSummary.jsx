import React from "react";
import { Tag, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  errors
}) {
  if (!booking) return null;

  const basePrice = booking.price || 0;
  const platformFee = booking.platformFee || 4.99;
  const tax = booking.tax || 0;
  const grandTotal = Math.max(0, Math.round((basePrice + platformFee + tax - appliedDiscount) * 100) / 100);

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E8DCC3] shadow-sm space-y-6 sticky top-24">
      <div className="space-y-3 pb-4 border-b border-[#E8DCC3]">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8C4B3E]">Order Summary</span>
        <h4 className="text-lg font-black text-[#1F1D1A] leading-tight">{booking.service?.title || "Booked Service"}</h4>
        <div className="text-xs text-[#5A5146]">
          Package: <strong className="text-[#1F1D1A]">{booking.plan}</strong>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={onApplyPromo} className="space-y-2">
        <label className="text-xs font-bold text-[#1F1D1A] flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-[#8C4B3E]" />
          Promo / Coupon Code
        </label>
        <div className="flex gap-2">
          <Input
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="e.g. WELCOME10"
            className="h-9 border-[#E8DCC3] text-xs rounded-xl uppercase bg-[#FAF6F0]/40"
          />
          <Button type="submit" variant="outline" className="h-9 px-4 border-[#E8DCC3] text-xs font-bold text-[#8C4B3E] hover:bg-[#8C4B3E]/10 rounded-xl cursor-pointer">
            Apply
          </Button>
        </div>
        {promoSuccessMsg && <p className="text-[11px] text-emerald-600 font-bold">{promoSuccessMsg}</p>}
        {promoErrorMsg && <p className="text-[11px] text-rose-600 font-bold">{promoErrorMsg}</p>}
      </form>

      <div className="space-y-2 text-xs text-[#5A5146] pt-2 border-t border-[#E8DCC3]">
        <div className="flex justify-between">
          <span>Service Price</span>
          <strong className="text-[#1F1D1A]">${basePrice.toFixed(2)}</strong>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <strong className="text-[#1F1D1A]">${platformFee.toFixed(2)}</strong>
        </div>
        <div className="flex justify-between">
          <span>Taxes & Fees</span>
          <strong className="text-[#1F1D1A]">${tax.toFixed(2)}</strong>
        </div>
        {appliedDiscount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Coupon Discount</span>
            <strong>-${appliedDiscount.toFixed(2)}</strong>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-[#E8DCC3]">
        <span className="text-sm font-extrabold text-[#1F1D1A]">Total Due</span>
        <span className="text-2xl font-black text-[#8C4B3E]">${grandTotal.toFixed(2)}</span>
      </div>

      {/* Terms Checkbox */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTermsValue}
            onChange={(e) => setValue("acceptTerms", e.target.checked)}
            className="rounded border-[#E8DCC3] text-[#8C4B3E] focus:ring-[#8C4B3E] mt-0.5"
          />
          <label htmlFor="acceptTerms" className="text-[11px] text-[#5A5146] font-medium leading-tight cursor-pointer select-none">
            I agree to the Terms of Service, Cancellation Policy, and Privacy Policy.
          </label>
        </div>
        {errors.acceptTerms && <p className="text-[11px] text-rose-600 font-bold">{errors.acceptTerms.message}</p>}
      </div>

      {submitError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-3 rounded-xl">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold p-3 rounded-xl">
          Payment Successful! Redirecting to confirmation page...
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            Processing Payment...
          </>
        ) : (
          <>
            Complete Payment (${grandTotal.toFixed(2)})
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A7266] font-medium">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>256-Bit SSL Encrypted Payment</span>
      </div>
    </div>
  );
}
