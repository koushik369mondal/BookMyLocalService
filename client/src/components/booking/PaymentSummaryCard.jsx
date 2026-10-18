import React from "react";
import { CreditCard, Wallet, AlertCircle } from "lucide-react";
import { PaymentStatusBadge, getPaymentMethodLabel } from "./BookingStatusBadges";
import { formatPrice } from "@/utils/currency";

export default function PaymentSummaryCard({ total, paymentStatus, paymentMethod, className = "" }) {
  const isCash = (paymentMethod || "").toUpperCase() === "CASH_ON_JOB" || (paymentMethod || "").toUpperCase() === "CASH";

  return (
    <div className={`card-chai p-3.5 space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          {isCash ? (
            <Wallet className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          ) : (
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
          <span>{getPaymentMethodLabel(paymentMethod)}</span>
        </div>
        <PaymentStatusBadge status={paymentStatus} method={paymentMethod} />
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total charge</span>
        <span className="text-base font-mono font-medium text-foreground">{formatPrice(total, { decimals: true })}</span>
      </div>
    </div>
  );
}
