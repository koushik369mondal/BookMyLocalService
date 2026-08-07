import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "../../context/AuthContext";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadges";
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  Plus,
  Loader2,
  Clock,
  Briefcase,
  ShieldAlert
} from "lucide-react";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { stats, services, recentBookings, isLoading, error } = useProviderDashboard();
  const [bookingFilter, setBookingFilter] = useState("all");

  const filteredBookings = bookingFilter === "all"
    ? recentBookings
    : recentBookings.filter(b => (b.bookingStatus || b.status || "").toLowerCase() === bookingFilter);

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-[#1F1D1A] space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
                {user?.fullName ? `Welcome back, ${user.fullName} 👋` : "Provider Dashboard 👋"}
              </h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">
                Manage your active job dispatches, offerings, and live earnings
              </p>
            </div>
            
            <Link to="/provider/services">
              <Button size="sm" className="bg-[#8C4B3E] hover:bg-[#783E33] text-white rounded-xl text-xs font-bold px-4 h-9 shadow-sm cursor-pointer flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Add New Service
              </Button>
            </Link>
          </div>
        </section>

        {/* STATS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Earnings</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{formatPrice(stats.totalEarnings || 0)}</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Dispatches</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.totalJobs || 0}</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Completed</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.completedJobs || 0}</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Pending</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.pendingJobs || 0}</span>
              </div>
              <div className="p-3 bg-amber-50 text-[#C9A46A] rounded-2xl shrink-0">
                <Clock className="h-6 w-6" />
              </div>
            </Card>

          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: RECENT DISPATCHES */}
            <div className="lg:col-span-8 space-y-6">
              
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#8C4B3E]" />
                    <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Customer Service Requests</CardTitle>
                  </div>

                  <div className="flex bg-[#FAF6F0] border border-[#E8DCC3] p-0.5 rounded-xl h-8 overflow-x-auto">
                    {[
                      { id: "all", label: "All" },
                      { id: "pending", label: "Pending" },
                      { id: "confirmed", label: "Confirmed" },
                      { id: "in_progress", label: "In Service" },
                      { id: "completed", label: "Completed" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBookingFilter(tab.id)}
                        className={`rounded-lg text-[10px] font-bold px-2.5 py-1 uppercase transition-all cursor-pointer whitespace-nowrap ${
                          bookingFilter === tab.id
                            ? "bg-[#8C4B3E] text-white shadow-2xs"
                            : "text-[#7A7266] hover:text-[#8C4B3E]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-4">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E]" />
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <p className="text-xs text-stone-500 py-8 text-center">No service requests matching status filter.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredBookings.map((b) => (
                        <div key={b.id} className="p-4 bg-[#FAF6F0]/50 rounded-2xl border border-[#E8DCC3]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-[#1F1D1A]">{b.service?.title || "Service Job"}</h4>
                              <BookingStatusBadge status={b.status} />
                            </div>
                            <p className="text-[11px] text-[#5A5146] font-medium">
                              Customer: <strong>{b.customer?.fullName || b.billingName || "Customer"}</strong> ({b.customer?.phone || b.billingPhone || "N/A"})
                            </p>
                            <p className="text-[10px] text-[#7A7266]">
                              Scheduled: <strong>{b.date}</strong> at <strong>{b.time}</strong>
                            </p>
                          </div>

                          <div className="text-right sm:text-right shrink-0">
                            <span className="text-base font-black text-[#8C4B3E] block">{formatPrice(b.total)}</span>
                            <span className="text-[10px] font-bold text-stone-400 uppercase">Plan: {b.plan}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN: MY OFFERINGS */}
            <div className="lg:col-span-4 space-y-6">
              
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#8C4B3E]" />
                    <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Active Offerings</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-[#8C4B3E] text-[#8C4B3E] text-[10px] font-bold">
                    {services.length} Listed
                  </Badge>
                </CardHeader>

                <CardContent className="p-0 pt-4 space-y-3">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E]" />
                    </div>
                  ) : services.length === 0 ? (
                    <div className="p-6 text-center space-y-2">
                      <p className="text-xs font-bold text-[#1F1D1A]">No Active Services Listed</p>
                      <p className="text-[11px] text-[#7A7266]">Create your first service offering to accept jobs</p>
                      <Link to="/provider/services">
                        <Button size="sm" className="bg-[#8C4B3E] text-white text-xs font-bold rounded-xl mt-2 cursor-pointer">
                          Add Service
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    services.map((s) => (
                      <div key={s.id} className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3] space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-black text-[#1F1D1A]">{s.title}</h5>
                          <span className="text-xs font-black text-[#8C4B3E]">{formatPrice(s.price, { priceType: s.priceType })}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E8DCC3] text-[#5A5146] inline-block">
                          {typeof s.category === "object" ? (s.category?.name || "General") : (s.category || "General")}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
