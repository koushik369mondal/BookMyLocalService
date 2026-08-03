import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  ChevronDown,
  AlertCircle
} from "lucide-react";

// Mock Initial Payment Invoice history
const initialInvoices = [
  { id: "INV-90284", date: "2026-07-01", plan: "Pro Plan (Monthly)", amount: 999.00, status: "success" },
  { id: "INV-80392", date: "2026-06-01", plan: "Pro Plan (Monthly)", amount: 999.00, status: "success" },
  { id: "INV-70492", date: "2026-05-01", plan: "Pro Plan (Monthly)", amount: 999.00, status: "success" }
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

      setSuccessMsg(`Your subscription has been updated to the ${selectedPlanToChange.toUpperCase()} Plan successfully!`);
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
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">

        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Subscription & Membership</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Manage your provider membership tier, platform fees, and monthly invoices</p>
            </div>

            <Link to="/provider/dashboard">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] text-white border border-[#E8DCC3] rounded-xl text-xs font-bold px-5 h-9.5 shadow-2xs flex items-center gap-1.5 cursor-pointer">
                <ArrowLeft className="h-4 w-4 text-white" />
                Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* NOTIFICATION ALERTS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#2B522B]" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* ACTIVE SUBSCRIPTION OVERVIEW CARD */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 relative overflow-hidden">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Badge className="bg-[#F0E7D5] text-[#C9A46A] border border-[#E8DCC3] font-bold rounded-lg text-xs py-1 px-3">
                    Active Membership
                  </Badge>
                  {activePlan === "pro" && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8C4B3E]">
                      <Sparkles className="h-3.5 w-3.5 fill-[#8C4B3E]" /> Most Popular Tier
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-black text-[#1F1D1A] tracking-tight">
                  {activePlan === "basic" && "Basic Free Plan"}
                  {activePlan === "pro" && "Pro Provider Plan"}
                  {activePlan === "premium" && "Premium Agency Plan"}
                  {activePlan === "none" && "No Active Subscription"}
                </h2>

                <p className="text-xs text-[#5A5146] max-w-xl leading-relaxed font-medium">
                  {activePlan === "basic" && "Standard local directory listing with 5% platform commission rate."}
                  {activePlan === "pro" && "Enhanced priority placement in search results with 0% platform handling fees."}
                  {activePlan === "premium" && "Full agency suite with unlimited listings, dedicated support, and top banner placement."}
                  {activePlan === "none" && "Your subscription has expired or been cancelled."}
                </p>

                {activePlan !== "none" && (
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#7A7266] pt-1">
                    <span>Current Rate: <strong>{formatPrice(getPlanPrice(activePlan))} / mo</strong></span>
                    <span>•</span>
                    <span>Next Renewal: <strong>{renewalDate}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                {activePlan !== "none" && (
                  <Button
                    onClick={() => setIsCancelDialogOpen(true)}
                    variant="outline"
                    className="border-[#E8DCC3] hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl h-9.5 px-4 cursor-pointer"
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>

            </div>

          </Card>
        </section>

        {/* PRICING PLANS COMPARISON GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-[#E8DCC3]">
            <div>
              <h3 className="text-sm font-bold text-[#1F1D1A]">Available Membership Plans</h3>
              <p className="text-xs text-[#7A7266]">Choose the ideal tier to grow your local service presence</p>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF6F0] p-1 rounded-xl border border-[#E8DCC3]">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-lg text-xs font-bold px-3 py-1.5 transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#C9A46A] text-white shadow-2xs"
                    : "text-[#5A5146] hover:text-[#1F1D1A]"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-lg text-xs font-bold px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-[#C9A46A] text-white shadow-2xs"
                    : "text-[#5A5146] hover:text-[#1F1D1A]"
                }`}
              >
                Yearly Billing
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md uppercase font-extrabold">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Basic Plan */}
            <Card className={`border rounded-2xl p-6 bg-white flex flex-col justify-between relative transition-all ${
              activePlan === "basic" ? "border-[#C9A46A] ring-2 ring-[#C9A46A]/20" : "border-[#E8DCC3]"
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#1F1D1A] text-lg">Basic</h4>
                  {activePlan === "basic" && (
                    <Badge className="bg-[#FAF6F0] text-[#C9A46A] border border-[#E8DCC3] font-bold text-[10px]">Active</Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#1F1D1A]">{formatPrice(0)}</span>
                  <span className="text-xs text-[#7A7266] font-medium">/ month</span>
                </div>

                <p className="text-xs text-[#5A5146]">Essential local directory presence for new sole traders.</p>

                <div className="space-y-2.5 pt-4 border-t border-[#E8DCC3] text-xs text-[#5A5146]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Up to 3 Active Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Standard Search Listing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Customer Review Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <X className="h-4 w-4 shrink-0" />
                    <span>5% Handling Commission Fee</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <X className="h-4 w-4 shrink-0" />
                    <span>No Top Banner Priority</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {activePlan === "basic" ? (
                  <Button disabled className="w-full h-10 bg-[#FAF6F0] text-[#7A7266] border border-[#E8DCC3] font-bold text-xs rounded-xl">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePlanChangeInitiate("basic")}
                    variant="outline"
                    className="w-full h-10 border-[#E8DCC3] text-[#1F1D1A] font-bold text-xs rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                  >
                    Switch to Basic
                  </Button>
                )}
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className={`border rounded-2xl p-6 bg-white flex flex-col justify-between relative transition-all shadow-md ${
              activePlan === "pro" ? "border-[#C9A46A] ring-2 ring-[#C9A46A]/20" : "border-[#E8DCC3]"
            }`}>
              <div className="absolute -top-3 right-6 bg-[#C9A46A] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#1F1D1A] text-lg">Pro Provider</h4>
                  {activePlan === "pro" && (
                    <Badge className="bg-[#C9A46A] text-white font-bold text-[10px]">Active</Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#1F1D1A]">{formatPrice(getPlanPrice("pro"))}</span>
                  <span className="text-xs text-[#7A7266] font-medium">/ month</span>
                </div>

                <p className="text-xs text-[#5A5146]">Ideal for established local professionals expanding their client base.</p>

                <div className="space-y-2.5 pt-4 border-t border-[#E8DCC3] text-xs text-[#5A5146]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Up to 10 Active Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Priority Search Placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>0% Commission Handling Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Verified Pro Profile Badge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Direct Customer Messaging</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {activePlan === "pro" ? (
                  <Button disabled className="w-full h-10 bg-[#FAF6F0] text-[#7A7266] border border-[#E8DCC3] font-bold text-xs rounded-xl">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePlanChangeInitiate("pro")}
                    className="w-full h-10 bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
                  >
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className={`border rounded-2xl p-6 bg-white flex flex-col justify-between relative transition-all ${
              activePlan === "premium" ? "border-[#C9A46A] ring-2 ring-[#C9A46A]/20" : "border-[#E8DCC3]"
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#1F1D1A] text-lg">Premium Agency</h4>
                  {activePlan === "premium" && (
                    <Badge className="bg-[#C9A46A] text-white font-bold text-[10px]">Active</Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#1F1D1A]">{formatPrice(getPlanPrice("premium"))}</span>
                  <span className="text-xs text-[#7A7266] font-medium">/ month</span>
                </div>

                <p className="text-xs text-[#5A5146]">Complete agency suite for larger teams & high volume providers.</p>

                <div className="space-y-2.5 pt-4 border-t border-[#E8DCC3] text-xs text-[#5A5146]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Unlimited Active Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Top Banner Featured Listing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>0% Commission Handling Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Multi-Staff Account Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Dedicated 24/7 Account Manager</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {activePlan === "premium" ? (
                  <Button disabled className="w-full h-10 bg-[#FAF6F0] text-[#7A7266] border border-[#E8DCC3] font-bold text-xs rounded-xl">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePlanChangeInitiate("premium")}
                    className="w-full h-10 bg-[#1F1D1A] hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </Card>

          </div>
        </section>

        {/* INVOICE HISTORY TABLE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC3]">
              <div>
                <h3 className="text-base font-bold text-[#1F1D1A]">Billing & Invoice Statements</h3>
                <p className="text-xs text-[#7A7266]">Download receipts for tax & membership reporting</p>
              </div>
              <CreditCard className="h-5 w-5 text-[#C9A46A]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E8DCC3] text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
                    <th className="py-2.5 px-1">INVOICE ID</th>
                    <th className="py-2.5">DATE</th>
                    <th className="py-2.5">PLAN</th>
                    <th className="py-2.5">AMOUNT</th>
                    <th className="py-2.5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCC3] font-medium text-[#5A5146]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 px-1 font-bold text-[#1F1D1A]">{inv.id}</td>
                      <td className="py-3">{inv.date}</td>
                      <td className="py-3 font-semibold text-[#1F1D1A]">{inv.plan}</td>
                      <td className="py-3 font-bold text-[#1F1D1A]">{formatPrice(inv.amount, { decimals: true })}</td>
                      <td className="py-3 text-right">
                        <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 font-bold rounded-lg text-[9px] px-2 py-0.5">
                          PAID
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* FAQS ACCORDION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1F1D1A] border-b border-[#E8DCC3] pb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#C9A46A]" />
              Membership FAQs
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#E8DCC3] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="w-full p-4 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#1F1D1A]">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#7A7266] transition-transform ${openFaqIdx === idx ? "rotate-180" : ""}`} />
                  </button>

                  {openFaqIdx === idx && (
                    <div className="p-4 bg-white border-t border-[#E8DCC3] text-xs text-[#5A5146] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

      </div>

      {/* PLAN CHANGE MODAL */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="max-w-md bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1F1D1A]">Confirm Plan Change</DialogTitle>
            <DialogDescription className="text-xs text-[#7A7266]">
              Are you sure you want to change your membership to the <strong>{selectedPlanToChange.toUpperCase()}</strong> plan?
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-white border border-[#E8DCC3] rounded-xl text-xs space-y-2 my-2">
            <div className="flex justify-between">
              <span>New Plan:</span>
              <strong className="text-[#1F1D1A]">{selectedPlanToChange.toUpperCase()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Billing Cycle:</span>
              <strong className="text-[#1F1D1A]">{billingCycle === "monthly" ? "Monthly" : "Yearly"}</strong>
            </div>
            <div className="flex justify-between text-sm font-black pt-2 border-t border-[#E8DCC3]">
              <span>New Rate:</span>
              <span className="text-[#C9A46A]">{formatPrice(getPlanPrice(selectedPlanToChange))} / mo</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPlanDialogOpen(false)}
              className="h-9 px-4 border-[#E8DCC3] text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPlanChange}
              disabled={isActionLoading}
              className="h-9 px-5 bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs rounded-xl cursor-pointer shadow-2xs"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CANCEL SUBSCRIPTION MODAL */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7266]">
              Cancelling will downgrade your account to the basic tier at the end of your billing cycle on {renewalDate}.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              className="h-9 px-4 border-[#E8DCC3] text-xs font-bold rounded-xl cursor-pointer"
            >
              Keep My Plan
            </Button>
            <Button
              onClick={handleConfirmCancel}
              disabled={isActionLoading}
              className="h-9 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
