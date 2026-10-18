import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  Loader2,
  ArrowLeft,
  ShieldAlert
} from "lucide-react";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminService.getAnalytics();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Failed to load analytics.");
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.message || "Failed to load analytics from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-[#0a0a0a] min-h-screen pb-16 font-sans text-neutral-100">
        
        {/* HEADER */}
        <section className="bg-neutral-900/40 border-b border-white/10 py-8 mb-8">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Platform analytics and intelligence</h1>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-medium">Real-time user growth, financial metrics, and booking statistics from database</p>
            </div>
            
            <Link to="/admin/dashboard">
              <Button size="sm" variant="outline" className="text-xs h-9.5 px-4 cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* CONTENT */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium text-neutral-400">Loading analytics intelligence from database...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* OVERVIEW CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-chai p-6">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Total users</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mt-2 block">
                    {data?.usersOverview?.totalUsers || 0}
                  </span>
                </div>

                <div className="card-chai p-6">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Active providers</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mt-2 block">
                    {data?.usersOverview?.totalProviders || 0}
                  </span>
                </div>

                <div className="card-chai p-6">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Total customers</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mt-2 block">
                    {data?.usersOverview?.totalCustomers || 0}
                  </span>
                </div>

                <div className="card-chai p-6">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Gross volume</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mt-2 block">
                    {formatPrice(data?.financials?.totalRevenue || 0, { decimals: true })}
                  </span>
                </div>
              </div>

              {/* BOOKINGS STATS CARD */}
              <div className="card-chai p-6 space-y-4">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-semibold text-white">System bookings intelligence</h2>
                  <p className="text-xs text-neutral-400">Total: {data?.bookingsOverview?.totalBookings || 0} dispatches</p>
                </div>

                <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Completed dispatches</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{data?.bookingsOverview?.completedBookings || 0}</span>
                  </div>

                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">Pending dispatches</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{data?.bookingsOverview?.pendingBookings || 0}</span>
                  </div>

                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">Cancelled dispatches</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{data?.bookingsOverview?.cancelledBookings || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
