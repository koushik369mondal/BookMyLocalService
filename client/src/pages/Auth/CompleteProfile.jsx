import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/logo";
import {
  Phone,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  User,
  Briefcase,
  Sparkles
} from "lucide-react";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role?.toLowerCase() || "customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await updateProfile({
        phone: phone.trim(),
        role
      });

      setSuccessMsg("Profile completed successfully! Redirecting...");
      setIsSubmitting(false);

      setTimeout(() => {
        const userRole = result.user?.role?.toUpperCase() || role.toUpperCase();
        if (userRole === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (userRole === "PROVIDER") {
          navigate("/provider/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }, 1000);
    } catch (err) {
      console.error("Complete Profile error:", err);
      setErrorMsg(err.message || "Failed to update profile details.");
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    const userRole = user?.role?.toUpperCase() || "CUSTOMER";
    if (userRole === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (userRole === "PROVIDER") {
      navigate("/provider/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-[#FAF6F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="mb-6 flex justify-center">
          <Logo size={42} showText={true} />
        </div>

        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-8 sm:p-10 transition-all duration-300">
          <div className="space-y-1.5 mb-6 text-center">
            <h1 className="text-2xl font-black text-[#1F1D1A] tracking-tight">Complete Your Profile</h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">Welcome {user?.fullName || "there"}! Add a phone number to get started.</p>
          </div>

          {/* User Info Avatar Preview */}
          <div className="flex items-center gap-3 p-3.5 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl mb-6">
            {user?.avatar ? (
              <img src={user.avatar} alt="Google Avatar" className="w-11 h-11 rounded-full object-cover border border-[#8C4B3E]/30" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#8C4B3E] text-white font-bold flex items-center justify-center text-sm">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <div className="text-xs font-extrabold text-[#1F1D1A]">{user?.fullName || "User"}</div>
              <div className="text-[11px] text-[#5A5146] font-medium">{user?.email}</div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1F1D1A]">I am using the platform as:</Label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  disabled={isSubmitting}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${role === "customer"
                      ? "bg-[#8C4B3E] text-white shadow-sm"
                      : "text-[#5A5146] hover:text-[#8C4B3E]"
                    }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("provider")}
                  disabled={isSubmitting}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${role === "provider"
                      ? "bg-[#8C4B3E] text-white shadow-sm"
                      : "text-[#5A5146] hover:text-[#8C4B3E]"
                    }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  Provider
                </button>
              </div>

              {role === "provider" && (
                <div className="p-3 bg-[#F0E7D5]/70 border border-[#E8DCC3] rounded-xl flex items-start gap-2 text-xs text-[#5A5146] mt-2">
                  <Sparkles className="h-4 w-4 text-[#C9A46A] shrink-0 mt-0.5" />
                  <span>Provider status lets you list services, manage bookings, and earn.</span>
                </div>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-[#1F1D1A]">Phone Number (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-[#8C4B3E]/60">
                  <Phone className="h-4 w-4" />
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 border-[#E8DCC3] focus:ring-2 focus:ring-[#8C4B3E] focus:border-[#8C4B3E] rounded-xl text-xs bg-[#FAF6F0]/30"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Saving details...
                </>
              ) : (
                <>
                  Complete Profile & Continue
                  <ArrowRight className="h-4 w-4 text-white/70" />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-center text-xs font-bold text-[#7A7266] hover:text-[#1F1D1A] transition-colors py-1 cursor-pointer"
            >
              Skip for now →
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
