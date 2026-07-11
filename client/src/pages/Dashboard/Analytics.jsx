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
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  Calendar, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Share2, 
  Download, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Percent, 
  Activity,
  AlertCircle,
  FileSpreadsheet,
  FileText
} from "lucide-react";

// Mock Analytical Charts Datasets
const revenueData = [
  { label: "Mon", val: 4200 },
  { label: "Tue", val: 5600 },
  { label: "Wed", val: 7100 },
  { label: "Thu", val: 6800 },
  { label: "Fri", val: 9200 },
  { label: "Sat", val: 12400 },
  { label: "Sun", val: 8900 }
];

const bookingsData = [
  { label: "Mon", val: 120 },
  { label: "Tue", val: 155 },
  { label: "Wed", val: 210 },
  { label: "Thu", val: 190 },
  { label: "Fri", val: 260 },
  { label: "Sat", val: 380 },
  { label: "Sun", val: 290 }
];

const userGrowthData = [
  { label: "Jan", val: 1200 },
  { label: "Feb", val: 1600 },
  { label: "Mar", val: 2100 },
  { label: "Apr", val: 2800 },
  { label: "May", val: 3500 },
  { label: "Jun", val: 4250 }
];

const providerGrowthData = [
  { label: "Jan", val: 150 },
  { label: "Feb", val: 190 },
  { label: "Mar", val: 240 },
  { label: "Apr", val: 290 },
  { label: "May", val: 330 },
  { label: "Jun", val: 380 }
];

// Mock Demographics (Borough booking distribution)
const demographics = [
  { borough: "Brooklyn, NY", percentage: 42, count: 772 },
  { borough: "Manhattan, NY", percentage: 28, count: 515 },
  { borough: "Queens, NY", percentage: 18, count: 331 },
  { borough: "Staten Island, NY", percentage: 12, count: 222 }
];

// Mock Top Specialists
const topPerformers = [
  { id: "1", name: "Sarah Jenkins", service: "Deep Home Cleaning Service", rating: 4.9, bookings: 142, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "2", name: "Marcus Vance", service: "Licensed Smart Home Wiring", rating: 4.9, bookings: 115, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" }
];

// Mock Categories Share
const categoryShare = [
  { name: "Home Cleaning", share: 38 },
  { name: "Plumbing", share: 22 },
  { name: "Electrical", share: 18 }
];

// Mock System Activity Timeline logs
const activityLogs = [
  { id: 1, text: "New Customer registration: Chloe Bennett", time: "12:45 PM", type: "user" },
  { id: 2, text: "Booking transaction TXN-70492 created for Electrical Wiring", time: "11:20 AM", type: "booking" },
  { id: 3, text: "Provider Sarah Jenkins verified by administrator", time: "09:30 AM", type: "verification" },
  { id: 4, text: "Payment of $98.00 settled successfully for Leak Repair", time: "Yesterday", type: "payment" }
];

export default function Analytics() {
  const navigate = useNavigate();

  // Filter parameters
  const [metricTab, setMetricTab] = useState("revenue"); // "revenue", "bookings", "users", "providers"
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Success message notifier
  const [successMsg, setSuccessMsg] = useState("");

  // Skeleton loader simulator
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [metricTab, categoryFilter, locationFilter]);

  // Export triggers
  const handleExport = (format) => {
    setSuccessMsg(`Simulating analytics export in ${format} format...`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // SVGs Chart computations
  const chartData = metricTab === "revenue" 
    ? revenueData 
    : (metricTab === "bookings" ? bookingsData : (metricTab === "users" ? userGrowthData : providerGrowthData));
  
  const maxVal = Math.max(...chartData.map(d => d.val));
  const chartWidth = 550;
  const chartHeight = 140;
  const spacing = (chartWidth - 50) / chartData.length;
  const barWidth = 30;

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">System Analytics</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Verify system transaction spline logs, category sharing indexes, and demographics</p>
            </div>
            
            {/* Quick dashboard back button */}
            <Link to="/admin/dashboard">
              <Button size="sm" className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-5 h-9.5 backdrop-blur-xs">
                <ArrowLeft className="h-4 w-4 text-white/60 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* STATISTICS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Total Revenue */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">$42,850</span>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
            </Card>

            {/* Total Bookings */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">1,840</span>
              </div>
              <div className="p-2.5 bg-slate-900/5 text-slate-900 rounded-xl shrink-0">
                <Activity className="h-5 w-5" />
              </div>
            </Card>

            {/* Total Users */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">4,250</span>
              </div>
              <div className="p-2.5 bg-slate-900/5 text-slate-900 rounded-xl shrink-0">
                <Users className="h-5 w-5" />
              </div>
            </Card>

            {/* Total Providers */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Providers</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">380</span>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl shrink-0">
                <Briefcase className="h-5 w-5" />
              </div>
            </Card>

            {/* Growth rate */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform col-span-2 md:col-span-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Growth Rate</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">+15.4%</span>
              </div>
              <div className="p-2.5 bg-slate-900/5 text-slate-900 rounded-xl shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
            </Card>

          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FILTERS & DOWNLOAD BUTTONS */}
          <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:hidden">
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dateFrom" className="text-[10px] font-bold text-slate-400 uppercase">From Date</Label>
                <Input 
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dateTo" className="text-[10px] font-bold text-slate-400 uppercase">To Date</Label>
                <Input 
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <Label htmlFor="categoryFilter" className="text-[10px] font-bold text-slate-400 uppercase">Category</Label>
                <div className="relative">
                  <select
                    id="categoryFilter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Categories</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                  <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <Label htmlFor="locationFilter" className="text-[10px] font-bold text-slate-400 uppercase">Borough</Label>
                <div className="relative">
                  <select
                    id="locationFilter"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Boroughs</option>
                    <option value="Brooklyn">Brooklyn</option>
                    <option value="Manhattan">Manhattan</option>
                    <option value="Queens">Queens</option>
                  </select>
                  <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-slate-400" />
                </div>
              </div>
            </div>

            {/* Exports */}
            <div className="flex items-center gap-2 shrink-0 border-t border-slate-100 lg:border-0 pt-4 lg:pt-0">
              <Button
                size="sm"
                onClick={() => handleExport("PDF")}
                className="bg-slate-900 hover:bg-black text-white rounded-xl text-xs h-9.5 font-bold flex items-center gap-1.5"
              >
                <FileText className="h-4 w-4" /> PDF Report
              </Button>
              <Button
                size="sm"
                onClick={() => handleExport("Excel")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-xl text-xs h-9.5 font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <FileSpreadsheet className="h-4 w-4" /> Excel Sheet
              </Button>
            </div>

          </Card>

          {/* TWO COLUMN GRID: SWITCH CHART & CATEGORY SHARE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Swappable analytics growth chart */}
            <Card className="lg:col-span-8 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 flex flex-col justify-between">
              <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900">Statistical Trends Analysis</CardTitle>
                  <CardDescription className="text-xs">Monitor analytical spline lines</CardDescription>
                </div>
                
                {/* Switch Tabs */}
                <div className="flex bg-slate-100/70 border border-slate-200 p-0.5 rounded-xl h-9 shrink-0 overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => setMetricTab("revenue")}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                      metricTab === "revenue"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricTab("bookings")}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                      metricTab === "bookings"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricTab("users")}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                      metricTab === "users"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    User Growth
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricTab("providers")}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                      metricTab === "providers"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Provider Growth
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-0 pt-6 flex-1 flex items-center justify-center min-h-[170px]">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                ) : (
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[480px] h-[160px] relative">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                        
                        {/* Grid lines */}
                        <line x1="20" y1="20" x2="520" y2="20" stroke="#f8fafc" strokeWidth="1" />
                        <line x1="20" y1="65" x2="520" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="20" y1="110" x2="520" y2="110" stroke="#cbd5e1" strokeWidth="2" />

                        {/* Chart Render paths or bars */}
                        {metricTab === "bookings" ? (
                          /* Render Bars for Bookings */
                          chartData.map((d, index) => {
                            const x = index * spacing + 35;
                            const barHeight = (d.val / maxVal) * (chartHeight - 45);
                            const y = chartHeight - barHeight - 30;
                            return (
                              <g key={d.label}>
                                <rect
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={barHeight}
                                  rx="4"
                                  fill="#2563eb"
                                  className="hover:fill-secondary transition-colors cursor-pointer"
                                />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-[9px] font-black fill-slate-800">{d.val}</text>
                                <text x={x + barWidth / 2} y={chartHeight - 12} textAnchor="middle" className="text-[9px] font-bold fill-slate-450">{d.label}</text>
                              </g>
                            );
                          })
                        ) : (
                          /* Render Spline Line Graph for Revenue / Growth */
                          <>
                            <path
                              d={chartData.reduce((path, d, index) => {
                                const x = index * spacing + 40;
                                const barHeight = (d.val / maxVal) * (chartHeight - 50);
                                const y = chartHeight - barHeight - 30;
                                return path + `${index === 0 ? "M" : "L"} ${x} ${y}`;
                              }, "")}
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {chartData.map((d, index) => {
                              const x = index * spacing + 40;
                              const barHeight = (d.val / maxVal) * (chartHeight - 50);
                              const y = chartHeight - barHeight - 30;
                              return (
                                <g key={d.label}>
                                  <circle cx={x} cy={y} r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
                                  <text x={x} y={y - 10} textAnchor="middle" className="text-[9px] font-black fill-slate-800">
                                    {metricTab === "revenue" ? `$${d.val}` : d.val}
                                  </text>
                                  <text x={x} y={chartHeight - 12} textAnchor="middle" className="text-[9px] font-bold fill-slate-450">{d.label}</text>
                                </g>
                              );
                            })}
                          </>
                        )}

                      </svg>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category breakdown Share */}
            <Card className="lg:col-span-4 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Category Shares</span>
              
              <div className="space-y-4">
                {categoryShare.map(cat => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-slate-700">{cat.name}</span>
                      <span className="text-slate-450">{cat.share}%</span>
                    </div>
                    <Progress value={cat.share} className="h-2 rounded-full bg-slate-100 [&>div]:bg-slate-700" />
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* LOWER GRID: TOP PROS, DEMOGRAPHICS & TIMELINE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Top performing specialists */}
            <Card className="lg:col-span-4 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Top Specialists</span>
              
              <div className="space-y-4">
                {topPerformers.map(prov => (
                  <div key={prov.id} className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-slate-100 overflow-hidden shrink-0">
                        <AvatarImage src={prov.avatar} className="object-cover" />
                        <AvatarFallback>{prov.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="block text-xs font-bold text-slate-800">{prov.name}</span>
                        <span className="text-[10px] text-slate-450 font-bold block mt-0.5">{prov.service}</span>
                        <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 mt-1.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> {prov.rating}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-black text-slate-900 shrink-0">{prov.bookings} jobs</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customer Demographics location distribution */}
            <Card className="lg:col-span-4 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Booking Demographics</span>
              
              <div className="space-y-4">
                {demographics.map(cat => (
                  <div key={cat.borough} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-slate-700">{cat.borough}</span>
                      <span className="text-slate-450 font-semibold">{cat.count} jobs ({cat.percentage}%)</span>
                    </div>
                    <Progress value={cat.percentage} className="h-2 rounded-full bg-slate-100 [&>div]:bg-slate-900" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent activity timeline */}
            <Card className="lg:col-span-4 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Activity Timeline Logs</span>
              
              <div className="relative pl-4 border-l border-slate-200 space-y-5 pt-1.5 ml-1 text-xs">
                {activityLogs.map(log => (
                  <div key={log.id} className="relative group animate-fade-in">
                    
                    {/* Ring dot indicator */}
                    <span className="absolute -left-[20.5px] top-1 h-3.5 w-3.5 rounded-full border border-white bg-slate-900 ring-2 ring-slate-900/10 shrink-0"></span>
                    
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">{log.time}</span>
                      <p className="font-bold text-slate-800 leading-relaxed text-[11px]">{log.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

        </div>
      </div>

    </MainLayout>
  );
}
