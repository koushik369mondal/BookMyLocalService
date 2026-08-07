import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import Logo from "@/components/ui/logo";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  Check,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function ChooseAccountType() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [googleAccount, setGoogleAccount] = useState(null);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("pendingGoogleAccount");
    if (saved) {
      try {
        setGoogleAccount(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse pending Google account:", e);
      }
    }
  }, []);

  const handleCreateAccount = async () => {
    if (!googleAccount || !googleAccount.credential) {
      setErrorMsg("Google session expired. Please return to Login or Register page.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const data = await googleLogin(googleAccount.credential, selectedRole);
      sessionStorage.removeItem("pendingGoogleAccount");
      
      const userRole = data.user?.role?.toUpperCase();
      if (data.isProfileComplete === false) {
        navigate("/complete-profile");
      } else if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userRole === "PROVIDER") {
        navigate("/provider/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      console.error("Failed to complete registration:", err);
      setErrorMsg(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-[#FAF6F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Brand Header */}
        <div className="mb-6 flex justify-center">
          <Logo size={42} showText={true} />
        </div>

        {/* Main Card */}
        <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-6 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          
          {/* Google Profile Greeting */}
          {googleAccount && (
            <div className="mb-6 p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl flex items-center gap-3.5">
              <UserAvatar
                src={googleAccount.avatar}
                name={googleAccount.fullName}
                className="h-12 w-12 border border-[#E8DCC3] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8C4B3E]">Verified Google Account</span>
                <h3 className="text-sm font-extrabold text-[#1F1D1A] truncate">{googleAccount.fullName}</h3>
                <p className="text-xs text-[#5A5146] truncate">{googleAccount.email}</p>
              </div>
            </div>
          )}

          {/* Header Title */}
          <div className="space-y-1.5 mb-6 text-center">
            <span className="inline-block px-3 py-1 bg-[#F0E7D5] border border-[#E8DCC3] text-[#8C4B3E] font-black text-[10px] uppercase tracking-widest rounded-full">
              New Account Registration ✨
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F1D1A] tracking-tight">
              Select Your Account Type
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">
              We couldn't find an existing account for this email. Pick your role to complete sign-up.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ROLE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            
            {/* Customer Role Card */}
            <div
              onClick={() => setSelectedRole("customer")}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between space-y-3 ${
                selectedRole === "customer"
                  ? "bg-[#FAF6F0] border-[#8C4B3E] ring-2 ring-[#8C4B3E]/20 shadow-md scale-[1.01]"
                  : "bg-white border-[#E8DCC3] hover:border-[#C9A46A] hover:bg-[#FAF6F0]/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${selectedRole === "customer" ? "bg-[#8C4B3E] text-white" : "bg-[#F0E7D5] text-[#8C4B3E]"}`}>
                  <User className="h-5 w-5" />
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRole === "customer" ? "bg-[#8C4B3E] border-[#8C4B3E] text-white" : "border-[#E8DCC3]"}`}>
                  {selectedRole === "customer" && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#1F1D1A]">Customer / Client</h3>
                <p className="text-[11px] text-[#5A5146] font-medium leading-relaxed mt-1">
                  Book local specialists, track dispatches live, and leave reviews.
                </p>
              </div>
            </div>

            {/* Provider Role Card */}
            <div
              onClick={() => setSelectedRole("provider")}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between space-y-3 ${
                selectedRole === "provider"
                  ? "bg-[#FAF6F0] border-[#8C4B3E] ring-2 ring-[#8C4B3E]/20 shadow-md scale-[1.01]"
                  : "bg-white border-[#E8DCC3] hover:border-[#C9A46A] hover:bg-[#FAF6F0]/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${selectedRole === "provider" ? "bg-[#8C4B3E] text-white" : "bg-[#F0E7D5] text-[#8C4B3E]"}`}>
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRole === "provider" ? "bg-[#8C4B3E] border-[#8C4B3E] text-white" : "border-[#E8DCC3]"}`}>
                  {selectedRole === "provider" && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#1F1D1A]">Service Provider</h3>
                <p className="text-[11px] text-[#5A5146] font-medium leading-relaxed mt-1">
                  Offer professional services, receive customer bookings, and earn.
                </p>
              </div>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <Button
            disabled={isSubmitting || !googleAccount}
            onClick={handleCreateAccount}
            className="w-full bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs sm:text-sm h-12 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                <span>Create Account as {selectedRole === "provider" ? "Service Provider" : "Customer"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Back link */}
          <div className="mt-6 text-center text-xs font-semibold text-[#5A5146]">
            Want to use a different Google account?{" "}
            <Link to="/login" className="text-[#8C4B3E] hover:underline font-bold">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
