import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm";
import { Loader2, User, MapPin, LogOut } from "lucide-react";
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
    addresses,
    isAddAddressOpen,
    setIsAddAddressOpen,
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
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF6F0]">
          <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen py-8 font-sans text-[#1F1D1A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">

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
          <div className="flex items-center justify-between border-b border-[#E8DCC3] pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === "details"
                    ? "bg-[#8C4B3E] text-white shadow-xs"
                    : "bg-white text-[#5A5146] hover:bg-[#FAF6F0] border border-[#E8DCC3]"
                }`}
              >
                <User className="h-3.5 w-3.5 inline mr-1.5" />
                Account Details
              </button>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              className="h-9 text-xs font-extrabold text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
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
