import React from "react";
import { NavLink } from "react-router-dom";
import { Sparkles, Calendar, Clock, MapPin, ChevronRight, PhoneCall, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/currency";
import { BookingStatusBadge, PaymentStatusBadge, getPaymentMethodLabel } from "./BookingStatusBadges";

export default function UpcomingBookingCard({ booking, onToggleDetails }) {
  if (!booking) return null;

  const providerName = typeof booking.provider === "object"
    ? (booking.provider?.fullName || booking.provider?.name || "Verified Local Specialist")
    : "Verified Local Specialist";

  const providerId = typeof booking.provider === "object"
    ? (booking.provider?.id || booking.provider?._id || booking.providerId)
    : booking.providerId;

  const providerPhone = typeof booking.provider === "object" ? booking.provider?.phone : null;

  return (
    <div className="card-chai p-6 rounded-2xl relative overflow-hidden my-6">
      <div className="relative z-10 space-y-5">
        
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-brand/10 text-brand border border-brand/20">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Upcoming confirmed service
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.bookingStatus || booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} method={booking.paymentMethod} />
          </div>
        </div>

        {/* Core Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="md:col-span-2 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                REF #{booking.id.substring(0, 8)}
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-foreground leading-snug">
                {booking.service?.title || "Local service appointment"}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5 bg-card/60 px-3 py-1.5 rounded-lg border border-border/80">
                <Calendar className="h-3.5 w-3.5 text-foreground" />
                {booking.date}
              </span>
              <span className="flex items-center gap-1.5 bg-card/60 px-3 py-1.5 rounded-lg border border-border/80">
                <Clock className="h-3.5 w-3.5 text-foreground" />
                {booking.time}
              </span>
              {providerId ? (
                <NavLink to={`/providers/${providerId}`} className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium hover:underline">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {providerName}
                </NavLink>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {providerName}
                </span>
              )}
            </div>
          </div>

          {/* Right Action Block */}
          <div className="card-chai p-4 rounded-xl space-y-3 text-right">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Total settlement</span>
              <span className="text-2xl font-mono font-medium text-foreground">{formatPrice(booking.total, { decimals: true })}</span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                Method: {getPaymentMethodLabel(booking.paymentMethod)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 pt-1">
              <Button
                onClick={() => onToggleDetails(booking.id)}
                variant="solid"
                className="w-full text-xs h-9 justify-center cursor-pointer"
              >
                Track specialist
              </Button>

              {providerPhone && (
                <a href={`tel:${providerPhone}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full text-xs h-9 justify-center cursor-pointer"
                  >
                    <PhoneCall className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                    Call specialist
                  </Button>
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
