import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "../../context/AuthContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings,
  DollarSign,
  UserCheck,
  ShieldAlert
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const {
    stats,
    recentUsers,
    recentBookings,
    unverifiedProviders,
    isLoading,
    error,
    actionSuccessMsg,
    handleApprovalAction
  } = useAdminDashboard();

  const [chartView, setChartView] = useState("users");

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
        
        {/* LIGHT BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
                {user?.fullName ? `Welcome back, ${user.fullName} 👋` : "System Administration 👋"}
              </h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">
                Live platform administration backed by PostgreSQL database
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/admin/users">
                <Button size="sm" className="bg-[#8C4B3E] hover:bg-[#783E33] text-white rounded-xl text-xs font-bold px-4 h-9 shadow-sm cursor-pointer">
                  <Users className="h-4 w-4 mr-1.5" /> Manage Users
                </Button>
              </Link>
              <Link to="/admin/providers">
                <Button size="sm" variant="outline" className="border-[#E8DCC3] bg-white text-[#1F1D1A] hover:bg-[#FAF6F0] rounded-xl text-xs font-bold px-4 h-9 cursor-pointer">
                  <Briefcase className="h-4 w-4 mr-1.5 text-[#8C4B3E]" /> Manage Providers
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* STATS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Customers</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.totalUsers || 0}</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Users className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Providers</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.totalProviders || 0}</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Briefcase className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Bookings</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{stats.totalBookings || 0}</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
            </Card>

            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Gross Revenue</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">{formatPrice(stats.totalRevenue || 0)}</span>
              </div>
              <div className="p-3 bg-amber-50 text-[#C9A46A] rounded-2xl shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

          </div>
        </section>

        {/* MAIN CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {actionSuccessMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: RECENT BOOKINGS & RECENT USERS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* RECENT DISPATCH BOOKINGS TABLE */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#8C4B3E]" />
                    <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Recent Service Bookings</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-4">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E]" />
                    </div>
                  ) : recentBookings.length === 0 ? (
                    <p className="text-xs text-stone-500 py-6 text-center">No recent bookings recorded in database.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-100 text-[10px] uppercase font-bold text-[#7A7266]">
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Service</th>
                            <th className="pb-2">Total</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-medium">
                          {recentBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-[#FAF6F0]/50">
                              <td className="py-3 font-bold text-[#1F1D1A]">{b.customer?.fullName || b.billingName || "Customer"}</td>
                              <td className="py-3 text-[#5A5146]">{b.service?.title || "Local Service"}</td>
                              <td className="py-3 font-black text-[#8C4B3E]">{formatPrice(b.total)}</td>
                              <td className="py-3">{getStatusBadge(b.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RECENTLY REGISTERED USERS */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#8C4B3E]" />
                    <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Recent Registrations</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-4">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E]" />
                    </div>
                  ) : recentUsers.length === 0 ? (
                    <p className="text-xs text-stone-500 py-6 text-center">No recent user registrations.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-[#FAF6F0]/50 rounded-xl border border-[#E8DCC3]/50">
                          <div>
                            <h4 className="text-xs font-black text-[#1F1D1A]">{u.fullName}</h4>
                            <p className="text-[11px] text-[#7A7266]">{u.email} • <span className="font-semibold text-[#8C4B3E]">{u.role}</span></p>
                          </div>
                          <span className="text-[10px] text-stone-400 font-bold">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN: PENDING PROVIDER APPROVALS */}
            <div className="lg:col-span-4 space-y-6">
              
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-[#8C4B3E]" />
                    <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Pending Approvals</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-[#8C4B3E] text-[#8C4B3E] text-[10px] font-bold">
                    {unverifiedProviders.length}
                  </Badge>
                </CardHeader>

                <CardContent className="p-0 pt-4 space-y-4">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E]" />
                    </div>
                  ) : unverifiedProviders.length === 0 ? (
                    <div className="p-6 text-center space-y-1">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-[#1F1D1A]">All Providers Verified</p>
                      <p className="text-[11px] text-[#7A7266]">No pending verification requests</p>
                    </div>
                  ) : (
                    unverifiedProviders.map((p) => (
                      <div key={p.id} className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DCC3] space-y-3">
                        <div>
                          <h4 className="text-xs font-black text-[#1F1D1A]">{p.fullName}</h4>
                          <p className="text-[11px] text-[#5A5146]">{p.email}</p>
                          <p className="text-[10px] text-[#7A7266] mt-0.5">{p.city ? `${p.city}, ${p.state}` : "Local Provider"}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprovalAction(p.id, "approve")}
                            className="flex-1 h-8 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-xl cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction(p.id, "reject")}
                            className="h-8 border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold rounded-xl cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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
