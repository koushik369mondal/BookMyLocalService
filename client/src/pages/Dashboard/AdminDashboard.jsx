import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "../../context/AuthContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderRoleBadge } from "./ManageUsers";
import {
  Users,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-amber-400/30 text-amber-400 font-medium rounded-lg px-2 py-0 text-[9px] uppercase">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="border-sky-400/30 text-sky-400 font-medium rounded-lg px-2 py-0 text-[9px] uppercase">Confirmed</Badge>;
      default:
        return <Badge variant="outline" className="border-emerald-400/30 text-emerald-400 font-medium rounded-lg px-2 py-0 text-[9px] uppercase">Completed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {user?.fullName ? `Welcome back, ${user.fullName}` : "System administration"}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Live platform administration and oversight
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/admin/users">
              <Button size="sm" variant="solid" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Manage users
              </Button>
            </Link>
            <Link to="/admin/providers">
              <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> Manage providers
              </Button>
            </Link>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Total customers</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.totalUsers || 0}</span>
            </div>
            <div className="p-3 bg-white/[0.04] text-neutral-200 rounded-2xl shrink-0 border border-white/10">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Providers</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.totalProviders || 0}</span>
            </div>
            <div className="p-3 bg-white/[0.04] text-neutral-200 rounded-2xl shrink-0 border border-white/10">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Total bookings</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{stats.totalBookings || 0}</span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shrink-0 border border-emerald-500/20">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="card-chai p-5 flex items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Gross revenue</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{formatPrice(stats.totalRevenue || 0)}</span>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0 border border-amber-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* MAIN CONTAINER */}
        <div>
          {actionSuccessMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: RECENT BOOKINGS & RECENT USERS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* RECENT DISPATCH BOOKINGS TABLE */}
              <div className="card-chai p-6 space-y-4">
                <div className="pb-3 border-b border-white/10 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                    <h2 className="text-base font-bold text-white">Recent service bookings</h2>
                  </div>
                </div>

                <div>
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    </div>
                  ) : recentBookings.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-6 text-center">No recent bookings recorded in database.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[10px] uppercase font-semibold text-neutral-400">
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Service</th>
                            <th className="pb-2">Total</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                          {recentBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-white/[0.02]">
                              <td className="py-3 font-semibold text-white">{b.customer?.fullName || b.billingName || "Customer"}</td>
                              <td className="py-3 text-neutral-300">{b.service?.title || "Local service"}</td>
                              <td className="py-3 font-mono font-bold text-white">{formatPrice(b.total)}</td>
                              <td className="py-3">{getStatusBadge(b.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* RECENTLY REGISTERED USERS */}
              <div className="card-chai p-6 space-y-4">
                <div className="pb-3 border-b border-white/10 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-neutral-400" />
                    <h2 className="text-base font-bold text-white">Recent registrations</h2>
                  </div>
                </div>

                <div>
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    </div>
                  ) : recentUsers.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-6 text-center">No recent user registrations.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/10">
                          <div>
                            <h4 className="text-xs font-bold text-white">{u.fullName}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[11px] text-neutral-400">{u.email}</p>
                              {renderRoleBadge(u.role)}
                            </div>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: PENDING PROVIDER APPROVALS */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="card-chai p-6 space-y-4">
                <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-base font-bold text-white">Pending approvals</h3>
                  </div>
                  <Badge variant="outline" className="border-white/10 text-neutral-300 text-[10px] font-medium">
                    {unverifiedProviders.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    </div>
                  ) : unverifiedProviders.length === 0 ? (
                    <div className="p-6 text-center space-y-1">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                      <p className="text-xs font-semibold text-white">All providers verified</p>
                      <p className="text-[11px] text-neutral-400">No pending verification requests</p>
                    </div>
                  ) : (
                    unverifiedProviders.map((p) => (
                      <div key={p.id} className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 space-y-3">
                        <div>
                          <h4 className="text-xs font-bold text-white">{p.fullName}</h4>
                          <p className="text-[11px] text-neutral-400">{p.email}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">{p.city ? `${p.city}, ${p.state}` : "Local provider"}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="solid"
                            onClick={() => handleApprovalAction(p.id, "approve")}
                            className="flex-1 h-8 text-[11px] font-semibold"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction(p.id, "reject")}
                            className="h-8 border-red-500/20 text-red-400 hover:bg-red-500/10 text-[11px] font-semibold"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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
