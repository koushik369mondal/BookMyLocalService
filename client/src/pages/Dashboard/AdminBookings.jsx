import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { adminService } from "@/services/adminService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
        return <Badge className="bg-[#C9A46A] border-0 text-white font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Pending</Badge>;
      case "confirmed":
      case "upcoming":
        return <Badge className="bg-[#5A95C9]/20 text-[#1E4B75] border-0 font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Cancelled</Badge>;
      default:
        return <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border-0 font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Completed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">System Bookings Management</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Global supervisor dashboard for all dispatch appointments and provider schedules</p>
          </div>
        </section>

        {/* BOOKINGS CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-[#1F1D1A]">All System Dispatches</CardTitle>
                  <CardDescription className="text-xs text-[#7A7266]">System-wide records of customer requests and assignments</CardDescription>
                </div>
              </div>

              <div className="flex bg-[#FAF6F0] border border-[#E8DCC3] p-1 rounded-xl">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`rounded-lg text-[10px] font-bold px-2.5 py-1 uppercase transition-all cursor-pointer ${
                      statusFilter === tab
                        ? "bg-[#C9A46A] text-white shadow-2xs"
                        : "text-[#7A7266] hover:text-[#C9A46A]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              {isLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 text-[#C9A46A] animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold text-[#5A5146]">Loading system bookings from database...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase className="h-10 w-10 text-[#7A7266] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#1F1D1A]">No bookings match status filter</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#E8DCC3]">
                  <table className="w-full text-left text-xs text-[#1F1D1A]">
                    <thead className="bg-[#F0E7D5] text-[#5A5146] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DCC3]">
                      <tr>
                        <th className="py-3.5 px-4">Booking ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Provider</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Scheduled Date</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCC3] bg-white">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">#{b.id.substring(0, 8)}</td>
                          <td className="py-3.5 px-4 font-medium">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-[#7A7266]" />
                              <span>{b.customer?.fullName || b.billingName || "Customer"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium">
                            <div className="flex items-center gap-1.5">
                              <UserCheck className="h-3.5 w-3.5 text-[#C9A46A]" />
                              <span>{b.provider?.fullName || "Provider"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">{b.service?.title || "Service"}</td>
                          <td className="py-3.5 px-4 text-[#5A5146] font-medium">{b.date} at {b.time}</td>
                          <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">{formatPrice(b.total, { decimals: true })}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
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
