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
    <div className="bg-gradient-to-br from-[#8C4B3E] via-[#753d32] to-[#5a2c22] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden my-6 border border-[#C9A46A]/30">
      
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#C9A46A]/10 pointer-events-none blur-2xl" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-xl" />

      <div className="relative z-10 space-y-5">
        
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-300/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-200">
              Upcoming Confirmed Service
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
              <span className="text-[10px] font-bold tracking-widest text-amber-200/80 uppercase">
                REF #{booking.id.substring(0, 8)}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white">
                {booking.service?.title || "Local Service Appointment"}
              </h2>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-amber-100/90 pt-1">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
                <Calendar className="h-4 w-4 text-amber-300" />
                {booking.date}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
                <Clock className="h-4 w-4 text-amber-300" />
                {booking.time}
              </span>
              {providerId ? (
                <NavLink to={`/providers/${providerId}`} className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold hover:underline">
                  <ShieldCheck className="h-4 w-4" />
                  {providerName}
                </NavLink>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  {providerName}
                </span>
              )}
            </div>
          </div>

          {/* Right Action Block */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-md space-y-3 text-right">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200 block">Total Settlement</span>
              <span className="text-2xl font-black text-white">{formatPrice(booking.total, { decimals: true })}</span>
              <span className="text-[10px] text-amber-100/70 block mt-0.5 font-medium">
                Method: {getPaymentMethodLabel(booking.paymentMethod)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 pt-1">
              <Button
                onClick={() => onToggleDetails(booking.id)}
                className="w-full bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs h-10 rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer border border-amber-300"
              >
                Track Specialist & Details
                <ChevronRight className="h-4 w-4" />
              </Button>

              {providerPhone && (
                <a href={`tel:${providerPhone}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-emerald-300" />
                    Call Specialist
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
