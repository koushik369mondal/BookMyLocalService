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
    return s === "confirmed" || s === "upcoming" || s === "in_progress" || s === "in_service";
  });

  return (
    <MainLayout>
      <div className="min-h-screen py-10 font-sans text-foreground">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">

          {/* HEADER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link to="/customer/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-heading font-medium text-foreground">My service bookings</h1>
              <p className="text-xs text-muted-foreground">Track specialist dispatches, service timelines, and payments</p>
            </div>
            
            <Link to="/services">
              <Button size="sm" variant="solid" className="text-xs">
                + Book new service
              </Button>
            </Link>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-400" />
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
          <div className="card-chai p-3 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search service title or provider..."
                  className="pl-10 h-9 text-xs rounded-xl bg-card/60"
                />
              </div>

              <div className="flex bg-muted/40 border border-border/80 p-0.5 rounded-xl h-9 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: "all", label: "All" },
                  { id: "pending", label: "Pending" },
                  { id: "confirmed", label: "Confirmed" },
                  { id: "in_progress", label: "In Service" },
                  { id: "completed", label: "Completed" },
                  { id: "cancelled", label: "Cancelled" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveStatus(tab.id)}
                    className={`rounded-lg text-[10px] font-mono px-3 py-1 uppercase transition-all cursor-pointer whitespace-nowrap ${
                      activeStatus === tab.id
                        ? "bg-card text-foreground border border-border/80 shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BOOKINGS LIST */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="card-chai p-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card-chai p-12 text-center space-y-3">
                <p className="text-sm font-medium text-foreground">No bookings found</p>
                <p className="text-xs text-muted-foreground">You have no bookings matching the selected filter criteria.</p>
                <Link to="/services">
                  <Button size="sm" variant="default" className="text-xs mt-2 cursor-pointer">
                    Browse services
                  </Button>
                </Link>
              </div>
            ) : (
              filteredBookings.map((b) => {
                const bStatus = (b.bookingStatus || b.status || "pending").toLowerCase();
                const isExpanded = expandedBookingId === b.id;

                return (
                  <div key={b.id} className="card-chai p-5 sm:p-6 transition-all duration-300 hover:border-foreground/30">
                    
                    {/* CARD HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/80 bg-card px-2 py-0.5 rounded-md">
                            REF #{b.id.substring(0, 8)}
                          </span>
                          <BookingStatusBadge status={bStatus} />
                        </div>
                        
                        <h3 className="text-base font-heading font-medium text-foreground leading-snug">
                          {b.service?.title || "Booked service"}
                        </h3>
                        
                        {/* Schedule with Date & Time */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-foreground" />
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-foreground" />
                            {b.time}
                          </span>
                          {b.plan && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-card px-2 py-0.5 rounded-lg border border-border/80">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              {b.plan}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Top Right Quick Summary */}
                      <div className="text-left sm:text-right shrink-0 sm:self-start pt-2 sm:pt-0">
                        <span className="text-xs text-muted-foreground block font-mono">Settlement total</span>
                        <span className="text-xl font-mono font-medium text-foreground">{formatPrice(b.total, { decimals: true })}</span>
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
                        <BookingProgressTimeline 
                          status={bStatus} 
                          reviewStatus={b.reviewStatus} 
                          hasReview={Boolean(b.review)} 
                        />
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
                      <div className="flex items-center justify-between gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl my-2">
                        <span className="text-xs font-medium text-rose-400">Are you sure you want to cancel this booking?</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              handleCancelBooking(b.id);
                              setConfirmCancelId(null);
                            }}
                            className="text-xs h-8 px-3 cursor-pointer"
                          >
                            Yes, cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmCancelId(null)}
                            className="text-xs h-8 px-3 cursor-pointer text-muted-foreground"
                          >
                            Keep booking
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
                      <div className="mt-4 pt-4 border-t border-dashed border-border/80 space-y-4 bg-card/60 p-4 rounded-xl">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Service details and audit
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Service Location */}
                          <div className="space-y-1 bg-card p-3 rounded-xl border border-border/80">
                            <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" /> Dispatch address
                            </span>
                            <p className="font-medium text-foreground leading-relaxed">
                              {b.address || b.userAddress || "Customer address on file"}
                            </p>
                          </div>

                          {/* Payment Audit Info */}
                          <div className="space-y-1 bg-card p-3 rounded-xl border border-border/80">
                            <span className="text-[10px] font-mono uppercase text-muted-foreground">Transaction info</span>
                            <p className="font-medium text-foreground">
                              Method: {getPaymentMethodLabel(b.paymentMethod)}
                            </p>
                            {b.paymentId && (
                              <p className="text-[11px] text-muted-foreground font-mono">Txn ID: {b.paymentId}</p>
                            )}
                          </div>
                        </div>

                        {/* Customer Support & Invoice note */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/70">
                          <span className="flex items-center gap-1">
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                            Need help with this booking? Contact Support 24/7
                          </span>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="font-medium text-foreground hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Printer className="h-3.5 w-3.5" /> Print receipt
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
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

