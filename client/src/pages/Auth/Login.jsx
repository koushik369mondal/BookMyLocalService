import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import {
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  CheckCircle
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
      const data = await googleLogin(response.credential, "CUSTOMER");
      setSuccessMsg("Google login successful! Redirecting...");
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

        {/* Brand Logo */}
        <div className="mb-6 flex justify-center">
          <Logo size={42} showText={true} />
        </div>

        {/* Centered Card */}
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">

          {/* Title Header */}
          <div className="space-y-1.5 mb-8 text-center">
            <h1 className="text-2xl font-black text-[#1F1D1A] tracking-tight">Login to your account</h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">Use 1-Click Google Sign-In for instant access</p>
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

          {/* Google Official Button */}
          <div className="mb-8 flex flex-col items-center justify-center space-y-4">
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
          </div>

          {/* Trust Badges */}
          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DCC3]/80 space-y-2 text-xs text-[#5A5146]">
            <div className="flex items-center gap-2 font-bold text-[#1F1D1A]">
              <ShieldCheck className="h-4 w-4 text-[#8C4B3E]" />
              Safe & Instant Authentication
            </div>
            <p className="text-[11px] leading-relaxed">
              Google Sign-In provides fast, passwordless, 1-click access to your BookMyLocalService account.
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 space-y-2.5 text-center text-xs font-semibold text-[#5A5146]">
            <div>
              New user?{" "}
              <Link
                to="/register"
                className="text-[#8C4B3E] hover:text-[#C9A46A] transition-colors font-bold hover:underline"
              >
                Sign up with Google
              </Link>
            </div>
            <div className="pt-2.5 border-t border-[#E8DCC3]">
              Are you a service provider?{" "}
              <Link
                to="/register?role=provider"
                className="text-[#C9A46A] hover:text-[#8C4B3E] transition-colors font-bold hover:underline"
              >
                Register as a Provider →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}