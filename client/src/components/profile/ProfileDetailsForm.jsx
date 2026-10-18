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
    <div className="card-chai p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-white/10">
        <User className="h-5 w-5 text-neutral-400" />
        <h2 className="text-lg font-bold text-white">Personal & account information</h2>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onProfileSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-neutral-300">Full name *</Label>
            <Input
              placeholder="Amanda Watson"
              disabled={isSavingDetails}
              className={profileErrors.fullName ? "border-red-500/50" : ""}
              {...regProfile("fullName")}
            />
            {profileErrors.fullName && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {profileErrors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-neutral-300">Email address (primary ID)</Label>
            <Input
              disabled
              readOnly
              className="opacity-60 cursor-not-allowed bg-neutral-900/50"
              {...regProfile("email")}
            />
            <p className="text-[10px] text-neutral-500">Email address is globally unique and cannot be modified.</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-neutral-300">Phone contact *</Label>
            <Input
              placeholder="123-456-7890"
              disabled={isSavingDetails}
              className={profileErrors.phone ? "border-red-500/50" : ""}
              {...regProfile("phone")}
            />
            {profileErrors.phone && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {profileErrors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-neutral-300">Default dispatch address</Label>
            <Input
              placeholder="123 Main Street"
              disabled={isSavingDetails}
              className={profileErrors.address ? "border-red-500/50" : ""}
              {...regProfile("address")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-neutral-300">City</Label>
            <Input
              placeholder="New York"
              disabled={isSavingDetails}
              className={profileErrors.city ? "border-red-500/50" : ""}
              {...regProfile("city")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-neutral-300">State</Label>
            <Input
              placeholder="NY"
              disabled={isSavingDetails}
              className={profileErrors.state ? "border-red-500/50" : ""}
              {...regProfile("state")}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-neutral-300">Postal code</Label>
            <Input
              placeholder="10001"
              disabled={isSavingDetails}
              className={profileErrors.zipCode ? "border-red-500/50" : ""}
              {...regProfile("zipCode")}
            />
            {profileErrors.zipCode && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {profileErrors.zipCode.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSavingDetails}
          variant="solid"
          className="flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSavingDetails ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving profile...
            </>
          ) : (
            "Save profile changes"
          )}
        </Button>
      </form>
    </div>
  );
}
