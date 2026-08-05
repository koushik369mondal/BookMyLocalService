import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  XCircle, 
  MapPin, 
  PhoneCall, 
  Star, 
  Printer, 
  RotateCw, 
  HelpCircle,
  Eye
} from "lucide-react";

export default function BookingActionButtons({ 
  status, 
  bookingId, 
  serviceId, 
  providerPhone,
  onCancel, 
  onReview, 
  onToggleDetails, 
  isExpanded 
}) {
  const s = (status || "pending").toLowerCase();

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8DCC3]/60">
      
      {/* View Details Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleDetails}
        className="border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#5A5146] text-xs font-bold rounded-xl h-9 px-3 flex items-center gap-1.5 cursor-pointer"
      >
        <Eye className="h-3.5 w-3.5 text-[#8C4B3E]" />
        {isExpanded ? "Hide Details" : "View Details"}
      </Button>

      {/* Pending status actions */}
      {s === "pending" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCancel(bookingId)}
          className="border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl h-9 px-3 flex items-center gap-1.5 cursor-pointer"
        >
          <XCircle className="h-3.5 w-3.5 text-rose-600" />
          Cancel Booking
        </Button>
      )}

      {/* Confirmed / Upcoming actions */}
      {(s === "confirmed" || s === "upcoming") && (
        <>
          <Button
            size="sm"
            onClick={onToggleDetails}
            className="bg-[#8C4B3E] hover:bg-[#723b30] text-white text-xs font-extrabold rounded-xl h-9 px-3.5 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5" />
            Track Booking
          </Button>

          {providerPhone && (
            <a href={`tel:${providerPhone}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#5A5146] text-xs font-bold rounded-xl h-9 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                Contact Specialist
              </Button>
            </a>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(bookingId)}
            className="border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-xl h-9 px-3 flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            Cancel
          </Button>
        </>
      )}

      {/* In Progress actions */}
      {s === "in_progress" && (
        <>
          <Button
            size="sm"
            onClick={onToggleDetails}
            className="bg-[#8C4B3E] hover:bg-[#723b30] text-white text-xs font-extrabold rounded-xl h-9 px-3.5 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 animate-pulse text-amber-300" />
            Track Live Specialist
          </Button>

          {providerPhone && (
            <a href={`tel:${providerPhone}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#5A5146] text-xs font-bold rounded-xl h-9 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                Call Specialist
              </Button>
            </a>
          )}
        </>
      )}

      {/* Completed actions */}
      {s === "completed" && (
        <>
          <Button
            size="sm"
            onClick={onReview}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl h-9 px-3.5 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Star className="h-3.5 w-3.5 fill-white text-white" />
            Rate & Review
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintInvoice}
            className="border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#5A5146] text-xs font-bold rounded-xl h-9 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-[#8C4B3E]" />
            Invoice
          </Button>

          {serviceId && (
            <Link to={`/booking/${serviceId}`}>
              <Button
                size="sm"
                className="bg-[#8C4B3E] hover:bg-[#723b30] text-white text-xs font-bold rounded-xl h-9 px-3.5 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Book Again
              </Button>
            </Link>
          )}
        </>
      )}

      {/* Cancelled actions */}
      {s === "cancelled" && serviceId && (
        <Link to={`/booking/${serviceId}`} className="ml-auto">
          <Button
            size="sm"
            className="bg-[#8C4B3E] hover:bg-[#723b30] text-white text-xs font-bold rounded-xl h-9 px-3.5 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Book Again
          </Button>
        </Link>
      )}

    </div>
  );
}
