import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { formatPrice } from "@/utils/currency";
import { servicesService } from "../../services/servicesService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

  const getPaymentLabel = (method) => {
    const isCash = method === "cash" || method === "CASH_ON_JOB";
    if (isCash) return "Cash on Service (Pay to Specialist)";
    return "Online Payment (Razorpay)";
  };

  const providerName = typeof service?.provider === "object"
    ? (service?.provider?.fullName || service?.provider?.name || "Verified Provider")
    : (typeof service?.provider === "string" ? service.provider : (service?.providerName || "Verified Provider"));

  const providerImage = typeof service?.provider === "object"
    ? (service?.provider?.avatar || service?.provider?.imageUrl || service?.imageUrl || "")
    : (service?.providerImage || service?.imageUrl || "");

  const categoryName = typeof service?.category === "object"
    ? (service?.category?.name || service?.category?.title || "Local Service")
    : (typeof service?.category === "string" ? service.category : "Local Service");

  const serviceTitle = typeof service?.title === "string"
    ? service.title
    : (typeof service?.name === "string" ? service.name : (typeof service?.title === "object" ? service?.title?.name || "Booked Service" : "Booked Service"));

  const displayPrice = !isNaN(selectedPriceParam) ? selectedPriceParam : (typeof service?.price === "number" ? service.price : (parseFloat(service?.price) || 1499));

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:py-4">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* CONFIRMATION HERO BLOCK */}
          <div className="text-center space-y-4 print:space-y-2">
            <div className="w-16 h-16 bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/40 rounded-full flex items-center justify-center mx-auto shadow-2xs print:w-12 print:h-12">
              <Check className="h-8 w-8 print:h-6 print:w-6" />
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B522B] bg-[#7DAB7D]/20 border border-[#7DAB7D]/30 rounded-full px-3 py-1">
                Booking Completed
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1D1A] tracking-tight pt-1">Appointment Confirmed!</h1>
              <p className="text-xs sm:text-sm text-[#7A7266] font-medium max-w-md mx-auto leading-relaxed">
                Thank you for scheduling with BookMyLocalService. Your appointment has been registered and scheduled with the specialist.
              </p>
            </div>
          </div>

          {/* MAIN CONFIRMATION CARD */}
          <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl overflow-hidden print:border-[#E8DCC3] print:shadow-none">
            
            {/* Header booking ID banner */}
            <div className="bg-[#F0E7D5] text-[#1F1D1A] py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E8DCC3]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider">Booking Reference:</span>
                <span className="font-bold text-xs bg-white text-[#1F1D1A] py-0.5 px-2.5 rounded-lg border border-[#E8DCC3] tracking-wider">
                  #{bookingId}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#2B522B] font-bold">
                <ShieldCheck className="h-4.5 w-4.5" />
                Secured Appointment
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              
              {/* SPECIALIST SECTION */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Service Specialist</span>
                {loading ? (
                  <div className="h-20 flex items-center justify-center bg-[#FAF6F0] rounded-2xl">
                    <Loader2 className="h-5 w-5 animate-spin text-[#8C4B3E]" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl print:bg-white">
                    <Avatar className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#E8DCC3] shadow-2xs">
                      <AvatarImage src={providerImage} className="object-cover" />
                      <AvatarFallback className="text-lg font-bold bg-[#F0E7D5] text-[#C9A46A]">{providerName?.[0] || "V"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Badge variant="secondary" className="bg-white border-[#E8DCC3] text-[#C9A46A] font-bold rounded-lg text-[9px] uppercase py-0.5 px-2">
                        {categoryName}
                      </Badge>
                      <h3 className="font-bold text-[#1F1D1A] text-base mt-1 leading-snug">{providerName}</h3>
                      <p className="text-xs text-[#7A7266] font-medium truncate max-w-xs">{serviceTitle}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* DATE, TIME, & ARRIVAL ESTIMATE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="flex items-start gap-3 p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl print:bg-white">
                  <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl shrink-0 mt-0.5 border border-[#E8DCC3]">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Date</span>
                    <span className="text-sm font-bold text-[#1F1D1A] block mt-0.5">{selectedDate}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3 p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl print:bg-white">
                  <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl shrink-0 mt-0.5 border border-[#E8DCC3]">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Arrival Window</span>
                    <span className="text-sm font-bold text-[#1F1D1A] block mt-0.5">{getArrivalWindow(selectedTime)}</span>
                  </div>
                </div>

              </div>

              {/* PAYMENT STATUS WIDGET */}
              <div className="p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl shrink-0 border border-[#E8DCC3]">
                    <CreditCard className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Payment Details</span>
                    <span className="text-xs font-bold text-[#1F1D1A] block mt-0.5">
                      {getPaymentLabel(paymentMethod)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center sm:text-right gap-3 sm:flex-col sm:gap-1">
                  {(paymentMethod === "cash" || paymentMethod === "CASH_ON_JOB") ? (
                    <Badge className="bg-amber-50 text-amber-800 border border-amber-300 font-bold rounded-lg text-[10px] py-1 px-3 shrink-0">
                      🟡 Payment Pending
                    </Badge>
                  ) : (
                    <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 font-bold rounded-lg text-[10px] py-1 px-3 shrink-0">
                      🟢 Paid / Success
                    </Badge>
                  )}
                  <span className="text-sm font-bold text-[#1F1D1A]">{formatPrice(displayPrice, { decimals: true })}</span>
                </div>
              </div>

              {/* ARRIVAL NOTICE INFORMATION */}
              <div className="p-4.5 bg-[#F0E7D5]/60 border border-[#E8DCC3] text-[#1F1D1A] rounded-2xl flex items-start gap-3 print:hidden">
                <Info className="h-5 w-5 text-[#C9A46A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs">Estimated Arrival Notification</h4>
                  <p className="text-[11px] text-[#5A5146] leading-relaxed font-medium">
                    Specialist {providerName} will arrive within the estimated window of {getArrivalWindow(selectedTime)}. Please ensure the service area is accessible.
                  </p>
                </div>
              </div>

              {/* NOTIFICATION NOTE */}
              <p className="text-[11px] text-[#7A7266] text-center font-medium pt-2 border-t border-[#E8DCC3]">
                📬 A confirmation email invoice and SMS alert has been dispatched to your registered contact credentials.
              </p>

            </CardContent>
          </Card>

          {/* ACTION BUTTON PANEL */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            
            {/* Back Home */}
            <Link to="/" className="w-full sm:w-auto order-3 sm:order-1">
              <Button variant="outline" className="w-full border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#5A5146] font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-1.5">
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>

            {/* Dashboard / print actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
              <Button 
                onClick={handlePrint}
                variant="outline" 
                className="w-full sm:w-auto border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#5A5146] font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
              
              <Link to="/customer/dashboard" className="w-full sm:w-auto">
                <Button className="w-full bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs border border-[#E8DCC3]">
                  View Bookings Dashboard
                  <ChevronRight className="h-4 w-4 text-white" />
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}
