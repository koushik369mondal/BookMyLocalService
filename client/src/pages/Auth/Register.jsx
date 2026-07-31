import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/logo";
import {
  ShieldAlert,
  CheckCircle2,
  Loader2,
  User,
  Sparkles,
  Briefcase,
  ShieldCheck
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
    setSuccessMsg("Registering with Google...");

    try {
      const data = await googleLogin(response.credential, selectedRole);
      setSuccessMsg("Google sign-up successful! Redirecting...");
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

        {/* Form Container Card */}
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">

          {/* Header Title */}
          <div className="space-y-1.5 mb-6 text-center">
            <h1 className="text-2xl font-black text-[#1F1D1A] tracking-tight">Create your account</h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">Join BookMyLocalService with 1-Click Google Sign-In</p>
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

          {/* Role Switcher */}
          <div className="mb-6 space-y-1.5">
            <Label className="text-xs font-bold text-[#1F1D1A]">I want to register as:</Label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
              <button
                type="button"
                onClick={() => setSelectedRole("customer")}
                disabled={isSubmitting}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${selectedRole === "customer"
                    ? "bg-[#8C4B3E] text-white shadow-sm"
                    : "text-[#5A5146] hover:text-[#8C4B3E]"
                  }`}
              >
                <User className="h-3.5 w-3.5" />
                Customer / Client
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("provider")}
                disabled={isSubmitting}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${selectedRole === "provider"
                    ? "bg-[#8C4B3E] text-white shadow-sm"
                    : "text-[#5A5146] hover:text-[#8C4B3E]"
                  }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                Service Provider
              </button>
            </div>

            {selectedRole === "provider" && (
              <div className="p-3 bg-[#F0E7D5]/70 border border-[#E8DCC3] rounded-xl flex items-start gap-2.5 text-xs text-[#5A5146] mt-2">
                <Sparkles className="h-4 w-4 text-[#C9A46A] shrink-0 mt-0.5" />
                <span>
                  <strong>Provider Onboarding:</strong> Showcase service offerings, set availability, accept bookings, and track earnings.
                </span>
              </div>
            )}
          </div>

          {/* Google Official Button Mount */}
          <div className="mb-6 flex flex-col items-center justify-center space-y-4">
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
          </div>

          {/* Trust Badges */}
          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DCC3]/80 space-y-2 text-xs text-[#5A5146]">
            <div className="flex items-center gap-2 font-bold text-[#1F1D1A]">
              <ShieldCheck className="h-4 w-4 text-[#8C4B3E]" />
              One-Click Instant Registration
            </div>
            <p className="text-[11px] leading-relaxed">
              No passwords or verification codes needed. Sign up instantly using your Google Account.
            </p>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs font-semibold text-[#5A5146]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8C4B3E] hover:text-[#C9A46A] transition-colors font-bold hover:underline"
            >
              Log in with Google
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
