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
  reviewStatus,
  hasReview,
  onCancel, 
  onReview, 
  onToggleDetails, 
  isExpanded 
}) {
  const s = (status || "pending").toLowerCase();
  const isReviewed = reviewStatus === "REVIEWED" || hasReview;

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/80">
      
      {/* View Details Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleDetails}
        className="text-xs h-8 px-3 flex items-center gap-1.5 cursor-pointer"
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        {isExpanded ? "Hide details" : "View details"}
      </Button>

      {/* Pending status actions */}
      {s === "pending" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCancel(bookingId)}
          className="border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs h-8 px-3 flex items-center gap-1.5 cursor-pointer"
        >
          <XCircle className="h-3.5 w-3.5 text-rose-400" />
          Cancel booking
        </Button>
      )}

      {/* Confirmed / Upcoming actions */}
      {(s === "confirmed" || s === "upcoming") && (
        <>
          <Button
            size="sm"
            variant="solid"
            onClick={onToggleDetails}
            className="text-xs h-8 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5" />
            Track booking
          </Button>

          {providerPhone && (
            <a href={`tel:${providerPhone}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                Contact specialist
              </Button>
            </a>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(bookingId)}
            className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs h-8 px-3 flex items-center gap-1.5 cursor-pointer ml-auto"
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
            variant="solid"
            onClick={onToggleDetails}
            className="text-xs h-8 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 animate-pulse text-brand" />
            Track live
          </Button>

          {providerPhone && (
            <a href={`tel:${providerPhone}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                Call specialist
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
            variant="default"
            onClick={onReview}
            className="text-xs h-8 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <Star className="h-3.5 w-3.5 fill-brand text-brand" />
            {isReviewed ? "View or edit review" : "Leave review"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintInvoice}
            className="text-xs h-8 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            Invoice
          </Button>

          {serviceId && (
            <Link to={`/booking/${serviceId}`}>
              <Button
                size="sm"
                variant="solid"
                className="text-xs h-8 px-3.5 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Book again
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
            variant="solid"
            className="text-xs h-8 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Book again
          </Button>
        </Link>
      )}

    </div>
  );
}
