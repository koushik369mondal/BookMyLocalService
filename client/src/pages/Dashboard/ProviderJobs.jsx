import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { providerService } from "@/services/providerService";
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
  Star,
  DollarSign
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
        setSuccessMsg("Payment marked as paid successfully.");
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
      <div className="space-y-6 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Job operations</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Accept, start, and complete service dispatches for local clients</p>
          </div>
          <Badge variant="outline" className="border-white/10 text-neutral-300 font-medium text-xs">
            {jobs.length} total assigned
          </Badge>
        </div>

        {/* FEEDBACK MESSAGES */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* JOBS BOARD */}
        <div className="card-chai p-6 space-y-6">
          <div className="pb-4 border-b border-white/10 flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Assigned jobs</h2>
              <p className="text-xs text-neutral-400">Lifecycle: Pending → Confirmed → In service → Completed</p>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mx-auto mb-3" />
                <p className="text-xs text-neutral-400">Loading assigned jobs from database...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">No active jobs assigned</p>
                <p className="text-xs text-neutral-400 mt-1">When customers book your services, dispatches will appear here instantly</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const jStatus = (job.bookingStatus || job.status || "pending").toLowerCase();
                  const isReviewed = job.reviewStatus === "REVIEWED" || Boolean(job.review);

                  return (
                    <div key={job.id} className="card-chai p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded uppercase">
                            Ref: #{job.id.substring(0, 8)}
                          </span>
                          <BookingStatusBadge status={jStatus} />
                          <PaymentStatusBadge status={job.paymentStatus} method={job.paymentMethod} />
                          {isReviewed && (
                            <span className="inline-flex items-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-md px-2 py-0.5 text-[10px] uppercase font-medium">
                              <Star className="h-3 w-3 fill-amber-400" /> Reviewed
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-base text-white leading-snug">{job.service}</h4>
                        <p className="text-xs text-neutral-400 font-normal">
                          Customer: <strong className="text-neutral-200">{job.customer}</strong> ({job.customerPhone})
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-neutral-400 font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {job.date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {job.time}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.address}</span>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 border-white/10 pt-4 md:pt-0 flex items-center justify-between md:justify-end gap-6 min-w-[240px]">
                        <div className="text-left md:text-right shrink-0">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider">Settlement rate</span>
                          <span className="text-lg font-bold text-white">{formatPrice(job.price, { decimals: true })}</span>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          {/* PENDING: Accept or Reject */}
                          {jStatus === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="xs"
                                variant="solid"
                                disabled={updatingId === job.id}
                                onClick={() => handleUpdateStatus(job.id, "accept")}
                                className="flex items-center gap-1"
                              >
                                {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle2 className="h-3.5 w-3.5" /> Accept</>}
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                disabled={updatingId === job.id}
                                onClick={() => handleUpdateStatus(job.id, "reject")}
                                className="border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center gap-1"
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
                                variant="solid"
                                disabled={updatingId === job.id}
                                onClick={() => handleUpdateStatus(job.id, "start")}
                                className="flex items-center gap-1"
                              >
                                {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><PlayCircle className="h-3.5 w-3.5" /> Start service</>}
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                disabled={updatingId === job.id}
                                onClick={() => handleUpdateStatus(job.id, "reject")}
                                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}

                          {/* IN_PROGRESS / IN_SERVICE: Complete Service */}
                          {(jStatus === "in_progress" || jStatus === "in_service") && (
                            <Button
                              size="xs"
                              variant="solid"
                              disabled={updatingId === job.id}
                              onClick={() => handleUpdateStatus(job.id, "complete")}
                              className="flex items-center gap-1.5"
                            >
                              {updatingId === job.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><CheckCircle2 className="h-4 w-4" /> Complete service</>}
                            </Button>
                          )}

                          {/* Cash Settlement Action */}
                          {job.paymentStatus !== "PAID" && (jStatus === "completed" || jStatus === "in_progress") && (
                            <Button
                              size="xs"
                              variant="outline"
                              disabled={updatingId === job.id}
                              onClick={() => handleMarkAsPaid(job.id)}
                              className="border-white/20 text-white flex items-center gap-1"
                            >
                              {updatingId === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><DollarSign className="h-3.5 w-3.5" /> Mark paid</>}
                            </Button>
                          )}

                          {/* COMPLETED STATUS BADGES */}
                          {jStatus === "completed" && (
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 text-center">
                              {isReviewed ? "Completed & reviewed" : "Completed (awaiting review)"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
