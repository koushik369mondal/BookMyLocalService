import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { bookingsService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CreditCard, 
  Printer, 
  RotateCcw, 
  XCircle, 
  TrendingUp, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  DollarSign,
  AlertCircle,
  FileText,
  Building,
  Check
} from "lucide-react";

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatusTab, setActiveStatusTab] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Interaction actions states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelTargetBooking, setCancelTargetBooking] = useState(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsService.getBookings();
        if (response.success && response.data) {
          const mapped = response.data.map(b => ({
            id: b.id,
            serviceId: b.serviceId,
            providerName: b.provider?.fullName || "",
            providerImage: b.provider?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
            serviceName: b.service?.title || "",
            category: b.service?.category || "",
            date: b.date,
            time: b.time,
            location: b.provider?.location || b.street || "",
            price: b.price,
            plan: b.plan,
            platformFee: b.platformFee,
            tax: b.tax,
            discount: b.discount,
            total: b.total,
            paymentMethod: b.paymentMethod || "card",
            status: b.status,
            dateAdded: b.createdAt ? new Date(b.createdAt).toISOString().split("T")[0] : ""
          }));
          setBookings(mapped);
        } else {
          setError(response.message || "Failed to load bookings.");
        }
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError(err.response?.data?.message || "Failed to load bookings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Loading skeleton simulator on filter changes
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeStatusTab, sortBy]);

  // Dynamic arrival window compute helper
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

  const handleCancelBooking = (booking) => {
    setCancelTargetBooking(booking);
    setIsCancelConfirmOpen(true);
  };

  const executeCancelBooking = async () => {
    if (!cancelTargetBooking) return;
    
    try {
      const response = await bookingsService.updateBooking(cancelTargetBooking.id, {
        status: "cancelled",
        paymentStatus: "refunded"
      });

      if (response.success) {
        const updated = bookings.map(b => {
          if (b.id === cancelTargetBooking.id) {
            return { ...b, status: "cancelled" };
          }
          return b;
        });

        setBookings(updated);
        setIsCancelConfirmOpen(false);
        setCancelTargetBooking(null);
      } else {
        alert(response.message || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(err.response?.data?.message || "Failed to cancel booking. Please try again.");
    }
  };

  const handlePrintInvoice = (booking) => {
    // Generate simple invoice print format
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${booking.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .details { margin-bottom: 40px; }
            .details table { width: 100%; border-collapse: collapse; }
            .details th, .details td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
            .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #888; margin-top: 50px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>BookMyLocalService Invoice</h2>
            <p>Booking ID: #${booking.id}</p>
          </div>
          <div class="details">
            <table>
              <tr><th>Provider</th><td>${booking.providerName} (${booking.category})</td></tr>
              <tr><th>Service</th><td>${booking.serviceName}</td></tr>
              <tr><th>Tier package</th><td>${booking.plan}</td></tr>
              <tr><th>Date & Time</th><td>${booking.date} at ${booking.time}</td></tr>
              <tr><th>Location</th><td>${booking.location}</td></tr>
              <tr><th>Price</th><td>$${booking.price.toFixed(2)}</td></tr>
              <tr><th>Status</th><td>${booking.status.toUpperCase()}</td></tr>
            </table>
          </div>
          <div class="footer">
            <p>Thank you for choosing BookMyLocalService. Secure SSL Transaction Authorized.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  // Filter & Sort math calculation
  const filteredBookings = React.useMemo(() => {
    let result = [...bookings];

    // Search query matching
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.providerName.toLowerCase().includes(q) || 
        b.serviceName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }

    // Status tabs matching
    if (activeStatusTab !== "all") {
      result = result.filter(b => b.status === activeStatusTab);
    }

    // Sorting dropdown math
    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "price-desc") {
        return b.price - a.price;
      } else if (sortBy === "price-asc") {
        return a.price - b.price;
      } else { // status
        return a.status.localeCompare(b.status);
      }
    });

    return result;
  }, [bookings, searchQuery, activeStatusTab, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Statistics summaries calculations
  const stats = React.useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === "upcoming").length;
    const completed = bookings.filter(b => b.status === "completed").length;
    const totalSpent = bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + b.price, 0);
    return { total, upcoming, completed, totalSpent };
  }, [bookings]);

  // Color status badge map
  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500 hover:bg-blue-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase">Completed</Badge>;
      default: // cancelled
        return <Badge className="bg-rose-500 hover:bg-rose-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase">Cancelled</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-650 to-indigo-750 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Your Booking History</h1>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Monitor appointments, download invoices, cancel upcoming service orders, or book again</p>
            </div>
            
            {/* Quick dashboard back button */}
            <Link to="/customer/dashboard">
              <Button size="sm" className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-5 h-9.5 backdrop-blur-xs">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 text-blue-200 ml-1" />
              </Button>
            </Link>
          </div>
        </section>

        {/* STATISTICS PANEL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-md">
            
            <div className="text-center space-y-1 py-1">
              <span className="block text-2xl font-black text-slate-900">{stats.total}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
            </div>
            
            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-blue-600">{stats.upcoming}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Upcoming</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-emerald-600">{stats.completed}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Jobs</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-slate-900">${stats.totalSpent.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount Spent</span>
            </div>

          </div>
        </section>

        {/* BOOKINGS LISTINGS CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT ACTIONS CONTROLS: FILTERS, SEARCH AND SORT */}
            <div className="lg:col-span-3 space-y-5 shrink-0">
              
              {/* Search filter */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5 flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-blue-600" /> Search Bookings
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-[50%] translate-y-[-50%] text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <Input 
                    placeholder="Search provider, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9.5 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                  />
                </div>
              </Card>

              {/* Status filtering buttons */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-3 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Filter by Status
                </span>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "all", label: "All Bookings", count: bookings.length },
                    { id: "upcoming", label: "Upcoming", count: bookings.filter(b => b.status === "upcoming").length },
                    { id: "completed", label: "Completed", count: bookings.filter(b => b.status === "completed").length },
                    { id: "cancelled", label: "Cancelled", count: bookings.filter(b => b.status === "cancelled").length }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setActiveStatusTab(opt.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        activeStatusTab === opt.id
                          ? "bg-blue-50 text-blue-600 border-blue-200 font-extrabold"
                          : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className={`text-[10px] py-0.5 px-2 rounded-full font-bold ${
                        activeStatusTab === opt.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"
                      }`}>
                        {opt.count}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sorting filter menu */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5">Sort Options</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="date-desc">Date: Latest First</option>
                    <option value="date-asc">Date: Oldest First</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="status-asc">Status Alphabetical</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

            </div>

            {/* RIGHT COLUMN: BOOKINGS HISTORY CARDS GRID */}
            <main className="lg:col-span-9 space-y-6">
              
              {error ? (
                <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-2xl animate-fade-in shadow-2xs">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                  <div>
                    <span className="font-bold block">Error loading bookings</span>
                    <span className="text-[11px] text-rose-600/90">{error}</span>
                  </div>
                </div>
              ) : isLoading ? (
                /* LOADING SKELETON GHOST CARDS */
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden border border-slate-100 bg-white p-6 rounded-2xl flex flex-col md:flex-row gap-5 animate-pulse">
                      <Skeleton className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-3 w-full flex-1">
                        <div className="h-4 bg-slate-200 w-1/4 rounded"></div>
                        <div className="h-5 bg-slate-200 w-2/3 rounded"></div>
                        <div className="flex gap-4">
                          <div className="h-4 bg-slate-200 w-20 rounded"></div>
                          <div className="h-4 bg-slate-200 w-24 rounded"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-slate-200 w-32 rounded-xl shrink-0 ml-auto self-center"></div>
                    </Card>
                  ))}
                </div>
              ) : paginatedBookings.length === 0 ? (
                /* EMPTY STATE DISPLAY */
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto shadow-2xs mt-4">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">No Bookings Found</h3>
                  <p className="text-xs text-slate-450 max-w-sm leading-relaxed">
                    We couldn't find any booking record matching your selection. Try clearing filters or schedule an appointment with a pro!
                  </p>
                  <Link to="/services">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-2 font-bold text-xs h-9.5 px-6 shadow-md flex items-center gap-1.5">
                      Explore Services Pro
                      <ArrowRight className="h-3.5 w-3.5 text-blue-200" />
                    </Button>
                  </Link>
                </div>
              ) : (
                /* CARDS LISTINGS GRID */
                <>
                  <div className="space-y-4">
                    {paginatedBookings.map((b) => (
                      <Card 
                        key={b.id} 
                        className="group overflow-hidden border border-slate-100 hover:border-slate-200 bg-white p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all duration-300 hover:shadow-md"
                      >
                        
                        {/* Left Details block */}
                        <div className="flex items-center gap-4.5 w-full md:w-auto">
                          {/* Provider Image */}
                          <Avatar className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-2xs">
                            <AvatarImage src={b.providerImage} className="object-cover w-full h-full" alt={b.providerName} />
                            <AvatarFallback>{b.providerName[0]}</AvatarFallback>
                          </Avatar>
                          
                          {/* Info descriptions */}
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">#{b.id}</span>
                              {getStatusBadge(b.status)}
                            </div>
                            
                            <h3 className="font-extrabold text-slate-950 text-sm leading-snug group-hover:text-blue-650 transition-colors">
                              {b.serviceName}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3.5 text-slate-500 text-[11px] font-medium">
                              <span className="text-slate-800 font-bold">{b.providerName}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                {b.date}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                {b.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Actions & Pricing Column */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 md:gap-3 border-t border-slate-50 md:border-0 pt-4.5 md:pt-0 shrink-0">
                          
                          {/* Price Tag */}
                          <div className="flex flex-col md:text-right">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Amount Paid</span>
                            <span className="font-black text-slate-950 text-base">${b.price.toFixed(2)}</span>
                          </div>

                          {/* CTA button layouts */}
                          <div className="flex items-center gap-2">
                            <Button 
                              size="xs" 
                              variant="outline" 
                              onClick={() => handleOpenDetails(b)}
                              className="h-8 text-[10px] font-bold border-slate-200 hover:bg-slate-50 rounded-lg text-slate-650"
                            >
                              View Invoice
                            </Button>
                            
                            {b.status === "upcoming" ? (
                              <Button 
                                size="xs" 
                                variant="outline" 
                                onClick={() => handleCancelBooking(b)}
                                className="h-8 text-[10px] font-bold border-rose-200 bg-white hover:bg-rose-50 text-rose-600 rounded-lg"
                              >
                                Cancel Order
                              </Button>
                            ) : (
                              <Link to={`/services/${b.serviceId}`}>
                                <Button 
                                  size="xs" 
                                  className="h-8 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                  Book Again
                                </Button>
                              </Link>
                            )}
                          </div>

                        </div>

                      </Card>
                    ))}
                  </div>

                  {/* INTERACTIVE PAGINATION PANEL */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-8 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-9 font-semibold text-xs"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1.5" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1.5">
                        {[...Array(totalPages)].map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`h-8 w-8 text-xs font-bold rounded-xl transition-all ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="rounded-xl border-slate-200 text-slate-650 hover:bg-slate-50 h-9 font-semibold text-xs"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </div>
                  )}
                </>
              )}

            </main>
          </div>
        </div>

      </div>

      {/* CONFIRMATION DELETION CANCEL DIALOG */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-600 animate-pulse" />
              Cancel Booking Order
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 pt-0.5">
              This action cannot be undone. Are you sure you want to cancel this booking?
            </DialogDescription>
          </DialogHeader>

          {cancelTargetBooking && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Selected Appointment</span>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white">
                  <AvatarImage src={cancelTargetBooking.providerImage} className="object-cover" />
                  <AvatarFallback>{cancelTargetBooking.providerName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{cancelTargetBooking.providerName}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{cancelTargetBooking.serviceName}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>Date: {cancelTargetBooking.date}</span>
                <span>Amount Refunding: ${cancelTargetBooking.price.toFixed(2)}</span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCancelConfirmOpen(false)}
              className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
            >
              Close
            </Button>
            <Button 
              type="button" 
              onClick={executeCancelBooking}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9.5 px-5 w-full sm:w-auto"
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DETAILED SUMMARY INVOICE MODAL POPUP */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedBooking && (
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-0 overflow-hidden">
            
            {/* Header booking ID banner */}
            <div className="bg-slate-900 text-white py-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ref ID:</span>
                <span className="font-extrabold text-xs bg-white/10 text-white py-0.5 px-2.5 rounded-lg border border-white/5 tracking-wider">
                  #{selectedBooking.id}
                </span>
              </div>
              <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Vetted Invoice
              </span>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Provider Info */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                <Avatar className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-2xs">
                  <AvatarImage src={selectedBooking.providerImage} className="object-cover" />
                  <AvatarFallback>{selectedBooking.providerName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700 font-bold rounded-lg text-[9px] uppercase py-0.5 px-2">
                    {selectedBooking.category}
                  </Badge>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{selectedBooking.providerName}</h4>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{selectedBooking.serviceName}</p>
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex items-start gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700">
                  <Calendar className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
                    <span className="text-xs font-bold block">{selectedBooking.date}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700">
                  <Clock className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Arrival Time</span>
                    <span className="text-xs font-bold block">{getArrivalWindow(selectedBooking.time)}</span>
                  </div>
                </div>
              </div>

              {/* Inclusions breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing Breakdown</span>
                
                <div className="space-y-2 border-b border-slate-100 pb-3 text-xs text-slate-550 font-semibold">
                  <div className="flex justify-between">
                    <span>Service Package ({selectedBooking.plan}):</span>
                    <span>${selectedBooking.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Service Fee:</span>
                    <span>${selectedBooking.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Taxes (8.5%):</span>
                    <span>${selectedBooking.tax.toFixed(2)}</span>
                  </div>
                  {selectedBooking.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Coupon Discount:</span>
                      <span>-${selectedBooking.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-extrabold text-slate-800">Total Charged:</span>
                  <span className="text-base font-black text-slate-900">
                    ${selectedBooking.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <CreditCard className="h-4 w-4" />
                  Method:
                </span>
                <span className="text-slate-800 uppercase">{selectedBooking.paymentMethod}</span>
              </div>

            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <Button 
                type="button" 
                onClick={() => handlePrintInvoice(selectedBooking)}
                className="rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs h-9.5 w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDetailsOpen(false)}
                className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
              >
                Close Invoice
              </Button>
            </DialogFooter>

          </DialogContent>
        )}
      </Dialog>

    </MainLayout>
  );
}
