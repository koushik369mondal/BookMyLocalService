import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  Sliders, 
  Bell, 
  FileText, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  User, 
  ArrowUpRight, 
  Lock,
  Mail,
  Phone,
  Check,
  AlertCircle
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

// Mock Live Alerts
const alerts = [
  { id: 1, text: "New booking request received from Amanda Watson", type: "info" },
  { id: 2, text: "Payout of $1,250.00 has been transferred to your bank account", type: "success" }
];

export default function ProviderDashboard() {
  const navigate = useNavigate();

  // Dashboard states
  const [bookings, setBookings] = useState(initialBookings);
  const [services, setServices] = useState(initialServices);
  const [bookingFilter, setBookingFilter] = useState("all");

  // Add Service modal form state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Home Cleaning");
  const [newServicePrice, setNewServicePrice] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
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
  const chartHeight = 120;
  const chartWidth = 500;
  const points = monthlyEarnings.map((e, index) => {
    const x = (index / (monthlyEarnings.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (e.amount / maxEarnings) * (chartHeight - 30) - 10;
    return `${x},${y}`;
  }).join(" ");

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500 border-0 hover:bg-amber-600 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500 border-0 hover:bg-blue-600 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-emerald-500 border-0 hover:bg-emerald-600 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Completed</Badge>;
      default:
        return <Badge className="bg-rose-500 border-0 hover:bg-rose-600 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Cancelled</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* TOP PATH BANNER */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-650 to-indigo-750 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Provider Operations Portal</h1>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Manage dispatch schedules, payouts statistics, rating reviews, and service rates</p>
            </div>
            
            {/* Quick Actions Panel */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                onClick={() => setIsAddServiceOpen(true)}
                size="sm" 
                className="bg-white text-blue-650 hover:bg-slate-50 rounded-full text-xs font-bold px-5 h-9.5 shadow-md flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Service
              </Button>
              <Link to="/profile">
                <Button size="sm" className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-5 h-9.5 backdrop-blur-xs">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* OVERVIEW STATS BOARD */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Earnings */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Earnings</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${totalEarnings.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            {/* Bookings count */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">{totalBookingsCount}</span>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
            </Card>

            {/* Rating count */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rating Score</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">{ratingAvg} <span className="text-xs text-slate-400 font-semibold">/5</span></span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0">
                <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
              </div>
            </Card>

            {/* Active Services count */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Services</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">{services.length}</span>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                <Activity className="h-6 w-6" />
              </div>
            </Card>

          </div>
        </section>

        {/* DETAILS GRID LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: PAYOUTS CHART & SERVICES */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* EARNINGS GRAPH CARD */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">Earnings Overview</CardTitle>
                      <CardDescription className="text-xs">Visual performance of month-on-month revenues</CardDescription>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-500 bg-slate-100 py-1 px-3 rounded-full border border-slate-200">
                    Last 6 Months
                  </span>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  {/* Styled SVG Chart layout */}
                  <div className="w-full overflow-x-auto pb-2">
                    <div className="min-w-[400px] h-[150px] relative">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                        {/* Grids */}
                        <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="20" y1="55" x2="480" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="20" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="20" y1="110" x2="480" y2="110" stroke="#cbd5e1" strokeWidth="2" />

                        {/* Spline Area Fill */}
                        <path
                          d={`M 20,110 L ${points} L 480,110 Z`}
                          fill="url(#gradient)"
                          opacity="0.15"
                        />

                        {/* Spline Line */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3.5"
                          points={points}
                          strokeLinecap="round"
                        />

                        {/* Point nodes and labels */}
                        {monthlyEarnings.map((e, index) => {
                          const x = (index / (monthlyEarnings.length - 1)) * (chartWidth - 40) + 20;
                          const y = chartHeight - (e.amount / maxEarnings) * (chartHeight - 30) - 10;
                          return (
                            <g key={e.month} className="group cursor-pointer">
                              <circle
                                cx={x}
                                cy={y}
                                r="4.5"
                                fill="#ffffff"
                                stroke="#3b82f6"
                                strokeWidth="3"
                              />
                              
                              {/* Hover tooltip amount */}
                              <text
                                x={x}
                                y={y - 12}
                                textAnchor="middle"
                                className="text-[10px] font-black fill-slate-800 bg-white"
                              >
                                $ {e.amount}
                              </text>

                              {/* Month label */}
                              <text
                                x={x}
                                y={chartHeight + 12}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-slate-400"
                              >
                                {e.month}
                              </text>
                            </g>
                          );
                        })}

                        {/* Gradients definition */}
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#ffffff" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RECENT BOOKINGS & STATUS CARD */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-extrabold text-slate-900">Job Board Requests</CardTitle>
                    <CardDescription className="text-xs">Accept, decline, or complete bookings scheduled</CardDescription>
                  </div>

                  {/* Filter Switcher */}
                  <div className="flex bg-slate-100/70 border border-slate-200 p-0.5 rounded-xl h-9 overflow-x-auto shrink-0 scrollbar-none">
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
                        className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all shrink-0 ${
                          bookingFilter === tab.id
                            ? "bg-white text-blue-650 shadow-2xs border border-slate-100"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-5">
                  {filteredBookings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                      No matching booking requests in this section.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                            <th className="py-2.5 px-1">Ref ID</th>
                            <th className="py-2.5">Customer</th>
                            <th className="py-2.5">Date & Time</th>
                            <th className="py-2.5">Service</th>
                            <th className="py-2.5">Price</th>
                            <th className="py-2.5">Status</th>
                            <th className="py-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-1 font-bold text-slate-450">{b.id}</td>
                              <td className="py-3">
                                <span className="block text-slate-800 font-bold">{b.customerName}</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {b.location}</span>
                              </td>
                              <td className="py-3">
                                <span className="block">{b.date}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{b.time}</span>
                              </td>
                              <td className="py-3 truncate max-w-[130px]">{b.serviceName}</td>
                              <td className="py-3 font-bold text-slate-900">${b.price.toFixed(2)}</td>
                              <td className="py-3">{getStatusBadge(b.status)}</td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  {b.status === "pending" && (
                                    <>
                                      <Button
                                        size="xs"
                                        onClick={() => handleBookingStatus(b.id, "confirmed")}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-7 rounded-lg text-[9px] py-0 px-2"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => handleBookingStatus(b.id, "cancelled")}
                                        className="border-rose-200 hover:bg-rose-50 text-rose-600 font-bold h-7 rounded-lg text-[9px] py-0 px-2 bg-white"
                                      >
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                  {b.status === "confirmed" && (
                                    <Button
                                      size="xs"
                                      onClick={() => handleBookingStatus(b.id, "completed")}
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-7 rounded-lg text-[9px] py-0 px-2"
                                    >
                                      Mark Completed
                                    </Button>
                                  )}
                                  {b.status === "completed" && (
                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                                    </span>
                                  )}
                                  {b.status === "cancelled" && (
                                    <span className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5">
                                      <XCircle className="h-3.5 w-3.5" /> Defunct
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
                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN: PROVIDER PROFILE, ALERTS, AND SERVICES */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* PROVIDER PROFILE CARD */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Specialist Profile</span>
                
                <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <Avatar className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-2xs">
                    <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" className="object-cover" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 font-bold rounded-lg text-[9px] uppercase py-0 px-2 leading-none">
                      Verified Specialist
                    </Badge>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1 leading-snug">Sarah Jenkins</h4>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5"><MapPin className="h-3 w-3" /> Brooklyn, NY</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-550 font-semibold">
                  <div className="flex justify-between">
                    <span>Active Level:</span>
                    <span className="text-blue-650 flex items-center gap-1 font-bold"><Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" /> Pro Platinum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Jobs:</span>
                    <span>142 Service Bookings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trust score:</span>
                    <span>99% Satisfaction</span>
                  </div>
                </div>
              </Card>

              {/* LIVE NOTIFICATIONS / ALERTS */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-blue-600 animate-swing" /> Operations Alerts
                </span>

                <div className="space-y-3">
                  {alerts.map(alt => (
                    <div key={alt.id} className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      alt.type === "success" 
                        ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                        : "bg-blue-50/50 border-blue-100 text-blue-800"
                    }`}>
                      <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                        alt.type === "success" ? "text-emerald-600" : "text-blue-600"
                      }`} />
                      <span className="text-[11px] font-semibold leading-normal">{alt.text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* SERVICES MANAGEMENT LISTING */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Service Management</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{services.length} cataloged</span>
                </div>

                <div className="space-y-2.5">
                  {services.map(svc => (
                    <div key={svc.id} className="flex items-center justify-between p-3 border border-slate-150 rounded-xl bg-white shadow-2xs group hover:border-slate-250 transition-colors">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{svc.category}</span>
                        <h5 className="font-extrabold text-slate-800 text-xs truncate mt-0.5">{svc.name}</h5>
                        <span className="text-[10px] font-black text-slate-900 block mt-0.5">${svc.price.toFixed(2)}{svc.type}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(svc.id)}
                        className="text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* RATINGS & REVIEWS SECTION */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Customer Reviews</span>
                
                <div className="space-y-3.5">
                  {reviews.map(rev => (
                    <div key={rev.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{rev.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-500" />
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">
                        "{rev.comment}"
                      </p>
                      
                      <hr className="border-slate-50 mt-2" />
                    </div>
                  ))}
                </div>
              </Card>

            </div>

          </div>
        </div>

      </div>

      {/* ADD SERVICE DIALOG FORM */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Add Catalog Service
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 pt-0.5">
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
                className="h-9.5 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
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
                  className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
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
                className="h-9.5 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddServiceOpen(false)}
                className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto"
              >
                Add Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </MainLayout>
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
