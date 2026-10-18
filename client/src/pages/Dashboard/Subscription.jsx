import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
  Loader2,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  ChevronDown,
  AlertCircle
} from "lucide-react";

const initialInvoices = [];

// FAQs list
const faqs = [
  { q: "How do I upgrade or downgrade my plan?", a: "You can modify your active plan at any time by selecting the corresponding plan button in the pricing table. Downgrades or upgrades apply immediately and balances adjust dynamically." },
  { q: "What happens if I cancel my subscription?", a: "If you cancel, you will maintain access to all active features until the end of your current billing period. No future charges will be billed." },
  { q: "What payout rate is charged on commissions?", a: "The Basic plan incurs a 5% platform handling rate. Pro and Premium subscriptions feature 0% handling rates on standard booking settlements." }
];

export default function Subscription() {
  const navigate = useNavigate();

  // Subscription states
  const [activePlan, setActivePlan] = useState("pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [renewalDate, setRenewalDate] = useState("2026-08-01");
  const [invoices, setInvoices] = useState(initialInvoices);

  // Dialog triggers
  const [selectedPlanToChange, setSelectedPlanToChange] = useState("");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // UI state notifications
  const [successMsg, setSuccessMsg] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // FAQ open state mapping
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [billingCycle]);

  // Plan Prices mapping (in ₹ INR)
  const getPlanPrice = (planKey) => {
    if (billingCycle === "monthly") {
      switch (planKey) {
        case "basic": return 0;
        case "pro": return 999;
        case "premium": return 2499;
        default: return 0;
      }
    } else {
      switch (planKey) {
        case "basic": return 0;
        case "pro": return 799;
        case "premium": return 1999;
        default: return 0;
      }
    }
  };

  const handlePlanChangeInitiate = (planKey) => {
    setSelectedPlanToChange(planKey);
    setIsPlanDialogOpen(true);
  };

  const handleConfirmPlanChange = () => {
    setIsActionLoading(true);
    setTimeout(() => {
      setActivePlan(selectedPlanToChange);
      setIsPlanDialogOpen(false);
      setIsActionLoading(false);

      if (selectedPlanToChange !== "basic") {
        const newPrice = getPlanPrice(selectedPlanToChange);
        const newInvoice = {
          id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toISOString().split("T")[0],
          plan: `${selectedPlanToChange.toUpperCase()} Plan (${billingCycle === "monthly" ? "Monthly" : "Yearly"})`,
          amount: newPrice,
          status: "success"
        };
        setInvoices([newInvoice, ...invoices]);
      }

      setSuccessMsg(`Your subscription has been updated to the ${selectedPlanToChange.toUpperCase()} Plan successfully.`);
      setTimeout(() => setSuccessMsg(""), 3500);
    }, 1200);
  };

  const handleConfirmCancel = () => {
    setIsActionLoading(true);
    setTimeout(() => {
      setActivePlan("none");
      setIsCancelDialogOpen(false);
      setIsActionLoading(false);

      setSuccessMsg("Your subscription has been cancelled. You can continue using your plan until the end of the current billing cycle.");
      setTimeout(() => setSuccessMsg(""), 3500);
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Subscription & membership</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Manage your provider membership tier, platform fees, and invoices</p>
          </div>

          <Link to="/provider/dashboard">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>

        {/* NOTIFICATION ALERTS */}
        {successMsg && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ACTIVE SUBSCRIPTION OVERVIEW CARD */}
        <div className="card-chai p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Badge variant="outline" className="border-white/20 text-white font-medium text-xs py-0.5 px-3">
                  Active membership
                </Badge>
                {activePlan === "pro" && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400">
                    <Sparkles className="h-3.5 w-3.5 fill-amber-400" /> Most popular
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">
                {activePlan === "basic" && "Basic Free Plan"}
                {activePlan === "pro" && "Pro Provider Plan"}
                {activePlan === "premium" && "Premium Agency Plan"}
                {activePlan === "none" && "No Active Subscription"}
              </h2>

              <p className="text-xs text-neutral-400 max-w-xl leading-relaxed font-normal">
                {activePlan === "basic" && "Standard local directory listing with 5% platform commission rate."}
                {activePlan === "pro" && "Enhanced priority placement in search results with 0% platform handling fees."}
                {activePlan === "premium" && "Full agency suite with unlimited listings, dedicated support, and top banner placement."}
                {activePlan === "none" && "Your subscription has expired or been cancelled."}
              </p>

              {activePlan !== "none" && (
                <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
                  <span>Current rate: <strong className="text-white font-mono">{formatPrice(getPlanPrice(activePlan))} / mo</strong></span>
                  <span>•</span>
                  <span>Next renewal: <strong className="text-neutral-300 font-mono">{renewalDate}</strong></span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
              {activePlan !== "none" && (
                <Button
                  onClick={() => setIsCancelDialogOpen(true)}
                  variant="outline"
                  className="border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs font-medium"
                >
                  Cancel subscription
                </Button>
              )}
            </div>

          </div>
        </div>

        {/* PRICING PLANS COMPARISON GRID */}
        <div className="space-y-6">

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4 card-chai p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Available membership plans</h3>
              <p className="text-xs text-neutral-400">Choose the ideal tier to grow your local service presence</p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-900/60 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-lg text-xs font-medium px-3 py-1.5 transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-neutral-950 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-lg text-xs font-medium px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white text-neutral-950 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Yearly billing
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Basic Plan */}
            <div className={`card-chai p-6 flex flex-col justify-between relative ${
              activePlan === "basic" ? "border-white/30" : ""
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-lg">Basic</h4>
                  {activePlan === "basic" && (
                    <Badge variant="outline" className="border-white/20 text-neutral-200 text-[10px]">Active</Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-white">{formatPrice(0)}</span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>

                <p className="text-xs text-neutral-400">Essential directory presence for new sole traders.</p>

                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Up to 3 active services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Standard search listing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Customer review management</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <X className="h-4 w-4 shrink-0" />
                    <span>5% handling commission</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <X className="h-4 w-4 shrink-0" />
                    <span>No banner priority</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {activePlan === "basic" ? (
                  <Button disabled variant="outline" className="w-full text-xs opacity-60">
                    Current plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePlanChangeInitiate("basic")}
                    variant="outline"
                    className="w-full text-xs"
                  >
                    Switch to Basic
                  </Button>
                )}
              </div>
            </div>

            {/* Pro Plan */}
            <div className={`card-chai p-6 flex flex-col justify-between relative ${
              activePlan === "pro" ? "border-white/40 ring-1 ring-white/20" : ""
            }`}>
              <div className="absolute -top-3 right-6 bg-white text-neutral-950 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most popular
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-lg">Pro Provider</h4>
                  {activePlan === "pro" && (
                    <Badge variant="outline" className="border-white/30 text-white text-[10px]">Active</Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-white">{formatPrice(getPlanPrice("pro"))}</span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>

                <p className="text-xs text-neutral-400">Ideal for established local professionals expanding their client base.</p>

                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Up to 10 active services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Priority search placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>0% commission handling rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Verified pro profile badge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Direct customer messaging</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {activePlan === "pro" ? (
                  <Button disabled variant="outline" className="w-full text-xs opacity-60">
                    Current plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePlanChangeInitiate("pro")}
                    variant="solid"
                    className="w-full text-xs"
                  >
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </div>

            {/* Premium Plan */}
            <div className={`card-chai p-6 flex flex-col justify-between relative ${
              activePlan === "premium" ? "border-white/30" : ""
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-lg">Premium Agency</h4>
                  {activePlan === "premium" && (
                    <Badge variant="outline" className="border-white/30 text-white text-[10px]">Active</Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-white">{formatPrice(getPlanPrice("premium"))}</span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>

                <p className="text-xs text-neutral-400">Complete agency suite for larger teams & high volume providers.</p>

                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Unlimited active services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Top banner featured listing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>0% commission handling rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Multi-staff account access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Dedicated 24/7 account manager</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {activePlan === "premium" ? (
                  <Button disabled variant="outline" className="w-full text-xs opacity-60">
                    Current plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePlanChangeInitiate("premium")}
                    variant="solid"
                    className="w-full text-xs"
                  >
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* INVOICE HISTORY TABLE */}
        <div className="card-chai p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">Billing & invoice statements</h3>
              <p className="text-xs text-neutral-400">Download receipts for tax & membership reporting</p>
            </div>
            <CreditCard className="h-5 w-5 text-neutral-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-semibold uppercase tracking-wider text-[9px] pb-2">
                  <th className="py-2.5 px-2">Invoice ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Plan</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-neutral-300">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No invoices recorded yet.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2 font-mono text-white">{inv.id}</td>
                      <td className="py-3 font-mono">{inv.date}</td>
                      <td className="py-3 font-medium text-white">{inv.plan}</td>
                      <td className="py-3 font-mono font-bold text-white">{formatPrice(inv.amount, { decimals: true })}</td>
                      <td className="py-3 text-right">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-medium rounded-lg text-[9px] px-2 py-0.5">
                          Paid
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQS ACCORDION */}
        <div className="card-chai p-6 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-neutral-400" />
            Membership FAQs
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-xs font-semibold text-white">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${openFaqIdx === idx ? "rotate-180" : ""}`} />
                </button>

                {openFaqIdx === idx && (
                  <div className="p-4 bg-white/[0.01] border-t border-white/5 text-xs text-neutral-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PLAN CHANGE MODAL */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="card-chai border-white/10 max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">Confirm plan change</DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Are you sure you want to change your membership to the <strong className="text-white">{selectedPlanToChange.toUpperCase()}</strong> plan?
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl text-xs space-y-2 my-2 text-neutral-300">
            <div className="flex justify-between">
              <span>New plan:</span>
              <strong className="text-white">{selectedPlanToChange.toUpperCase()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Billing cycle:</span>
              <strong className="text-white">{billingCycle === "monthly" ? "Monthly" : "Yearly"}</strong>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
              <span>New rate:</span>
              <span className="text-white font-mono">{formatPrice(getPlanPrice(selectedPlanToChange))} / mo</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPlanDialogOpen(false)}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPlanChange}
              disabled={isActionLoading}
              variant="solid"
              className="text-xs"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CANCEL SUBSCRIPTION MODAL */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="card-chai border-white/10 max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cancel subscription?
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Cancelling will downgrade your account to the basic tier at the end of your billing cycle on {renewalDate}.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              className="text-xs font-medium"
            >
              Keep my plan
            </Button>
            <Button
              onClick={handleConfirmCancel}
              disabled={isActionLoading}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-xs font-medium"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
