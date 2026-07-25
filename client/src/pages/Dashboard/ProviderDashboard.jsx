import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCards from "../../components/navigation/DashboardCards";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Activity, 
  Plus, 
  Trash2, 
  Bell, 
  XCircle, 
  Sparkles, 
  MapPin, 
  ArrowUpRight, 
  Info,
  Clock,
  Layers
} from "lucide-react";

// Mock earnings database records
const monthlyEarnings = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 980 },
  { month: "Mar", amount: 1550 },
  { month: "Apr", amount: 1300 },
  { month: "May", amount: 1750 },
  { month: "Jun", amount: 2100 }
];

// Mock Recent Dispatch Activity Bookings
const initialBookings = [
  { id: "BMLS-98394", customerName: "Amanda Watson", serviceName: "Deep Home Cleaning Service", date: "2026-07-15", time: "10:30 AM", price: 55.00, status: "pending", location: "Brooklyn, NY" },
  { id: "BMLS-88294", customerName: "Robert Garcia", serviceName: "Window Washing Service", date: "2026-07-16", time: "01:00 PM", price: 30.00, status: "confirmed", location: "Queens, NY" },
  { id: "BMLS-77291", customerName: "Sarah Connor", serviceName: "Sofa & Carpet Sanitization", date: "2026-07-05", time: "03:30 PM", price: 90.00, status: "completed", location: "Manhattan, NY" }
];

// Mock Catalog Services
const initialServices = [
  { id: 1, name: "Deep Home Cleaning Service", category: "Home Cleaning", price: 35, type: "/hr" },
  { id: 2, name: "Sofa & Carpet Sanitization", category: "Home Cleaning", price: 45, type: "/hr" },
  { id: 3, name: "Window Washing Service", category: "Home Cleaning", price: 30, type: "/hr" }
];

// Mock Customer Reviews
const reviews = [
  { id: 1, name: "Amanda Watson", rating: 5, comment: "Outstanding work by Sarah! She cleaned every nook and corner with high precision. Will definitely book again!", date: "2026-07-05" },
  { id: 2, name: "Sarah Connor", rating: 4.8, comment: "Punctual, professional, and had all bio-safe supplies with her. Left the sofa looking brand new.", date: "2026-07-03" }
];

// Mock Live Alerts with Timestamps
const alerts = [
  { id: 1, text: "New booking request received from Amanda Watson", timestamp: "2 mins ago", type: "info" },
  { id: 2, text: "Payout of $1,250.00 has been transferred to your bank account", timestamp: "1 hour ago", type: "success" }
];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dashboard states
  const [bookings, setBookings] = useState(initialBookings);
  const [services, setServices] = useState(initialServices);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Add Service modal form state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Home Cleaning");
  const [newServicePrice, setNewServicePrice] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Accept / Decline / Complete booking transitions
  const handleBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  // Add Service logic
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    const newSvc = {
      id: Date.now(),
      name: newServiceName,
      category: newServiceCategory,
      price: parseFloat(newServicePrice),
      type: "/hr"
    };

    setServices([...services, newSvc]);
    setIsAddServiceOpen(false);

    // Reset inputs
    setNewServiceName("");
    setNewServicePrice("");
  };

  // Delete Service logic
  const handleDeleteService = (id) => {
    setServices(services.filter(svc => svc.id !== id));
  };

  // Calculations for stats
  const totalEarnings = bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + b.price, 0) + 4760.00;
  const ratingAvg = 4.9;
  const totalBookingsCount = bookings.length + 124;

  const filteredBookings = React.useMemo(() => {
    if (bookingFilter === "all") return bookings;
    return bookings.filter(b => b.status === bookingFilter);
  }, [bookings, bookingFilter]);

  // SVG Chart Dimensions & Computations
  const maxEarnings = Math.max(...monthlyEarnings.map(e => e.amount));
  const chartHeight = 160;
  const chartWidth = 500;
  const points = monthlyEarnings.map((e, index) => {
    const x = (index / (monthlyEarnings.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (e.amount / maxEarnings) * (chartHeight - 40) - 15;
    return `${x},${y}`;
  }).join(" ");

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#C9A46A]/20 text-[#C9A46A] border-[#C9A46A]/30">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-[#5A95C9]/20 text-[#1E4B75] border-[#5A95C9]/30">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border-[#7DAB7D]/30">Completed</Badge>;
      default:
        return <Badge className="bg-[#8C4B3E]/20 text-[#8C4B3E] border-[#8C4B3E]/30">Cancelled</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* TOP LIGHT RETRO HEADER BANNER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A46A] uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 fill-[#C9A46A]" /> Provider Operations Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1D1A] tracking-tight">{user?.fullName ? `Welcome back, ${user.fullName} 👋` : "Welcome back 👋"}</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Manage dispatch schedules, payout statistics, rating reviews, and service rates</p>
            </div>
            
            {/* Quick Actions Panel */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                onClick={() => setIsAddServiceOpen(true)}
                size="sm" 
                className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl text-xs font-bold px-5 h-10 border border-[#E8DCC3] shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Catalog Service
              </Button>
              <Link to="/profile">
                <Button size="sm" variant="outline" className="bg-[#FAF6F0] hover:bg-white text-[#1F1D1A] border-[#E8DCC3] rounded-xl text-xs font-bold px-5 h-10 transition-all shadow-2xs">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* OVERVIEW STATS BOARD */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-[#E8DCC3] bg-white p-5 rounded-2xl shadow-2xs space-y-3">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-8 w-32 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              
              {/* Total Earnings */}
              <div className="border border-[#E8DCC3] shadow-2xs hover:shadow-md bg-white p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider">Total Earnings</span>
                  <div className="p-2.5 bg-[#7DAB7D]/20 text-[#2B522B] rounded-xl border border-[#7DAB7D]/30 group-hover:scale-105 transition-transform duration-200">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-bold text-[#1F1D1A]">${totalEarnings.toFixed(2)}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#2B522B] mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>+12.4% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Total Bookings */}
              <div className="border border-[#E8DCC3] shadow-2xs hover:shadow-md bg-white p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider">Total Bookings</span>
                  <div className="p-2.5 bg-[#5A95C9]/20 text-[#1E4B75] rounded-xl border border-[#5A95C9]/30 group-hover:scale-105 transition-transform duration-200">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-bold text-[#1F1D1A]">{totalBookingsCount}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#1E4B75] mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>+8.1% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Rating Score */}
              <div className="border border-[#E8DCC3] shadow-2xs hover:shadow-md bg-white p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider">Rating Score</span>
                  <div className="p-2.5 bg-[#C9A46A]/20 text-[#C9A46A] rounded-xl border border-[#C9A46A]/30 group-hover:scale-105 transition-transform duration-200">
                    <Star className="h-5 w-5 fill-[#C9A46A] text-[#C9A46A]" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-bold text-[#1F1D1A]">{ratingAvg} <span className="text-xs text-[#7A7266] font-normal">/ 5.0</span></div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#C9A46A] mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>+0.2 rating points</span>
                  </div>
                </div>
              </div>

              {/* Active Services */}
              <div className="border border-[#E8DCC3] shadow-2xs hover:shadow-md bg-white p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider">Active Services</span>
                  <div className="p-2.5 bg-[#F0E7D5] text-[#5A5146] rounded-xl border border-[#E8DCC3] group-hover:scale-105 transition-transform duration-200">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-bold text-[#1F1D1A]">{services.length}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#7A7266] mt-1">
                    <Layers className="h-3.5 w-3.5 text-[#7A7266]" />
                    <span>Active public catalog</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </section>

        {/* QUICK ACTIONS CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7A7266]">
              Quick Shortcuts
            </h3>
          </div>
          <DashboardCards role="PROVIDER" />
        </section>

        {/* DETAILS GRID LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: PAYOUTS CHART & SERVICES */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* EARNINGS GRAPH CARD */}
              <div className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
                <div className="pb-5 border-b border-[#E8DCC3] flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#C9A46A] text-white rounded-xl shadow-2xs">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1F1D1A]">Earnings & Revenue Overview</h3>
                      <p className="text-xs text-[#7A7266]">Visual performance of month-on-month revenues</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#5A5146] bg-[#F0E7D5] py-1 px-3 rounded-full border border-[#E8DCC3]">
                    Last 6 Months
                  </span>
                </div>

                <div className="pt-6">
                  {/* Styled SVG Chart layout */}
                  <div className="w-full overflow-x-auto pb-2">
                    <div className="min-w-[450px] h-[190px] relative">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                        {/* Grid lines */}
                        <line x1="20" y1="20" x2="480" y2="20" stroke="#E8DCC3" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="65" x2="480" y2="65" stroke="#E8DCC3" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="110" x2="480" y2="110" stroke="#E8DCC3" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="145" x2="480" y2="145" stroke="#E8DCC3" strokeWidth="1.5" />

                        {/* Spline Area Fill */}
                        <path
                          d={`M 20,145 L ${points} L 480,145 Z`}
                          fill="url(#retro-gradient)"
                          opacity="0.25"
                        />

                        {/* Spline Line */}
                        <polyline
                          fill="none"
                          stroke="#C9A46A"
                          strokeWidth="3"
                          points={points}
                          strokeLinecap="round"
                        />

                        {/* Point nodes and labels */}
                        {monthlyEarnings.map((e, index) => {
                          const x = (index / (monthlyEarnings.length - 1)) * (chartWidth - 40) + 20;
                          const y = chartHeight - (e.amount / maxEarnings) * (chartHeight - 40) - 15;
                          return (
                            <g key={e.month} className="group cursor-pointer">
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#FAF6F0"
                                stroke="#C9A46A"
                                strokeWidth="2.5"
                                className="transition-transform group-hover:scale-125"
                              />
                              
                              {/* Hover tooltip amount */}
                              <text
                                x={x}
                                y={y - 12}
                                textAnchor="middle"
                                className="text-[11px] font-extrabold fill-[#1F1D1A]"
                              >
                                ${e.amount}
                              </text>

                              {/* Month label */}
                              <text
                                x={x}
                                y={chartHeight + 14}
                                textAnchor="middle"
                                className="text-[11px] font-bold fill-[#7A7266]"
                              >
                                {e.month}
                              </text>
                            </g>
                          );
                        })}

                        {/* Gradients definition */}
                        <defs>
                          <linearGradient id="retro-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#C9A46A" />
                            <stop offset="100%" stopColor="#FAF6F0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT BOOKINGS & STATUS CARD */}
              <div className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
                <div className="pb-5 border-b border-[#E8DCC3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#1F1D1A]">Job Board Requests</h3>
                    <p className="text-xs text-[#7A7266]">Accept, decline, or complete bookings scheduled</p>
                  </div>

                  {/* Filter Switcher */}
                  <div className="flex bg-[#F0E7D5] p-1 rounded-xl h-10 overflow-x-auto shrink-0 border border-[#E8DCC3]">
                    {[
                      { id: "all", label: "All" },
                      { id: "pending", label: "Pending" },
                      { id: "confirmed", label: "Confirmed" },
                      { id: "completed", label: "Completed" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBookingFilter(tab.id)}
                        className={`rounded-lg text-xs font-bold px-3 py-1 transition-all shrink-0 ${
                          bookingFilter === tab.id
                            ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                            : "text-[#5A5146] hover:text-[#1F1D1A]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {filteredBookings.length === 0 ? (
                    /* PROFESSIONAL EMPTY STATE */
                    <div className="py-12 px-4 text-center flex flex-col items-center gap-3">
                      <div className="p-3 bg-[#F0E7D5] text-[#7A7266] rounded-full">
                        <Info className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-[#1F1D1A] text-sm">No Bookings Found</h4>
                      <p className="text-xs text-[#7A7266] max-w-xs">
                        No requests match the selected status. Try switching filters to view all active requests.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setBookingFilter("all")}
                        className="rounded-xl border-[#E8DCC3] bg-[#FAF6F0] text-xs font-bold h-9 mt-1"
                      >
                        View All Bookings
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-[#E8DCC3] bg-[#F0E7D5]/50 text-[#7A7266] font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-3">Ref ID</th>
                            <th className="py-3 px-3">Customer</th>
                            <th className="py-3 px-3">Date & Time</th>
                            <th className="py-3 px-3">Service</th>
                            <th className="py-3 px-3">Price</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC3]/60 font-medium text-[#5A5146]">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-[#FAF6F0] transition-colors duration-150">
                              <td className="py-3.5 px-3 font-bold text-[#1F1D1A]">{b.id}</td>
                              <td className="py-3.5 px-3">
                                <span className="block text-[#1F1D1A] font-bold">{b.customerName}</span>
                                <span className="text-[10px] text-[#7A7266] font-medium flex items-center gap-0.5 mt-0.5"><MapPin className="h-3 w-3" /> {b.location}</span>
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="block font-semibold text-[#1F1D1A]">{b.date}</span>
                                <span className="text-[10px] text-[#7A7266] font-medium">{b.time}</span>
                              </td>
                              <td className="py-3.5 px-3 truncate max-w-[140px] font-semibold text-[#1F1D1A]">{b.serviceName}</td>
                              <td className="py-3.5 px-3 font-bold text-[#1F1D1A]">${b.price.toFixed(2)}</td>
                              <td className="py-3.5 px-3">{getStatusBadge(b.status)}</td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  {b.status === "pending" && (
                                    <>
                                      <Button
                                        size="xs"
                                        onClick={() => handleBookingStatus(b.id, "confirmed")}
                                        className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold h-8 rounded-xl text-xs px-3 shadow-2xs border border-[#E8DCC3]"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => handleBookingStatus(b.id, "cancelled")}
                                        className="border-[#E8DCC3] hover:bg-[#F0E7D5] text-[#8C4B3E] font-bold h-8 rounded-xl text-xs px-3 bg-[#FAF6F0]"
                                      >
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                  {b.status === "confirmed" && (
                                    <Button
                                      size="xs"
                                      onClick={() => handleBookingStatus(b.id, "completed")}
                                      className="bg-[#8C4B3E] hover:bg-[#7A3E32] text-white font-bold h-8 rounded-xl text-xs px-3 shadow-2xs border border-[#E8DCC3]"
                                    >
                                      Mark Completed
                                    </Button>
                                  )}
                                  {b.status === "completed" && (
                                    <span className="text-xs text-[#2B522B] font-bold flex items-center gap-1">
                                      <CheckCircle2 className="h-4 w-4" /> Settled
                                    </span>
                                  )}
                                  {b.status === "cancelled" && (
                                    <span className="text-xs text-[#8C4B3E] font-bold flex items-center gap-1">
                                      <XCircle className="h-4 w-4" /> Defunct
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: PROVIDER PROFILE, ALERTS, AND SERVICES */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* PROVIDER PROFILE CARD */}
              <div className="border border-[#E8DCC3] rounded-2xl bg-white p-6 space-y-4 shadow-2xs">
                <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block">Specialist Profile</span>
                
                <div className="flex items-center gap-3.5 p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl">
                  <Avatar className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#E8DCC3] shadow-2xs">
                    <AvatarImage src={user?.avatar} className="object-cover" />
                    <AvatarFallback className="bg-[#F0E7D5] text-[#C9A46A] font-bold">
                      {user?.fullName ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge variant="mustard" className="text-[9px] mb-1">
                      Verified Specialist
                    </Badge>
                    <h4 className="font-bold text-[#1F1D1A] text-sm leading-snug">{user?.fullName || "Provider Specialist"}</h4>
                    <p className="text-xs text-[#7A7266] font-medium flex items-center gap-0.5 mt-0.5"><MapPin className="h-3 w-3 text-[#7A7266]" /> {user?.city ? `${user.city}, ${user.state || ""}` : "Verified Location"}</p>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-[#E8DCC3] pt-3.5 text-xs text-[#5A5146] font-medium">
                  <div className="flex justify-between">
                    <span>Active Tier:</span>
                    <span className="text-[#1F1D1A] flex items-center gap-1 font-bold"><Sparkles className="h-3.5 w-3.5 text-[#C9A46A] fill-[#C9A46A]" /> Pro Platinum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Jobs:</span>
                    <span className="font-bold text-[#1F1D1A]">142 Service Bookings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction Score:</span>
                    <span className="font-bold text-[#2B522B]">99% Positive</span>
                  </div>
                </div>
              </div>

              {/* LIVE NOTIFICATIONS / ALERTS */}
              <div className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4 border-b border-[#E8DCC3] pb-3">
                  <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-[#C9A46A]" /> Operations Alerts
                  </span>
                  <span className="text-[10px] font-bold text-[#5A5146] bg-[#F0E7D5] px-2 py-0.5 rounded-full border border-[#E8DCC3]">Live</span>
                </div>

                <div className="space-y-3">
                  {alerts.map(alt => (
                    <div key={alt.id} className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                      alt.type === "success" 
                        ? "bg-[#7DAB7D]/10 border-[#7DAB7D]/30 text-[#2B522B]"
                        : "bg-[#FAF6F0] border-[#E8DCC3] text-[#1F1D1A]"
                    }`}>
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                        alt.type === "success" ? "text-[#2B522B]" : "text-[#1F1D1A]"
                      }`} />
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-semibold leading-normal">{alt.text}</p>
                        <span className="text-[10px] text-[#7A7266] font-medium block flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {alt.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICES MANAGEMENT LISTING */}
              <div className="border border-[#E8DCC3] rounded-2xl bg-white p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E8DCC3] pb-3">
                  <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block">Catalog Services</span>
                  <span className="text-xs font-bold text-[#5A5146] bg-[#F0E7D5] px-2.5 py-0.5 rounded-full border border-[#E8DCC3]">{services.length} items</span>
                </div>

                {services.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#7A7266]">
                    No services in your catalog. Click "Add Catalog Service" to create one.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {services.map(svc => (
                      <div key={svc.id} className="flex items-center justify-between p-3.5 border border-[#E8DCC3] rounded-xl bg-[#FAF6F0] hover:bg-white hover:border-[#C9A46A] shadow-2xs group transition-all">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#8C4B3E] uppercase tracking-wider block">{svc.category}</span>
                          <h5 className="font-bold text-[#1F1D1A] text-xs truncate mt-0.5">{svc.name}</h5>
                          <span className="text-xs font-bold text-[#1F1D1A] block mt-0.5">${svc.price.toFixed(2)}{svc.type}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteService(svc.id)}
                          className="text-[#7A7266] hover:text-[#8C4B3E] opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-50"
                          title="Delete Service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RATINGS & REVIEWS SECTION */}
              <div className="border border-[#E8DCC3] rounded-2xl bg-white p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E8DCC3] pb-3">
                  <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block">Recent Reviews</span>
                  <span className="text-xs font-bold text-[#C9A46A] flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#C9A46A]" /> 4.9 Average
                  </span>
                </div>
                
                <div className="space-y-4">
                  {reviews.map(rev => (
                    <div key={rev.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1F1D1A]">{rev.name}</span>
                        <span className="text-[10px] text-[#7A7266] font-semibold">{rev.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-0.5 text-[#C9A46A]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-[#C9A46A] text-[#C9A46A]" />
                        ))}
                      </div>

                      <p className="text-xs text-[#5A5146] leading-relaxed font-normal italic bg-[#FAF6F0] p-2.5 rounded-xl border border-[#E8DCC3]">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* ADD SERVICE DIALOG FORM */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="max-w-md bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1F1D1A] flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#C9A46A]" />
              Add Catalog Service
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7266] pt-0.5">
              Insert pricing and descriptions to update your public provider listings
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddService} className="space-y-4 pt-3">
            {/* Service Name */}
            <div className="space-y-1.5">
              <Label htmlFor="svcName" className="text-xs font-bold text-[#1F1D1A]">Service Title</Label>
              <Input
                id="svcName"
                placeholder="e.g. Premium Bathroom Sanitization"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] placeholder:text-[#7A7266] shadow-2xs"
                required
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <Label htmlFor="svcCategory" className="text-xs font-bold text-[#1F1D1A]">Category Group</Label>
              <div className="relative">
                <select
                  id="svcCategory"
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 border border-[#E8DCC3] focus:outline-none focus:ring-2 focus:ring-[#C9A46A]/20 focus:border-[#C9A46A] rounded-xl bg-white text-xs font-semibold text-[#1F1D1A] cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="Home Cleaning">Home Cleaning</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Lawn & Garden">Lawn & Garden</option>
                  <option value="Wellness & Personal">Wellness & Personal</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7A7266]">
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="svcPrice" className="text-xs font-bold text-[#1F1D1A]">Price Rate ($/hr)</Label>
              <Input
                id="svcPrice"
                type="number"
                placeholder="e.g. 40"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] placeholder:text-[#7A7266] shadow-2xs"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddServiceOpen(false)}
                className="rounded-xl border-[#E8DCC3] bg-[#FAF6F0] text-[#5A5146] hover:bg-[#F0E7D5] text-xs h-10 px-6 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-10 px-6 w-full sm:w-auto transition-all border border-[#E8DCC3] shadow-2xs"
              >
                Add Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}

// Chevron selector icon
function ChevronDown(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
