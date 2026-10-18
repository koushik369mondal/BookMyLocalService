import React from "react";
import { Camera, Loader2, Sparkles, Briefcase, User } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getProfileCompletion } from "@/hooks/useProfile";

export function ProfileHeader({
  user,
  isUploadingPhoto,
  fileInputRef,
  onAvatarFileChange,
  isUpgradingRole,
  onUpgradeToProvider,
  onSwitchToCustomer
}) {
  if (!user) return null;
  const completion = getProfileCompletion(user);

  return (
    <div className="card-chai p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar with Camera Overlay */}
        <div className="relative group">
          <UserAvatar
            user={user}
            className="h-24 w-24 border-2 border-white/10"
            fallbackClassName="bg-neutral-800 text-neutral-100 font-bold text-2xl"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
            className="absolute bottom-0 right-0 h-8 w-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full flex items-center justify-center border border-white/20 cursor-pointer transition-transform hover:scale-105"
            title="Change avatar"
          >
            {isUploadingPhoto ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onAvatarFileChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />
        </div>

        {/* Name and Role Info */}
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{user.fullName}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300 text-[10px] font-semibold uppercase tracking-wider">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-medium">{user.email}</p>
          <p className="text-xs text-neutral-500">{user.phone || "No phone number added"}</p>
        </div>

        {/* Role Switch Action Button */}
        <div>
          {user.role === "CUSTOMER" ? (
            <Button
              onClick={onUpgradeToProvider}
              disabled={isUpgradingRole}
              variant="solid"
              className="flex items-center gap-1.5"
            >
              {isUpgradingRole ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Briefcase className="h-4 w-4" />
                  Become a provider
                </>
              )}
            </Button>
          ) : user.role === "PROVIDER" ? (
            <Button
              onClick={onSwitchToCustomer}
              disabled={isUpgradingRole}
              variant="outline"
              className="flex items-center gap-1.5"
            >
              {isUpgradingRole ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Switch to customer mode
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Profile completion ({completion.percent}%)
          </span>
          <span className="text-neutral-400 font-medium">
            {completion.percent === 100 ? "All details complete" : `${completion.missing.length} item(s) remaining`}
          </span>
        </div>
        <Progress value={completion.percent} className="h-1.5" />
      </div>
    </div>
  );
}
