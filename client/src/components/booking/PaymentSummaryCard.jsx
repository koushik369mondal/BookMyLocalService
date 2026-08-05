import React from "react";
import { CreditCard, Wallet, AlertCircle } from "lucide-react";
import { PaymentStatusBadge, getPaymentMethodLabel } from "./BookingStatusBadges";
import { formatPrice } from "@/utils/currency";

export default function PaymentSummaryCard({ total, paymentStatus, paymentMethod, className = "" }) {
  const isCash = (paymentMethod || "").toUpperCase() === "CASH_ON_JOB" || (paymentMethod || "").toUpperCase() === "CASH";

  return (
    <div className={`p-3.5 bg-white border border-[#E8DCC3] rounded-2xl space-y-2 shadow-2xs ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-[#E8DCC3]/60 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-[#5A5146] font-semibold">
          {isCash ? (
            <Wallet className="h-3.5 w-3.5 text-[#C9A46A] shrink-0" />
          ) : (
            <CreditCard className="h-3.5 w-3.5 text-[#8C4B3E] shrink-0" />
          )}
          <span>{getPaymentMethodLabel(paymentMethod)}</span>
        </div>
        <PaymentStatusBadge status={paymentStatus} method={paymentMethod} />
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A7266]">Total Charge</span>
        <span className="text-base font-black text-[#1F1D1A]">{formatPrice(total, { decimals: true })}</span>
      </div>
    </div>
  );
}
