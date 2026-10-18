import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { couponService } from "@/services/couponService";
import { formatPrice } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tag,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ShieldAlert,
  Percent,
  DollarSign,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  X,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "FIXED",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: ""
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchCoupons = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await couponService.getAllCoupons({ search: searchQuery });
      if (response.success && response.data) {
        setCoupons(response.data);
      } else {
        setError(response.message || "Failed to load coupons.");
      }
    } catch (err) {
      console.error("Fetch coupons error:", err);
      setError(err.message || "Failed to fetch coupons from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [searchQuery]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await couponService.toggleCouponStatus(id);
      if (response.success) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
        );
        setSuccessMsg(response.message || "Coupon status updated.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Toggle coupon status error:", err);
      setError(err.message || "Failed to update status.");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const response = await couponService.deleteCoupon(id);
      if (response.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        setSuccessMsg("Coupon deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Delete coupon error:", err);
      setError(err.message || "Failed to delete coupon.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "code") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.code.trim()) {
      setModalError("Coupon code is required.");
      return;
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      setModalError("Discount value must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await couponService.createCoupon(formData);
      if (response.success && response.data) {
        setCoupons((prev) => [response.data, ...prev]);
        setSuccessMsg(`Coupon '${response.data.code}' created successfully!`);
        setTimeout(() => setSuccessMsg(""), 3000);
        setIsModalOpen(false);
        setFormData({
          code: "",
          description: "",
          discountType: "FIXED",
          discountValue: "",
          minOrderAmount: "0",
          maxDiscount: "",
          usageLimit: "",
          expiresAt: ""
        });
      } else {
        setModalError(response.message || "Failed to create coupon.");
      }
    } catch (err) {
      console.error("Create coupon error:", err);
      setModalError(err.response?.data?.message || err.message || "Server error while creating coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const fixedCoupons = coupons.filter((c) => c.discountType === "FIXED").length;
  const percentageCoupons = coupons.filter((c) => c.discountType === "PERCENTAGE").length;

  return (
    <DashboardLayout>
      <div className="bg-[#0a0a0a] min-h-screen pb-16 font-sans text-neutral-100">
        
        {/* HEADER */}
        <section className="bg-neutral-900/40 border-b border-white/10 py-8">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 transition-colors mb-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to admin dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Coupon and promo code directory
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm font-medium">
                Create, manage, and configure promotional discount coupons for customer bookings
              </p>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              variant="solid"
              className="text-xs font-medium px-4 h-10 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Create new coupon
            </Button>
          </div>
        </section>

        {/* METRICS STATS CARDS */}
        <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 -mt-5 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="card-chai p-4 flex items-center justify-between gap-3.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Total coupons</span>
                <span className="text-xl font-bold text-white">{totalCoupons}</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/10 text-neutral-300 rounded-xl shrink-0">
                <Tag className="h-5 w-5" />
              </div>
            </div>

            <div className="card-chai p-4 flex items-center justify-between gap-3.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Active coupons</span>
                <span className="text-xl font-bold text-emerald-400">{activeCoupons}</span>
              </div>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="card-chai p-4 flex items-center justify-between gap-3.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Flat amount off</span>
                <span className="text-xl font-bold text-white">{fixedCoupons}</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/10 text-neutral-300 rounded-xl shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            <div className="card-chai p-4 flex items-center justify-between gap-3.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Percentage off</span>
                <span className="text-xl font-bold text-white">{percentageCoupons}</span>
              </div>
              <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl shrink-0">
                <Percent className="h-5 w-5" />
              </div>
            </div>

          </div>
        </section>

        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6">
          
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* SEARCH BAR */}
          <div className="card-chai p-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code or description..."
                className="pl-10 h-10 border-white/10 text-xs rounded-xl bg-white/[0.03] font-medium text-neutral-200 placeholder:text-neutral-500 focus:border-white/20"
              />
            </div>
          </div>

          {/* COUPONS TABLE */}
          <div className="card-chai p-6 space-y-4">
            <div className="pb-4 border-b border-white/10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-neutral-400" />
                <h2 className="text-base font-semibold text-white">Configured promo codes</h2>
              </div>
              <span className="border border-white/10 bg-white/5 text-neutral-300 text-[11px] font-medium px-3 py-1 rounded-lg">
                {coupons.length} total
              </span>
            </div>

            <div>
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                </div>
              ) : coupons.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Tag className="h-10 w-10 text-neutral-600 mx-auto opacity-50" />
                  <p className="text-xs font-semibold text-neutral-300">No coupons created yet</p>
                  <p className="text-[11px] text-neutral-500">Click "Create new coupon" above to add your first promotional code.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                        <th className="pb-3">Coupon code</th>
                        <th className="pb-3">Discount</th>
                        <th className="pb-3">Min order</th>
                        <th className="pb-3">Redemptions</th>
                        <th className="pb-3">Expiry</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-normal text-neutral-300">
                      {coupons.map((c) => (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium text-white tracking-wider text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
                                {c.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(c.code)}
                                className="p-1 text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer"
                                title="Copy promo code"
                              >
                                {copiedCode === c.code ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            {c.description && (
                              <p className="text-[11px] text-neutral-400 font-normal mt-1">{c.description}</p>
                            )}
                          </td>

                          <td className="py-3.5">
                            {c.discountType === "PERCENTAGE" ? (
                              <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium text-xs px-2.5 py-1 rounded-lg">
                                <Percent className="h-3.5 w-3.5 text-sky-400" />
                                {c.discountValue}% OFF {c.maxDiscount ? `(Cap: ${formatPrice(c.maxDiscount)})` : ""}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-white/5 text-neutral-200 border border-white/10 font-medium text-xs px-2.5 py-1 rounded-lg">
                                <Tag className="h-3.5 w-3.5 text-neutral-400" />
                                {formatPrice(c.discountValue)} OFF
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 text-neutral-300 font-medium">
                            {c.minOrderAmount > 0 ? formatPrice(c.minOrderAmount) : "No minimum"}
                          </td>

                          <td className="py-3.5 text-neutral-300">
                            <span className="font-semibold text-white">{c.usageCount}</span>
                            <span className="text-[11px] text-neutral-500">
                              {c.usageLimit ? ` / ${c.usageLimit}` : " (Unlimited)"}
                            </span>
                          </td>

                          <td className="py-3.5 text-neutral-400">
                            {c.expiresAt ? (
                              <span className={`text-[11px] ${new Date(c.expiresAt) < new Date() ? "text-rose-400 font-medium" : "text-neutral-300"}`}>
                                {new Date(c.expiresAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-neutral-600">Never</span>
                            )}
                          </td>

                          <td className="py-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(c.id)}
                              className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium transition-colors"
                            >
                              {c.isActive ? (
                                <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                                  <ToggleRight className="h-5 w-5 text-emerald-400" /> Active
                                </span>
                              ) : (
                                <span className="text-neutral-500 font-medium flex items-center gap-1 text-[11px]">
                                  <ToggleLeft className="h-5 w-5 text-neutral-600" /> Inactive
                                </span>
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 text-right">
                            {confirmDeleteId === c.id ? (
                              <div className="inline-flex items-center gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleDeleteCoupon(c.id)}
                                  className="h-7 px-2 bg-rose-600 text-white text-[10px] font-medium rounded-lg cursor-pointer"
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="h-7 px-2 text-[10px] font-medium rounded-lg cursor-pointer text-neutral-400 hover:text-white"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConfirmDeleteId(c.id)}
                                className="h-8 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="card-chai max-w-lg w-full bg-neutral-950 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/5 border border-white/10 text-neutral-300 rounded-xl">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Create promo coupon</h3>
                  <p className="text-xs text-neutral-400">Configure discount details for checkout promotion</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              
              {/* CODE & TYPE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Coupon code *</Label>
                  <Input
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    placeholder="e.g. FESTIVE50"
                    disabled={isSubmitting}
                    className="h-10 border-white/10 text-xs uppercase font-mono bg-white/[0.03] text-neutral-100 placeholder:text-neutral-500 focus:border-white/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Discount type *</Label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                    className="h-10 px-3 w-full border border-white/10 rounded-xl text-xs font-medium bg-neutral-900 text-neutral-200 cursor-pointer focus:outline-none"
                  >
                    <option value="FIXED">Flat amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
              </div>

              {/* VALUE & MIN ORDER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">
                    {formData.discountType === "PERCENTAGE" ? "Discount percentage (%) *" : "Discount amount (₹) *"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleFormChange}
                    placeholder={formData.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 50"}
                    disabled={isSubmitting}
                    className="h-10 border-white/10 text-xs font-medium bg-white/[0.03] text-neutral-100 placeholder:text-neutral-500 focus:border-white/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Min order amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleFormChange}
                    placeholder="e.g. 200"
                    disabled={isSubmitting}
                    className="h-10 border-white/10 text-xs bg-white/[0.03] text-neutral-100 placeholder:text-neutral-500 focus:border-white/20"
                  />
                </div>
              </div>

              {/* MAX DISCOUNT & USAGE LIMIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.discountType === "PERCENTAGE" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-300">Max discount cap (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleFormChange}
                      placeholder="e.g. 150"
                      disabled={isSubmitting}
                      className="h-10 border-white/10 text-xs bg-white/[0.03] text-neutral-100 placeholder:text-neutral-500 focus:border-white/20"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Max redemptions (limit)</Label>
                  <Input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleFormChange}
                    placeholder="e.g. 100 (Optional)"
                    disabled={isSubmitting}
                    className="h-10 border-white/10 text-xs bg-white/[0.03] text-neutral-100 placeholder:text-neutral-500 focus:border-white/20"
                  />
                </div>
              </div>

              {/* EXPIRY & DESCRIPTION */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Expiry date (optional)</Label>
                <Input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  className="h-10 border-white/10 text-xs bg-white/[0.03] text-neutral-100 placeholder:text-neutral-500 focus:border-white/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Description / note</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="e.g. Festive season ₹50 discount for all customers"
                  disabled={isSubmitting}
                  className="h-10 border-white/10 text-xs bg-white/[0.03] text-neutral-100 placeholder:text-neutral-500 focus:border-white/20"
                />
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="h-10 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  disabled={isSubmitting}
                  className="h-10 text-xs font-medium px-6 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Creating...
                    </>
                  ) : (
                    "Save and activate coupon"
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
