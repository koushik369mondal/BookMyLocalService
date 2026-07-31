import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/logo";
import {
  Mail,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Loader2
} from "lucide-react";

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" })
});

export default function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const googleBtnRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: ""
    }
  });

  const { loginSendOtp, googleLogin } = useAuth();

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
        if (userRole === "ADMIN") {
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await loginSendOtp(data.email);
      setSuccessMsg("Verification code sent! Redirecting to OTP validation page...");
      setIsSubmitting(false);
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: data.email, flow: "login" } });
      }, 1200);
    } catch (err) {
      console.error("Login page error:", err);
      setErrorMsg(err.message || "Failed to send OTP. Please check the email and try again.");
      setIsSubmitting(false);
    }
  };

  const handleCustomGoogleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMsg("Google Sign-In is initializing. Please try again in a moment.");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-[#FAF6F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">

        {/* Brand Logo */}
        <div className="mb-6 flex justify-center">
          <Logo size={42} showText={true} />
        </div>

        {/* Minimal Centered Card */}
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">

          {/* Title Header */}
          <div className="space-y-1.5 mb-8 text-center">
            <h1 className="text-2xl font-black text-[#1F1D1A] tracking-tight">Login to your account</h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">Enter your email or sign in with Google</p>
          </div>

          {/* Success and Error Banners */}
          {errorMsg && (
            <div className="mb-6 flex flex-col gap-3 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
              {errorMsg.toLowerCase().includes("no account found") && (
                <Button
                  type="button"
                  onClick={() => navigate("/register", { state: { email: watch("email") } })}
                  className="self-start mt-1 h-8 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-[11px] rounded-lg px-4 flex items-center gap-1 shadow-sm transition-all"
                >
                  Create Account
                  <ArrowRight className="h-3 w-3 text-white" />
                </Button>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Official Button Mount */}
          <div className="mb-6 flex flex-col items-center justify-center">
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
          </div>

          {/* OR Continue With Email */}
          <div className="relative my-6 shrink-0">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DCC3]"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider text-[#7A7266]">
              <span className="bg-white px-3.5">or continue with email</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-[#1F1D1A]">Email Address</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-[#8C4B3E]/60">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-10 h-11 border-[#E8DCC3] focus:ring-2 focus:ring-[#8C4B3E] focus:border-[#8C4B3E] rounded-xl text-xs bg-[#FAF6F0]/30 ${errors.email ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
                    }`}
                  disabled={isSubmitting}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <ShieldAlert className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Sending verification code...
                </>
              ) : (
                <>
                  Send Login OTP
                  <ArrowRight className="h-4 w-4 text-white/70" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Links */}
          <div className="mt-8 space-y-2.5 text-center text-xs font-semibold text-[#5A5146]">
            <div>
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="text-[#8C4B3E] hover:text-[#C9A46A] transition-colors font-bold hover:underline"
              >
                Create client account
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