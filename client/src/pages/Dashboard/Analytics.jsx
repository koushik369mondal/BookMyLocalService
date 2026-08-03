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
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Platform Analytics & Intelligence</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Real-time user growth, financial metrics, and booking statistics from PostgreSQL</p>
            </div>
            
            <Link to="/admin/dashboard">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] border border-[#E8DCC3] text-white font-bold text-xs rounded-xl h-9.5 px-4 cursor-pointer shadow-2xs">
                <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {error && (
            <div className="p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="h-8 w-8 text-[#C9A46A] animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-[#5A5146]">Loading analytics intelligence from database...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* OVERVIEW CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border border-[#E8DCC3] bg-white rounded-2xl p-6 shadow-2xs">
                  <span className="text-xs font-bold text-[#7A7266] uppercase block">Total Users</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A] mt-2 block">
                    {data?.usersOverview?.totalUsers || 0}
                  </span>
                </Card>

                <Card className="border border-[#E8DCC3] bg-white rounded-2xl p-6 shadow-2xs">
                  <span className="text-xs font-bold text-[#7A7266] uppercase block">Active Providers</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A] mt-2 block">
                    {data?.usersOverview?.totalProviders || 0}
                  </span>
                </Card>

                <Card className="border border-[#E8DCC3] bg-white rounded-2xl p-6 shadow-2xs">
                  <span className="text-xs font-bold text-[#7A7266] uppercase block">Total Customers</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A] mt-2 block">
                    {data?.usersOverview?.totalCustomers || 0}
                  </span>
                </Card>

                <Card className="border border-[#E8DCC3] bg-white rounded-2xl p-6 shadow-2xs">
                  <span className="text-xs font-bold text-[#7A7266] uppercase block">Gross Volume</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A] mt-2 block">
                    {formatPrice(data?.financials?.totalRevenue || 0, { decimals: true })}
                  </span>
                </Card>
              </div>

              {/* BOOKINGS STATS CARD */}
              <Card className="border border-[#E8DCC3] bg-white rounded-2xl p-6 shadow-2xs space-y-4">
                <CardHeader className="p-0 pb-3 border-b border-[#E8DCC3]">
                  <CardTitle className="text-base font-bold text-[#1F1D1A]">System Bookings Intelligence</CardTitle>
                  <CardDescription className="text-xs text-[#7A7266]">Total: {data?.bookingsOverview?.totalBookings || 0} Dispatches</CardDescription>
                </CardHeader>

                <CardContent className="p-0 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                    <span className="text-xs font-bold text-[#2B522B] uppercase block">Completed Dispatches</span>
                    <span className="text-2xl font-black text-[#1F1D1A] mt-1 block">{data?.bookingsOverview?.completedBookings || 0}</span>
                  </div>

                  <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                    <span className="text-xs font-bold text-[#C9A46A] uppercase block">Pending Dispatches</span>
                    <span className="text-2xl font-black text-[#1F1D1A] mt-1 block">{data?.bookingsOverview?.pendingBookings || 0}</span>
                  </div>

                  <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                    <span className="text-xs font-bold text-[#8C4B3E] uppercase block">Cancelled Dispatches</span>
                    <span className="text-2xl font-black text-[#1F1D1A] mt-1 block">{data?.bookingsOverview?.cancelledBookings || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
