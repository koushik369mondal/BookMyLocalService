import React from "react";
import { CheckCircle2, Clock, PlayCircle, XCircle, ShieldCheck } from "lucide-react";

export default function BookingProgressTimeline({ status }) {
  const s = (status || "pending").toLowerCase();

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
    { key: "booked", label: "Booked", icon: CheckCircle2 },
    { key: "confirmed", label: "Confirmed", icon: ShieldCheck },
    { key: "in_progress", label: "In Service", icon: PlayCircle },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  let currentStepIndex = 0; // default booked
  if (s === "confirmed" || s === "upcoming") currentStepIndex = 1;
  else if (s === "in_progress") currentStepIndex = 2;
  else if (s === "completed") currentStepIndex = 3;

  return (
    <div className="w-full bg-[#FAF6F0]/80 border border-[#E8DCC3]/80 rounded-2xl p-4 my-2">
      <div className="relative flex items-center justify-between">
        
        {/* Background Connector Bar */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-[#E8DCC3] rounded-full z-0" />
        
        {/* Active Progress Bar */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-[#8C4B3E] rounded-full transition-all duration-500 z-0"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? "bg-[#8C4B3E] text-white shadow-2xs"
                    : "bg-white text-[#7A7266] border border-[#E8DCC3]"
                } ${isCurrent ? "ring-4 ring-[#8C4B3E]/20 scale-110" : ""}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`text-[10px] mt-1.5 font-bold tracking-tight text-center ${
                  isDone ? "text-[#1F1D1A]" : "text-[#7A7266]"
                } ${isCurrent ? "text-[#8C4B3E] font-black" : ""}`}
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
