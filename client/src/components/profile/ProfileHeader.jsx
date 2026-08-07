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
    <div className="bg-white rounded-3xl border border-[#E8DCC3] shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar with Camera Overlay */}
        <div className="relative group">
          <UserAvatar
            user={user}
            className="h-24 w-24 border-4 border-[#FAF6F0] shadow-md"
            fallbackClassName="bg-[#8C4B3E] text-white font-extrabold text-2xl"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
            className="absolute bottom-0 right-0 h-8 w-8 bg-[#8C4B3E] hover:bg-[#783E33] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer transition-transform hover:scale-105"
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
            <h1 className="text-2xl font-black text-[#1F1D1A]">{user.fullName}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8C4B3E]/10 border border-[#8C4B3E]/20 text-[#8C4B3E] text-[10px] font-extrabold uppercase">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-[#5A5146] font-medium">{user.email}</p>
          <p className="text-xs text-[#7A7266]">{user.phone || "No phone number added"}</p>
        </div>

        {/* Role Switch Action Button */}
        <div>
          {user.role === "CUSTOMER" ? (
            <Button
              onClick={onUpgradeToProvider}
              disabled={isUpgradingRole}
              className="h-10 px-4 bg-[#8C4B3E] hover:bg-[#783E33] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isUpgradingRole ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <>
                  <Briefcase className="h-4 w-4" />
                  Become a Provider
                </>
              )}
            </Button>
          ) : user.role === "PROVIDER" ? (
            <Button
              onClick={onSwitchToCustomer}
              disabled={isUpgradingRole}
              variant="outline"
              className="h-10 px-4 border-[#E8DCC3] text-xs font-bold text-[#1F1D1A] hover:bg-[#FAF6F0] rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              {isUpgradingRole ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <User className="h-4 w-4 text-[#8C4B3E]" />
                  Switch to Customer Mode
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="space-y-2 pt-4 border-t border-[#E8DCC3]">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-[#1F1D1A] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#8C4B3E]" />
            Profile Completion ({completion.percent}%)
          </span>
          <span className="text-[#7A7266] font-medium">
            {completion.percent === 100 ? "All Details Complete!" : `${completion.missing.length} item(s) remaining`}
          </span>
        </div>
        <Progress value={completion.percent} className="h-2 bg-[#FAF6F0]" />
      </div>
    </div>
  );
}
