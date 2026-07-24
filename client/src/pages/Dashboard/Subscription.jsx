import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  X,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowLeft,
  HelpCircle,
  Info,
  Sparkles,
  ChevronDown,
  AlertCircle
} from "lucide-react";

// Mock Initial Payment Invoice history
const initialInvoices = [
  { id: "INV-90284", date: "2026-07-01", plan: "Pro Plan (Monthly)", amount: 29.00, status: "success" },
  { id: "INV-80392", date: "2026-06-01", plan: "Pro Plan (Monthly)", amount: 29.00, status: "success" },
  { id: "INV-70492", date: "2026-05-01", plan: "Pro Plan (Monthly)", amount: 29.00, status: "success" }
];

// Mock FAQs list
const faqs = [
  { q: "How do I upgrade or downgrade my plan?", a: "You can modify your active plan at any time by clicking the corresponding plan button in the pricing table. Downgrades or upgrades apply immediately and balances adjust dynamically." },
  { q: "What happens if I cancel my subscription?", a: "If you cancel, you will maintain access to all active features until the end of your current billing period. No future charges will be billed." },
  { q: "What payout rate is charged on commissions?", a: "The Basic plan incurs a 5% platform handling rate. Pro and Premium subscriptions feature 0% handling rates on standard booking settlements." }
];

export default function Subscription() {
  const navigate = useNavigate();

  // Subscription states
  const [activePlan, setActivePlan] = useState("pro"); // "basic", "pro", "premium", "none" (cancelled)
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "yearly"
  const [renewalDate, setRenewalDate] = useState("2026-08-01");
  const [invoices, setInvoices] = useState(initialInvoices);

  // Dialog triggers
  const [selectedPlanToChange, setSelectedPlanToChange] = useState("");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // UI state notifications
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // FAQ open state mapping
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Shimmer skeleton simulator
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [billingCycle]);

  // Plan Prices mapping (yearly has 20% discount computed)
  const getPlanPrice = (planKey) => {
    if (billingCycle === "monthly") {
      switch (planKey) {
        case "basic": return 0;
        case "pro": return 29;
        case "premium": return 79;
        default: return 0;
      }
    } else {
      switch (planKey) {
        case "basic": return 0;
        case "pro": return 23; // ~20% off
        case "premium": return 63; // ~20% off
        default: return 0;
      }
    }
  };

  // Change active plan (upgrade/downgrade)
  const triggerPlanChange = (planKey) => {
    if (activePlan === planKey) return;
    setSelectedPlanToChange(planKey);
    setIsPlanDialogOpen(true);
  };

  const executePlanChange = async () => {
    setIsActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsActionLoading(false);
    setIsPlanDialogOpen(false);

    setActivePlan(selectedPlanToChange);
    setRenewalDate("2026-08-01");

    // Add mock invoice record
    const amountVal = getPlanPrice(selectedPlanToChange);
    if (amountVal > 0) {
      const newInv = {
        id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().split("T")[0],
        plan: `${selectedPlanToChange.toUpperCase()} Plan (${billingCycle === "monthly" ? "Monthly" : "Yearly"})`,
        amount: billingCycle === "monthly" ? amountVal : amountVal * 12,
        status: "success"
      };
      setInvoices([newInv, ...invoices]);
    }

    setSuccessMsg(`Plan successfully updated to ${selectedPlanToChange.toUpperCase()}!`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Cancel subscription logic
  const executeCancellation = async () => {
    setIsActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsActionLoading(false);
    setIsCancelDialogOpen(false);

    setActivePlan("none");
    setSuccessMsg("Subscription cancelled. Benefits will expire on renewal date.");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Detailed features comparison matrix checklist
  const featuresMatrix = [
    { label: "Active Services Listings", basic: "Up to 3", pro: "Unlimited", premium: "Unlimited" },
    { label: "Platform Handling Commissions", basic: "5% per job", pro: "0%", premium: "0%" },
    { label: "Verified Dispatch Trust Badge", basic: false, pro: true, premium: true },
    { label: "Customer Analytics Logs", basic: false, pro: true, premium: true },
    { label: "Search Results Visibility Priority", basic: "Standard", pro: "High", premium: "Maximum" },
    { label: "Custom Ad Promotion Banners", basic: false, pro: false, premium: true },
    { label: "Support Resolution Channel", basic: "Email", pro: "Priority Email/Chat", premium: "Dedicated Manager" }
  ];

  return (
    <DashboardLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">

        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Billing & Subscriptions</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Verify your active plan tier, pricing schedules, features, or print invoices</p>
            </div>

            {/* Quick dashboard back button */}
            <Link to="/provider/dashboard">
              <Button size="sm" className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-5 h-9.5 backdrop-blur-xs">
                <ArrowLeft className="h-4 w-4 text-white/60 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ACTIVE PLAN TIER CARD OVERVIEW */}
          <Card className="border border-slate-100 shadow-md bg-white rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl shrink-0 mt-0.5">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Plan Tier</span>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-xl font-black text-slate-900 capitalize">
                      {activePlan === "none" ? "No Active Subscription" : `${activePlan} Plan`}
                    </h2>
                    {activePlan !== "none" && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[9px] py-0.5 px-2 border-0">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-450 mt-1.5 font-medium leading-relaxed">
                    {activePlan === "none"
                      ? "Your subscription is cancelled. Access to premium dispatcher listings expires soon."
                      : `Your plan renews automatically on ${renewalDate} at $${getPlanPrice(activePlan)}/${billingCycle === "monthly" ? "month" : "month billed annually"}.`
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t border-slate-100 md:border-0 pt-4 md:pt-0">
                {activePlan !== "none" && activePlan !== "basic" && (
                  <Button
                    onClick={() => setIsCancelDialogOpen(true)}
                    variant="outline"
                    className="w-full md:w-auto border-rose-200 hover:bg-rose-50 text-rose-600 font-bold h-10 text-xs rounded-xl"
                  >
                    Cancel Subscription
                  </Button>
                )}
                {activePlan === "none" && (
                  <Button
                    onClick={() => triggerPlanChange("pro")}
                    className="w-full md:w-auto bg-slate-900 hover:bg-slate-900 text-white font-bold h-10 text-xs rounded-xl shadow-md"
                  >
                    Re-Activate Pro Plan
                  </Button>
                )}
              </div>

            </div>
          </Card>

          {/* BILLING TOGGLE AND PRICING CARDS */}
          <div className="space-y-6">

            {/* Monthly/Yearly toggle */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Choose your billing cycle</span>
              <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-xl h-10 w-60">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`flex-1 rounded-lg text-xs font-bold transition-all ${billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={`flex-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${billingCycle === "yearly"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Yearly
                  <Badge className="bg-emerald-500 text-white text-[8px] px-1 py-0 border-0">-20%</Badge>
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* BASIC PLAN */}
              <Card className={`border rounded-3xl p-6 relative flex flex-col justify-between ${activePlan === "basic"
                ? "bg-white border-slate-900 shadow-lg ring-1 ring-slate-900"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs transition-all"
                }`}>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Standard</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">Basic Plan</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-950">$0</span>
                    <span className="text-xs text-slate-400 font-bold">/month</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Perfect for new providers getting started locally.
                  </p>

                  <hr className="border-slate-100" />

                  {/* Highlights */}
                  <div className="space-y-2.5">
                    {[
                      "Up to 3 Active Listings",
                      "5% Platform Commissions Rate",
                      "Standard Search Results placement",
                      "Email support logs"
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50">
                  <Button
                    onClick={() => triggerPlanChange("basic")}
                    disabled={activePlan === "basic"}
                    variant={activePlan === "basic" ? "default" : "outline"}
                    className="w-full h-10 font-bold text-xs rounded-xl border-slate-200 hover:bg-slate-50"
                  >
                    {activePlan === "basic" ? "Active Plan" : "Downgrade to Basic"}
                  </Button>
                </div>
              </Card>

              {/* PRO PLAN (RECOMMENDED) */}
              <Card className={`border rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden ${activePlan === "pro"
                ? "bg-white border-slate-900 shadow-lg ring-1 ring-slate-900"
                : "bg-white border-slate-200 hover:border-slate-400 shadow-md transition-all"
                }`}>
                {/* Popular Badge */}
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-[9px] font-black tracking-wider uppercase px-4 py-1.5 rounded-bl-2xl">
                  Popular
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">Scale</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">Pro Plan</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-950">${getPlanPrice("pro")}</span>
                    <span className="text-xs text-slate-400 font-bold">/month</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Boost listing exposures and eliminate commission handling rates.
                  </p>

                  <hr className="border-slate-100" />

                  {/* Highlights */}
                  <div className="space-y-2.5">
                    {[
                      "Unlimited Service Listings",
                      "0% Handling rate commissions",
                      "Verified Trust Badge status",
                      "High search visibility placement",
                      "Customer analytics logs",
                      "Priority Email/Chat support"
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50">
                  <Button
                    onClick={() => triggerPlanChange("pro")}
                    disabled={activePlan === "pro"}
                    className="w-full h-10 bg-slate-900 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    {activePlan === "pro" ? "Active Plan" : (activePlan === "basic" ? "Upgrade to Pro" : "Downgrade to Pro")}
                  </Button>
                </div>
              </Card>

              {/* PREMIUM PLAN */}
              <Card className={`border rounded-3xl p-6 relative flex flex-col justify-between ${activePlan === "premium"
                ? "bg-white border-slate-900 shadow-lg ring-1 ring-slate-900"
                : "bg-white border-slate-200 hover:border-slate-400 shadow-xs transition-all"
                }`}>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Enterprise</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">Premium Plan</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-950">${getPlanPrice("premium")}</span>
                    <span className="text-xs text-slate-400 font-bold">/month</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Maximum exposure with custom promotion overlays.
                  </p>

                  <hr className="border-slate-100" />

                  {/* Highlights */}
                  <div className="space-y-2.5">
                    {[
                      "Unlimited Service Listings",
                      "0% platform commissions",
                      "Verified Trust Badge status",
                      "Maximum search priority rank",
                      "Custom promotion banners active",
                      "Dedicated Support Manager"
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50">
                  <Button
                    onClick={() => triggerPlanChange("premium")}
                    disabled={activePlan === "premium"}
                    variant={activePlan === "premium" ? "default" : "outline"}
                    className="w-full h-10 font-bold text-xs rounded-xl border-slate-200 hover:bg-slate-50"
                  >
                    {activePlan === "premium" ? "Active Plan" : "Upgrade to Premium"}
                  </Button>
                </div>
              </Card>

            </div>

          </div>

          {/* FEATURE COMPARISON MATRIX TABLE */}
          <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 overflow-hidden">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Features Comparison Matrix</span>

            <div className="overflow-x-auto pt-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-450 font-bold text-[9px] uppercase tracking-wider">
                    <th className="py-2.5">Core Features</th>
                    <th className="py-2.5">Basic Plan</th>
                    <th className="py-2.5 text-slate-900">Pro Plan</th>
                    <th className="py-2.5">Premium Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {featuresMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800">{row.label}</td>
                      <td className="py-3.5">
                        {typeof row.basic === "boolean"
                          ? (row.basic ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-slate-300" />)
                          : row.basic
                        }
                      </td>
                      <td className="py-3.5 text-slate-900">
                        {typeof row.pro === "boolean"
                          ? (row.pro ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-slate-300" />)
                          : row.pro
                        }
                      </td>
                      <td className="py-3.5">
                        {typeof row.premium === "boolean"
                          ? (row.premium ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-slate-300" />)
                          : row.premium
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* LOWER GRID: INVOICES & FAQS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* PAYMENT INVOICES */}
            <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Billing History</span>

              <div className="space-y-3">
                {invoices.map(inv => (
                  <div key={inv.id} className="p-3.5 border border-slate-200 rounded-xl bg-white shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ref ID: {inv.id}</span>
                        <Badge variant="success" className="bg-emerald-500 border-0 text-white font-bold rounded-lg text-[8px] py-0 px-1 leading-none uppercase">Settled</Badge>
                      </div>
                      <h5 className="font-extrabold text-slate-800 text-xs mt-1 truncate max-w-[200px]">{inv.plan}</h5>
                      <span className="text-[9px] text-slate-400 font-semibold block">{inv.date}</span>
                    </div>

                    <span className="font-black text-slate-950 text-sm shrink-0">${inv.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* FAQS SECTION */}
            <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Frequently Asked Questions</span>

              <div className="space-y-3.5">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-3.5 text-left font-extrabold text-xs text-slate-800 hover:text-slate-900 transition-colors bg-slate-50/50"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="h-4.5 w-4.5 text-slate-900" />
                          {faq.q}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <p className="p-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed font-semibold bg-white animate-fade-in">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>

        </div>
      </div>

      {/* DIALOG 1: PLAN UPGRADE/DOWNGRADE CONFIRMATION */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-white" />
              Confirm Plan Switch
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 pt-0.5">
              Confirm your switch to the selected billing tier
            </DialogDescription>
          </DialogHeader>

          {selectedPlanToChange && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Change Details</span>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">New Target Plan:</span>
                <span className="text-slate-800 uppercase">{selectedPlanToChange} Plan</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="text-slate-800 uppercase">{billingCycle}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold border-t border-slate-200 pt-2 mt-1">
                <span className="text-slate-550">Rate Charged:</span>
                <span className="text-slate-900 text-sm font-black">${getPlanPrice(selectedPlanToChange)}/mo</span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPlanDialogOpen(false)}
              className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={executePlanChange}
              disabled={isActionLoading}
              className="rounded-xl bg-slate-900 hover:bg-slate-900 text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Updating...
                </>
              ) : (
                <>
                  Confirm Switch
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: CANCELLATION WARNING DIALOG */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600 animate-pulse" />
              Cancel Active Subscription
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 pt-0.5">
              Confirming cancellation will downgrade your account at the end of the active billing cycle.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4.5 bg-rose-50 border border-rose-100 rounded-xl space-y-2 text-rose-800 text-xs">
            <h4 className="font-bold text-xs flex items-center gap-1">
              <Info className="h-4 w-4 text-rose-600" />
              What will change:
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-semibold">
              <li>0% Handling Commissions rate will revert to 5%.</li>
              <li>Verified Specialist trust badge status will expire.</li>
              <li>Listing search placements priority rank will lower to Standard.</li>
            </ul>
          </div>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
            >
              Close Dialog
            </Button>
            <Button
              type="button"
              onClick={executeCancellation}
              disabled={isActionLoading}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto flex items-center justify-center gap-1"
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Cancelling...
                </>
              ) : (
                <>
                  Confirm Cancellation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}


