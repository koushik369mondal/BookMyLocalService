import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Check, ShieldAlert, Loader2 } from "lucide-react";

export default function ChooseAccountType() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [googleAccount, setGoogleAccount] = useState(null);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("pendingGoogleAccount");
    if (saved) {
      try {
        setGoogleAccount(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse pending Google account:", e);
      }
    }
  }, []);

  const handleCreateAccount = async () => {
    if (!googleAccount || !googleAccount.credential) {
      setErrorMsg("Google session expired. Please return to login page.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const data = await googleLogin(googleAccount.credential, selectedRole);
      sessionStorage.removeItem("pendingGoogleAccount");

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
    } catch (err) {
      console.error("Account creation error:", err);
      setErrorMsg(err.message || "Failed to create account. Please try again.");
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
              Select your account role
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Choose how you will be using{" "}
              <span className="highlight">BookMyLocalService</span>.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
              <ShieldAlert className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <div
              onClick={() => setSelectedRole("customer")}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === "customer"
                  ? "bg-card border-border ring-1 ring-border"
                  : "bg-card/40 border-border/70 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg border border-border bg-card flex items-center justify-center text-foreground">
                  <User className="size-4" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground">
                    Customer
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    I want to book local services
                  </p>
                </div>
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

            <div
              onClick={() => setSelectedRole("provider")}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === "provider"
                  ? "bg-card border-border ring-1 ring-border"
                  : "bg-card/40 border-border/70 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg border border-border bg-card flex items-center justify-center text-foreground">
                  <Briefcase className="size-4" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground">
                    Service provider
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    I want to offer my services and earn
                  </p>
                </div>
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
          </div>

          <Button
            onClick={handleCreateAccount}
            disabled={isSubmitting}
            variant="solid"
            size="lg"
            className="w-full justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Continue to dashboard</span>
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
