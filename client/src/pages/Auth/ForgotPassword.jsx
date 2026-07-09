import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/logo";
import { 
  Mail, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  ShieldCheck,
  KeyRound
} from "lucide-react";

// Schema validation for email
const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" })
});

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Simulate API request call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Allow testing simulated failure if email contains "error"
    if (data.email.toLowerCase().includes("error")) {
      setErrorMsg("This email address is not registered in our system.");
      setIsSubmitting(false);
    } else {
      setSuccessMsg("Reset link dispatched! Please check your email inbox (and spam folder) for instructions.");
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] bg-slate-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Container box */}
        <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px] transition-all duration-300 hover:shadow-2xl">
          
          {/* LEFT PANEL: PLATFORM PRESENTATION BANNER (DESKTOP ONLY) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary via-secondary to-primary p-10 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
            
            {/* Mesh shapes and overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]"></div>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 shrink-0">
              <Logo size={36} showText={true} />
            </div>

            {/* Testimonials or Stats Info Block */}
            <div className="relative z-10 space-y-6 my-auto pt-10">
              <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-slate-300 border border-white/5 backdrop-blur-xs">
                <KeyRound className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                Account Security
              </span>
              <h2 className="text-3xl font-black leading-tight tracking-tight">
                Forgot Your Password?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                No worries! Simply enter your registered email address, and our secure authentication server will generate and send a temporary recovery link.
              </p>

              {/* Verified Features list */}
              <div className="space-y-3.5 pt-4">
                {[
                  "Secure, Single-Use Reset Token Links",
                  "Password Strength Helper Rules",
                  "24/7 Support for Account Retrieval"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support footer card */}
            <div className="relative z-10 bg-white/10 border border-white/5 rounded-2xl p-4 backdrop-blur-xs">
              <p className="text-[11px] text-slate-300 leading-relaxed">
                If you no longer have access to this email account, please contact our support desk directly at <span className="underline font-bold text-white">support@bookmylocalservice.com</span> to verify your identity manually.
              </p>
            </div>

          </div>

          {/* RIGHT PANEL: FORGOT PASSWORD FORM CARD */}
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white relative">
            
            {/* Brand logo on mobile */}
            <div className="lg:hidden mb-6 flex justify-center">
              <Logo size={32} showText={true} />
            </div>

            {/* Header */}
            <div className="space-y-2 mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recover Password</h1>
              <p className="text-sm text-slate-450 font-medium">Enter your email and we'll send a single-use recovery link</p>
            </div>

            {/* Error & Success Notices */}
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Email Address Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Registered Email Address</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-[50%] translate-y-[-50%] text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. name@example.com"
                    className={`pl-10 h-11 border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-xs bg-white ${
                      errors.email ? "border-rose-350 focus:ring-rose-500 focus:border-rose-550" : ""
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

              {/* Submit Reset Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-primary hover:bg-secondary text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Dispatching recovery link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center text-xs font-semibold">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary font-bold transition-all hover:-translate-x-0.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Sign In
              </Link>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}
