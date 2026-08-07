import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { formatPrice } from "@/utils/currency";
import { useBookingHistory } from "@/hooks/useBookingHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Search,
  Loader2,
  ShieldAlert,
  ArrowLeft,
  XCircle,
  CheckCircle2,
  Star,
  MapPin,
  Package,
  Printer,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import ReviewModal from "@/components/modals/ReviewModal";
import { BookingStatusBadge, PaymentStatusBadge, getPaymentMethodLabel } from "@/components/booking/BookingStatusBadges";
import BookingProgressTimeline from "@/components/booking/BookingProgressTimeline";
import PaymentSummaryCard from "@/components/booking/PaymentSummaryCard";
import ProviderSummaryCard from "@/components/booking/ProviderSummaryCard";
import BookingActionButtons from "@/components/booking/BookingActionButtons";
import UpcomingBookingCard from "@/components/booking/UpcomingBookingCard";

export default function BookingHistory() {
  const {
    filteredBookings,
    isLoading,
    error,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    handleCancelBooking,
    refetch
  } = useBookingHistory();

  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedBookingId(prev => prev === id ? null : id);
  };

  // Featured upcoming booking for top highlight card
  const upcomingBooking = filteredBookings.find(b => {
    const s = (b.bookingStatus || b.status || "").toLowerCase();
    return s === "confirmed" || s === "upcoming";
  });

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen py-10 font-sans text-[#1F1D1A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">

          {/* HEADER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link to="/customer/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-[#8C4B3E] hover:underline mb-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F1D1A]">My Service Bookings</h1>
              <p className="text-xs text-[#5A5146] font-medium">Track specialist dispatches, service timelines, and payments</p>
            </div>
            
            <Link to="/services">
              <Button size="sm" className="bg-[#8C4B3E] hover:bg-[#723B30] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer">
                + Book New Service
              </Button>
            </Link>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* FEATURED UPCOMING BOOKING HIGHLIGHT CARD */}
          {upcomingBooking && (
            <UpcomingBookingCard
              booking={upcomingBooking}
              onToggleDetails={toggleDetails}
            />
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
                  className="pl-10 h-10 border-[#E8DCC3] text-xs rounded-xl bg-[#FAF6F0]/50 font-medium text-[#1F1D1A]"
                />
              </div>

              <div className="flex bg-[#FAF6F0] border border-[#E8DCC3] p-0.5 rounded-xl h-10 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: "all", label: "All" },
                  { id: "confirmed", label: "Upcoming" },
                  { id: "in_progress", label: "In Progress" },
                  { id: "completed", label: "Completed" },
                  { id: "cancelled", label: "Cancelled" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveStatus(tab.id)}
                    className={`rounded-lg text-[10px] font-extrabold px-3 py-1.5 uppercase transition-all cursor-pointer whitespace-nowrap ${
                      activeStatus === tab.id
                        ? "bg-[#8C4B3E] text-white shadow-2xs"
                        : "text-[#7A7266] hover:text-[#8C4B3E]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* BOOKINGS LIST */}
          <div className="space-y-5">
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
              filteredBookings.map((b) => {
                const bStatus = (b.bookingStatus || b.status || "pending").toLowerCase();
                const isExpanded = expandedBookingId === b.id;

                return (
                  <Card key={b.id} className="border border-[#5A5146]/15 shadow-2xs rounded-3xl bg-white p-5 sm:p-6 transition-all duration-300 hover:border-[#C9A46A]/60">
                    
                    {/* CARD HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DCC3]">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#8C4B3E] bg-[#F0E7D5] border border-[#E8DCC3] px-2 py-0.5 rounded-md">
                            REF #{b.id.substring(0, 8)}
                          </span>
                          <BookingStatusBadge status={bStatus} />
                        </div>
                        
                        <h3 className="text-base sm:text-lg font-black text-[#1F1D1A] leading-snug">
                          {b.service?.title || "Booked Service"}
                        </h3>
                        
                        {/* Schedule with 📅 Date & 🕒 Time */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5A5146] pt-0.5">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#8C4B3E]" />
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#8C4B3E]" />
                            {b.time}
                          </span>
                          {b.plan && (
                            <span className="flex items-center gap-1 text-[11px] text-[#7A7266] bg-[#FAF6F0] px-2 py-0.5 rounded-lg border border-[#E8DCC3]">
                              <Package className="h-3 w-3 text-[#C9A46A]" />
                              {b.plan}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Top Right Quick Summary */}
                      <div className="text-left sm:text-right shrink-0 sm:self-start pt-2 sm:pt-0">
                        <span className="text-xs font-bold text-[#7A7266] block">Settlement Total</span>
                        <span className="text-xl font-black text-[#8C4B3E]">{formatPrice(b.total, { decimals: true })}</span>
                      </div>
                    </div>

                    {/* CARD BODY (GRID LAYOUT) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
                      
                      {/* Left Block: Provider & Timeline */}
                      <div className="lg:col-span-2 space-y-3">
                        <ProviderSummaryCard
                          provider={b.provider}
                          serviceTitle={b.service?.title}
                        />

                        {/* HORIZONTAL TIMELINE */}
                        <BookingProgressTimeline status={bStatus} />
                      </div>

                      {/* Right Block: Payment Summary Card */}
                      <div>
                        <PaymentSummaryCard
                          total={b.total}
                          paymentStatus={b.paymentStatus}
                          paymentMethod={b.paymentMethod}
                        />
                      </div>

                    </div>

                    {/* DYNAMIC ACTION BUTTONS RIBBON */}
                    {confirmCancelId === b.id ? (
                      <div className="flex items-center justify-between gap-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl my-2">
                        <span className="text-xs font-bold text-rose-800">Are you sure you want to cancel this booking?</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => {
                              handleCancelBooking(b.id);
                              setConfirmCancelId(null);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-8 px-3 rounded-xl cursor-pointer"
                          >
                            Yes, Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmCancelId(null)}
                            className="text-xs font-bold h-8 px-3 rounded-xl cursor-pointer text-[#5A5146]"
                          >
                            Keep Booking
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <BookingActionButtons
                        status={bStatus}
                        bookingId={b.id}
                        serviceId={b.serviceId || b.service?.id}
                        providerPhone={typeof b.provider === "object" ? b.provider?.phone : null}
                        reviewStatus={b.reviewStatus}
                        hasReview={Boolean(b.review)}
                        onCancel={(id) => setConfirmCancelId(id)}
                        onReview={() => setReviewBooking(b)}
                        onToggleDetails={() => toggleDetails(b.id)}
                        isExpanded={isExpanded}
                      />
                    )}

                    {/* EXPANDABLE DETAILS PANEL */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-dashed border-[#E8DCC3] space-y-4 bg-[#FAF6F0]/40 p-4.5 rounded-2xl">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8C4B3E]">
                          Detailed Service Breakdown & Audit
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Service Location */}
                          <div className="space-y-1 bg-white p-3 rounded-xl border border-[#E8DCC3]">
                            <span className="text-[10px] font-bold uppercase text-[#7A7266] flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[#8C4B3E]" /> Service Location Address
                            </span>
                            <p className="font-semibold text-[#1F1D1A] leading-relaxed">
                              {b.address || b.userAddress || "Customer Address On File"}
                            </p>
                          </div>

                          {/* Payment Audit Info */}
                          <div className="space-y-1 bg-white p-3 rounded-xl border border-[#E8DCC3]">
                            <span className="text-[10px] font-bold uppercase text-[#7A7266]">Payment Transaction Info</span>
                            <p className="font-semibold text-[#1F1D1A]">
                              Method: {getPaymentMethodLabel(b.paymentMethod)}
                            </p>
                            {b.paymentId && (
                              <p className="text-[11px] text-[#7A7266] font-mono">Txn ID: {b.paymentId}</p>
                            )}
                          </div>
                        </div>

                        {/* Customer Support & Invoice note */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#7A7266] border-t border-[#E8DCC3]/60">
                          <span className="flex items-center gap-1">
                            <HelpCircle className="h-3.5 w-3.5 text-[#C9A46A]" />
                            Need help with this booking? Contact Support 24/7
                          </span>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="font-bold text-[#8C4B3E] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Printer className="h-3.5 w-3.5" /> Print Detailed Receipt
                          </button>
                        </div>
                      </div>
                    )}

                  </Card>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* REVIEW MODAL */}
      <ReviewModal
        isOpen={Boolean(reviewBooking)}
        onClose={() => setReviewBooking(null)}
        booking={reviewBooking}
        onSuccess={() => {
          setReviewBooking(null);
          refetch();
        }}
      />
    </MainLayout>
  );
}

