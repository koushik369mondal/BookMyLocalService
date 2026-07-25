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
        if (response.user?.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (response.user?.role === "PROVIDER") {
          navigate("/provider/dashboard");
        } else {
          navigate("/");
        }
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
      <div className="min-h-[85vh] bg-[#FAF6F0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">

        {/* Brand Logo */}
        <div className="mb-6 flex justify-center">
          <Logo size={42} showText={true} />
        </div>

        {/* Minimal Centered Card */}
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DCC3] shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">

          {/* Title Header */}
          <div className="space-y-1.5 mb-8 text-center">
            <h1 className="text-2xl font-black text-[#1F1D1A] tracking-tight">Verify your Email</h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-medium">
              We sent a 6-digit verification code to <br className="hidden sm:inline" />
              <strong className="text-[#1F1D1A] font-bold">{email}</strong>
            </p>
          </div>

          {/* OTP VERIFICATION FORM */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#1F1D1A] block text-center">
                Enter 6-Digit Verification Code
              </label>

              {/* 6 Digit Inputs */}
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
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
                    className="w-11 h-13 text-center text-xl font-bold border border-[#E8DCC3] rounded-xl bg-[#FAF6F0]/30 focus:ring-2 focus:ring-[#8C4B3E] focus:border-[#8C4B3E] outline-none transition-all shadow-2xs"
                    disabled={isSubmitting || isResending}
                  />
                ))}
              </div>

              <p className="text-[11px] text-[#5A5146] text-center">
                The code will expire in <span className="font-semibold text-[#8C4B3E]">5 minutes</span>.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isResending || otp.join("").length !== 6}
              className="w-full h-11 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Verifying code...
                </>
              ) : (
                <>
                  Verify & Sign In
                  <ArrowRight className="h-4 w-4 text-white/70" />
                </>
              )}
            </Button>
          </form>

          {/* RESEND SECTION */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white rounded-xl shadow-2xs text-[#8C4B3E]">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <span className="block text-xs font-bold text-[#1F1D1A]">Didn't receive code?</span>
                <span className="text-[10px] text-[#5A5146] font-medium">Check spam folder or retry</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={!canResend || isResending || isSubmitting}
              className={`h-9 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs border-[#E8DCC3] bg-white shrink-0 ${canResend ? "text-[#8C4B3E] hover:bg-[#FAF6F0] cursor-pointer" : "text-[#7A7266]"
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
                  {canResend ? "Resend Code" : `Resend in ${timer}s`}
                </>
              )}
            </Button>
          </div>

          {/* Back to Login Link */}
          <div className="mt-8 text-center text-xs font-semibold text-[#5A5146]">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#8C4B3E] hover:text-[#C9A46A] transition-colors font-bold hover:underline cursor-pointer"
            >
              Back to email entry
            </button>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}
