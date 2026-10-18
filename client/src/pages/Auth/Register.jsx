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
} from "lucide-react";
import AnimatedBadge from "@/components/ui/AnimatedBadge";

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
    setSuccessMsg(
      `Registering as ${
        selectedRole === "provider" ? "service provider" : "customer"
      }...`
    );

    try {
      const data = await googleLogin(response.credential, selectedRole);
      if (data.requiresRoleSelection) {
        setIsSubmitting(false);
        navigate("/choose-account-type");
        return;
      }

      setSuccessMsg("Registration successful. Redirecting...");
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
      console.error("Google Auth error:", err);
      setErrorMsg(err.message || "Failed to register with Google.");
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
            text: "signup_with",
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
  }, [selectedRole]);

  return (
    <MainLayout>
      <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="mb-6 flex justify-center">
          <Logo size={36} showText={true} />
        </div>

        {/* Form Container Card */}
        <div className="max-w-xl w-full card-chai p-6 sm:p-10 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select your account type and continue with{" "}
              <span className="highlight">instant Google authentication</span>.
            </p>
          </div>

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

          {/* Account Type Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-foreground block">
              1. Choose account type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Customer */}
              <div
                onClick={() => setSelectedRole("customer")}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                  selectedRole === "customer"
                    ? "bg-card border-border ring-1 ring-border shadow-none"
                    : "bg-card/40 border-border/70 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="size-9 rounded-lg border border-border bg-card flex items-center justify-center text-foreground">
                    <User className="size-4" />
                  </div>
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center ${
                      selectedRole === "customer"
                        ? "bg-foreground border-foreground text-background"
                        : "border-border"
                    }`}
                  >
                    {selectedRole === "customer" && (
                      <Check className="size-2.5 stroke-[3]" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Customer
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Book verified local specialists and manage home bookings.
                  </p>
                </div>
              </div>

              {/* Provider */}
              <div
                onClick={() => setSelectedRole("provider")}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                  selectedRole === "provider"
                    ? "bg-card border-border ring-1 ring-border shadow-none"
                    : "bg-card/40 border-border/70 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="size-9 rounded-lg border border-border bg-card flex items-center justify-center text-foreground">
                    <Briefcase className="size-4" />
                  </div>
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center ${
                      selectedRole === "provider"
                        ? "bg-foreground border-foreground text-background"
                        : "border-border"
                    }`}
                  >
                    {selectedRole === "provider" && (
                      <Check className="size-2.5 stroke-[3]" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Service provider
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Offer services, receive job dispatches, and receive payouts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Button */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-foreground block">
              2. Continue with Google:
            </span>
            <div
              ref={googleBtnRef}
              className="w-full flex justify-center min-h-[44px]"
            />
          </div>

          {/* Benefits */}
          <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
              <span>Verified directory</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="size-3.5 text-muted-foreground shrink-0" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-3.5 text-amber-500 shrink-0" />
              <span>Instant confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="size-3.5 text-amber-500 shrink-0" />
              <span>Genuine ratings</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground hover:text-brand font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
