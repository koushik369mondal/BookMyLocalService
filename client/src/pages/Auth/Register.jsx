import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Mail,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Phone,
  User,
  Sparkles,
  ShieldCheck,
  Briefcase,
  UserCheck
} from "lucide-react";

// Registration form schema validation
const registerSchema = z.object({
  fullName: z.string()
    .min(2, { message: "Full Name must be at least 2 characters" })
    .max(50, { message: "Full Name must be under 50 characters" }),
  email: z.string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z.string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {
      message: "Please enter a valid 10-digit phone number"
    }),
  role: z.enum(["customer", "provider"], {
    errorMap: () => ({ message: "Please select a role" })
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

// Custom high-fidelity brand SVGs for social options
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

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: location.state?.email || "",
      phone: "",
      role: "customer",
      acceptTerms: false
    }
  });

  const selectedRole = watch("role");
  const acceptTermsValue = watch("acceptTerms");

  const { registerSendOtp } = useAuth();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const registerData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role
      };
      await registerSendOtp(registerData);
      setSuccessMsg("Verification code sent! Redirecting to OTP validation page...");
      setIsSubmitting(false);
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: data.email,
            flow: "register",
            registerData
          }
        });
      }, 1200);
    } catch (err) {
      console.error("Register page error:", err);
      setErrorMsg(err.message || "Registration failed. Email or phone number might already be registered.");
      setIsSubmitting(false);
    }
  };

  const handleSocialSignUp = (provider) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Simulate social sign-up OAuth flow
    setTimeout(() => {
      setSuccessMsg(`Creating account with ${provider}... Please wait.`);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg("");
        navigate("/");
      }, 1500);
    }, 800);
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-slate-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">

        {/* Container box */}
        <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px] transition-all duration-300 hover:shadow-2xl">

          {/* LEFT PANEL: PLATFORM PRESENTATION BANNER (DESKTOP ONLY) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">

            {/* Mesh shapes and overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]"></div>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

            <div className="relative z-10 shrink-0">
              <Logo size={36} showText={true} />
            </div>

            {/* Benefit statements block matching the active role tab */}
            <div className="relative z-10 space-y-6 my-auto pt-8">
              <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-slate-300 border border-white/5 backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Join the Platform
              </span>

              {selectedRole === "customer" ? (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-3xl font-black leading-tight tracking-tight">
                    Get Things Done with Verified Experts.
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Create a free account to compare reviews, book appointments instantly, and manage transactions securely.
                  </p>

                  <div className="space-y-3.5 pt-4">
                    {[
                      "Over 120+ Service Specialties",
                      "Verified Service Guarantee",
                      "Easy Booking Calendar & Schedule Slots"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                        <UserCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-3xl font-black leading-tight tracking-tight">
                    Grow Your Service Business.
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Register as a service provider to list your specialties, accept online bookings, structure pricing tiers, and find local customers.
                  </p>

                  <div className="space-y-3.5 pt-4">
                    {[
                      "Zero Registration Setup Fees",
                      "Keep 100% of Your Standard Rates",
                      "Interactive Provider Dashboard Included"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                        <Briefcase className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="relative z-10 bg-white/10 border border-white/5 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">Identity Safety</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All data transfers are protected under 256-bit encryption protocols. We never share your personal information with unverified third parties.
              </p>
            </div>

          </div>

          {/* RIGHT PANEL: REGISTRATION FORM CARD */}
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white relative">

            {/* Brand logo on mobile */}
            <div className="lg:hidden mb-6 flex justify-center">
              <Logo size={32} showText={true} />
            </div>

            <div className="space-y-2 mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create your account using Email OTP</h1>
              <p className="text-sm text-slate-450 font-medium">Join BookMyLocalService to manage your bookings</p>
            </div>

            {/* Error & Success Notice Banners */}
            {errorMsg && (
              <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">

              {/* Role Switcher Tabs */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">I want to register as a:</Label>
                <div className="grid grid-cols-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl h-12">
                  <button
                    type="button"
                    onClick={() => setValue("role", "customer")}
                    disabled={isSubmitting}
                    className={`rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${selectedRole === "customer"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    Customer / Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("role", "provider")}
                    disabled={isSubmitting}
                    className={`rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${selectedRole === "provider"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    Service Provider
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Full Name</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="fullName"
                    placeholder="e.g. Amanda Watson"
                    className={`pl-10 h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 rounded-xl text-xs bg-white ${errors.fullName ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
                      }`}
                    disabled={isSubmitting}
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <ShieldAlert className="h-3 w-3" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Email address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`pl-10 h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 rounded-xl text-xs bg-white ${errors.email ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
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

                {/* Phone number */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input
                      id="phone"
                      placeholder="123-456-7890"
                      className={`pl-10 h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 rounded-xl text-xs bg-white ${errors.phone ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
                        }`}
                      disabled={isSubmitting}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                      <ShieldAlert className="h-3 w-3" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

              </div>

              {/* Accept Terms Checkbox */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-start space-x-2.5">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTermsValue}
                    onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
                    disabled={isSubmitting}
                    className="rounded-md border-slate-300 bg-white mt-0.5"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-xs font-semibold text-slate-550 leading-relaxed cursor-pointer select-none"
                  >
                    I agree to the BookMyLocalService{" "}
                    <Link to="/terms" className="text-slate-900 hover:text-amber-500 hover:underline">Terms of Service</Link> and{" "}
                    <Link to="/privacy" className="text-slate-900 hover:text-amber-500 hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <ShieldAlert className="h-3 w-3" />
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              {/* Register Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-slate-900 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Sending verification code...
                  </>
                ) : (
                  <>
                    Continue with Email OTP
                    <ArrowRight className="h-4 w-4 text-white/60" />
                  </>
                )}
              </Button>
            </form>

            {/* Continue with divider */}
            <div className="relative my-6 shrink-0">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="bg-white px-3.5">or continue with</span>
              </div>
            </div>

            {/* Social oauth buttons */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleSocialSignUp("Google")}
                className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold h-10 text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <GoogleIcon className="h-4 w-4" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleSocialSignUp("GitHub")}
                className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold h-10 text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <GitHubIcon className="h-4 w-4 text-slate-900" />
                GitHub
              </Button>
            </div>

            {/* Redirect to login */}
            <div className="mt-8 text-center text-xs font-semibold text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-slate-900 hover:text-amber-500 transition-colors font-bold hover:underline"
              >
                Sign In
              </Link>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}
