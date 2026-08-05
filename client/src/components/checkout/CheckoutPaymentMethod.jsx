import React from "react";
import { CreditCard, Banknote, ShieldCheck, CheckCircle2, Sparkles, Lock } from "lucide-react";

export function CheckoutPaymentMethod({
  setValue,
  selectedPaymentMethod,
  isSubmitting
}) {
  const currentMethod = (selectedPaymentMethod === "cash") ? "cash" : "razorpay";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCC3] shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DCC3]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#8C4B3E]/10 text-[#8C4B3E] rounded-2xl">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1F1D1A]">2. Payment Selection</h2>
            <p className="text-xs text-[#5A5146] font-medium">Choose your preferred payment method</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {/* Main Payment Options Stack */}
      <div className="space-y-4">
        
        {/* OPTION 1: ONLINE PAYMENT (RAZORPAY) */}
        <div
          onClick={() => !isSubmitting && setValue("paymentMethod", "razorpay")}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
            currentMethod === "razorpay"
              ? "bg-[#FAF6F0] border-[#8C4B3E] shadow-2xs"
              : "bg-white border-[#E8DCC3] hover:border-[#C9A46A]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                currentMethod === "razorpay"
                  ? "border-[#8C4B3E] bg-[#8C4B3E]"
                  : "border-stone-300 bg-white"
              }`}>
                {currentMethod === "razorpay" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-[#1F1D1A] text-base">Online Payment</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#8C4B3E] bg-[#8C4B3E]/10 border border-[#8C4B3E]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Recommended
                  </span>
                </div>
                <p className="text-xs text-[#5A5146] font-medium leading-relaxed">
                  Pay securely via Razorpay Standard Web Checkout
                </p>

                {/* Informational Payment Method Badges */}
                <div className="pt-2.5 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-[#1F1D1A] bg-white border border-[#E8DCC3] px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1">
                    <span className="text-[#8C4B3E] font-black">UPI</span> GPay • PhonePe • Paytm
                  </span>
                  <span className="text-[11px] font-bold text-[#1F1D1A] bg-white border border-[#E8DCC3] px-2.5 py-1 rounded-lg shadow-2xs">
                    Cards (Visa, Mastercard, RuPay)
                  </span>
                  <span className="text-[11px] font-bold text-[#1F1D1A] bg-white border border-[#E8DCC3] px-2.5 py-1 rounded-lg shadow-2xs">
                    Netbanking & Wallets
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OPTION 2: PAY ON SERVICE (CASH) */}
        <div
          onClick={() => !isSubmitting && setValue("paymentMethod", "cash")}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
            currentMethod === "cash"
              ? "bg-[#FAF6F0] border-[#8C4B3E] shadow-2xs"
              : "bg-white border-[#E8DCC3] hover:border-[#C9A46A]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                currentMethod === "cash"
                  ? "border-[#8C4B3E] bg-[#8C4B3E]"
                  : "border-stone-300 bg-white"
              }`}>
                {currentMethod === "cash" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#1F1D1A] text-base">Pay on Service (Cash)</h3>
                  <Banknote className="h-4.5 w-4.5 text-[#C9A46A]" />
                </div>
                <p className="text-xs text-[#5A5146] font-medium leading-relaxed">
                  Pay cash or UPI directly to the specialist after service completion.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Information Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC3] flex items-start gap-3">
        {currentMethod === "cash" ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-[#8C4B3E] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#1F1D1A]">No Online Payment Required Now</p>
              <p className="text-[11px] text-[#5A5146] font-medium leading-relaxed mt-0.5">
                Your booking will be registered immediately. You can pay cash or scan the specialist's UPI QR code once the job is finished.
              </p>
            </div>
          </>
        ) : (
          <>
            <Lock className="h-5 w-5 text-[#8C4B3E] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#1F1D1A]">Powered by Razorpay Standard Web Checkout</p>
              <p className="text-[11px] text-[#5A5146] font-medium leading-relaxed mt-0.5">
                Clicking "Complete Booking & Pay" opens the secure Razorpay payment window where you can choose any payment mode (UPI, Cards, Netbanking, or Wallets).
              </p>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
