import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { providerService } from "@/services/providerService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar, Clock, ArrowRight, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ProviderJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchJobs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await providerService.getJobs();
      if (response.success && response.data) {
        setJobs(response.data);
      } else {
        setError(response.message || "Failed to load assigned jobs.");
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError(err.message || "Error fetching assigned jobs from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    setSuccessMsg("");
    setError("");
    try {
      const response = await providerService.updateJobStatus(id, newStatus);
      if (response.success) {
        setSuccessMsg(`Job status updated to ${newStatus}.`);
        setTimeout(() => setSuccessMsg(""), 2500);
        fetchJobs();
      } else {
        setError(response.message || "Failed to update job status.");
      }
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.message || "Failed to update job status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#C9A46A] text-white border-0 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Pending</Badge>;
      case "confirmed":
      case "upcoming":
        return <Badge className="bg-[#5A95C9]/20 text-[#1E4B75] border border-[#5A95C9]/30 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-[#8C4B3E]/20 text-[#8C4B3E] border border-[#8C4B3E]/30 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Cancelled</Badge>;
      default:
        return <Badge className="bg-stone-100 text-stone-700 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Job Board Operations</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Review and process booking requests dispatched by customers</p>
          </div>
        </section>

        {/* JOBS BOARD */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {successMsg && (
            <div className="p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">Assigned Jobs</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Incoming and scheduled dispatch activities from PostgreSQL</CardDescription>
              </div>
              <Badge variant="outline" className="border-[#C9A46A] text-[#1F1D1A] font-bold text-xs">
                {jobs.length} Total Assigned
              </Badge>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              {isLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 text-[#C9A46A] animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold text-[#5A5146]">Loading assigned jobs from database...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase className="h-10 w-10 text-[#7A7266] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#1F1D1A]">No active jobs assigned</p>
                  <p className="text-xs text-[#7A7266] mt-1">When customers book your services, dispatches will appear here instantly</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-[#E8DCC3] p-5 rounded-2xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#C9A46A] shadow-2xs transition-all duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wide">REF ID: {job.id}</span>
                          {getBadge(job.status)}
                        </div>
                        <h4 className="font-bold text-sm text-[#1F1D1A] leading-snug">{job.service}</h4>
                        <p className="text-xs font-medium text-[#5A5146]">
                          Customer: <strong>{job.customer}</strong> ({job.customerPhone})
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-[#5A5146] font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#C9A46A]" /> {job.date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#C9A46A]" /> {job.time}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#C9A46A]" /> {job.address}</span>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 border-[#E8DCC3] pt-4 md:pt-0 flex items-center justify-between md:justify-end gap-6 min-w-[240px]">
                        <div className="text-left md:text-right shrink-0">
                          <span className="text-[9px] font-bold text-[#7A7266] uppercase block tracking-wider">Settlement Rate</span>
                          <span className="text-base font-bold text-[#1F1D1A]">{formatPrice(job.price, { decimals: true })}</span>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          {job.status === "pending" && (
                            <Button
                              size="xs"
                              disabled={updatingId === job.id}
                              onClick={() => handleUpdateStatus(job.id, "confirmed")}
                              className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl h-8 px-3 text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-[#E8DCC3]"
                            >
                              {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm Job"}
                            </Button>
                          )}

                          {(job.status === "confirmed" || job.status === "upcoming" || job.status === "pending") && (
                            <Button
                              size="xs"
                              disabled={updatingId === job.id}
                              onClick={() => handleUpdateStatus(job.id, "completed")}
                              className="bg-[#7DAB7D] hover:bg-[#689468] text-white rounded-xl h-8 px-3 text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-[#E8DCC3]"
                            >
                              {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark Completed"}
                            </Button>
                          )}

                          {job.status === "completed" && (
                            <span className="text-[10px] font-bold text-[#2B522B] bg-[#7DAB7D]/20 px-2.5 py-1 rounded-lg border border-[#7DAB7D]/30 text-center">
                              Job Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
