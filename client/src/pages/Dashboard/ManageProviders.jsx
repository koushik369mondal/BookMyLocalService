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
      <div className="bg-[#0a0a0a] min-h-screen pb-16 font-sans text-neutral-100">
        
        {/* HEADER */}
        <section className="bg-neutral-900/40 border-b border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 transition-colors mb-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to admin dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Provider verification and directory
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm font-medium">
                Verify provider credentials and audit listed services
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* SEARCH BAR */}
          <div className="card-chai p-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search provider name or email..."
                className="pl-10 h-10 border-white/10 text-xs rounded-xl bg-white/[0.03] text-neutral-200 placeholder:text-neutral-500 focus:border-white/20"
              />
            </div>
          </div>

          {/* PROVIDERS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full h-40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : providers.length === 0 ? (
              <div className="col-span-full card-chai p-8 text-center">
                <p className="text-xs text-neutral-400 font-medium">No providers found in database.</p>
              </div>
            ) : (
              providers.map((p) => (
                <div key={p.id} className="card-chai p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{p.fullName}</h3>
                      <p className="text-xs text-neutral-400">{p.email}</p>
                      <p className="text-[11px] text-neutral-500">{p.phone || "No phone"}</p>
                    </div>

                    {p.isVerified ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                        <UserCheck className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                        Pending
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Listed services: {p.services?.length || 0}</span>
                    {p.services && p.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.services.map((s) => (
                          <span key={s.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
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
                        className="w-full h-9 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium rounded-xl cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1.5" /> Revoke verification
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="solid"
                        onClick={() => handleVerifyProvider(p.id, true)}
                        className="w-full h-9 text-xs font-medium rounded-xl cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Verify and approve provider
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
