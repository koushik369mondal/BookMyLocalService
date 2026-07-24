import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  ShieldAlert,
  Loader2,
  Sparkles,
  ShieldCheck,
  RotateCw,
  Mail
} from "lucide-react";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();

  // Retrieve email, flow, and registration data passed from parent pages
  const email = location.state?.email || "";
  const flow = location.state?.flow || "login";
  const registerData = location.state?.registerData || null;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Timer states (60 seconds countdown)
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Redirect if no email is provided in state
  useEffect(() => {
    if (!email) {
      toast.error("Invalid session. Please enter your email first.");
      navigate("/login");
    }
  }, [email, navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      setCanResend(false);
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle value change in inputs
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    // Take the last character typed
    newOtp[index] = value[value.length - 1];
    setOtp(newOtp);

    // Focus on the next input if value is entered
    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace and cursor movement
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        // If current box is empty, focus previous box and delete its content
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        // Just delete current box content
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste support
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");

    if (pasteData.length === 6) {
      const pasteOtp = pasteData.split("");
      setOtp(pasteOtp);
      // Focus on the last input
      inputRefs.current[5].focus();
    } else if (pasteData.length > 0) {
      // Partially fill OTP inputs
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pasteData.length, 6); i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const targetFocusIndex = Math.min(pasteData.length, 5);
      inputRefs.current[targetFocusIndex].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOtp(email, otpString, flow);
      if (response.success) {
        toast.success(flow === "register" ? "Account created and logged in successfully!" : "Logged in successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      const response = await resendOtp(email, flow, registerData);
      if (response.success) {
        toast.success("A new verification code has been sent to your email.");
        setTimer(60); // Reset timer
        setOtp(["", "", "", "", "", ""]); // Clear inputs
        inputRefs.current[0].focus(); // Autofocus first input
      }
    } catch (err) {
      console.error("OTP resend error:", err);
      toast.error(err.message || "Failed to resend verification code. Please try again later.");
    } finally {
      setIsResending(false);
    }
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

            {/* Stats Info Block */}
            <div className="relative z-10 space-y-6 my-auto pt-10">
              <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-[#7A7266] border border-white/5 backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Verified Local Pros
              </span>
              <h2 className="text-3xl font-black leading-tight tracking-tight">
                Secure & Fast Access.
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
              <h1 className="text-2xl font-black text-[#1F1D1A] tracking-tight">Verify your Email</h1>
              <p className="text-sm text-[#7A7266] font-medium">
                We sent a 6-digit verification code to <strong className="text-[#1F1D1A]">{email}</strong>.
              </p>
            </div>

            {/* OTP VERIFICATION FORM */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#B2563B] block text-center lg:text-left">
                  Enter 6-Digit OTP Code
                </label>

                {/* 6 Digit Inputs */}
                <div className="flex justify-between gap-2 max-w-sm mx-auto lg:mx-0">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      value={data}
                      className="w-12 h-14 text-center text-xl font-bold border border-[#5A5146]/20 rounded-xl bg-white focus:ring-2 focus:ring-violet-950 focus:border-violet-950 outline-none transition-all shadow-sm"
                      disabled={isSubmitting || isResending}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-[#7A7266] text-center lg:text-left">
                  The code will expire in <span className="font-semibold text-[#B2563B]">5 minutes</span>.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isResending || otp.join("").length !== 6}
                className="w-full h-11 bg-[#B2563B] hover:bg-[#7C8A6B] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Verifying code...
                  </>
                ) : (
                  <>
                    Verify & Sign In
                    <ArrowRight className="h-4 w-4 text-white/60" />
                  </>
                )}
              </Button>
            </form>

            {/* RESEND SECTION */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 bg-[#FAF6F0] border border-[#5A5146]/15 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-white rounded-xl shadow-2xs text-[#7A7266]">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <div>
                  <span className="block text-xs font-bold text-[#B2563B]">Didn't receive the email?</span>
                  <span className="text-[10px] text-[#7A7266] font-medium">Check your spam folder or try again.</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={!canResend || isResending || isSubmitting}
                className={`h-9 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs border-[#5A5146]/20 bg-white ${canResend ? "text-[#1F1D1A] hover:bg-[#FAF6F0] cursor-pointer" : "text-[#7A7266]"
                  }`}
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RotateCw className="h-3.5 w-3.5" />
                    {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                  </>
                )}
              </Button>
            </div>

            {/* Back to Login Link */}
            <div className="mt-8 text-center text-xs font-semibold text-[#7A7266]">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#1F1D1A] hover:text-[#C9A46A] transition-colors font-bold hover:underline"
              >
                Back to email entry
              </button>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}
