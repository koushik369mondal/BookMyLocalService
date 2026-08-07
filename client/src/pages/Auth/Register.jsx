import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import Logo from "@/components/ui/logo";
import {
  ShieldAlert,
  CheckCircle2,
  User,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Zap,
  Star,
  Check,
  ArrowRight,
  FileText,
  UserCheck,
  Award
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const googleBtnRef = useRef(null);

  const { googleLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam === "provider") {
      setSelectedRole("provider");
    }
  }, [location.search]);

  const handleGoogleCallback = async (response) => {
    if (!response.credential) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg(`Registering as ${selectedRole === "provider" ? "Service Provider" : "Customer"}...`);

    try {
      const data = await googleLogin(response.credential, selectedRole);
      if (data.requiresRoleSelection) {
        setIsSubmitting(false);
        navigate("/choose-account-type");
        return;
      }

      setSuccessMsg("Registration successful! Redirecting...");
      setIsSubmitting(false);
      setTimeout(() => {
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
      }, 1000);
    } catch (err) {
      console.error("Google Auth error:", err);
      setErrorMsg(err.message || "Failed to register with Google.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1059298384612-7g8dpchm16n2fts4oel7nd5l10h32drv.apps.googleusercontent.com";

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback
        });
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signup_with",
            shape: "pill"
          });
        }
      }
    };

    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.head.appendChild(script);
    } else {
      initGsi();
    }
  }, [selectedRole]);

  return (
    <MainLayout>
      <div className="min-h-[90vh] bg-[#FAF6F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">

        {/* Brand Header */}
        <div className="mb-6 flex justify-center">
          <Logo size={42} showText={true} />
        </div>

        {/* Main Form Container Card */}
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-6 sm:p-10 transition-all duration-300 hover:shadow-2xl">

          {/* Header Title */}
          <div className="space-y-2 mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-[#F0E7D5] border border-[#E8DCC3] text-[#8C4B3E] font-black text-[10px] uppercase tracking-widest rounded-full">
              Join BookMyLocalService 🚀
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F1D1A] tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">
              Select your role and authenticate with Google in seconds
            </p>
          </div>

          {/* Error and Success Alerts */}
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

          {/* STEP 1: PREMIUM ROLE SELECTION CARDS */}
          <div className="mb-8 space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1F1D1A] block">
              1. Choose Account Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
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
                    Book verified local specialists, track live service dispatch, and submit reviews.
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
                    Offer professional services, manage job requests, and grow your local business.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* PROVIDER ONBOARDING PIPELINE NOTE (Displayed only when Provider is selected) */}
          {selectedRole === "provider" && (
            <div className="mb-8 p-4 bg-[#F0E7D5]/70 border border-[#E8DCC3] rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#1F1D1A]">
                <Award className="h-4 w-4 text-[#8C4B3E]" />
                <span>Provider Verification & Onboarding Journey</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-[#1F1D1A] font-extrabold text-center">
                <div className="p-2 bg-white rounded-xl border border-[#E8DCC3] flex flex-col items-center justify-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-[#8C4B3E]" />
                  <span>1. Profile Setup</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#E8DCC3] flex flex-col items-center justify-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-[#C9A46A]" />
                  <span>2. KYC Details</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#E8DCC3] flex flex-col items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#8C4B3E]" />
                  <span>3. Admin Review</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#E8DCC3] flex flex-col items-center justify-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>4. Accept Jobs</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DYNAMIC GOOGLE AUTH BUTTON */}
          <div className="mb-8 flex flex-col items-center justify-center space-y-3 p-4 bg-[#FAF6F0]/60 rounded-2xl border border-[#E8DCC3]/80">
            <span className="text-xs font-black uppercase tracking-wider text-[#8C4B3E] flex items-center gap-1.5">
              <span>2. Continue as {selectedRole === "provider" ? "Service Provider" : "Customer"}</span>
            </span>
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
          </div>

          {/* PLATFORM BENEFITS GRID */}
          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DCC3]/80 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#7A7266] block">
              Why Join BookMyLocalService
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#5A5146] font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#8C4B3E] shrink-0" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#8C4B3E] shrink-0" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#8C4B3E] shrink-0" />
                <span>Easy 1-Click Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#8C4B3E] shrink-0" />
                <span>100% Database Reviews</span>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-[#E8DCC3] text-center text-xs font-semibold text-[#5A5146]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8C4B3E] hover:text-[#C9A46A] transition-colors font-extrabold flex items-center justify-center gap-1 mt-1.5 hover:underline"
            >
              <span>Log in with Google Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
