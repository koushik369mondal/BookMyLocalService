import React from "react";
import { User, ShieldAlert, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileDetailsForm({
  user,
  regProfile,
  profileErrors,
  isSavingDetails,
  onProfileSubmit,
  successMsg,
  errorMsg
}) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCC3] shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-[#E8DCC3]">
        <User className="h-5 w-5 text-[#8C4B3E]" />
        <h2 className="text-lg font-black text-[#1F1D1A]">Personal & Account Information</h2>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onProfileSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-bold text-[#1F1D1A]">Full Name *</Label>
            <Input
              placeholder="Amanda Watson"
              disabled={isSavingDetails}
              className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${profileErrors.fullName ? "border-rose-400" : ""}`}
              {...regProfile("fullName")}
            />
            {profileErrors.fullName && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{profileErrors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#1F1D1A]">Email Address (Primary Login ID)</Label>
            <Input
              disabled
              readOnly
              className="h-10 border-[#E8DCC3] text-xs rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              {...regProfile("email")}
            />
            <p className="text-[10px] text-[#7A7266]">Email address is globally unique and cannot be modified.</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#1F1D1A]">Phone Contact *</Label>
            <Input
              placeholder="123-456-7890"
              disabled={isSavingDetails}
              className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${profileErrors.phone ? "border-rose-400" : ""}`}
              {...regProfile("phone")}
            />
            {profileErrors.phone && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{profileErrors.phone.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-bold text-[#1F1D1A]">Default Dispatch Address</Label>
            <Input
              placeholder="123 Main Street"
              disabled={isSavingDetails}
              className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${profileErrors.address ? "border-rose-400" : ""}`}
              {...regProfile("address")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#1F1D1A]">City</Label>
            <Input
              placeholder="New York"
              disabled={isSavingDetails}
              className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${profileErrors.city ? "border-rose-400" : ""}`}
              {...regProfile("city")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#1F1D1A]">State</Label>
            <Input
              placeholder="NY"
              disabled={isSavingDetails}
              className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${profileErrors.state ? "border-rose-400" : ""}`}
              {...regProfile("state")}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-bold text-[#1F1D1A]">PIN Code</Label>
            <Input
              placeholder="100001"
              disabled={isSavingDetails}
              className={`h-10 border-[#E8DCC3] text-xs rounded-xl ${profileErrors.zipCode ? "border-rose-400" : ""}`}
              {...regProfile("zipCode")}
            />
            {profileErrors.zipCode && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{profileErrors.zipCode.message}</p>}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSavingDetails}
          className="h-11 px-6 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          {isSavingDetails ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Saving Profile...
            </>
          ) : (
            "Save Profile Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
