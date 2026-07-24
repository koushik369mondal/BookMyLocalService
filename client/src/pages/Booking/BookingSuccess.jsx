import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
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
  Info
} from "lucide-react";

// Predefined services dataset matching the rest of the application
const initialServices = [
  {
    id: 1,
    name: "Deep Home Cleaning Service",
    category: "Home Cleaning",
    providerName: "Sarah Jenkins",
    providerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewsCount: 142,
    price: 35,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    description: "Complete top-to-bottom cleaning of all rooms including dusting, vacuuming, kitchen sanitization, and window washing.",
    availability: "today",
    popularity: 98,
    dateAdded: "2026-07-01",
    badge: "Top Rated"
  },
  {
    id: 2,
    name: "Expert Plumbing & Leak Repair",
    category: "Plumbing",
    providerName: "David Miller",
    providerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Queens, NY",
    rating: 4.8,
    reviewsCount: 98,
    price: 50,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    description: "Resolving leakages, clogged drains, toilet repairs, pipe installations, and hot water heater repair with guarantee.",
    availability: "this-week",
    popularity: 85,
    dateAdded: "2026-06-28",
    badge: "Verified"
  },
  {
    id: 3,
    name: "Licensed Smart Home Wiring",
    category: "Electrical",
    providerName: "Marcus Vance",
    providerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Manhattan, NY",
    rating: 4.9,
    reviewsCount: 115,
    price: 65,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    description: "Installation of smart lighting panels, smart thermostats, EV charger setups, and general home electrical upgrades.",
    availability: "today",
    popularity: 92,
    dateAdded: "2026-07-05",
    badge: "Top Rated"
  }
];

const getArrivalWindow = (timeStr) => {
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

  // Retrieve parameters dynamically
  const bookingId = searchParams.get("bookingId") || `BMLS-${Math.floor(100000 + Math.random() * 900000)}`;
  const serviceId = parseInt(searchParams.get("serviceId")) || 1;
  const provider = initialServices.find(s => s.id === serviceId) || initialServices[0];
  const selectedPrice = parseFloat(searchParams.get("price")) || provider.price;
  const selectedDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const selectedTime = searchParams.get("time") || "10:30 AM";
  const paymentMethod = searchParams.get("paymentMethod") || "card";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case "upi":
        return "UPI Transfer";
      case "netbanking":
        return "Net Banking";
      case "wallet":
        return "Digital Wallet";
      case "cash":
        return "Cash on Job";
      default:
        return "Credit/Debit Card";
    }
  };

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
                <div className="flex items-center gap-4 p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl print:bg-white">
                  <Avatar className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#E8DCC3] shadow-2xs">
                    <AvatarImage src={provider.providerImage} className="object-cover" />
                    <AvatarFallback className="text-lg font-bold bg-[#F0E7D5] text-[#C9A46A]">{provider.providerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge variant="secondary" className="bg-white border-[#E8DCC3] text-[#C9A46A] font-bold rounded-lg text-[9px] uppercase py-0.5 px-2">
                      {provider.category}
                    </Badge>
                    <h3 className="font-bold text-[#1F1D1A] text-base mt-1 leading-snug">{provider.providerName}</h3>
                    <p className="text-xs text-[#7A7266] font-medium truncate max-w-xs">{provider.name}</p>
                  </div>
                </div>
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
                  <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 font-bold rounded-lg text-[10px] py-1 px-3 shrink-0">
                    Paid / Success
                  </Badge>
                  <span className="text-sm font-bold text-[#1F1D1A]">${selectedPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* ARRIVAL NOTICE INFORMATION */}
              <div className="p-4.5 bg-[#F0E7D5]/60 border border-[#E8DCC3] text-[#1F1D1A] rounded-2xl flex items-start gap-3 print:hidden">
                <Info className="h-5 w-5 text-[#C9A46A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs">Estimated Arrival Notification</h4>
                  <p className="text-[11px] text-[#5A5146] leading-relaxed font-medium">
                    Specialist {provider.providerName} will arrive within the estimated window of {getArrivalWindow(selectedTime)}. Please ensure the service area is accessible.
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
