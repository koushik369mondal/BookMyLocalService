import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/logo";
import { UserAvatar } from "@/components/ui/avatar";
import {
  Phone,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  User,
  Briefcase,
} from "lucide-react";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role?.toLowerCase() || "customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await updateProfile({
        phone: phone.trim(),
        role,
      });

      setSuccessMsg("Profile completed successfully. Redirecting...");
      setIsSubmitting(false);

      setTimeout(() => {
        const userRole = result.user?.role?.toUpperCase() || role.toUpperCase();
        if (userRole === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (userRole === "PROVIDER") {
          navigate("/provider/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }, 800);
    } catch (err) {
      console.error("Complete profile error:", err);
      setErrorMsg(err.message || "Failed to update profile details.");
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="mb-6 flex justify-center">
          <Logo size={36} showText={true} />
        </div>

        <div className="max-w-md w-full card-chai p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Complete your profile
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Just one step left to activate your{" "}
              <span className="highlight">BookMyLocalService account</span>.
            </p>
          </div>

          {/* User Preview */}
          <div className="p-3.5 rounded-xl border border-border/70 bg-card/40 flex items-center gap-3">
            <UserAvatar user={user} className="size-10 rounded-full border border-border" />
            <div className="min-w-0 flex-1">
              <span className="font-display font-semibold text-xs text-foreground block truncate">
                {user?.fullName}
              </span>
              <span className="text-[11px] text-muted-foreground truncate block">
                {user?.email}
              </span>
            </div>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                Phone number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-9 border-border bg-card/40 text-xs rounded-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Account role
              </Label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    role === "customer"
                      ? "bg-card text-foreground border-border font-semibold"
                      : "bg-card/40 text-muted-foreground border-border/70 hover:text-foreground"
                  }`}
                >
                  <User className="size-3.5" />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("provider")}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    role === "provider"
                      ? "bg-card text-foreground border-border font-semibold"
                      : "bg-card/40 text-muted-foreground border-border/70 hover:text-foreground"
                  }`}
                >
                  <Briefcase className="size-3.5" />
                  <span>Provider</span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="solid"
              size="lg"
              className="w-full justify-center pt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving details...</span>
                </>
              ) : (
                <span>Complete profile</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
