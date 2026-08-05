import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useManageUsers } from "@/hooks/useManageUsers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Briefcase,
  UserCheck
} from "lucide-react";

export const renderRoleBadge = (role) => {
  const roleUpper = String(role || "CUSTOMER").toUpperCase();
  switch (roleUpper) {
    case "ADMIN":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
          ADMIN
        </span>
      );
    case "PROVIDER":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300 shadow-2xs">
          PROVIDER
        </span>
      );
    case "CUSTOMER":
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
          CUSTOMER
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
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-[#8C4B3E] hover:underline mb-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
                User Management Directory
              </h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">
                Audit, manage, and inspect all registered customers and service providers in PostgreSQL
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* SEARCH & FILTERS BAR */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, or phone..."
                  className="pl-10 h-10 border-[#E8DCC3] text-xs rounded-xl bg-[#FAF6F0]/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-[#7A7266]">Filter Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 px-3 border border-[#E8DCC3] rounded-xl text-xs font-bold bg-[#FAF6F0] text-[#1F1D1A] cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="CUSTOMER">Customers</option>
                  <option value="PROVIDER">Providers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>
          </Card>

          {/* USERS TABLE */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
            <CardHeader className="p-0 pb-4 border-b border-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#8C4B3E]" />
                <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Registered Accounts</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-4">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E]" />
                </div>
              ) : paginatedUsers.length === 0 ? (
                <p className="text-xs text-stone-500 py-10 text-center">No users match your criteria.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] uppercase font-bold text-[#7A7266]">
                        <th className="pb-3">User</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Verification</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {paginatedUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#FAF6F0]/50">
                          <td className="py-3.5">
                            <div className="font-bold text-[#1F1D1A]">{u.fullName}</div>
                            <div className="text-[11px] text-[#7A7266]">{u.email}</div>
                          </td>
                          <td className="py-3.5">
                            {renderRoleBadge(u.role)}
                          </td>
                          <td className="py-3.5 text-[#5A5146]">{u.phone || "N/A"}</td>
                          <td className="py-3.5">
                            {u.isVerified ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified
                              </span>
                            ) : (
                              <span className="text-amber-700 font-bold text-[11px]">Pending</span>
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            {confirmDeleteId === u.id ? (
                              <div className="inline-flex items-center gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    handleDeleteUser(u.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  className="h-7 px-2 bg-rose-600 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="h-7 px-2 text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConfirmDeleteId(u.id)}
                                className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs cursor-pointer"
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
                    className="h-8 px-3 border-[#E8DCC3] rounded-xl text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs font-bold text-[#5A5146]">Page {currentPage} of {totalPages}</span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="h-8 px-3 border-[#E8DCC3] rounded-xl text-xs"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}
