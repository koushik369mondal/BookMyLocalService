import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  ArrowUpRight, 
  Lock, 
  Settings, 
  Activity, 
  FileText, 
  Check, 
  MapPin,
  ChevronDown,
  DollarSign
} from "lucide-react";

// Mock user growth
const userGrowthData = [
  { month: "Jan", count: 1200 },
  { month: "Feb", count: 1600 },
  { month: "Mar", count: 2100 },
  { month: "Apr", count: 2800 },
  { month: "May", count: 3500 },
  { month: "Jun", count: 4250 }
];

// Mock bookings growth
const bookingsGrowthData = [
  { month: "Jan", count: 450 },
  { month: "Feb", count: 680 },
  { month: "Mar", count: 950 },
  { month: "Apr", count: 1100 },
  { month: "May", count: 1500 },
  { month: "Jun", count: 1840 }
];

// Mock Pending Provider Approvals
const initialApprovals = [
  { id: "1", name: "John Doe", serviceName: "Licensed Smart Home Wiring", email: "john.doe@example.com", category: "Electrical", location: "Manhattan, NY" },
  { id: "2", name: "Mary Smith", serviceName: "Deep Home Cleaning Service", email: "mary.smith@example.com", category: "Home Cleaning", location: "Queens, NY" }
];

// Mock Recent Registered Users
const recentUsers = [
  { name: "Amanda Watson", role: "Customer", email: "amanda@example.com", date: "2026-07-08" },
  { name: "Gary Woods", role: "Provider", email: "gary.woods@example.com", date: "2026-07-07" },
  { name: "Alex Mercer", role: "Provider", email: "alex.m@example.com", date: "2026-07-06" }
];

// Mock Recent Bookings
const recentBookings = [
  { id: "BMLS-98394", customerName: "Amanda Watson", serviceName: "Deep Home Cleaning Service", date: "2026-07-10", price: 55.00, status: "pending" },
  { id: "BMLS-88294", customerName: "Robert Garcia", serviceName: "Window Washing Service", date: "2026-07-12", price: 30.00, status: "confirmed" },
  { id: "BMLS-77291", customerName: "Sarah Connor", serviceName: "Sofa & Carpet Sanitization", date: "2026-07-05", price: 90.00, status: "completed" }
];

// Mock System notifications
const notifications = [
  { id: 1, text: "Server CPU spike detected: 85% utilization (resolved)", type: "warning" },
  { id: 2, text: "Platform database backing backup completed successfully", type: "info" }
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Admin dashboard states
  const [approvals, setApprovals] = useState(initialApprovals);
  const [chartView, setChartView] = useState("users"); // "users" or "bookings"
  const [isLoading, setIsLoading] = useState(true);

  // Quick message states
  const [successMsg, setSuccessMsg] = useState("");

  // Skeleton loader simulator
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [chartView]);

  // Provider approvals handler
  const handleApprovalAction = (id, action) => {
    setApprovals(approvals.filter(a => a.id !== id));
    setSuccessMsg(`Provider ${action === "approve" ? "approved" : "rejected"} successfully.`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Chart calculations
  const activeChartData = chartView === "users" ? userGrowthData : bookingsGrowthData;
  const maxVal = Math.max(...activeChartData.map(d => d.count));
  const chartHeight = 120;
  const chartWidth = 500;

  const barWidth = 35;
  const spacing = (chartWidth - 40) / activeChartData.length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#C9A46A] border-0 text-white font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-[#5A95C9]/20 text-[#1E4B75] border-0 font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Confirmed</Badge>;
      default:
        return <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border-0 font-bold rounded-lg px-2 py-0 text-[9px] uppercase">Completed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
                {user?.fullName ? `Welcome back, ${user.fullName} 👋` : "System Administration 👋"}
              </h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Moderate platform registrations, monitor servers, and audit user dispatch bookings</p>
            </div>
            
            {/* Quick Actions Panel */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl text-xs font-bold px-5 h-9.5 shadow-2xs flex items-center gap-1 border border-[#E8DCC3] cursor-pointer">
                <Settings className="h-4 w-4" /> Manage System
              </Button>
            </div>
          </div>
        </section>

        {/* STATS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Total Users */}
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Users</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">4,250</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Users className="h-6 w-6" />
              </div>
            </Card>

            {/* Service Providers */}
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Providers</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">380</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Briefcase className="h-6 w-6" />
              </div>
            </Card>

            {/* Bookings */}
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Bookings</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">1,840</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
            </Card>

            {/* Revenue */}
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Revenue</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">$42,850</span>
              </div>
              <div className="p-3 bg-amber-50 text-[#C9A46A] rounded-2xl shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: GRAPH CHARTS & LISTS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* ANALYTICS GROWTH CHART */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Platform Analytics</CardTitle>
                      <CardDescription className="text-xs">Monitor monthly growth statistics</CardDescription>
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="flex bg-[#F0E7D5]/70 border border-[#5A5146]/20 p-0.5 rounded-xl h-9 shrink-0">
                    <button
                      type="button"
                      onClick={() => setChartView("users")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                        chartView === "users"
                          ? "bg-white text-[#1F1D1A] shadow-2xs border border-[#5A5146]/15"
                          : "text-[#7A7266] hover:text-[#8C4B3E]"
                      }`}
                    >
                      User Registrations
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartView("bookings")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                        chartView === "bookings"
                          ? "bg-white text-[#1F1D1A] shadow-2xs border border-[#5A5146]/15"
                          : "text-[#7A7266] hover:text-[#8C4B3E]"
                      }`}
                    >
                      Bookings Placed
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  {isLoading ? (
                    <div className="h-[150px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#1F1D1A]" />
                    </div>
                  ) : (
                    /* SVG bar layout */
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="min-w-[400px] h-[150px] relative">
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                          
                          {/* Grids */}
                          <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="20" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="20" y1="110" x2="480" y2="110" stroke="#cbd5e1" strokeWidth="2" />

                          {/* Bars */}
                          {activeChartData.map((d, index) => {
                            const x = index * spacing + 25;
                            const barHeight = (d.count / maxVal) * (chartHeight - 40);
                            const y = chartHeight - barHeight - 20;
                            return (
                              <g key={d.month} className="group cursor-pointer">
                                <rect
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={barHeight}
                                  rx="4"
                                  fill="#3b82f6"
                                  className="transition-colors hover:fill-secondary"
                                />

                                <text
                                  x={x + barWidth / 2}
                                  y={y - 8}
                                  textAnchor="middle"
                                  className="text-[9px] font-black fill-violet-900"
                                >
                                  {d.count}
                                </text>

                                <text
                                  x={x + barWidth / 2}
                                  y={chartHeight - 4}
                                  textAnchor="middle"
                                  className="text-[9px] font-bold fill-stone-500"
                                >
                                  {d.month}
                                </text>
                              </g>
                            );
                          })}

                        </svg>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PENDING APPROVAL REQUESTS */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Provider Approvals Requests</CardTitle>
                    <CardDescription className="text-xs">Moderate new specialist registration claims</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-amber-50 border border-amber-100 text-amber-700 font-bold rounded-lg text-[10px] py-0.5 px-2">
                    {approvals.length} Pending
                  </Badge>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  {approvals.length === 0 ? (
                    <p className="text-center text-xs text-[#7A7266] font-semibold py-6">All provider approvals are processed! Clear slate.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {approvals.map(app => (
                        <div key={app.id} className="border border-[#5A5146]/20 p-4 rounded-2xl bg-white flex flex-col justify-between hover:border-stone-300 transition-colors shadow-2xs">
                          <div>
                            <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">{app.category}</span>
                            <h4 className="font-extrabold text-[#1F1D1A] text-sm mt-1">{app.name}</h4>
                            <span className="block text-[11px] text-[#7A7266] font-semibold mt-0.5">{app.serviceName}</span>
                            <span className="block text-[10px] text-[#7A7266] font-medium flex items-center gap-0.5 mt-2"><MapPin className="h-3 w-3" /> {app.location}</span>
                          </div>

                          <div className="border-t border-stone-50 pt-3 mt-4 flex justify-end gap-2 shrink-0">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleApprovalAction(app.id, "decline")}
                              className="border-rose-200 hover:bg-rose-50 text-rose-600 font-bold h-7 rounded-lg text-[9px] py-0 px-2 bg-white"
                            >
                              Decline
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => handleApprovalAction(app.id, "approve")}
                              className="bg-[#8C4B3E] hover:bg-[#8C4B3E] text-white font-bold h-7 rounded-lg text-[9px] py-0 px-2.5 shadow-2xs"
                            >
                              Approve Pro
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RECENT BOOKINGS TABLE */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-stone-50">
                  <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Recent Global Bookings</CardTitle>
                  <CardDescription className="text-xs">Monitor booking orders audit logs</CardDescription>
                </CardHeader>

                <CardContent className="p-0 pt-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-stone-50 text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
                          <th className="py-2.5 px-1">Ref ID</th>
                          <th className="py-2.5">Customer</th>
                          <th className="py-2.5">Service</th>
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5">Price</th>
                          <th className="py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50 font-medium text-[#8C4B3E]">
                        {recentBookings.map(b => (
                          <tr key={b.id} className="hover:bg-[#FAF6F0] transition-colors">
                            <td className="py-3 px-1 font-bold text-[#7A7266]">{b.id}</td>
                            <td className="py-3 font-bold text-[#1F1D1A]">{b.customerName}</td>
                            <td className="py-3 truncate max-w-[130px]">{b.serviceName}</td>
                            <td className="py-3">{b.date}</td>
                            <td className="py-3 font-black text-[#1F1D1A]">${b.price.toFixed(2)}</td>
                            <td className="py-3 text-right">{getStatusBadge(b.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN: NOTIFICATION, USERS AND SYSTEM STATUS */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* SYSTEM NOTIFICATIONS PANEL */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-stone-50 pb-2.5">System Alerts</span>
                
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3.5 border rounded-xl flex items-start gap-2.5 ${
                      n.type === "warning"
                        ? "bg-rose-50/50 border-rose-100 text-rose-800"
                        : "bg-[#8C4B3E]/5 border-violet-950/10 text-[#1F1D1A]"
                    }`}>
                      <AlertCircle className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                        n.type === "warning" ? "text-rose-600" : "text-[#1F1D1A]"
                      }`} />
                      <span className="text-[11px] font-semibold leading-normal">{n.text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* RECENT USERS LOG */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-stone-50 pb-2.5">New Registrations</span>
                
                <div className="space-y-3.5">
                  {recentUsers.map((u, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-1.5 hover:bg-[#FAF6F0] rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 border border-[#5A5146]/15 overflow-hidden shrink-0 bg-[#FAF6F0] text-[#5A5146] flex items-center justify-center font-bold text-xs">
                          {u.name[0]}
                        </Avatar>
                        <div>
                          <span className="text-xs font-bold text-[#1F1D1A] block leading-tight">{u.name}</span>
                          <span className="text-[9px] text-[#7A7266] font-semibold block mt-0.5">{u.email}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-[#F0E7D5] text-[#5A5146] font-bold rounded-lg text-[8px] py-0 px-2 uppercase leading-none">
                        {u.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* SYSTEM STATUS OVERVIEW */}
              <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-stone-50 pb-2.5">System Status Gauges</span>
                
                <div className="space-y-4 pt-1.5">
                  
                  {/* Database */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-[#7A7266]">Database API Connection</span>
                      <span className="text-emerald-600">99.9% Online</span>
                    </div>
                    <Progress value={99.9} className="h-1.5 bg-[#F0E7D5] [&>div]:bg-emerald-500" />
                  </div>

                  {/* Storage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-[#7A7266]">Image Storage Capacity</span>
                      <span className="text-[#8C4B3E]">42% Used</span>
                    </div>
                    <Progress value={42} className="h-1.5 bg-[#F0E7D5] [&>div]:bg-[#8C4B3E]" />
                  </div>

                  {/* Mail */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-[#7A7266]">Email SMTP Relay Gateway</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5"><Check className="h-3.5 w-3.5" /> Operational</span>
                    </div>
                  </div>

                </div>
              </Card>

            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
