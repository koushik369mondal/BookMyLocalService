import React from "react";
import { CreditCard, Banknote, ShieldCheck, CheckCircle2, Sparkles, Lock } from "lucide-react";

export function CheckoutPaymentMethod({
  setValue,
  selectedPaymentMethod,
  isSubmitting
}) {
  const currentMethod = (selectedPaymentMethod === "cash") ? "cash" : "razorpay";

  return (
    <div className="card-chai p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-foreground/5 text-foreground border border-border/70">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-heading font-medium text-foreground">2. Payment selection</h2>
            <p className="text-xs text-muted-foreground">Choose your preferred payment method</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground border border-border/80 px-3 py-1 rounded-full bg-card/60">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>256-bit encrypted</span>
        </div>
      </div>

      {/* Main Payment Options Stack */}
      <div className="space-y-3">
        
        {/* OPTION 1: ONLINE PAYMENT (RAZORPAY) */}
        <div
          onClick={() => !isSubmitting && setValue("paymentMethod", "razorpay")}
          className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
            currentMethod === "razorpay"
              ? "bg-card border-foreground/40 ring-1 ring-foreground/20"
              : "bg-card/40 border-border/80 hover:border-foreground/30"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className={`mt-0.5 size-4 rounded-full border flex items-center justify-center shrink-0 ${
                currentMethod === "razorpay"
                  ? "border-foreground bg-foreground"
                  : "border-border bg-card"
              }`}>
                {currentMethod === "razorpay" && (
                  <div className="size-1.5 rounded-full bg-background" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-medium text-foreground text-sm">Online payment</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-brand" /> Recommended
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pay securely via Razorpay standard web checkout
                </p>

                {/* Informational Payment Method Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="border border-border/70 bg-card px-2 py-0.5 rounded-md">
                    UPI (GPay, PhonePe, Paytm)
                  </span>
                  <span className="border border-border/70 bg-card px-2 py-0.5 rounded-md">
                    Cards (Visa, Mastercard, RuPay)
                  </span>
                  <span className="border border-border/70 bg-card px-2 py-0.5 rounded-md">
                    Netbanking and wallets
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OPTION 2: PAY ON SERVICE (CASH) */}
        <div
          onClick={() => !isSubmitting && setValue("paymentMethod", "cash")}
          className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
            currentMethod === "cash"
              ? "bg-card border-foreground/40 ring-1 ring-foreground/20"
              : "bg-card/40 border-border/80 hover:border-foreground/30"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className={`mt-0.5 size-4 rounded-full border flex items-center justify-center shrink-0 ${
                currentMethod === "cash"
                  ? "border-foreground bg-foreground"
                  : "border-border bg-card"
              }`}>
                {currentMethod === "cash" && (
                  <div className="size-1.5 rounded-full bg-background" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-medium text-foreground text-sm">Pay on service (cash or UPI)</h3>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pay cash or scan specialist UPI QR code directly after service completion.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Information Notice Banner */}
      <div className="p-3.5 rounded-xl bg-card/60 border border-border/80 flex items-start gap-3">
        {currentMethod === "cash" ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-foreground">No online payment required now</p>
              <p className="text-muted-foreground mt-0.5 leading-relaxed">
                Your appointment will be confirmed immediately. You can settle in person once the service is completed.
              </p>
            </div>
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-foreground">Powered by Razorpay secure checkout</p>
              <p className="text-muted-foreground mt-0.5 leading-relaxed">
                Selecting payment redirects to a secure modal supporting any UPI, card, or netbanking choice.
              </p>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
