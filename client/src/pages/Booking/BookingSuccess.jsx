import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { formatPrice } from "@/utils/currency";
import { servicesService } from "../../services/servicesService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProviderAvatar } from "@/components/ui/avatar";
import { getProviderImage } from "@/utils/imageUtils";
import { 
  Check, 
  Calendar, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Home, 
  ChevronRight, 
  Printer, 
  Info,
  Loader2
} from "lucide-react";

import { BookingStatusBadge, PaymentStatusBadge, getPaymentMethodLabel } from "@/components/booking/BookingStatusBadges";

const getArrivalWindow = (timeStr) => {
  if (!timeStr) return "10:00 AM - 10:30 AM";
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return `${timeStr} - ${timeStr}`;
  let hrs = parseInt(match[1]);
  let mins = parseInt(match[2]);
  const meridiem = match[3].toUpperCase();
  
  mins += 30;
  let endHrs = hrs;
  let endMins = mins;
  let endMeridiem = meridiem;
  
  if (endMins >= 60) {
    endMins -= 60;
    endHrs += 1;
    if (endHrs === 12) {
      endMeridiem = meridiem === "AM" ? "PM" : "AM";
    } else if (endHrs > 12) {
      endHrs -= 12;
    }
  }
  
  const endHrsStr = endHrs < 10 ? `0${endHrs}` : `${endHrs}`;
  const endMinsStr = endMins < 10 ? `0${endMins}` : `${endMins}`;
  
  return `${timeStr} - ${endHrsStr}:${endMinsStr} ${endMeridiem}`;
};

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("bookingId") || `BMLS-${Math.floor(100000 + Math.random() * 900000)}`;
  const serviceId = searchParams.get("serviceId");
  const selectedPriceParam = parseFloat(searchParams.get("price"));
  const selectedDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const selectedTime = searchParams.get("time") || "10:30 AM";
  const paymentMethod = searchParams.get("paymentMethod") || "card";

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchServiceData = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }
      try {
        const response = await servicesService.getServiceById(serviceId);
        if (response.success && response.data) {
          setService(response.data);
        }
      } catch (err) {
        console.error("Failed to load service for success page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);

  const handlePrint = () => {
    window.print();
  };

  const providerName = typeof service?.provider === "object"
    ? (service?.provider?.fullName || service?.provider?.name || "Verified Provider")
    : (typeof service?.provider === "string" ? service.provider : (service?.providerName || "Verified Provider"));

  const providerImage = getProviderImage(service?.provider || service);

  const categoryName = typeof service?.category === "object"
    ? (service?.category?.name || service?.category?.title || "Local Service")
    : (typeof service?.category === "string" ? service.category : "Local Service");

  const serviceTitle = typeof service?.title === "string"
    ? service.title
    : (typeof service?.name === "string" ? service.name : (typeof service?.title === "object" ? service?.title?.name || "Booked Service" : "Booked Service"));

  const displayPrice = !isNaN(selectedPriceParam) ? selectedPriceParam : (typeof service?.price === "number" ? service.price : (parseFloat(service?.price) || 1499));

  return (
    <MainLayout>
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans print:py-4">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* CONFIRMATION HERO BLOCK */}
          <div className="text-center space-y-3 print:space-y-2">
            <div className="size-14 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="size-7" />
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-3 py-1">
                Booking completed
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-medium text-foreground tracking-tight pt-1">Appointment confirmed</h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you for scheduling with BookMyLocalService. Your appointment has been registered with the specialist.
              </p>
            </div>
          </div>

          {/* MAIN CONFIRMATION CARD */}
          <div className="card-chai rounded-2xl overflow-hidden print:shadow-none">
            
            {/* Header booking ID banner */}
            <div className="bg-muted/40 py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/80">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Reference:</span>
                <span className="font-mono text-xs bg-card text-foreground py-0.5 px-2.5 rounded-lg border border-border/80">
                  #{bookingId}
                </span>
                <BookingStatusBadge status="CONFIRMED" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                <ShieldCheck className="h-4 w-4" />
                Secured appointment
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              {/* SPECIALIST SECTION */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Service specialist</span>
                {loading ? (
                  <div className="h-20 flex items-center justify-center bg-card/60 rounded-xl border border-border/80">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-card/60 border border-border/80 rounded-xl">
                    <ProviderAvatar
                      provider={service?.provider || { fullName: providerName, profileImage: providerImage }}
                      className="size-12 rounded-full overflow-hidden shrink-0 border border-border/80"
                      size={120}
                    />
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase border border-border/70 bg-card px-2 py-0.5 rounded-md">
                        {categoryName}
                      </span>
                      <h3 className="font-heading font-medium text-foreground text-sm mt-1 leading-snug">{providerName}</h3>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{serviceTitle}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* DATE, TIME, & ARRIVAL ESTIMATE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="flex items-start gap-3 p-4 bg-card/60 border border-border/80 rounded-xl">
                  <div className="p-2 bg-card rounded-lg shrink-0 mt-0.5 border border-border/70 text-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Date</span>
                    <span className="text-sm font-medium text-foreground block mt-0.5">{selectedDate}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3 p-4 bg-card/60 border border-border/80 rounded-xl">
                  <div className="p-2 bg-card rounded-lg shrink-0 mt-0.5 border border-border/70 text-foreground">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Arrival window</span>
                    <span className="text-sm font-medium text-foreground block mt-0.5">{getArrivalWindow(selectedTime)}</span>
                  </div>
                </div>

              </div>

              {/* PAYMENT STATUS WIDGET */}
              <div className="p-4 bg-card/60 border border-border/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-card rounded-lg shrink-0 border border-border/70 text-foreground">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Payment method</span>
                    <span className="text-xs font-medium text-foreground block mt-0.5">
                      {getPaymentMethodLabel(paymentMethod)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center sm:text-right gap-3 sm:flex-col sm:gap-1">
                  <PaymentStatusBadge status={paymentMethod === "cash" || paymentMethod === "CASH_ON_JOB" ? "PENDING" : "PAID"} method={paymentMethod} />
                  <span className="text-sm font-mono font-medium text-foreground">{formatPrice(displayPrice, { decimals: true })}</span>
                </div>
              </div>

              {/* ARRIVAL NOTICE INFORMATION */}
              <div className="p-4 bg-muted/30 border border-border/80 text-foreground rounded-xl flex items-start gap-3 print:hidden">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-heading font-medium text-xs">Estimated arrival notification</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Specialist {providerName} will arrive within the estimated window of {getArrivalWindow(selectedTime)}. Please ensure the service area is accessible.
                  </p>
                </div>
              </div>

              {/* NOTIFICATION NOTE */}
              <p className="text-[11px] text-muted-foreground text-center pt-2 border-t border-border/80">
                A confirmation email invoice and SMS alert has been dispatched to your registered contact credentials.
              </p>

            </div>
          </div>

          {/* ACTION BUTTON PANEL */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            
            {/* Back Home */}
            <Link to="/" className="w-full sm:w-auto order-3 sm:order-1">
              <Button variant="outline" className="w-full h-10 text-xs rounded-xl flex items-center justify-center gap-1.5">
                <Home className="h-4 w-4" />
                Return to home
              </Button>
            </Link>

            {/* Dashboard / print actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
              <Button 
                onClick={handlePrint}
                variant="outline" 
                className="w-full sm:w-auto h-10 text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print invoice
              </Button>
              
              <Link to="/customer/dashboard" className="w-full sm:w-auto">
                <Button variant="solid" className="w-full h-10 text-xs rounded-xl flex items-center justify-center gap-1.5">
                  View bookings
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}
