import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { providerService } from "@/services/providerService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert,
  PlayCircle,
  XCircle,
  Star
} from "lucide-react";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/booking/BookingStatusBadges";

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

  const handleUpdateStatus = async (id, action) => {
    setUpdatingId(id);
    setSuccessMsg("");
    setError("");
    try {
      const response = await providerService.updateJobStatus(id, action);
      if (response.success) {
        setSuccessMsg(`Job status updated successfully.`);
        setTimeout(() => setSuccessMsg(""), 2500);
        fetchJobs();
      } else {
        setError(response.message || "Failed to update job status.");
      }
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.response?.data?.message || err.message || "Failed to update job status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkAsPaid = async (id) => {
    setUpdatingId(id);
    setSuccessMsg("");
    setError("");
    try {
      const response = await providerService.markAsPaid(id);
      if (response.success) {
        setSuccessMsg("Payment marked as PAID successfully.");
        setTimeout(() => setSuccessMsg(""), 2500);
        fetchJobs();
      } else {
        setError(response.message || "Failed to mark payment as paid.");
      }
    } catch (err) {
      console.error("Mark as paid error:", err);
      setError(err.message || "Failed to mark payment as paid.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Job Board Operations</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Accept, start, and complete service dispatches for local clients</p>
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
                <CardDescription className="text-xs text-[#7A7266]">Lifecycle pipeline: PENDING → CONFIRMED → IN_SERVICE → COMPLETED → REVIEWED</CardDescription>
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
                  {jobs.map((job) => {
                    const jStatus = (job.bookingStatus || job.status || "pending").toLowerCase();
                    const isReviewed = job.reviewStatus === "REVIEWED" || Boolean(job.review);

                    return (
                      <div key={job.id} className="border border-[#E8DCC3] p-5 rounded-2xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#C9A46A] shadow-2xs transition-all duration-300">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-[10px] font-black text-[#1F1D1A] bg-[#F0E7D5] border border-[#E8DCC3] px-2 py-0.5 rounded-md uppercase tracking-wide">
                              REF ID: #{job.id.substring(0, 8)}
                            </span>
                            <BookingStatusBadge status={jStatus} />
                            <PaymentStatusBadge status={job.paymentStatus} method={job.paymentMethod} />
                            {isReviewed && (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold rounded-lg px-2 py-0.5 text-[10px] uppercase shadow-2xs">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Reviewed
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-base text-[#1F1D1A] leading-snug">{job.service}</h4>
                          <p className="text-xs font-semibold text-[#5A5146]">
                            Customer: <strong className="text-[#1F1D1A] font-extrabold">{job.customer}</strong> ({job.customerPhone})
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-[#1F1D1A] font-bold">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#8C4B3E]" /> {job.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#8C4B3E]" /> {job.time}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#8C4B3E]" /> {job.address}</span>
                          </div>
                        </div>

                        <div className="border-t md:border-t-0 border-[#E8DCC3] pt-4 md:pt-0 flex items-center justify-between md:justify-end gap-6 min-w-[240px]">
                          <div className="text-left md:text-right shrink-0">
                            <span className="text-[9px] font-black text-[#8C4B3E] uppercase block tracking-wider">Settlement Rate</span>
                            <span className="text-lg font-black text-[#1F1D1A]">{formatPrice(job.price, { decimals: true })}</span>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            {/* PENDING: Accept or Reject */}
                            {jStatus === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="xs"
                                  disabled={updatingId === job.id}
                                  onClick={() => handleUpdateStatus(job.id, "accept")}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-8 px-3 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer border border-emerald-800 shadow-2xs"
                                >
                                  {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle2 className="h-3.5 w-3.5" /> Accept</>}
                                </Button>
                                <Button
                                  size="xs"
                                  variant="outline"
                                  disabled={updatingId === job.id}
                                  onClick={() => handleUpdateStatus(job.id, "reject")}
                                  className="border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl h-8 px-3 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><XCircle className="h-3.5 w-3.5" /> Reject</>}
                                </Button>
                              </div>
                            )}

                            {/* CONFIRMED: Start Service or Cancel */}
                            {(jStatus === "confirmed" || jStatus === "upcoming") && (
                              <div className="flex gap-2">
                                <Button
                                  size="xs"
                                  disabled={updatingId === job.id}
                                  onClick={() => handleUpdateStatus(job.id, "start")}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-8 px-3.5 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer shadow-2xs"
                                >
                                  {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><PlayCircle className="h-3.5 w-3.5" /> Start Service</>}
                                </Button>
                                <Button
                                  size="xs"
                                  variant="outline"
                                  disabled={updatingId === job.id}
                                  onClick={() => handleUpdateStatus(job.id, "reject")}
                                  className="border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl h-8 px-2.5 text-[10px] font-bold cursor-pointer"
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}

                            {/* IN_PROGRESS / IN_SERVICE: Complete Service */}
                            {(jStatus === "in_progress" || jStatus === "in_service") && (
                              <Button
                                size="xs"
                                disabled={updatingId === job.id}
                                onClick={() => handleUpdateStatus(job.id, "complete")}
                                className="bg-[#7DAB7D] hover:bg-[#689468] text-white rounded-xl h-8.5 px-4 text-[10px] font-black flex items-center gap-1.5 cursor-pointer border border-[#E8DCC3] shadow-xs"
                              >
                                {updatingId === job.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><CheckCircle2 className="h-4 w-4" /> Complete Service</>}
                              </Button>
                            )}

                            {/* Cash Settlement Action */}
                            {job.paymentStatus !== "PAID" && (jStatus === "completed" || jStatus === "in_progress") && (
                              <Button
                                size="xs"
                                disabled={updatingId === job.id}
                                onClick={() => handleMarkAsPaid(job.id)}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-8 px-3 text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-emerald-800 shadow-2xs"
                              >
                                {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "💵 Mark Cash as Paid"}
                              </Button>
                            )}

                            {/* COMPLETED STATUS BADGES */}
                            {jStatus === "completed" && (
                              <span className="text-[10px] font-bold text-[#2B522B] bg-[#7DAB7D]/20 px-2.5 py-1 rounded-lg border border-[#7DAB7D]/30 text-center">
                                {isReviewed ? "Completed & Reviewed" : "Completed (Awaiting Review)"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
