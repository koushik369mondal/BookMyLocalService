import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useBookingHistory } from "@/hooks/useBookingHistory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Search,
  Loader2,
  ShieldAlert,
  ArrowLeft,
  XCircle,
  CheckCircle2
} from "lucide-react";

export default function BookingHistory() {
  const {
    filteredBookings,
    isLoading,
    error,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    handleCancelBooking
  } = useBookingHistory();

  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#C9A46A] border-0 text-white font-bold rounded-lg px-2 py-0.5 text-[10px] uppercase">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-[#5A95C9]/20 text-[#1E4B75] border-0 font-bold rounded-lg px-2 py-0.5 text-[10px] uppercase">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-lg px-2 py-0.5 text-[10px] uppercase">Cancelled</Badge>;
      default:
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg px-2 py-0.5 text-[10px] uppercase">Completed</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen py-10 font-sans text-[#1F1D1A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link to="/customer/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-[#8C4B3E] hover:underline mb-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F1D1A]">Booking History</h1>
              <p className="text-xs text-[#5A5146] font-medium">Track your service dispatch requests, payments, and schedules</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* FILTERS & SEARCH */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search service title or provider..."
                  className="pl-10 h-10 border-[#E8DCC3] text-xs rounded-xl bg-[#FAF6F0]/50"
                />
              </div>

              <div className="flex bg-[#FAF6F0] border border-[#E8DCC3] p-0.5 rounded-xl h-10 overflow-x-auto w-full sm:w-auto">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveStatus(tab)}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1.5 uppercase transition-all cursor-pointer whitespace-nowrap ${
                      activeStatus === tab
                        ? "bg-[#8C4B3E] text-white shadow-2xs"
                        : "text-[#7A7266] hover:text-[#8C4B3E]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* BOOKINGS LIST */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white p-12 rounded-3xl border border-[#E8DCC3] text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E] mx-auto" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-[#E8DCC3] text-center space-y-3">
                <p className="text-sm font-bold text-[#1F1D1A]">No Bookings Found</p>
                <p className="text-xs text-[#5A5146]">You have no bookings matching the selected filter criteria.</p>
                <Link to="/services">
                  <Button size="sm" className="bg-[#8C4B3E] text-white text-xs font-bold rounded-xl mt-2 cursor-pointer">
                    Browse Services Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              filteredBookings.map((b) => (
                <Card key={b.id} className="border border-[#5A5146]/15 shadow-2xs rounded-3xl bg-white p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DCC3]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C4B3E]">Booking #{b.id.substring(0, 8)}</span>
                        {getStatusBadge(b.status)}
                      </div>
                      <h3 className="text-base font-black text-[#1F1D1A]">{b.service?.title || "Booked Service"}</h3>
                      <p className="text-xs text-[#5A5146] font-medium">
                        Provider: <strong>{b.provider?.fullName || "Verified Provider"}</strong> ({b.provider?.phone || "N/A"})
                      </p>
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <span className="text-xl font-black text-[#8C4B3E] block">₹{b.total}</span>
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Package: {b.plan}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 text-xs text-[#5A5146]">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-[#8C4B3E]" />
                        <span>Date: <strong>{b.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#8C4B3E]" />
                        <span>Time: <strong>{b.time}</strong></span>
                      </div>
                    </div>

                    <div>
                      {b.status !== "cancelled" && b.status !== "completed" && (
                        confirmCancelId === b.id ? (
                          <div className="inline-flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                handleCancelBooking(b.id);
                                setConfirmCancelId(null);
                              }}
                              className="h-8 px-3 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Confirm Cancel
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setConfirmCancelId(null)}
                              className="h-8 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Back
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirmCancelId(b.id)}
                            className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Cancel Booking
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
