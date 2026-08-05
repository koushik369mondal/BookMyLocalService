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
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Payment Transactions Log</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Audit global platform revenues, settlements, and refund logs</p>
            </div>
            
            <Link to="/admin/dashboard">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] border border-[#E8DCC3] text-white font-bold text-xs rounded-xl h-9.5 px-4 cursor-pointer shadow-2xs">
                <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {error && (
            <div className="p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6">
              <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Total Volume Paid</span>
              <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A] mt-2 block">
                {formatPrice(totalVolume, { decimals: true })}
              </span>
            </Card>

            <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6">
              <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Pending Processing</span>
              <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A] mt-2 block">
                {formatPrice(pendingVolume, { decimals: true })}
              </span>
            </Card>

            <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6">
              <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Refunded Volume</span>
              <span className="text-2xl sm:text-3xl font-black text-[#8C4B3E] mt-2 block">
                {formatPrice(refundedVolume, { decimals: true })}
              </span>
            </Card>
          </div>

          {/* PAYMENTS TABLE CARD */}
          <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs space-y-6">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">System Transactions</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Itemized settlement audit from PostgreSQL database</CardDescription>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Input
                  placeholder="Search customer, provider, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-52 text-xs border-[#E8DCC3] rounded-xl bg-[#FAF6F0]"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 text-xs font-bold border border-[#E8DCC3] rounded-xl px-3 bg-[#FAF6F0] text-[#1F1D1A] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="PENDING">🟡 Pending</option>
                  <option value="PAID">🟢 Paid</option>
                  <option value="FAILED">🔴 Failed</option>
                  <option value="REFUNDED">🔵 Refunded</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-2">
              {isLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 text-[#C9A46A] animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold text-[#5A5146]">Loading payment transactions from database...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="py-16 text-center">
                  <Briefcase className="h-10 w-10 text-[#7A7266] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#1F1D1A]">No payment transactions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#E8DCC3]">
                  <table className="w-full text-left text-xs text-[#1F1D1A]">
                    <thead className="bg-[#F0E7D5] text-[#5A5146] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DCC3]">
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
                    <tbody className="divide-y divide-[#E8DCC3] bg-white">
                      {filteredPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">#{p.id.substring(0, 8)}</td>
                          <td className="py-3.5 px-4 font-medium">{p.customer?.fullName || "Customer"}</td>
                          <td className="py-3.5 px-4 font-medium">{p.provider?.fullName || "Provider"}</td>
                          <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">{p.service?.title || "Service"}</td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-[#7A7266]">{getPaymentMethodLabel(p.paymentMethod)}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-[#1F1D1A]">{formatPrice(p.total, { decimals: true })}</td>
                          <td className="py-3.5 px-4 text-center">
                            <PaymentStatusBadge status={p.paymentStatus} method={p.paymentMethod} />
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
    </DashboardLayout>
  );
}
