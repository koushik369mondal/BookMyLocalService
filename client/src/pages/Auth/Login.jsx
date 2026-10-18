import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import Logo from "@/components/ui/logo";
import { ShieldAlert, CheckCircle2, ShieldCheck } from "lucide-react";
import AnimatedBadge from "@/components/ui/AnimatedBadge";

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

      setSuccessMsg("Welcome back. Redirecting to your dashboard...");
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
      }, 800);
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMsg(err.message || "Failed to authenticate with Google.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      "1059298384612-7g8dpchm16n2fts4oel7nd5l10h32drv.apps.googleusercontent.com";

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="mb-6 flex justify-center">
          <Logo size={36} showText={true} />
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full card-chai p-8 sm:p-10 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Sign in to your account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Single-click passwordless access for{" "}
              <span className="highlight">clients and specialists</span>.
            </p>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
              <ShieldAlert className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Official Button Container */}
          <div className="space-y-3 pt-2">
            <div
              ref={googleBtnRef}
              className="w-full flex justify-center min-h-[44px]"
            />
          </div>

          {/* Security note */}
          <div className="pt-4 border-t border-border/60 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>Account protection</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Google OAuth verified session. Zero passwords stored on servers.
            </p>
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-foreground hover:text-brand font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}