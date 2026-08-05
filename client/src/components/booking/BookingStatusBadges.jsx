import React from "react";

export function getPaymentMethodLabel(method) {
  const m = (method || "").toUpperCase();
  if (m === "CASH_ON_JOB" || m === "CASH") {
    return "Cash on Service";
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
    const label = isCash ? "Cash Collected" : "Paid Online";
    return (
      <span className={`inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 border border-emerald-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] shadow-2xs ${className}`}>
        🟢 {label}
      </span>
    );
  }

  if (pStatus === "FAILED") {
    return (
      <span className={`inline-flex items-center gap-1 bg-rose-100 text-rose-950 border border-rose-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] shadow-2xs ${className}`}>
        🔴 Failed
      </span>
    );
  }

  if (pStatus === "REFUNDED") {
    return (
      <span className={`inline-flex items-center gap-1 bg-sky-100 text-sky-950 border border-sky-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] shadow-2xs ${className}`}>
        🔵 Refunded
      </span>
    );
  }

  const label = isCash ? "Cash on Service" : "Payment Pending";
  return (
    <span className={`inline-flex items-center gap-1 bg-orange-100 text-orange-950 border border-orange-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] shadow-2xs ${className}`}>
      🟠 {label}
    </span>
  );
}

export function BookingStatusBadge({ status, className = "" }) {
  const s = (status || "pending").toUpperCase();

  switch (s) {
    case "CONFIRMED":
    case "UPCOMING":
      return (
        <span className={`inline-flex items-center gap-1 bg-blue-100 text-blue-950 border border-blue-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] uppercase shadow-2xs ${className}`}>
          Confirmed
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className={`inline-flex items-center gap-1 bg-purple-100 text-purple-950 border border-purple-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] uppercase shadow-2xs ${className}`}>
          In Progress
        </span>
      );
    case "CANCELLED":
      return (
        <span className={`inline-flex items-center gap-1 bg-rose-100 text-rose-950 border border-rose-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] uppercase shadow-2xs ${className}`}>
          Cancelled
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 border border-emerald-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] uppercase shadow-2xs ${className}`}>
          Completed
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 bg-amber-100 text-amber-950 border border-amber-400 font-extrabold rounded-lg px-2.5 py-0.5 text-[10px] uppercase shadow-2xs ${className}`}>
          Pending
        </span>
      );
  }
}
