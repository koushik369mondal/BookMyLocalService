import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  RotateCcw, 
  Search, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  Briefcase
} from "lucide-react";
import { PaymentStatusBadge, getPaymentMethodLabel } from "@/components/booking/BookingStatusBadges";

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPayments = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminService.getPayments();
      if (response.success && response.data) {
        setPayments(response.data);
      } else {
        setError(response.message || "Failed to load payment transactions.");
      }
    } catch (err) {
      console.error("Fetch payments error:", err);
      setError(err.message || "Failed to load payments from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalVolume = payments.reduce((sum, p) => (p.paymentStatus || "").toUpperCase() === "PAID" ? sum + (p.total || 0) : sum, 0);
  const pendingVolume = payments.reduce((sum, p) => (p.paymentStatus || "").toUpperCase() === "PENDING" ? sum + (p.total || 0) : sum, 0);
  const refundedVolume = payments.reduce((sum, p) => (p.paymentStatus || "").toUpperCase() === "REFUNDED" ? sum + (p.total || 0) : sum, 0);

  const filteredPayments = payments.filter((p) => {
    const cust = p.customer?.fullName || "";
    const prov = p.provider?.fullName || "";
    const serv = p.service?.title || "";
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || cust.toLowerCase().includes(q) || prov.toLowerCase().includes(q) || serv.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const pStatus = (p.paymentStatus || "PENDING").toUpperCase();
    const matchesStatus = statusFilter === "all" || pStatus === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="bg-[#0a0a0a] min-h-screen pb-16 font-sans text-neutral-100">
        
        {/* HEADER */}
        <section className="bg-neutral-900/40 border-b border-white/10 py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Payment transactions log</h1>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-medium">Audit global platform revenues, settlements, and refund logs</p>
            </div>
            
            <Link to="/admin/dashboard">
              <Button size="sm" variant="outline" className="text-xs h-9.5 px-4 cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-chai p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Total volume paid</span>
              <span className="text-2xl sm:text-3xl font-bold text-white mt-2 block">
                {formatPrice(totalVolume, { decimals: true })}
              </span>
            </div>

            <div className="card-chai p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Pending processing</span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 mt-2 block">
                {formatPrice(pendingVolume, { decimals: true })}
              </span>
            </div>

            <div className="card-chai p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Refunded volume</span>
              <span className="text-2xl sm:text-3xl font-bold text-rose-400 mt-2 block">
                {formatPrice(refundedVolume, { decimals: true })}
              </span>
            </div>
          </div>

          {/* PAYMENTS TABLE CARD */}
          <div className="card-chai p-6 space-y-6">
            <div className="pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">System transactions</h2>
                <p className="text-xs text-neutral-400">Itemized settlement audit from database</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Input
                  placeholder="Search customer, provider, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-60 text-xs border-white/10 rounded-xl bg-white/[0.03] text-neutral-200 placeholder:text-neutral-500 focus:border-white/20"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 text-xs font-medium border border-white/10 rounded-xl px-3 bg-neutral-900 text-neutral-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All payment statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </div>

            <div>
              {isLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mx-auto mb-3" />
                  <p className="text-xs font-medium text-neutral-400">Loading payment transactions from database...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="py-16 text-center">
                  <Briefcase className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-neutral-300">No payment transactions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs text-neutral-200">
                    <thead className="bg-white/[0.02] text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">TXN ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Provider</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Method</th>
                        <th className="py-3.5 px-4 text-right">Amount</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                      {filteredPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-white">#{p.id.substring(0, 8)}</td>
                          <td className="py-3.5 px-4 font-normal text-neutral-300">{p.customer?.fullName || "Customer"}</td>
                          <td className="py-3.5 px-4 font-normal text-neutral-300">{p.provider?.fullName || "Provider"}</td>
                          <td className="py-3.5 px-4 font-medium text-white">{p.service?.title || "Service"}</td>
                          <td className="py-3.5 px-4 text-xs text-neutral-400">{getPaymentMethodLabel(p.paymentMethod)}</td>
                          <td className="py-3.5 px-4 text-right font-semibold text-white">{formatPrice(p.total, { decimals: true })}</td>
                          <td className="py-3.5 px-4 text-center">
                            <PaymentStatusBadge status={p.paymentStatus} method={p.paymentMethod} />
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
    </DashboardLayout>
  );
}
