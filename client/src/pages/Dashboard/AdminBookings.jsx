import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, UserCheck, Loader2, ShieldAlert, Briefcase } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminService.getBookings({ status: statusFilter });
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.message || "Failed to fetch platform bookings.");
      }
    } catch (err) {
      console.error("Admin bookings fetch error:", err);
      setError(err.message || "Failed to load bookings from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-amber-400/30 text-amber-400 font-medium rounded-lg px-2 py-0 text-[9px] uppercase">Pending</Badge>;
      case "confirmed":
      case "upcoming":
        return <Badge variant="outline" className="border-sky-400/30 text-sky-400 font-medium rounded-lg px-2 py-0 text-[9px] uppercase">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500/30 text-red-400 font-medium rounded-lg px-2 py-0 text-[9px] uppercase">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="border-emerald-400/30 text-emerald-400 font-medium rounded-lg px-2 py-0 text-[9px] uppercase">Completed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* HEADER */}
        <div className="pb-4 border-b border-white/10">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">System bookings</h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">Global supervisor dashboard for all dispatch appointments and schedules</p>
        </div>

        {/* BOOKINGS CONTENT */}
        <div className="space-y-6">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="card-chai p-6 space-y-6">
            <div className="pb-4 border-b border-white/10 flex flex-row items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">All system dispatches</h2>
                  <p className="text-xs text-neutral-400">System-wide records of customer requests and assignments</p>
                </div>
              </div>

              <div className="flex bg-neutral-900/60 border border-white/10 p-1 rounded-xl overflow-x-auto">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`rounded-lg text-[10px] font-semibold px-2.5 py-1 uppercase transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === tab
                        ? "bg-white text-neutral-950 font-semibold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {isLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mx-auto mb-3" />
                  <p className="text-xs text-neutral-400">Loading system bookings from database...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">No bookings match this status</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-200">
                    <thead className="border-b border-white/10 text-neutral-400 uppercase font-semibold text-[10px] tracking-wider bg-white/[0.02]">
                      <tr>
                        <th className="py-3 px-4">Booking ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Scheduled date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-white">#{b.id.substring(0, 8)}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-neutral-400" />
                              <span className="text-white font-medium">{b.customer?.fullName || b.billingName || "Customer"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <UserCheck className="h-3.5 w-3.5 text-neutral-400" />
                              <span className="text-neutral-300">{b.provider?.fullName || "Provider"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">{b.service?.title || "Service"}</td>
                          <td className="py-3.5 px-4 text-neutral-400 font-mono">{b.date} at {b.time}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">{formatPrice(b.total, { decimals: true })}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
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
