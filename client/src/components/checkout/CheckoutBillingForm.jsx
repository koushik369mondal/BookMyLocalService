import React from "react";
import { User, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutBillingForm({ register, errors, isSubmitting }) {
  return (
    <div className="card-chai p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border/80">
        <div className="p-2 rounded-xl bg-foreground/5 text-foreground border border-border/70">
          <User className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-heading font-medium text-foreground">1. Billing and contact details</h2>
          <p className="text-xs text-muted-foreground">Verify your address for service dispatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-foreground">Full name *</Label>
          <Input
            placeholder="Rajesh Sharma"
            disabled={isSubmitting}
            className={`h-10 text-xs rounded-xl ${errors.fullName ? "border-rose-400" : ""}`}
            {...register("fullName")}
          />
          {errors.fullName && <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Email address *</Label>
          <Input
            type="email"
            placeholder="rajesh@example.com"
            disabled={isSubmitting}
            className={`h-10 text-xs rounded-xl ${errors.email ? "border-rose-400" : ""}`}
            {...register("email")}
          />
          {errors.email && <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Phone contact *</Label>
          <Input
            placeholder="9876543210"
            disabled={isSubmitting}
            className={`h-10 text-xs rounded-xl ${errors.phone ? "border-rose-400" : ""}`}
            {...register("phone")}
          />
          {errors.phone && <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-foreground">Street address *</Label>
          <Input
            placeholder="42 Park Street, Flat 3B"
            disabled={isSubmitting}
            className={`h-10 text-xs rounded-xl ${errors.street ? "border-rose-400" : ""}`}
            {...register("street")}
          />
          {errors.street && <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.street.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">City *</Label>
          <Input
            placeholder="Kolkata"
            disabled={isSubmitting}
            className={`h-10 text-xs rounded-xl ${errors.city ? "border-rose-400" : ""}`}
            {...register("city")}
          />
          {errors.city && <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.city.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">State or region *</Label>
          <Input
            placeholder="West Bengal"
            disabled={isSubmitting}
            className={`h-10 text-xs rounded-xl ${errors.state ? "border-rose-400" : ""}`}
            {...register("state")}
          />
          {errors.state && <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.state.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-foreground">PIN code *</Label>
          <Input
            placeholder="700016"
            disabled={isSubmitting}
            className={`h-10 text-xs rounded-xl ${errors.zipCode ? "border-rose-400" : ""}`}
            {...register("zipCode")}
          />
          {errors.zipCode && <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.zipCode.message}</p>}
        </div>
      </div>
    </div>
  );
}
