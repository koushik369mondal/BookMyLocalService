import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
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
  BarChart2, 
  PieChart, 
  Download, 
  Printer, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  FileSpreadsheet, 
  Star, 
  MapPin, 
  TrendingDown, 
  Layers,
  FileText,
  AlertCircle
} from "lucide-react";

// Mock Analytical Charts Datasets
const revenueChartData = [
  { label: "Mon", val: 42000 },
  { label: "Tue", val: 56000 },
  { label: "Wed", val: 71000 },
  { label: "Thu", val: 68000 },
  { label: "Fri", val: 92000 },
  { label: "Sat", val: 124000 },
  { label: "Sun", val: 89000 }
];

const bookingsChartData = [
  { label: "Mon", val: 120 },
  { label: "Tue", val: 155 },
  { label: "Wed", val: 210 },
  { label: "Thu", val: 190 },
  { label: "Fri", val: 260 },
  { label: "Sat", val: 380 },
  { label: "Sun", val: 290 }
];

const growthChartData = [
  { label: "Jan", val: 1200 },
  { label: "Feb", val: 1600 },
  { label: "Mar", val: 2100 },
  { label: "Apr", val: 2800 },
  { label: "May", val: 3500 },
  { label: "Jun", val: 4250 }
];

// Mock Category Breakdown Distribution
const categoryShare = [
  { name: "Home Cleaning", share: 38, count: 700 },
  { name: "Plumbing", share: 22, count: 405 },
  { name: "Electrical", share: 18, count: 330 },
  { name: "Lawn & Garden", share: 14, count: 260 },
  { name: "Wellness & Personal", share: 8, count: 145 }
];

// Mock Top Performing Specialists
const topProviders = [
  { id: "1", name: "Sunita Rao", service: "Deep Home Cleaning & Sanitization", rating: 4.9, bookings: 142, revenue: 149900.00, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "2", name: "Amit Verma", service: "Certified Home Electrical Repair", rating: 4.9, bookings: 115, revenue: 132250.00, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "3", name: "Rajesh Sharma", service: "Expert Plumbing & Leakage Repair", rating: 4.8, bookings: 98, revenue: 96040.00, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }
];

// Mock Audit Logs
const recentTransactions = [
  { id: "TXN-90284", customer: "Ananya Sen", provider: "Sunita Rao", amount: 1499.00, date: "2026-07-09", status: "completed" },
  { id: "TXN-80392", customer: "Priya Patel", provider: "Rajesh Sharma", amount: 499.00, date: "2026-07-08", status: "completed" },
  { id: "TXN-70492", customer: "Amit Das", provider: "Amit Verma", amount: 399.00, date: "2026-07-09", status: "pending" },
  { id: "TXN-60591", customer: "Neha Gupta", provider: "Manoj Mali", amount: 799.00, date: "2026-07-05", status: "refunded" }
];

export default function Reports() {
  const navigate = useNavigate();

  // Filters & State
  const [metricTab, setMetricTab] = useState("revenue"); // "revenue", "bookings", "growth"
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
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
  }, [metricTab, categoryFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (type) => {
    setSuccessMsg(`Simulating ${type} report generation download...`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // SVGs Chart computations
  const activeChartData = metricTab === "revenue" ? revenueChartData : (metricTab === "bookings" ? bookingsChartData : growthChartData);
  const maxVal = Math.max(...activeChartData.map(d => d.val));
  const chartWidth = 550;
  const chartHeight = 140;
  const spacing = (chartWidth - 50) / activeChartData.length;
  const barWidth = 30;

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans print:bg-white print:py-2">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Analytical Reports & Audits</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Verify system transaction graphs, top performing specialists, and export records</p>
            </div>
            
            {/* Quick Actions Panel */}
            <div className="flex items-center gap-2.5 flex-wrap print:hidden">
              <Button 
                onClick={handlePrint}
                size="sm" 
                className="bg-[#FAF6F0] hover:bg-white text-[#1F1D1A] border border-[#E8DCC3] rounded-xl text-xs font-bold px-4 h-9.5 shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4 text-[#C9A46A]" /> Print Reports
              </Button>
              <Link to="/admin/dashboard">
                <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] text-white border border-[#E8DCC3] rounded-xl text-xs font-bold px-4 h-9.5 shadow-2xs flex items-center gap-1 cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-0.5" /> Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* STATISTICS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Revenue</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">₹3,42,850 <span className="text-[10px] text-[#7A7266] font-medium">INR</span></span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            {/* Total Bookings */}
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Bookings</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">1,840</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Layers className="h-6 w-6" />
              </div>
            </Card>

            {/* Active Users */}
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Active Users</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">4,250</span>
              </div>
              <div className="p-3 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-2xl shrink-0">
                <Users className="h-6 w-6" />
              </div>
            </Card>

            {/* Active Providers */}
            <Card className="border border-[#5A5146]/15 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Active Specialists</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F1D1A]">380</span>
              </div>
              <div className="p-3 bg-amber-50 text-[#C9A46A] rounded-2xl shrink-0">
                <Briefcase className="h-6 w-6" />
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

          {/* FILTERING & EXPORT TOOLBAR */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-4.5 print:hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold text-[#7A7266] uppercase">Date Range</Label>
                  <div className="flex items-center gap-1.5">
                    <Input 
                      type="date" 
                      value={dateFrom} 
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-9 border-[#5A5146]/20 focus-visible:ring-violet-950 text-xs rounded-xl bg-white text-[#1F1D1A] w-36" 
                    />
                    <span className="text-xs text-stone-400">to</span>
                    <Input 
                      type="date" 
                      value={dateTo} 
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-9 border-[#5A5146]/20 focus-visible:ring-violet-950 text-xs rounded-xl bg-white text-[#1F1D1A] w-36" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold text-[#7A7266] uppercase">Category</Label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#8C4B3E] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Categories</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Lawn & Garden">Lawn & Garden</option>
                    <option value="Wellness & Personal">Wellness & Personal</option>
                  </select>
                </div>
              </div>

              {/* EXPORT BUTTONS */}
              <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                <Button 
                  size="sm" 
                  onClick={() => handleExport("PDF")}
                  className="bg-[#8C4B3E] hover:bg-black text-white rounded-xl h-9 text-xs font-bold flex items-center gap-1.5"
                >
                  <FileText className="h-4 w-4" /> PDF Report
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleExport("Excel")}
                  variant="outline"
                  className="border-[#5A5146]/20 text-[#5A5146] hover:bg-[#FAF6F0] rounded-xl h-9 text-xs font-bold flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel Sheet
                </Button>
              </div>

            </div>
          </Card>

          {/* TWO COLUMN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SWAP GRAPH ANALYSIS CHART */}
            <Card className="lg:col-span-8 border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 flex flex-col justify-between">
              <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-extrabold text-[#1F1D1A]">System Performance Trends</CardTitle>
                  <CardDescription className="text-xs">Visualizing transaction metrics over time</CardDescription>
                </div>

                <div className="flex bg-[#FAF6F0] p-1 border border-[#5A5146]/15 rounded-xl h-9 shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => setMetricTab("revenue")}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1 transition-all ${
                      metricTab === "revenue" ? "bg-[#8C4B3E] text-white shadow-2xs" : "text-[#7A7266] hover:text-[#1F1D1A]"
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricTab("bookings")}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1 transition-all ${
                      metricTab === "bookings" ? "bg-[#8C4B3E] text-white shadow-2xs" : "text-[#7A7266] hover:text-[#1F1D1A]"
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricTab("growth")}
                    className={`rounded-lg text-[10px] font-bold px-3 py-1 transition-all ${
                      metricTab === "growth" ? "bg-[#8C4B3E] text-white shadow-2xs" : "text-[#7A7266] hover:text-[#1F1D1A]"
                    }`}
                  >
                    Growth
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-0 pt-6 flex-1 flex items-center justify-center min-h-[170px]">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E]" />
                ) : (
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[480px] h-[160px] relative">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                        
                        <line x1="20" y1="20" x2="520" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="65" x2="520" y2="65" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="110" x2="520" y2="110" stroke="#f1f5f9" strokeWidth="1.5" />

                        {activeChartData.map((d, index) => {
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
                                fill="#8C4B3E"
                                className="hover:fill-[#1F1D1A] transition-colors cursor-pointer"
                              />
                              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-[9px] font-bold fill-[#1F1D1A]">{metricTab === "revenue" ? `₹${d.val}` : d.val}</text>
                              <text x={x + barWidth / 2} y={chartHeight - 12} textAnchor="middle" className="text-[9px] font-medium fill-stone-400">{d.label}</text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CATEGORY REVENUE DISTRIBUTION SHARE */}
            <Card className="lg:col-span-4 border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-stone-50 pb-2.5">Category Share</span>

              <div className="space-y-4">
                {categoryShare.map(cat => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#1F1D1A]">{cat.name}</span>
                      <span className="text-[#8C4B3E]">{cat.share}% ({cat.count} jobs)</span>
                    </div>
                    <Progress value={cat.share} className="h-2 bg-[#FAF6F0]" />
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* TOP PROVIDERS AND MOST BOOKED SERVICES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Top performing specialists */}
            <Card className="lg:col-span-5 border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-stone-50 pb-2.5">Top Service Specialists</span>

              <div className="space-y-4">
                {topProviders.map(prov => (
                  <div key={prov.id} className="flex items-center justify-between p-3 border border-[#5A5146]/15 rounded-xl bg-[#FAF6F0]/50 hover:bg-[#FAF6F0] transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-[#5A5146]/15 shadow-2xs">
                        <AvatarImage src={prov.avatar} className="object-cover" />
                        <AvatarFallback>{prov.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="block text-xs font-bold text-[#1F1D1A]">{prov.name}</span>
                        <span className="text-[10px] text-[#7A7266] font-bold block mt-0.5">{prov.service}</span>
                        <span className="text-[10px] text-[#C9A46A] font-bold flex items-center gap-0.5 mt-1.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-[#C9A46A]" /> {prov.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      <span className="text-xs font-extrabold text-[#8C4B3E] block">{prov.bookings} jobs</span>
                      <span className="text-[11px] text-emerald-600 font-black block">₹{prov.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Most Booked Services listing */}
            <Card className="lg:col-span-7 border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-stone-50 pb-2.5">Most Booked Services</span>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#5A5146]/15 text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
                      <th className="py-2.5 px-1">Service Title</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Avg Rate</th>
                      <th className="py-2.5">Booking Orders</th>
                      <th className="py-2.5 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50 font-semibold text-[#8C4B3E]">
                    <tr className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 px-1 font-bold text-[#1F1D1A]">Deep Home Cleaning & Sanitization</td>
                      <td className="py-3">Cleaning</td>
                      <td className="py-3">₹1,499.00</td>
                      <td className="py-3">700</td>
                      <td className="py-3 text-right text-emerald-600 font-bold">₹10,49,300.00</td>
                    </tr>
                    <tr className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 px-1 font-bold text-[#1F1D1A]">Certified Home Electrical Repair</td>
                      <td className="py-3">Electrical</td>
                      <td className="py-3">₹399.00</td>
                      <td className="py-3">330</td>
                      <td className="py-3 text-right text-emerald-600 font-bold">₹1,31,670.00</td>
                    </tr>
                    <tr className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 px-1 font-bold text-[#1F1D1A]">Expert Plumbing & Leakage Repair</td>
                      <td className="py-3">Plumbing</td>
                      <td className="py-3">₹499.00</td>
                      <td className="py-3">405</td>
                      <td className="py-3 text-right text-emerald-600 font-bold">₹2,02,095.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

          </div>

          {/* RECENT AUDIT TRANSACTIONS TABLE */}
          <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
            <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-stone-50 pb-2.5 mb-4">Recent Audit Transactions</span>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#5A5146]/15 text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
                    <th className="py-2.5 px-1">Ref Transaction ID</th>
                    <th className="py-2.5">Customer Name</th>
                    <th className="py-2.5">Provider Name</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 font-semibold text-[#8C4B3E]">
                  {recentTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 px-1 font-bold text-[#7A7266]">{txn.id}</td>
                      <td className="py-3 font-bold text-[#1F1D1A]">{txn.customer}</td>
                      <td className="py-3">{txn.provider}</td>
                      <td className="py-3">{txn.date}</td>
                      <td className="py-3 font-black text-[#1F1D1A]">₹{txn.amount.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <Badge variant={txn.status === "completed" ? "success" : "warning"} className="capitalize font-bold rounded-lg text-[9px] py-0.5 px-2.5 border-0">
                          {txn.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>

    </DashboardLayout>
  );
}
