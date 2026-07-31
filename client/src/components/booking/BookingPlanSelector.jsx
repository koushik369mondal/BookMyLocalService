import React from "react";
import { Check } from "lucide-react";

export function BookingPlanSelector({ plans, activePlanIdx, onSelectPlan }) {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="space-y-4 bg-white p-6 rounded-3xl border border-[#E8DCC3] shadow-sm">
      <h3 className="text-sm font-extrabold text-[#1F1D1A]">Select Your Service Package</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, idx) => {
          const isSelected = activePlanIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => onSelectPlan(idx)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#FAF6F0] border-[#8C4B3E] shadow-sm"
                  : "bg-white border-[#E8DCC3] hover:border-[#8C4B3E]/50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1F1D1A] uppercase tracking-wider">{plan.name}</span>
                  {isSelected && (
                    <span className="h-5 w-5 rounded-full bg-[#8C4B3E] text-white flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div className="text-xl font-black text-[#8C4B3E]">₹{plan.price}</div>
                <p className="text-[11px] text-[#5A5146] leading-relaxed">{plan.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E8DCC3] space-y-1">
                {plan.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#5A5146] font-medium">
                    <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
