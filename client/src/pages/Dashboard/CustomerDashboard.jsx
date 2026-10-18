import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import DashboardCards from "../../components/navigation/DashboardCards";
import { useAuth } from "../../context/AuthContext";
import { useCustomerDashboard } from "@/hooks/useCustomerDashboard";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, Activity, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/booking/BookingStatusBadges";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { stats, recentBookings, isLoading, error } = useCustomerDashboard();

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        
        {/* HEADER */}
        <div className="pb-4 border-b border-white/10">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {user?.fullName ? `Welcome back, ${user.fullName}` : "Welcome back"}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Request dispatches, manage payments, track ratings, and configure your address locations
          </p>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Total bookings</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.totalBookings || 0}</span>
            </div>
            <div className="p-3 bg-white/[0.04] text-neutral-300 rounded-2xl shrink-0 border border-white/10">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Active scheduled</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.activeBookings || 0}</span>
            </div>
            <div className="p-3 bg-white/[0.04] text-neutral-300 rounded-2xl shrink-0 border border-white/10">
              <Activity className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Completed</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.completedBookings || 0}</span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shrink-0 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Pending approval</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.pendingBookings || 0}</span>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* CONTAINER CONTENT */}
        <div className="space-y-8">
          
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* RECENT BOOKINGS ACTIVITY */}
          <div className="card-chai p-6 space-y-6">
            <div className="pb-4 border-b border-white/10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-neutral-400" />
                <h2 className="text-base font-bold text-white">Recent booking history</h2>
              </div>
              <Link to="/booking/history" className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1">
                View history <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div>
              {isLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-xs font-semibold text-white">No bookings placed yet</p>
                  <p className="text-[11px] text-neutral-400">Browse our verified service catalog and place your first booking</p>
                  <Link to="/services">
                    <Button variant="solid" size="sm" className="mt-2">
                      Explore services
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{b.service?.title || "Booked service"}</h4>
                          <BookingStatusBadge status={b.bookingStatus || b.status} />
                          <PaymentStatusBadge status={b.paymentStatus} method={b.paymentMethod} />
                        </div>
                        <p className="text-[11px] text-neutral-400 font-normal">
                          Provider: <strong className="text-neutral-200">{b.provider?.fullName || "Verified provider"}</strong> ({b.provider?.phone || "Contact verified"})
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

          {/* QUICK ACTIONS */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Quick actions & navigation
            </h3>
            <DashboardCards role="CUSTOMER" />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
