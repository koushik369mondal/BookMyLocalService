import React from "react";
import { Check } from "lucide-react";
import { formatPrice } from "@/utils/currency";

export function BookingPlanSelector({ plans, activePlanIdx, onSelectPlan }) {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="card-chai p-6 space-y-4">
      <h3 className="font-display font-semibold text-sm text-foreground">
        Select service package
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {plans.map((plan, idx) => {
          const isSelected = activePlanIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => onSelectPlan(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? "bg-card border-border ring-1 ring-border shadow-none"
                  : "bg-card/40 border-border/70 hover:border-border"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-xs text-foreground">
                    {plan.name}
                  </span>
                  {isSelected && (
                    <span className="size-4 rounded-full bg-foreground text-background flex items-center justify-center">
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-display font-semibold text-base text-foreground">
                  {formatPrice(plan.price)}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-border/60 space-y-1">
                {plan.inclusions?.map((inc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                  >
                    <Check className="size-3 text-emerald-500 shrink-0" />
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
