import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  FileText, 
  ChevronRight, 
  Printer, 
  MapPin, 
  Sparkles,
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
  
  // Add 30 mins to estimate arrival window
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
  const navigate = useNavigate();

  // Retrieve parameters dynamically
  const bookingId = searchParams.get("bookingId") || `BMLS-${Math.floor(100000 + Math.random() * 900000)}`;
  const serviceId = parseInt(searchParams.get("serviceId")) || 1;
  const provider = initialServices.find(s => s.id === serviceId) || initialServices[0];
  const selectedPlanName = searchParams.get("plan") || "Standard Package";
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
            {/* Animated Ring Checkmark */}
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs animate-bounce print:w-12 print:h-12 print:animate-none">
              <Check className="h-8 w-8 print:h-6 print:w-6" />
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                Booking Completed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F1D1A] tracking-tight pt-1">Appointment Confirmed!</h1>
              <p className="text-xs sm:text-sm text-[#7A7266] font-medium max-w-md mx-auto leading-relaxed">
                Thank you for scheduling with BookMyLocalService. Your appointment has been registered and scheduled with the specialist.
              </p>
            </div>
          </div>

          {/* MAIN CONFIRMATION CARD */}
          <Card className="border border-[#5A5146]/20 shadow-md bg-white rounded-2xl overflow-hidden print:border-[#5A5146]/20 print:shadow-none">
            
            {/* Header booking ID banner */}
            <div className="bg-[#8C4B3E] text-white py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 print:bg-[#F0E7D5] print:text-[#1F1D1A] print:border-b print:border-[#5A5146]/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7A7266] print:text-[#7A7266] uppercase tracking-wider">Booking Reference:</span>
                <span className="font-extrabold text-xs bg-white/10 text-white print:bg-[#E8DCC3] print:text-[#1F1D1A] py-0.5 px-2.5 rounded-lg border border-white/5 tracking-wider">
                  #{bookingId}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold print:text-emerald-700">
                <ShieldCheck className="h-4.5 w-4.5" />
                Secured Appointment
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              
              {/* SPECIALIST SECTION */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-[#7A7266] uppercase tracking-wider block">Service Specialist</span>
                <div className="flex items-center gap-4 p-4 bg-[#FAF6F0] border border-[#5A5146]/15 rounded-2xl print:bg-white print:border-[#5A5146]/20">
                  <Avatar className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white shadow-2xs">
                    <AvatarImage src={provider.providerImage} className="object-cover" />
                    <AvatarFallback className="text-lg font-bold bg-[#E8DCC3]/40 text-[#1F1D1A]">{provider.providerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge variant="secondary" className="bg-white border-[#5A5146]/20 text-[#8C4B3E] font-bold rounded-lg text-[9px] uppercase py-0.5 px-2">
                      {provider.category}
                    </Badge>
                    <h3 className="font-black text-[#1F1D1A] text-base mt-1 leading-snug">{provider.providerName}</h3>
                    <p className="text-xs text-[#7A7266] font-medium truncate max-w-xs">{provider.name}</p>
                  </div>
                </div>
              </div>

              {/* DATE, TIME, & ARRIVAL ESTIMATE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="flex items-start gap-3 p-4 bg-[#FAF6F0] border border-[#5A5146]/15 rounded-2xl print:bg-white print:border-[#5A5146]/20">
                  <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl shrink-0 mt-0.5">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Date</span>
                    <span className="text-sm font-extrabold text-[#1F1D1A] block mt-0.5">{selectedDate}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3 p-4 bg-[#FAF6F0] border border-[#5A5146]/15 rounded-2xl print:bg-white print:border-[#5A5146]/20">
                  <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl shrink-0 mt-0.5">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Arrival Window</span>
                    <span className="text-sm font-extrabold text-[#1F1D1A] block mt-0.5">{getArrivalWindow(selectedTime)}</span>
                  </div>
                </div>

              </div>

              {/* PAYMENT STATUS WIDGET */}
              <div className="p-4 bg-[#FAF6F0] border border-[#5A5146]/15 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-white print:border-[#5A5146]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <CreditCard className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Payment Details</span>
                    <span className="text-xs font-semibold text-[#8C4B3E] block mt-0.5">
                      {getPaymentLabel(paymentMethod)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center sm:text-right gap-3 sm:flex-col sm:gap-1">
                  <Badge variant="success" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] py-1 px-3 border-0 shrink-0">
                    Paid / Success
                  </Badge>
                  <span className="text-sm font-black text-[#1F1D1A]">${selectedPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* ARRIVAL NOTICE INFORMATION */}
              <div className="p-4.5 bg-[#8C4B3E]/5 border border-violet-950/10 text-[#1F1D1A] rounded-2xl flex items-start gap-3 print:hidden">
                <Info className="h-5 w-5 text-[#1F1D1A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs">Estimated Arrival Notification</h4>
                  <p className="text-[11px] text-[#8C4B3E] leading-relaxed">
                    Specialist {provider.providerName} will arrive within the estimated window of {getArrivalWindow(selectedTime)}. Please ensure the service area is accessible. You can coordinate details directly in the dashboard.
                  </p>
                </div>
              </div>

              {/* NOTIFICATION NOTE */}
              <p className="text-[11px] text-[#7A7266] text-center font-semibold pt-2 border-t border-[#5A5146]/15">
                📬 A confirmation email invoice and SMS alert has been dispatched to your registered contact credentials.
              </p>

            </CardContent>
          </Card>

          {/* ACTION BUTTON PANEL */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            
            {/* Back Home */}
            <NavLink to="/" className="w-full sm:w-auto order-3 sm:order-1">
              <Button variant="outline" className="w-full border-[#5A5146]/20 hover:bg-[#FAF6F0] text-[#5A5146] font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-1.5">
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </NavLink>

            {/* Dashboard / print actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
              <Button 
                onClick={handlePrint}
                variant="outline" 
                className="w-full sm:w-auto border-[#5A5146]/20 hover:bg-[#FAF6F0] text-[#5A5146] font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
              
              <NavLink to="/customer/dashboard" className="w-full sm:w-auto">
                <Button className="w-full bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white font-extrabold h-11 text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md">
                  View Bookings Dashboard
                  <ChevronRight className="h-4 w-4 text-white/60" />
                </Button>
              </NavLink>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}
