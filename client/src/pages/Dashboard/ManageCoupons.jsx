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
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-[#8C4B3E] hover:underline mb-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
                Coupon & Promo Code Directory
              </h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">
                Create, manage, and configure promotional discount coupons for customer bookings
              </p>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#8C4B3E] hover:bg-[#783E33] text-white rounded-xl text-xs font-bold px-4 h-10 shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Create New Coupon
            </Button>
          </div>
        </section>

        {/* METRICS STATS CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Card className="border border-[#5A5146]/15 shadow-xs bg-white p-4 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Coupons</span>
                <span className="text-xl font-black text-[#1F1D1A]">{totalCoupons}</span>
              </div>
              <div className="p-2.5 bg-[#8C4B3E]/10 text-[#8C4B3E] rounded-xl shrink-0">
                <Tag className="h-5 w-5" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-xs bg-white p-4 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Active Coupons</span>
                <span className="text-xl font-black text-emerald-700">{activeCoupons}</span>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-xs bg-white p-4 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Flat ₹ Off</span>
                <span className="text-xl font-black text-[#1F1D1A]">{fixedCoupons}</span>
              </div>
              <div className="p-2.5 bg-amber-50 text-[#C9A46A] rounded-xl shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-xs bg-white p-4 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Percentage % Off</span>
                <span className="text-xl font-black text-[#1F1D1A]">{percentageCoupons}</span>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Percent className="h-5 w-5" />
              </div>
            </Card>

          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* SEARCH BAR */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code or description..."
                className="pl-10 h-10 border-[#E8DCC3] text-xs rounded-xl bg-[#FAF6F0]/50"
              />
            </div>
          </Card>

          {/* COUPONS TABLE */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
            <CardHeader className="p-0 pb-4 border-b border-stone-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#8C4B3E]" />
                <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Configured Promo Codes</CardTitle>
              </div>
              <Badge variant="outline" className="border-[#8C4B3E] text-[#8C4B3E] text-[10px] font-bold">
                {coupons.length} total
              </Badge>
            </CardHeader>

            <CardContent className="p-0 pt-4">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E]" />
                </div>
              ) : coupons.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Tag className="h-10 w-10 text-[#7A7266] mx-auto opacity-50" />
                  <p className="text-xs font-bold text-[#1F1D1A]">No coupons created yet</p>
                  <p className="text-[11px] text-[#7A7266]">Click "Create New Coupon" above to add your first promotional code.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] uppercase font-bold text-[#7A7266]">
                        <th className="pb-3">Coupon Code</th>
                        <th className="pb-3">Discount</th>
                        <th className="pb-3">Min Order</th>
                        <th className="pb-3">Redemptions</th>
                        <th className="pb-3">Expiry</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {coupons.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-[#1F1D1A] tracking-wider text-xs bg-[#FAF6F0] border border-[#E8DCC3] px-2.5 py-1 rounded-lg">
                                {c.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(c.code)}
                                className="p-1 text-[#7A7266] hover:text-[#8C4B3E] transition-colors cursor-pointer"
                                title="Copy promo code"
                              >
                                {copiedCode === c.code ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            {c.description && (
                              <p className="text-[11px] text-[#7A7266] mt-1">{c.description}</p>
                            )}
                          </td>

                          <td className="py-3.5">
                            {c.discountType === "PERCENTAGE" ? (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-300 font-black text-[10px]">
                                {c.discountValue}% OFF {c.maxDiscount ? `(Cap: ${formatPrice(c.maxDiscount)})` : ""}
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-black text-[10px]">
                                {formatPrice(c.discountValue)} OFF
                              </Badge>
                            )}
                          </td>

                          <td className="py-3.5 text-[#5A5146] font-bold">
                            {c.minOrderAmount > 0 ? formatPrice(c.minOrderAmount) : "No Minimum"}
                          </td>

                          <td className="py-3.5 text-[#5A5146]">
                            <span className="font-bold text-[#1F1D1A]">{c.usageCount}</span>
                            <span className="text-[11px] text-[#7A7266]">
                              {c.usageLimit ? ` / ${c.usageLimit}` : " (Unlimited)"}
                            </span>
                          </td>

                          <td className="py-3.5 text-[#5A5146]">
                            {c.expiresAt ? (
                              <span className={`font-semibold text-[11px] ${new Date(c.expiresAt) < new Date() ? "text-rose-600 font-bold" : ""}`}>
                                {new Date(c.expiresAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-stone-400">Never</span>
                            )}
                          </td>

                          <td className="py-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(c.id)}
                              className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold transition-colors"
                            >
                              {c.isActive ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                  <ToggleRight className="h-5 w-5 text-emerald-600" /> Active
                                </span>
                              ) : (
                                <span className="text-stone-400 font-bold flex items-center gap-1 text-[11px]">
                                  <ToggleLeft className="h-5 w-5 text-stone-400" /> Inactive
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
                                  className="h-7 px-2 bg-rose-600 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="h-7 px-2 text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConfirmDeleteId(c.id)}
                                className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs cursor-pointer"
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
            </CardContent>
          </Card>

        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-[#E8DCC3] shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DCC3]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#8C4B3E]/10 text-[#8C4B3E] rounded-xl">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1F1D1A]">Create Promo Coupon</h3>
                  <p className="text-xs text-[#5A5146]">Configure discount details for checkout promotion</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              
              {/* CODE & TYPE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Coupon Code *</Label>
                  <Input
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    placeholder="e.g. FESTIVE50"
                    disabled={isSubmitting}
                    className="h-10 border-[#E8DCC3] text-xs uppercase font-extrabold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Discount Type *</Label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                    className="h-10 px-3 w-full border border-[#E8DCC3] rounded-xl text-xs font-bold bg-[#FAF6F0] text-[#1F1D1A] cursor-pointer"
                  >
                    <option value="FIXED">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
              </div>

              {/* VALUE & MIN ORDER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F1D1A]">
                    {formData.discountType === "PERCENTAGE" ? "Discount Percentage (%) *" : "Discount Amount (₹) *"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleFormChange}
                    placeholder={formData.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 50"}
                    disabled={isSubmitting}
                    className="h-10 border-[#E8DCC3] text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Min Order Amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleFormChange}
                    placeholder="e.g. 200"
                    disabled={isSubmitting}
                    className="h-10 border-[#E8DCC3] text-xs"
                  />
                </div>
              </div>

              {/* MAX DISCOUNT & USAGE LIMIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.discountType === "PERCENTAGE" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1F1D1A]">Max Discount Cap (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleFormChange}
                      placeholder="e.g. 150"
                      disabled={isSubmitting}
                      className="h-10 border-[#E8DCC3] text-xs"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Max Redemptions (Limit)</Label>
                  <Input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleFormChange}
                    placeholder="e.g. 100 (Optional)"
                    disabled={isSubmitting}
                    className="h-10 border-[#E8DCC3] text-xs"
                  />
                </div>
              </div>

              {/* EXPIRY & DESCRIPTION */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#1F1D1A]">Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  className="h-10 border-[#E8DCC3] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#1F1D1A]">Description / Internal Note</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="e.g. Festive season ₹50 discount for all customers"
                  disabled={isSubmitting}
                  className="h-10 border-[#E8DCC3] text-xs"
                />
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DCC3]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="h-10 border-[#E8DCC3] text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 bg-[#8C4B3E] hover:bg-[#783E33] text-white text-xs font-bold rounded-xl px-6 cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Creating...
                    </>
                  ) : (
                    "Save & Activate Coupon"
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
