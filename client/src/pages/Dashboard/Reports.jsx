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
  { label: "Mon", val: 4200 },
  { label: "Tue", val: 5600 },
  { label: "Wed", val: 7100 },
  { label: "Thu", val: 6800 },
  { label: "Fri", val: 9200 },
  { label: "Sat", val: 12400 },
  { label: "Sun", val: 8900 }
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
  { id: "1", name: "Sarah Jenkins", service: "Deep Home Cleaning Service", rating: 4.9, bookings: 142, revenue: 7810.00, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "2", name: "Marcus Vance", service: "Licensed Smart Home Wiring", rating: 4.9, bookings: 115, revenue: 13225.00, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "3", name: "David Miller", service: "Expert Plumbing & Leak Repair", rating: 4.8, bookings: 98, revenue: 9604.00, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" }
];

// Mock Recent auditing transactions
const recentTransactions = [
  { id: "TXN-90284", customer: "Amanda Watson", provider: "Sarah Jenkins", amount: 55.00, status: "completed", date: "2026-07-09" },
  { id: "TXN-80392", customer: "Robert Garcia", provider: "David Miller", amount: 98.00, status: "completed", date: "2026-07-08" },
  { id: "TXN-70492", customer: "Sarah Connor", provider: "Marcus Vance", amount: 115.00, status: "pending", date: "2026-07-09" }
];

export default function Reports() {
  const navigate = useNavigate();

  // Filter parameters
  const [reportType, setReportType] = useState("revenue"); // "revenue", "bookings", "growth"
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Success message trigger
  const [successMsg, setSuccessMsg] = useState("");

  // Skeleton simulator
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [reportType]);

  // Export triggers
  const handleExport = (format) => {
    setSuccessMsg(`Simulating export of system reports in ${format} format...`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handlePrint = () => {
    setSuccessMsg("Generating print queue copy for system reports audit layout...");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // SVG Chart variables calculations
  const chartData = reportType === "revenue" ? revenueChartData : (reportType === "bookings" ? bookingsChartData : growthChartData);
  const maxVal = Math.max(...chartData.map(d => d.val));
  const chartWidth = 550;
  const chartHeight = 140;
  const spacing = (chartWidth - 50) / chartData.length;
  const barWidth = 30;

  return (
    <DashboardLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Reports & Analytics</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Verify system transaction graphs, top performing specialists, and export records</p>
            </div>
            
            {/* Quick Actions Panel */}
            <div className="flex items-center gap-2.5 flex-wrap print:hidden">
              <Button 
                onClick={handlePrint}
                size="sm" 
                className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-4 h-9.5 backdrop-blur-xs flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Print Reports
              </Button>
              <Link to="/admin/dashboard">
                <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-50 border border-slate-100 rounded-full text-xs font-bold px-4 h-9.5 shadow-md flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4 mr-0.5" /> Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* STATISTICS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">$42,850 <span className="text-[10px] text-slate-400 font-semibold">USD</span></span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            {/* Total Bookings */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">1,840</span>
              </div>
              <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl shrink-0">
                <Layers className="h-6 w-6" />
              </div>
            </Card>

            {/* Active Users */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Users</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">4,250</span>
              </div>
              <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl shrink-0">
                <Users className="h-6 w-6" />
              </div>
            </Card>

            {/* Active Providers */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Specialists</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">380</span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0">
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

          {/* EXPORTS & FILTERS CONTROL CARD */}
          <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:hidden">
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div className="flex flex-col gap-1.5 shrink-0">
                <Label htmlFor="reportType" className="text-[10px] font-bold text-slate-400 uppercase">Report Type</Label>
                <div className="relative">
                  <select
                    id="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="revenue">Financial Revenue Report</option>
                    <option value="bookings">Volume Bookings Report</option>
                    <option value="growth">Account Registrations Growth</option>
                  </select>
                  <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-slate-400" />
                </div>
              </div>

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
            </div>

            {/* Export buttons */}
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
              <Button
                size="sm"
                onClick={() => handleExport("CSV")}
                variant="outline"
                className="border-slate-200 text-slate-655 hover:bg-slate-50 rounded-xl text-xs h-9.5 font-bold flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> CSV Export
              </Button>
            </div>

          </Card>

          {/* TWO COLUMN GRID: CHART & CATEGORY PROGRESS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Swappable SVG Growth Chart */}
            <Card className="lg:col-span-8 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 flex flex-col justify-between">
              <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900 capitalize">
                    {reportType === "revenue" ? "Revenue Growth (Daily)" : (reportType === "bookings" ? "Volume Booking Orders" : "User Registrations Ledger")}
                  </CardTitle>
                  <CardDescription className="text-xs">Visual analytics mapping current cycle parameters</CardDescription>
                </div>
                <div className="p-2 bg-slate-900/5 text-slate-900 rounded-xl shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardHeader>

              <CardContent className="p-0 pt-6 flex-1 flex items-center justify-center min-h-[160px]">
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
                        {reportType === "bookings" ? (
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
                                  fill="#4f46e5"
                                  className="hover:fill-secondary transition-colors cursor-pointer"
                                />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-[9px] font-black fill-slate-800">{d.val}</text>
                                <text x={x + barWidth / 2} y={chartHeight - 12} textAnchor="middle" className="text-[9px] font-bold fill-slate-450">{d.label}</text>
                              </g>
                            );
                          })
                        ) : (
                          /* Render Spline Line Graph for Revenue or Growth */
                          <>
                            <path
                              d={chartData.reduce((path, d, index) => {
                                const x = index * spacing + 40;
                                const barHeight = (d.val / maxVal) * (chartHeight - 50);
                                const y = chartHeight - barHeight - 30;
                                return path + `${index === 0 ? "M" : "L"} ${x} ${y}`;
                              }, "")}
                              fill="none"
                              stroke="#2563eb"
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
                                  <circle cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
                                  <text x={x} y={y - 10} textAnchor="middle" className="text-[9px] font-black fill-slate-800">
                                    {reportType === "revenue" ? `$${d.val}` : d.val}
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

            {/* Category Share Distribution breakdown */}
            <Card className="lg:col-span-4 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5 mb-4">Category Shares</span>
              
              <div className="space-y-4 pt-1.5">
                {categoryShare.map(cat => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-slate-700">{cat.name}</span>
                      <span className="text-slate-450 font-semibold">{cat.count} jobs ({cat.share}%)</span>
                    </div>
                    <Progress value={cat.share} className="h-2 rounded-full bg-slate-100 [&>div]:bg-slate-700" />
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* LOWER GRID: TOP PROS, MOST BOOKED, AND AUDIT MATRIX */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Top Specialists Grid */}
            <Card className="lg:col-span-5 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Top Performing Specialists</span>
              
              <div className="space-y-4">
                {topProviders.map(prov => (
                  <div key={prov.id} className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-slate-100 overflow-hidden shrink-0">
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

                    <div className="text-right space-y-1 shrink-0">
                      <span className="text-xs font-extrabold text-slate-700 block">{prov.bookings} jobs</span>
                      <span className="text-[11px] text-emerald-600 font-black block">${prov.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Most Booked Services listing */}
            <Card className="lg:col-span-7 border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5">Most Booked Services</span>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                      <th className="py-2.5 px-1">Service Title</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Avg Rate</th>
                      <th className="py-2.5">Booking Orders</th>
                      <th className="py-2.5 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-1 font-bold text-slate-900">Deep Home Cleaning Service</td>
                      <td className="py-3">Cleaning</td>
                      <td className="py-3">$55.00</td>
                      <td className="py-3">700</td>
                      <td className="py-3 text-right text-emerald-600 font-bold">$38,500.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-1 font-bold text-slate-900">Licensed Smart Home Wiring</td>
                      <td className="py-3">Electrical</td>
                      <td className="py-3">$115.00</td>
                      <td className="py-3">330</td>
                      <td className="py-3 text-right text-emerald-600 font-bold">$37,950.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-1 font-bold text-slate-900">Expert Plumbing & Leak Repair</td>
                      <td className="py-3">Plumbing</td>
                      <td className="py-3">$98.00</td>
                      <td className="py-3">405</td>
                      <td className="py-3 text-right text-emerald-600 font-bold">$39,690.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

          </div>

          {/* RECENT AUDIT TRANSACTIONS TABLE */}
          <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2.5 mb-4">Recent Audit Transactions</span>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                    <th className="py-2.5 px-1">Ref Transaction ID</th>
                    <th className="py-2.5">Customer Name</th>
                    <th className="py-2.5">Provider Name</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {recentTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-1 font-bold text-slate-450">{txn.id}</td>
                      <td className="py-3 font-bold text-slate-800">{txn.customer}</td>
                      <td className="py-3">{txn.provider}</td>
                      <td className="py-3">{txn.date}</td>
                      <td className="py-3 font-black text-slate-950">${txn.amount.toFixed(2)}</td>
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
