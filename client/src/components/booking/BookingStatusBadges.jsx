import React from "react";

export function getPaymentMethodLabel(method) {
  const m = (method || "").toUpperCase();
  if (m === "CASH_ON_JOB" || m === "CASH") {
    return "Cash on service";
  }
  return "Online (Razorpay)";
}

export function PaymentStatusBadge({ status, method, className = "" }) {
  const m = (method || "").toUpperCase();
  const isCash = m === "CASH" || m === "CASH_ON_JOB";
  let pStatus = (status || "PENDING").toUpperCase();

  let isPaid = false;
  if (method && !isCash && (pStatus === "PENDING" || !status)) {
    isPaid = true;
  }

  if (pStatus === "PAID" || isPaid) {
    const label = isCash ? "Cash collected" : "Paid online";
    return (
      <span className={`inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] rounded-md px-2 py-0.5 ${className}`}>
        <span className="size-1 rounded-full bg-emerald-400" />
        {label}
      </span>
    );
  }

  if (pStatus === "FAILED") {
    return (
      <span className={`inline-flex items-center gap-1.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-[10px] rounded-md px-2 py-0.5 ${className}`}>
        <span className="size-1 rounded-full bg-rose-400" />
        Failed
      </span>
    );
  }

  if (pStatus === "REFUNDED") {
    return (
      <span className={`inline-flex items-center gap-1.5 border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono text-[10px] rounded-md px-2 py-0.5 ${className}`}>
        <span className="size-1 rounded-full bg-sky-400" />
        Refunded
      </span>
    );
  }

  const label = isCash ? "Cash on service" : "Payment pending";
  return (
    <span className={`inline-flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-[10px] rounded-md px-2 py-0.5 ${className}`}>
      <span className="size-1 rounded-full bg-amber-400" />
      {label}
    </span>
  );
}

export function BookingStatusBadge({ status, className = "" }) {
  const s = (status || "pending").toUpperCase();

  switch (s) {
    case "CONFIRMED":
    case "UPCOMING":
      return (
        <span className={`inline-flex items-center gap-1.5 border border-sky-500/30 bg-sky-500/10 text-sky-300 font-mono text-[10px] uppercase rounded-md px-2 py-0.5 ${className}`}>
          <span className="size-1 rounded-full bg-sky-400" />
          Confirmed
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className={`inline-flex items-center gap-1.5 border border-purple-500/30 bg-purple-500/10 text-purple-300 font-mono text-[10px] uppercase rounded-md px-2 py-0.5 ${className}`}>
          <span className="size-1 rounded-full bg-purple-400 animate-pulse" />
          In progress
        </span>
      );
    case "CANCELLED":
      return (
        <span className={`inline-flex items-center gap-1.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-[10px] uppercase rounded-md px-2 py-0.5 ${className}`}>
          <span className="size-1 rounded-full bg-rose-400" />
          Cancelled
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase rounded-md px-2 py-0.5 ${className}`}>
          <span className="size-1 rounded-full bg-emerald-400" />
          Completed
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 border border-border/80 bg-muted/40 text-muted-foreground font-mono text-[10px] uppercase rounded-md px-2 py-0.5 ${className}`}>
          <span className="size-1 rounded-full bg-muted-foreground" />
          Pending
        </span>
      );
  }
}
