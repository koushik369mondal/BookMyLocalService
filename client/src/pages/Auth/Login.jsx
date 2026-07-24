import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/ui/logo";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle
} from "lucide-react";

// Custom high-fidelity brand SVGs to bypass missing Lucide brand icons in old builds
const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.527-10-10-10z" />
  </svg>
);

// Schema for validating email address
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

  const { loginSendOtp } = useAuth();

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

  const handleSocialSignIn = (provider) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Simulate social auth oauth popup redirect
    setTimeout(() => {
      setSuccessMsg(`Signing in with ${provider}... Please wait.`);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg("");
        navigate("/");
      }, 1500);
    }, 800);
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-[#FAF6F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">

        {/* Container box */}
        <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#5A5146]/15 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] transition-all duration-300 hover:shadow-2xl">

          {/* LEFT PANEL: PLATFORM PRESENTATION BANNER (DESKTOP ONLY) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-violet-950 via-violet-800 to-violet-950 p-10 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">

            {/* Mesh shapes and overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]"></div>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

            <div className="relative z-10 shrink-0">
              <Logo size={36} showText={true} />
            </div>

            {/* Testimonials or Stats Info Block */}
            <div className="relative z-10 space-y-6 my-auto pt-10">
              <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-[#7A7266] border border-white/5 backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Verified Local Pros
              </span>
              <h2 className="text-3xl font-black leading-tight tracking-tight">
                Find and Book Service Experts Near You.
              </h2>
              <p className="text-[#7A7266] text-sm leading-relaxed">
                Connect with verified local cleaners, plumbers, electricians, and personal coaches. Manage schedules, messaging, and secured checkout all in one place.
              </p>

              {/* Verified Features list */}
              <div className="space-y-3.5 pt-4">
                {[
                  "100% Background Checked Specialists",
                  "Secure & Encrypted Booking Checkout",
                  "Clear, Upfront Pricing Tiers"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-[#7A7266]">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote footer card */}
            <div className="relative z-10 bg-white/10 border border-white/5 rounded-2xl p-4.5 backdrop-blur-xs">
              <p className="text-xs italic text-[#7A7266] leading-relaxed">
                "Finding a smart home electrician used to take hours. On BookMyLocalService, I matched and scheduled Marcus in under 5 minutes!"
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-[#E8DCC3] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&h=40&q=80" alt="Client User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold">Helena Rostova</span>
                  <span className="text-[9px] text-white/60">Verified Customer</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: AUTHENTICATION FORM CARD */}
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white relative">

            {/* Platform branding on mobile */}
            <div className="lg:hidden mb-6 flex justify-center">
              <Logo size={32} showText={true} />
            </div>

            <div className="space-y-2 mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-black text-[#1F1D1A] tracking-tight">Login securely with Email OTP</h1>
              <p className="text-sm text-[#7A7266] font-medium">Enter your email to receive a secure login code</p>
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
                    className="self-start mt-1 h-8 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] rounded-lg px-4 flex items-center gap-1 shadow-sm transition-all"
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

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5.5">

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-[#8C4B3E]">Email Address</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-[#7A7266]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`pl-10 h-11 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 focus:border-violet-950 rounded-xl text-xs bg-white ${errors.email ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
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
                className="w-full h-11 bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Sending verification code...
                  </>
                ) : (
                  <>
                    Send Login OTP
                    <ArrowRight className="h-4 w-4 text-white/60" />
                  </>
                )}
              </Button>
            </form>

            {/* OR Continue With Divider */}
            <div className="relative my-7 shrink-0">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#5A5146]/15"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider text-[#7A7266]">
                <span className="bg-white px-3.5">or continue with</span>
              </div>
            </div>

            {/* Social Oauth Buttons */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleSocialSignIn("Google")}
                className="border-[#5A5146]/20 bg-white hover:bg-[#FAF6F0] text-[#8C4B3E] font-bold h-10 text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <GoogleIcon className="h-4 w-4" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleSocialSignIn("GitHub")}
                className="border-[#5A5146]/20 bg-white hover:bg-[#FAF6F0] text-[#8C4B3E] font-bold h-10 text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <GitHubIcon className="h-4 w-4 text-[#1F1D1A]" />
                GitHub
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center text-xs font-semibold text-[#7A7266]">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="text-[#1F1D1A] hover:text-[#C9A46A] transition-colors font-bold hover:underline"
              >
                Create client account
              </Link>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}