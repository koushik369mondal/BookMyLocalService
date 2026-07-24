import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCards from "../../components/navigation/DashboardCards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  ArrowDownRight,
  Info,
  Clock,
  Layers
} from "lucide-react";

// Mock earnings database records
const monthlyEarnings = [
  { month: "Jan", amount: 650 },
  { month: "Feb", amount: 800 },
  { month: "Mar", amount: 1100 },
  { month: "Apr", amount: 950 },
  { month: "May", amount: 1300 },
  { month: "Jun", amount: 1550 }
];

// Mock Initial Bookings list
const initialBookings = [
  { id: "BMLS-98394", customerName: "Amanda Watson", serviceName: "Deep Home Cleaning Service", date: "2026-07-10", time: "10:30 AM", price: 55.00, status: "pending", location: "Brooklyn, NY" },
  { id: "BMLS-88294", customerName: "Robert Garcia", serviceName: "Window Washing Service", date: "2026-07-12", time: "01:00 PM", price: 30.00, status: "confirmed", location: "Queens, NY" },
  { id: "BMLS-77291", customerName: "Sarah Connor", serviceName: "Sofa & Carpet Sanitization", date: "2026-07-05", time: "03:30 PM", price: 90.00, status: "completed", location: "Manhattan, NY" },
  { id: "BMLS-66381", customerName: "Jessica Alba", serviceName: "Deep Home Cleaning Service", date: "2026-07-02", time: "11:00 AM", price: 110.00, status: "cancelled", location: "Manhattan, NY" }
];

// Mock Initial Services
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
        return <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-extrabold rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider">Pending</span>;
      case "confirmed":
        return <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 font-extrabold rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider">Confirmed</span>;
      case "completed":
        return <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-extrabold rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider">Completed</span>;
      default:
        return <span className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-extrabold rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider">Cancelled</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-slate-50/60 min-h-screen pb-16 font-sans">
        
        {/* TOP PATH BANNER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 relative overflow-hidden shadow-md">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 fill-amber-400" /> Provider Operations Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome back, Sarah 👋</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Manage dispatch schedules, payouts statistics, rating reviews, and service rates</p>
            </div>
            
            {/* Quick Actions Panel */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                onClick={() => setIsAddServiceOpen(true)}
                size="sm" 
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold px-5 h-10 shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Catalog Service
              </Button>
              <Link to="/profile">
                <Button size="sm" className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-xs font-bold px-5 h-10 backdrop-blur-xs transition-all">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* OVERVIEW STATS BOARD */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-slate-200/80 bg-white p-5 rounded-2xl shadow-xs space-y-3">
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
              <div className="border border-slate-200/90 shadow-xs hover:shadow-lg bg-white p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Earnings</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/60 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">${totalEarnings.toFixed(2)}</div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>+12.4% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Total Bookings */}
              <div className="border border-slate-200/90 shadow-xs hover:shadow-lg bg-white p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</span>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/60 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalBookingsCount}</div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>+8.1% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Rating Score */}
              <div className="border border-slate-200/90 shadow-xs hover:shadow-lg bg-white p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating Score</span>
                  <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl border border-amber-100/60 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{ratingAvg} <span className="text-xs text-slate-400 font-normal">/ 5.0</span></div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>+0.2 rating points</span>
                  </div>
                </div>
              </div>

              {/* Active Services */}
              <div className="border border-slate-200/90 shadow-xs hover:shadow-lg bg-white p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Services</span>
                  <div className="p-2.5 bg-slate-100 text-slate-900 rounded-xl border border-slate-200/60 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{services.length}</div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mt-1">
                    <Layers className="h-3.5 w-3.5 text-slate-400" />
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
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
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
              <div className="border border-slate-200 rounded-2xl bg-white p-6">
                <div className="pb-5 border-b border-slate-100 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-xs">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Earnings & Revenue Overview</h3>
                      <p className="text-xs text-slate-500">Visual performance of month-on-month revenues</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-600 bg-slate-100 py-1 px-3 rounded-full border border-slate-200/80">
                    Last 6 Months
                  </span>
                </div>

                <div className="pt-6">
                  {/* Styled SVG Chart layout */}
                  <div className="w-full overflow-x-auto pb-2">
                    <div className="min-w-[450px] h-[190px] relative">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                        {/* Grid lines */}
                        <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="20" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="20" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="20" y1="145" x2="480" y2="145" stroke="#e2e8f0" strokeWidth="1.5" />

                        {/* Spline Area Fill */}
                        <path
                          d={`M 20,145 L ${points} L 480,145 Z`}
                          fill="url(#gradient)"
                          opacity="0.2"
                        />

                        {/* Spline Line */}
                        <polyline
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
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
                                fill="#ffffff"
                                stroke="#f59e0b"
                                strokeWidth="3"
                                className="transition-transform group-hover:scale-125"
                              />
                              
                              {/* Hover tooltip amount */}
                              <text
                                x={x}
                                y={y - 12}
                                textAnchor="middle"
                                className="text-[11px] font-extrabold fill-slate-900 bg-white"
                              >
                                ${e.amount}
                              </text>

                              {/* Month label */}
                              <text
                                x={x}
                                y={chartHeight + 14}
                                textAnchor="middle"
                                className="text-[11px] font-bold fill-slate-400"
                              >
                                {e.month}
                              </text>
                            </g>
                          );
                        })}

                        {/* Gradients definition */}
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ffffff" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT BOOKINGS & STATUS CARD */}
              <div className="border border-slate-200 rounded-2xl bg-white p-6">
                <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Job Board Requests</h3>
                    <p className="text-xs text-slate-500">Accept, decline, or complete bookings scheduled</p>
                  </div>

                  {/* Filter Switcher */}
                  <div className="flex bg-slate-100 p-1 rounded-xl h-10 overflow-x-auto shrink-0 border border-slate-200/60">
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
                            ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                            : "text-slate-500 hover:text-slate-800"
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
                      <div className="p-3 bg-slate-100 text-slate-400 rounded-full">
                        <Info className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">No Bookings Found</h4>
                      <p className="text-xs text-slate-500 max-w-xs">
                        No requests match the selected status. Try switching filters to view all active requests.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setBookingFilter("all")}
                        className="rounded-xl border-slate-200 text-xs font-semibold h-9 mt-1"
                      >
                        View All Bookings
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-3">Ref ID</th>
                            <th className="py-3 px-3">Customer</th>
                            <th className="py-3 px-3">Date & Time</th>
                            <th className="py-3 px-3">Service</th>
                            <th className="py-3 px-3">Price</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                              <td className="py-3.5 px-3 font-bold text-slate-900">{b.id}</td>
                              <td className="py-3.5 px-3">
                                <span className="block text-slate-900 font-bold">{b.customerName}</span>
                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5"><MapPin className="h-3 w-3" /> {b.location}</span>
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="block font-semibold">{b.date}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{b.time}</span>
                              </td>
                              <td className="py-3.5 px-3 truncate max-w-[140px] font-semibold text-slate-800">{b.serviceName}</td>
                              <td className="py-3.5 px-3 font-extrabold text-slate-900">${b.price.toFixed(2)}</td>
                              <td className="py-3.5 px-3">{getStatusBadge(b.status)}</td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  {b.status === "pending" && (
                                    <>
                                      <Button
                                        size="xs"
                                        onClick={() => handleBookingStatus(b.id, "confirmed")}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 rounded-xl text-xs px-3 shadow-xs"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => handleBookingStatus(b.id, "cancelled")}
                                        className="border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold h-8 rounded-xl text-xs px-3 bg-white"
                                      >
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                  {b.status === "confirmed" && (
                                    <Button
                                      size="xs"
                                      onClick={() => handleBookingStatus(b.id, "completed")}
                                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold h-8 rounded-xl text-xs px-3 shadow-xs"
                                    >
                                      Mark Completed
                                    </Button>
                                  )}
                                  {b.status === "completed" && (
                                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="h-4 w-4" /> Settled
                                    </span>
                                  )}
                                  {b.status === "cancelled" && (
                                    <span className="text-xs text-rose-500 font-bold flex items-center gap-1">
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
              <div className="border border-slate-200 rounded-2xl bg-white p-6 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Specialist Profile</span>
                
                <div className="flex items-center gap-3.5 p-4 bg-slate-50/80 border border-slate-200/70 rounded-2xl">
                  <Avatar className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-xs">
                    <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" className="object-cover" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-extrabold rounded-full text-[10px] uppercase px-2.5 py-0.5 inline-block">
                      Verified Specialist
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1 leading-snug">Sarah Jenkins</h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-0.5 mt-0.5"><MapPin className="h-3 w-3 text-slate-400" /> Brooklyn, NY</p>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-slate-100 pt-3.5 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>Active Tier:</span>
                    <span className="text-slate-900 flex items-center gap-1 font-bold"><Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" /> Pro Platinum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Jobs:</span>
                    <span className="font-bold text-slate-900">142 Service Bookings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction Score:</span>
                    <span className="font-bold text-emerald-600">99% Positive</span>
                  </div>
                </div>
              </div>

              {/* LIVE NOTIFICATIONS / ALERTS */}
              <div className="border border-slate-200 rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-amber-500" /> Operations Alerts
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Live</span>
                </div>

                <div className="space-y-3">
                  {alerts.map(alt => (
                    <div key={alt.id} className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                      alt.type === "success" 
                        ? "bg-emerald-50/50 border-emerald-100/80 text-emerald-900"
                        : "bg-slate-50 border-slate-200/80 text-slate-900"
                    }`}>
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                        alt.type === "success" ? "text-emerald-600" : "text-slate-900"
                      }`} />
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-semibold leading-normal">{alt.text}</p>
                        <span className="text-[10px] text-slate-400 font-medium block flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {alt.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICES MANAGEMENT LISTING */}
              <div className="border border-slate-200 rounded-2xl bg-white p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Catalog Services</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">{services.length} items</span>
                </div>

                {services.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No services in your catalog. Click "Add Catalog Service" to create one.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {services.map(svc => (
                      <div key={svc.id} className="flex items-center justify-between p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-white hover:border-slate-300 shadow-2xs group transition-all">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">{svc.category}</span>
                          <h5 className="font-bold text-slate-900 text-xs truncate mt-0.5">{svc.name}</h5>
                          <span className="text-xs font-black text-slate-900 block mt-0.5">${svc.price.toFixed(2)}{svc.type}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteService(svc.id)}
                          className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-50"
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
              <div className="border border-slate-200 rounded-2xl bg-white p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Recent Reviews</span>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> 4.9 Average
                  </span>
                </div>
                
                <div className="space-y-4">
                  {reviews.map(rev => (
                    <div key={rev.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
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
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-slate-900" />
              Add Catalog Service
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 pt-0.5">
              Insert pricing and descriptions to update your public provider listings
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddService} className="space-y-4 pt-3">
            {/* Service Name */}
            <div className="space-y-1.5">
              <Label htmlFor="svcName" className="text-xs font-bold text-slate-700">Service Title</Label>
              <Input
                id="svcName"
                placeholder="e.g. Premium Bathroom Sanitization"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500 rounded-xl text-xs bg-white text-slate-900 placeholder:text-slate-400 shadow-2xs"
                required
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <Label htmlFor="svcCategory" className="text-xs font-bold text-slate-700">Category Group</Label>
              <div className="relative">
                <select
                  id="svcCategory"
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="Home Cleaning">Home Cleaning</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Lawn & Garden">Lawn & Garden</option>
                  <option value="Wellness & Personal">Wellness & Personal</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="svcPrice" className="text-xs font-bold text-slate-700">Price Rate ($/hr)</Label>
              <Input
                id="svcPrice"
                type="number"
                placeholder="e.g. 40"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500 rounded-xl text-xs bg-white text-slate-900 placeholder:text-slate-400 shadow-2xs"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddServiceOpen(false)}
                className="rounded-xl border-slate-200 text-xs h-10 px-6 w-full sm:w-auto hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-6 w-full sm:w-auto transition-all shadow-md"
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
