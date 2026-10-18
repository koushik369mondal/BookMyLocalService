import React from "react";
import { CheckCircle2, Clock, PlayCircle, XCircle, ShieldCheck, Star } from "lucide-react";

export default function BookingProgressTimeline({ status, reviewStatus, hasReview }) {
  const s = (status || "pending").toLowerCase();
  const isReviewed = reviewStatus === "REVIEWED" || Boolean(hasReview);

  if (s === "cancelled") {
    return (
      <div className="w-full bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3.5 my-2">
        <div className="flex items-center justify-between text-xs text-rose-800 font-bold">
          <div className="flex items-center gap-2">
            <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
            <span>Booking Cancelled</span>
          </div>
          <span className="text-[11px] text-rose-600 font-medium">Order request was closed</span>
        </div>
      </div>
    );
  }

  const steps = [
    { key: "booked", label: "Pending", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: ShieldCheck },
    { key: "in_progress", label: "In Service", icon: PlayCircle },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
    { key: "reviewed", label: "Reviewed", icon: Star },
  ];

  let currentStepIndex = 0; // default pending
  if (s === "confirmed" || s === "upcoming") {
    currentStepIndex = 1;
  } else if (s === "in_progress" || s === "in_service") {
    currentStepIndex = 2;
  } else if (s === "completed") {
    currentStepIndex = isReviewed ? 4 : 3;
  }

  return (
    <div className="w-full card-chai p-4 my-2">
      <div className="relative flex items-center justify-between">
        
        {/* Background Connector Bar */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-border/80 rounded-full z-0" />
        
        {/* Active Progress Bar */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-foreground rounded-full transition-all duration-500 z-0"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`size-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground border border-border/80"
                } ${isCurrent ? "ring-2 ring-foreground/20 scale-105" : ""}`}
              >
                <Icon className={`size-3.5 ${isCurrent && step.key === "in_progress" ? "animate-pulse" : ""}`} />
              </div>
              <span
                className={`text-[10px] mt-1.5 font-medium tracking-tight text-center ${
                  isDone ? "text-foreground" : "text-muted-foreground"
                } ${isCurrent ? "font-semibold text-foreground" : ""}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}
