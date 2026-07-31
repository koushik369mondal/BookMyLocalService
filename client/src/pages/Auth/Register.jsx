import React, { useState, useEffect, useRef } from "react";
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
  Briefcase
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

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const googleBtnRef = useRef(null);

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
  const { registerSendOtp, googleLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam === "provider") {
      setValue("role", "provider");
    }
  }, [location.search, setValue]);

  const handleGoogleCallback = async (response) => {
    if (!response.credential) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("Authenticating with Google...");

    try {
      const data = await googleLogin(response.credential, selectedRole || "customer");
      setSuccessMsg("Registration with Google successful! Redirecting...");
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await registerSendOtp({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role
      });

      setSuccessMsg("Verification code sent! Redirecting to OTP validation page...");
      setIsSubmitting(false);
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: data.email,
            flow: "register",
            registerData: {
              fullName: data.fullName,
              email: data.email,
              phone: data.phone,
              role: data.role
            }
          }
        });
      }, 1200);
    } catch (err) {
      console.error("Register page error:", err);
      setErrorMsg(err.message || "Failed to send OTP. Please try again.");
      setIsSubmitting(false);
    }
  };

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
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">Join BookMyLocalService platform today</p>
          </div>

          {/* Error and Success Alerts */}
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

          {/* Role Switcher */}
          <div className="mb-6 space-y-1.5">
            <Label className="text-xs font-bold text-[#1F1D1A]">I want to register as:</Label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
              <button
                type="button"
                onClick={() => setValue("role", "customer")}
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
                onClick={() => setValue("role", "provider")}
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
                  <strong>Provider Onboarding:</strong> Showcase your service offerings, set availability, accept customer jobs, and track payments.
                </span>
              </div>
            )}
          </div>

          {/* Google Official Button Mount */}
          <div className="mb-6 flex flex-col items-center justify-center">
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
          </div>

          {/* OR Divider */}
          <div className="relative my-6 shrink-0">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DCC3]"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider text-[#7A7266]">
              <span className="bg-white px-3.5">or register with email</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-bold text-[#1F1D1A]">Full Name</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-[#8C4B3E]/60">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="fullName"
                  placeholder="e.g. Amanda Watson"
                  className={`pl-10 h-10 border-[#E8DCC3] focus:ring-2 focus:ring-[#8C4B3E] focus:border-[#8C4B3E] rounded-xl text-xs bg-[#FAF6F0]/30 ${errors.fullName ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
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
                <Label htmlFor="email" className="text-xs font-bold text-[#1F1D1A]">Email Address</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-[#8C4B3E]/60">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`pl-10 h-10 border-[#E8DCC3] focus:ring-2 focus:ring-[#8C4B3E] focus:border-[#8C4B3E] rounded-xl text-xs bg-[#FAF6F0]/30 ${errors.email ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
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
                <Label htmlFor="phone" className="text-xs font-bold text-[#1F1D1A]">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-[#8C4B3E]/60">
                    <Phone className="h-4 w-4" />
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    className={`pl-10 h-10 border-[#E8DCC3] focus:ring-2 focus:ring-[#8C4B3E] focus:border-[#8C4B3E] rounded-xl text-xs bg-[#FAF6F0]/30 ${errors.phone ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500" : ""
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

            {/* Terms and Conditions */}
            <div className="space-y-1 pt-1">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTermsValue}
                  onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
                  disabled={isSubmitting}
                  className="mt-0.5 border-[#8C4B3E] data-[state=checked]:bg-[#8C4B3E] data-[state=checked]:text-white"
                />
                <Label htmlFor="acceptTerms" className="text-xs font-medium text-[#5A5146] cursor-pointer leading-tight">
                  I agree to the{" "}
                  <Link to="#" className="text-[#8C4B3E] font-bold hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-[#8C4B3E] font-bold hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
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
                  Send Registration OTP
                  <ArrowRight className="h-4 w-4 text-white/70" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs font-semibold text-[#5A5146]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8C4B3E] hover:text-[#C9A46A] transition-colors font-bold hover:underline"
            >
              Login here
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
