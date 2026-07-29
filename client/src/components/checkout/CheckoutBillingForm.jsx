import React from "react";
import { User, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutBillingForm({ register, errors, isSubmitting }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCC3] shadow-sm space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-[#E8DCC3]">
        <div className="p-2 bg-[#8C4B3E]/10 text-[#8C4B3E] rounded-xl">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#1F1D1A]">1. Billing & Contact Details</h2>
          <p className="text-xs text-[#5A5146] font-medium">Verify your address for service dispatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-bold text-[#1F1D1A]">Full Name *</Label>
          <Input
            placeholder="Amanda Watson"
            disabled={isSubmitting}
            className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${errors.fullName ? "border-rose-400" : ""}`}
            {...register("fullName")}
          />
          {errors.fullName && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-[#1F1D1A]">Email Address *</Label>
          <Input
            type="email"
            placeholder="name@example.com"
            disabled={isSubmitting}
            className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${errors.email ? "border-rose-400" : ""}`}
            {...register("email")}
          />
          {errors.email && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-[#1F1D1A]">Phone Contact *</Label>
          <Input
            placeholder="123-456-7890"
            disabled={isSubmitting}
            className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${errors.phone ? "border-rose-400" : ""}`}
            {...register("phone")}
          />
          {errors.phone && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-bold text-[#1F1D1A]">Street Address *</Label>
          <Input
            placeholder="123 Main Street, Apt 4B"
            disabled={isSubmitting}
            className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${errors.street ? "border-rose-400" : ""}`}
            {...register("street")}
          />
          {errors.street && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.street.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-[#1F1D1A]">City *</Label>
          <Input
            placeholder="New York"
            disabled={isSubmitting}
            className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${errors.city ? "border-rose-400" : ""}`}
            {...register("city")}
          />
          {errors.city && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.city.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-[#1F1D1A]">State / Region *</Label>
          <Input
            placeholder="NY"
            disabled={isSubmitting}
            className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${errors.state ? "border-rose-400" : ""}`}
            {...register("state")}
          />
          {errors.state && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.state.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-bold text-[#1F1D1A]">PIN Code *</Label>
          <Input
            placeholder="100001"
            disabled={isSubmitting}
            className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${errors.zipCode ? "border-rose-400" : ""}`}
            {...register("zipCode")}
          />
          {errors.zipCode && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.zipCode.message}</p>}
        </div>
      </div>
    </div>
  );
}
