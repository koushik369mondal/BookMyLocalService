import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import Logo from "@/components/ui/logo";
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Zap,
  KeyRound,
  ArrowRight
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const googleBtnRef = useRef(null);

  const { googleLogin } = useAuth();

  const handleGoogleCallback = async (response) => {
    if (!response.credential) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("Authenticating with Google...");

    try {
      const data = await googleLogin(response.credential);
      if (data.requiresRoleSelection) {
        setIsSubmitting(false);
        navigate("/choose-account-type");
        return;
      }

      setSuccessMsg("Welcome back! Redirecting to your dashboard...");
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
      console.error("Google login error:", err);
      setErrorMsg(err.message || "Failed to authenticate with Google.");
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
            text: "signin_with",
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
  }, []);

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-[#FAF6F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">

        {/* Brand Header */}
        <div className="mb-6 flex justify-center">
          <Logo size={42} showText={true} />
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">

          {/* Minimal Welcome Header */}
          <div className="space-y-2 mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-[#F0E7D5] border border-[#E8DCC3] text-[#8C4B3E] font-black text-[10px] uppercase tracking-widest rounded-full">
              Welcome Back 👋
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F1D1A] tracking-tight">
              Login to Account
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">
              Single-click passwordless access for Clients & Specialists
            </p>
          </div>

          {/* Alert Banners */}
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

          {/* Google Official Button Container */}
          <div className="mb-8 flex flex-col items-center justify-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7266]">
              Sign In With Google
            </span>
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
          </div>

          {/* Security & Account Protection Highlights */}
          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DCC3]/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-[#1F1D1A]">
              <ShieldCheck className="h-4 w-4 text-[#8C4B3E]" />
              <span>Account Security & Protection</span>
            </div>

            <div className="space-y-2 text-[11px] text-[#5A5146] font-semibold">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-[#C9A46A] shrink-0" />
                <span>256-Bit Encrypted Google Single Sign-On</span>
              </div>
              <div className="flex items-center gap-2">
                <KeyRound className="h-3.5 w-3.5 text-[#C9A46A] shrink-0" />
                <span>No password storage or credential leaks</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-[#C9A46A] shrink-0" />
                <span>Automatic role routing to your active dashboard</span>
              </div>
            </div>
          </div>

          {/* Footer Navigation Link */}
          <div className="mt-8 pt-6 border-t border-[#E8DCC3] text-center text-xs font-semibold text-[#5A5146]">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="text-[#8C4B3E] hover:text-[#C9A46A] transition-colors font-extrabold flex items-center justify-center gap-1 mt-1.5 hover:underline"
            >
              <span>Create an Account & Join Platform</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}