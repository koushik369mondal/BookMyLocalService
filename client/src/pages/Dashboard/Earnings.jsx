import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  Clock, 
  ArrowUpRight, 
  Download, 
  CreditCard, 
  Printer, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Info,
  Lock,
  ArrowLeft,
  AlertCircle,
  Building,
  Check,
  ChevronDown
} from "lucide-react";

// Mock daily earnings
const dailyEarnings = [
  { label: "Mon", amount: 120 },
  { label: "Tue", amount: 150 },
  { label: "Wed", amount: 80 },
  { label: "Thu", amount: 220 },
  { label: "Fri", amount: 190 },
  { label: "Sat", amount: 250 },
  { label: "Sun", amount: 310 }
];

// Mock monthly earnings
const monthlyEarnings = [
  { label: "Jan", amount: 1200 },
  { label: "Feb", amount: 980 },
  { label: "Mar", amount: 1550 },
  { label: "Apr", amount: 1300 },
  { label: "May", amount: 1750 },
  { label: "Jun", amount: 2100 },
  { label: "Jul", amount: 2400 }
];

// Mock Transaction Database
const initialTransactions = [
  { id: "TXN-88391", customerName: "Amanda Watson", serviceName: "Deep Home Cleaning Service", date: "2026-07-08", amount: 55.00, status: "cleared" },
  { id: "TXN-66382", customerName: "Sarah Connor", serviceName: "Sofa & Carpet Sanitization", date: "2026-07-05", amount: 90.00, status: "cleared" },
  { id: "TXN-44281", customerName: "Robert Garcia", serviceName: "Window Washing Service", date: "2026-07-02", amount: 30.00, status: "processing" },
  { id: "TXN-10943", customerName: "Jessica Alba", serviceName: "Deep Home Cleaning Service", date: "2026-06-28", amount: 110.00, status: "cleared" },
  { id: "TXN-99382", customerName: "Marcus Vance", serviceName: "Smart Plug Install", date: "2026-06-15", amount: 65.00, status: "cleared" }
];

// Mock Payouts archive transfers
const payoutHistory = [
  { id: "PAY-99381", date: "2026-07-01", amount: 1250.00, method: "Bank Account (Chase ****1290)", status: "success" },
  { id: "PAY-88291", date: "2026-06-01", amount: 980.00, method: "Bank Account (Chase ****1290)", status: "success" }
];

export default function Earnings() {
  const navigate = useNavigate();

  // Transactions list & balance states
  const [transactions, setTransactions] = useState(initialTransactions);
  const [pendingBalance, setPendingBalance] = useState(120.00);
  const [withdrawableBalance, setWithdrawableBalance] = useState(850.00);
  const [payouts, setPayouts] = useState(payoutHistory);

  // Filters & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Chart data configuration
  const [chartView, setChartView] = useState("monthly"); // "daily" or "monthly"

  // Withdraw earnings modal states
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [withdrawError, setWithdrawError] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // General notification triggers
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Skeleton loader simulator on filters
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [statusFilter, chartView]);

  // Report downloads trigger
  const handleDownloadReport = () => {
    setIsDownloading(true);
    setSuccessMsg("");
    setTimeout(() => {
      setIsDownloading(false);
      setSuccessMsg("Earnings report downloaded successfully (PDF/Excel)!");
      setTimeout(() => setSuccessMsg(""), 2500);
    }, 1500);
  };

  // Withdraw processing
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError("");
    const amountVal = parseFloat(withdrawAmount);

    if (isNaN(amountVal) || amountVal <= 0) {
      setWithdrawError("Please enter a valid amount.");
      return;
    }

    if (amountVal > withdrawableBalance) {
      setWithdrawError(`Insufficient funds. Max withdrawable amount is $${withdrawableBalance.toFixed(2)}.`);
      return;
    }

    setIsWithdrawing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsWithdrawing(false);
    setIsWithdrawOpen(false);

    // Subtract balance
    const nextBalance = withdrawableBalance - amountVal;
    setWithdrawableBalance(nextBalance);

    // Append mock payout record
    const newPayout = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      amount: amountVal,
      method: withdrawMethod === "bank" ? "Bank Account (Chase ****1290)" : "UPI Wallet (Paytm/GPay)",
      status: "success"
    };

    setPayouts([newPayout, ...payouts]);
    setSuccessMsg(`Withdrawal of $${amountVal.toFixed(2)} authorized successfully!`);
    setWithdrawAmount("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Filter calculations
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(txn => {
      // Search matching
      const matchesSearch = 
        txn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Status matching
      const matchesStatus = statusFilter === "all" || txn.status === statusFilter;

      // Dates matching
      let matchesDate = true;
      if (dateFrom) {
        matchesDate = matchesDate && new Date(txn.date) >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && new Date(txn.date) <= new Date(dateTo);
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [transactions, searchQuery, statusFilter, dateFrom, dateTo]);

  // Chart computations
  const activeChartData = chartView === "monthly" ? monthlyEarnings : dailyEarnings;
  const maxVal = Math.max(...activeChartData.map(d => d.amount));
  const chartHeight = 130;
  const chartWidth = 500;
  
  // Custom styled SVG bars coordinates
  const barWidth = 30;
  const spacing = (chartWidth - 40) / activeChartData.length;

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Earnings & Settlements</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Verify payout logs, trace transaction references, or withdraw cleared funds</p>
            </div>
            
            {/* Quick dashboard back button */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <Button 
                onClick={handleDownloadReport}
                disabled={isDownloading}
                size="sm" 
                className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-5 h-9.5 backdrop-blur-xs flex items-center gap-1.5"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 text-white/60" />
                )}
                Download Report
              </Button>
              
              <Link to="/provider/dashboard">
                <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-50 rounded-full text-xs font-bold px-5 h-9.5 shadow-md flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4 text-slate-900" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* OVERVIEW STATS PANEL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Total Balance */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Cleared</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${(withdrawableBalance + 4760.00).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            {/* Withdrawable Balance */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cleared Balance</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${withdrawableBalance.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </Card>

            {/* Pending Balance */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Payouts</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${pendingBalance.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0">
                <Clock className="h-6 w-6" />
              </div>
            </Card>

            {/* Withdraw Action Card */}
            <Card className="border border-slate-900/10 shadow-md bg-slate-900/5 p-5 flex flex-col justify-center gap-2 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">Authorize Transfer</span>
              <Button 
                onClick={() => setIsWithdrawOpen(true)}
                className="w-full h-9.5 bg-slate-900 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs"
              >
                Withdraw Cleared Funds
              </Button>
            </Card>

          </div>
        </section>

        {/* DETAILS GRID LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: PAYOUT CHART & TRANSACTIONS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* ANALYTICS CHART */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-900/5 text-slate-900 rounded-xl">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">Earnings Performance</CardTitle>
                      <CardDescription className="text-xs">Compare monthly shifts or daily payouts</CardDescription>
                    </div>
                  </div>

                  {/* Chart view toggler */}
                  <div className="flex bg-slate-100/70 border border-slate-200 p-0.5 rounded-xl h-9 shrink-0">
                    <button
                      type="button"
                      onClick={() => setChartView("daily")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                        chartView === "daily"
                          ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartView("monthly")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1.5 transition-all ${
                        chartView === "monthly"
                          ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  {isLoading ? (
                    <div className="h-[150px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                    </div>
                  ) : (
                    /* SVG Bars chart */
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="min-w-[400px] h-[160px] relative">
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                          
                          {/* Grids */}
                          <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="20" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="20" y1="110" x2="480" y2="110" stroke="#cbd5e1" strokeWidth="2" />

                          {/* Bars */}
                          {activeChartData.map((d, index) => {
                            const x = index * spacing + 25;
                            const barHeight = (d.amount / maxVal) * (chartHeight - 40);
                            const y = chartHeight - barHeight - 20;
                            return (
                              <g key={d.label} className="group cursor-pointer">
                                {/* Bar rect */}
                                <rect
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={barHeight}
                                  rx="4"
                                  fill="#3b82f6"
                                  className="transition-colors hover:fill-secondary"
                                />

                                {/* Amount tag */}
                                <text
                                  x={x + barWidth / 2}
                                  y={y - 8}
                                  textAnchor="middle"
                                  className="text-[9px] font-black fill-slate-800"
                                >
                                  ${d.amount}
                                </text>

                                {/* Label tag */}
                                <text
                                  x={x + barWidth / 2}
                                  y={chartHeight - 4}
                                  textAnchor="middle"
                                  className="text-[9px] font-bold fill-slate-450"
                                >
                                  {d.label}
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

              {/* TRANSACTION HISTORY TABLE */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-extrabold text-slate-900">Transaction History</CardTitle>
                    <CardDescription className="text-xs">Settle logs and verification audits</CardDescription>
                  </div>
                  
                  {/* Status buttons */}
                  <div className="flex bg-slate-100/70 border border-slate-200 p-0.5 rounded-xl h-9 shrink-0">
                    {[
                      { id: "all", label: "All" },
                      { id: "cleared", label: "Cleared" },
                      { id: "processing", label: "Processing" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`rounded-lg text-[10px] font-bold px-3.5 py-1.5 transition-all ${
                          statusFilter === tab.id
                            ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6 space-y-4">
                  
                  {/* SEARCH AND DATE RANGES */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-50/50 p-4 border border-slate-200 rounded-2xl">
                    <div className="space-y-1.5">
                      <Label htmlFor="searchQuery" className="text-[10px] font-bold text-slate-700">Search</Label>
                      <Input
                        id="searchQuery"
                        placeholder="TXN ID, name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="dateFrom" className="text-[10px] font-bold text-slate-700">From Date</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="dateTo" className="text-[10px] font-bold text-slate-700">To Date</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* TABLE LISTING */}
                  {filteredTransactions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                      No transactions match your queries.
                    </div>
                  ) : (
                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                            <th className="py-2.5 px-1">TXN ID</th>
                            <th className="py-2.5">Customer</th>
                            <th className="py-2.5">Date</th>
                            <th className="py-2.5">Service</th>
                            <th className="py-2.5">Amount</th>
                            <th className="py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {filteredTransactions.map(txn => (
                            <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-1 font-bold text-slate-450">{txn.id}</td>
                              <td className="py-3 font-bold text-slate-800">{txn.customerName}</td>
                              <td className="py-3">{txn.date}</td>
                              <td className="py-3 truncate max-w-[130px]">{txn.serviceName}</td>
                              <td className="py-3 font-black text-slate-900">${txn.amount.toFixed(2)}</td>
                              <td className="py-3 text-right">
                                <Badge variant={txn.status === "cleared" ? "success" : "warning"} className="rounded-lg text-[9px] font-bold px-2 py-0 border-0 leading-none">
                                  {txn.status.toUpperCase()}
                                </Badge>
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

            {/* RIGHT COLUMN: PAYOUTS HISTORIES */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* PAYOUT BANK ARCHIVES */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2">Payout History</span>
                
                <div className="space-y-3">
                  {payouts.map(p => (
                    <div key={p.id} className="p-3.5 border border-slate-200 rounded-xl bg-white shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ref: {p.id}</span>
                          <Badge variant="success" className="bg-emerald-500 border-0 text-white font-bold rounded-lg text-[8px] py-0 px-1 leading-none uppercase">Success</Badge>
                        </div>
                        <h5 className="font-extrabold text-slate-800 text-xs mt-1 truncate max-w-[180px]">{p.method}</h5>
                        <span className="text-[9px] text-slate-400 font-semibold block">{p.date}</span>
                      </div>

                      <span className="font-black text-slate-950 text-sm shrink-0">${p.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* SECURITY ASSURANCES CARD */}
              <Card className="border border-slate-100 shadow-2xs bg-white rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3 text-slate-700">
                  <div className="p-2 bg-slate-900/5 text-slate-900 rounded-xl shrink-0 mt-0.5">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs">Direct Deposits</h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                      Withdrawals take 1-3 business days to post to your bank routing details. No fees are deducted on transfers to linked checking accounts.
                    </p>
                  </div>
                </div>
              </Card>

            </div>

          </div>
        </div>

      </div>

      {/* WITHDRAW EARNINGS FORM MODAL */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-900" />
              Withdraw Cleared Balance
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 pt-0.5">
              Select your payment gateway transfer endpoint and specify withdraw values
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-3">
            
            {/* Display Withdrawable Balance */}
            <div className="p-3 bg-slate-900/5 border border-slate-900/10 rounded-xl flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Withdrawable Balance:</span>
              <span className="font-black text-slate-900 text-sm">${withdrawableBalance.toFixed(2)}</span>
            </div>

            {withdrawError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
                <span>{withdrawError}</span>
              </div>
            )}

            {/* Withdrawal Method */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Transfer Endpoint</Label>
              <div className="grid grid-cols-2 bg-slate-50 border border-slate-200 p-1 rounded-xl h-10">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod("bank")}
                  className={`rounded-lg text-xs font-bold transition-all ${
                    withdrawMethod === "bank"
                      ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Chase Bank
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod("upi")}
                  className={`rounded-lg text-xs font-bold transition-all ${
                    withdrawMethod === "upi"
                      ? "bg-white text-slate-900 shadow-2xs border border-slate-100"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  UPI Paytm / GPay
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs font-bold text-slate-700">Withdraw Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 200"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsWithdrawOpen(false)}
                className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isWithdrawing}
                className="rounded-xl bg-slate-900 hover:bg-slate-900 text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-md"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    Request Transfer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}
