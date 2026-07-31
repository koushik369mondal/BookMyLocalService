import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCards from "../../components/navigation/DashboardCards";
import { useAuth } from "../../context/AuthContext";
import { useCustomerDashboard } from "@/hooks/useCustomerDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, Activity, Loader2, ArrowRight, ShieldAlert } from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { stats, recentBookings, isLoading, error } = useCustomerDashboard();

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#C9A46A] border-0 text-white font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-[#5A95C9]/20 text-[#1E4B75] border-0 font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Confirmed</Badge>;
      default:
        return <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border-0 font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Completed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* HEADER BANNER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
              {user?.fullName ? `Welcome back, ${user.fullName} 👋` : "Welcome back 👋"}
            </h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">
              Quickly request dispatches, manage payments, track ratings, and configure your address locations
            </p>
          </div>
        </section>

        {/* STATS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Bookings</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.totalBookings || 0}</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Active Scheduled</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.activeBookings || 0}</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Activity className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Completed</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.completedBookings || 0}</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Pending Approval</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.pendingBookings || 0}</span>
              </div>
              <div className="p-3 bg-amber-50 text-[#C9A46A] rounded-2xl shrink-0">
                <Clock className="h-6 w-6" />
              </div>
            </Card>

          </div>
        </section>

        {/* CONTAINER CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* RECENT BOOKINGS ACTIVITY */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
            <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#8C4B3E]" />
                <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Recent Booking History</CardTitle>
              </div>
              <Link to="/booking/history" className="text-xs font-bold text-[#8C4B3E] hover:underline flex items-center gap-1">
                View History <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0 pt-4">
              {isLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E]" />
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-xs font-bold text-[#1F1D1A]">No Bookings Placed Yet</p>
                  <p className="text-[11px] text-[#7A7266]">Browse our verified service catalog and place your first booking</p>
                  <Link to="/services">
                    <Button size="sm" className="bg-[#8C4B3E] text-white text-xs font-bold rounded-xl cursor-pointer">
                      Explore Services
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-[#FAF6F0]/50 rounded-2xl border border-[#E8DCC3]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-[#1F1D1A]">{b.service?.title || "Booked Service"}</h4>
                          {getStatusBadge(b.status)}
                        </div>
                        <p className="text-[11px] text-[#5A5146] font-medium">
                          Provider: <strong>{b.provider?.fullName || "Verified Provider"}</strong> ({b.provider?.phone || "Contact Verified"})
                        </p>
                        <p className="text-[10px] text-[#7A7266]">
                          Scheduled: <strong>{b.date}</strong> at <strong>{b.time}</strong>
                        </p>
                      </div>

                      <div className="text-right sm:text-right shrink-0">
                        <span className="text-base font-black text-[#8C4B3E] block">₹{b.total}</span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase">Plan: {b.plan}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A7266]">
              Quick Actions & Navigation
            </h3>
            <DashboardCards role="CUSTOMER" />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
