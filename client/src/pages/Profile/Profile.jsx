import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm";
import { Loader2, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const {
    user,
    authLoading,
    activeTab,
    setActiveTab,
    successMsg,
    errorMsg,
    isSavingDetails,
    isUploadingPhoto,
    isUpgradingRole,
    fileInputRef,
    regProfile,
    handleProfileSubmit,
    profileErrors,
    handleUpgradeToProvider,
    handleSwitchToCustomer,
    handleAvatarFileChange,
    logout
  } = useProfile();

  if (authLoading || !user) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen py-4 font-sans text-neutral-200">
        <div className="space-y-6">

          {/* Profile Header Component */}
          <ProfileHeader
            user={user}
            isUploadingPhoto={isUploadingPhoto}
            fileInputRef={fileInputRef}
            onAvatarFileChange={handleAvatarFileChange}
            isUpgradingRole={isUpgradingRole}
            onUpgradeToProvider={handleUpgradeToProvider}
            onSwitchToCustomer={handleSwitchToCustomer}
          />

          {/* Profile Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "details"
                    ? "bg-white text-neutral-950"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10"
                }`}
              >
                <User className="h-3.5 w-3.5 inline mr-1.5" />
                Account details
              </button>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              className="h-9 text-xs font-medium text-red-400 border-red-500/20 hover:bg-red-500/10 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>

          {/* Tab Contents */}
          {activeTab === "details" && (
            <ProfileDetailsForm
              user={user}
              regProfile={regProfile}
              profileErrors={profileErrors}
              isSavingDetails={isSavingDetails}
              onProfileSubmit={handleProfileSubmit}
              successMsg={successMsg}
              errorMsg={errorMsg}
            />
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
