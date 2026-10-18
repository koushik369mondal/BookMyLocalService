import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "../../context/AuthContext";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="space-y-8 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {user?.fullName ? `Welcome back, ${user.fullName}` : "Provider dashboard"}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Manage your active job dispatches, offerings, and live earnings
            </p>
          </div>
          
          <Link to="/provider/services">
            <Button variant="solid" size="sm" className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Add service
            </Button>
          </Link>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Total earnings</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{formatPrice(stats.totalEarnings || 0)}</span>
            </div>
            <div className="p-3 bg-white/[0.04] text-neutral-300 rounded-2xl shrink-0 border border-white/10">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Total dispatches</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.totalJobs || 0}</span>
            </div>
            <div className="p-3 bg-white/[0.04] text-neutral-300 rounded-2xl shrink-0 border border-white/10">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Completed</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.completedJobs || 0}</span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shrink-0 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Pending</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.pendingJobs || 0}</span>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div>
          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: RECENT DISPATCHES */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="card-chai p-6 space-y-6">
                <div className="pb-4 border-b border-white/10 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                    <h2 className="text-base font-bold text-white">Customer service requests</h2>
                  </div>

                  <div className="flex bg-neutral-900/60 border border-white/10 p-0.5 rounded-xl h-8 overflow-x-auto">
                    {[
                      { id: "all", label: "All" },
                      { id: "pending", label: "Pending" },
                      { id: "confirmed", label: "Confirmed" },
                      { id: "in_progress", label: "In service" },
                      { id: "completed", label: "Completed" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBookingFilter(tab.id)}
                        className={`rounded-lg text-[10px] font-semibold px-2.5 py-1 uppercase transition-all cursor-pointer whitespace-nowrap ${
                          bookingFilter === tab.id
                            ? "bg-white text-neutral-950"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-8 text-center">No service requests matching this status.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredBookings.map((b) => (
                        <div key={b.id} className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{b.service?.title || "Service job"}</h4>
                              <BookingStatusBadge status={b.status} />
                            </div>
                            <p className="text-[11px] text-neutral-400 font-normal">
                              Customer: <strong className="text-neutral-200">{b.customer?.fullName || b.billingName || "Customer"}</strong> ({b.customer?.phone || b.billingPhone || "N/A"})
                            </p>
                            <p className="text-[10px] text-neutral-500 font-mono">
                              Scheduled: {b.date} at {b.time}
                            </p>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-base font-bold text-white block">{formatPrice(b.total)}</span>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">Plan: {b.plan}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: MY OFFERINGS */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="card-chai p-6 space-y-6">
                <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-base font-bold text-white">Active offerings</h3>
                  </div>
                  <Badge variant="outline" className="border-white/10 text-neutral-300 text-[10px] font-medium">
                    {services.length} listed
                  </Badge>
                </div>

                <div className="space-y-3">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    </div>
                  ) : services.length === 0 ? (
                    <div className="p-6 text-center space-y-2">
                      <p className="text-xs font-semibold text-white">No active services listed</p>
                      <p className="text-[11px] text-neutral-400">Create your first service offering to accept jobs</p>
                      <Link to="/provider/services">
                        <Button variant="solid" size="sm" className="mt-2">
                          Add service
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    services.map((s) => (
                      <div key={s.id} className="p-3.5 bg-white/[0.02] rounded-xl border border-white/10 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-white">{s.title}</h4>
                          <span className="text-xs font-mono font-bold text-neutral-200">{formatPrice(s.price, { priceType: s.priceType })}</span>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 inline-block">
                          {typeof s.category === "object" ? (s.category?.name || "General") : (s.category || "General")}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
