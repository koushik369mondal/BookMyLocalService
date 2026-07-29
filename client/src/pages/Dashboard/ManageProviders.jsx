import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useManageProviders } from "@/hooks/useManageProviders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  ShieldAlert,
  UserCheck
} from "lucide-react";

export default function ManageProviders() {
  const {
    providers,
    isLoading,
    error,
    successMsg,
    searchQuery,
    setSearchQuery,
    handleVerifyProvider
  } = useManageProviders();

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
                Provider Verification & Directory
              </h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">
                Verify provider credentials and audit listed services in PostgreSQL
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

          {/* SEARCH BAR */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search provider name or email..."
                className="pl-10 h-10 border-[#E8DCC3] text-xs rounded-xl bg-[#FAF6F0]/50"
              />
            </div>
          </Card>

          {/* PROVIDERS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full h-40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E]" />
              </div>
            ) : providers.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-[#E8DCC3] text-center">
                <p className="text-xs text-stone-500 font-bold">No providers found in database.</p>
              </div>
            ) : (
              providers.map((p) => (
                <Card key={p.id} className="border border-[#5A5146]/15 shadow-sm rounded-2xl bg-white p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black text-[#1F1D1A]">{p.fullName}</h3>
                      <p className="text-xs text-[#5A5146]">{p.email}</p>
                      <p className="text-[11px] text-[#7A7266]">{p.phone || "No phone"}</p>
                    </div>

                    {p.isVerified ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        <UserCheck className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        Pending
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#E8DCC3]">
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase">Listed Services: {p.services?.length || 0}</span>
                    {p.services && p.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.services.map((s) => (
                          <span key={s.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF6F0] border border-[#E8DCC3] text-[#1F1D1A]">
                            {s.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    {p.isVerified ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerifyProvider(p.id, false)}
                        className="w-full h-9 border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Revoke Verification
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleVerifyProvider(p.id, true)}
                        className="w-full h-9 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Verify & Approve Provider
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
