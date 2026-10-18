import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useManageUsers } from "@/hooks/useManageUsers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Trash2,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserCheck
} from "lucide-react";

export const renderRoleBadge = (role) => {
  const roleUpper = String(role || "CUSTOMER").toUpperCase();
  switch (roleUpper) {
    case "ADMIN":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
          Admin
        </span>
      );
    case "PROVIDER":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Provider
        </span>
      );
    case "CUSTOMER":
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/[0.04] text-neutral-300 border border-white/10">
          Customer
        </span>
      );
  }
};

export default function ManageUsers() {
  const {
    paginatedUsers,
    isLoading,
    error,
    successMsg,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDeleteUser
  } = useManageUsers();

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* HEADER */}
        <div className="pb-4 border-b border-white/10">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            User directory
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Audit, inspect, and manage registered customers and service providers
          </p>
        </div>

        <div className="space-y-6">
          
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SEARCH & FILTERS BAR */}
          <div className="card-chai p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, or phone..."
                  className="pl-10 h-10 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-medium text-neutral-400">Filter role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 px-3 border border-white/10 rounded-xl text-xs font-medium bg-neutral-900/60 text-white cursor-pointer focus:outline-none"
                >
                  <option value="all" className="bg-neutral-900 text-white">All roles</option>
                  <option value="CUSTOMER" className="bg-neutral-900 text-white">Customers</option>
                  <option value="PROVIDER" className="bg-neutral-900 text-white">Providers</option>
                  <option value="ADMIN" className="bg-neutral-900 text-white">Admins</option>
                </select>
              </div>
            </div>
          </div>

          {/* USERS TABLE */}
          <div className="card-chai p-6 space-y-4">
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-neutral-400" />
                <h2 className="text-base font-bold text-white">Registered accounts</h2>
              </div>
            </div>

            <div>
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                </div>
              ) : paginatedUsers.length === 0 ? (
                <p className="text-xs text-neutral-500 py-10 text-center">No users match your criteria.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase font-semibold text-neutral-400 bg-white/[0.02]">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{u.fullName}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">{u.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            {renderRoleBadge(u.role)}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-400 font-mono">{u.phone || "N/A"}</td>
                          <td className="py-3.5 px-4">
                            {u.isVerified ? (
                              <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                                <UserCheck className="h-3.5 w-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="text-amber-400 font-medium text-[11px]">Pending</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {confirmDeleteId === u.id ? (
                              <div className="inline-flex items-center gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    handleDeleteUser(u.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  className="h-7 px-2 bg-red-600 text-white text-[10px] font-semibold rounded-lg cursor-pointer"
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="h-7 px-2 text-[10px] font-semibold rounded-lg cursor-pointer"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConfirmDeleteId(u.id)}
                                className="h-8 border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs"
                                title="Delete user"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="h-8 px-3 text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs font-medium text-neutral-400">Page {currentPage} of {totalPages}</span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="h-8 px-3 text-xs"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
