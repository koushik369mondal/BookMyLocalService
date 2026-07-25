import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
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
  Clock,
  Download,
  CreditCard,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle
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
      const matchesSearch =
        txn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || txn.status === statusFilter;

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

  const barWidth = 30;
  const spacing = (chartWidth - 40) / activeChartData.length;

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">

        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Earnings & Settlements</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Verify payout logs, trace transaction references, or withdraw cleared funds</p>
            </div>

            <div className="flex items-center gap-3.5 flex-wrap">
              <Button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                size="sm"
                className="bg-[#FAF6F0] hover:bg-[#F0E7D5] text-[#1F1D1A] border border-[#E8DCC3] rounded-xl text-xs font-bold px-5 h-9.5 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#C9A46A]" />
                ) : (
                  <Download className="h-4 w-4 text-[#C9A46A]" />
                )}
                Download Report
              </Button>

              <Link to="/provider/dashboard">
                <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] text-white border border-[#E8DCC3] rounded-xl text-xs font-bold px-5 h-9.5 shadow-2xs flex items-center gap-1.5 cursor-pointer">
                  <ArrowLeft className="h-4 w-4 text-white" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* OVERVIEW STATS PANEL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* Total Balance */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Cleared</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">${(withdrawableBalance + 4760.00).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-[#7DAB7D]/20 text-[#2B522B] rounded-2xl shrink-0 border border-[#7DAB7D]/30">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            {/* Withdrawable Balance */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Cleared Balance</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">${withdrawableBalance.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-[#F0E7D5] text-[#C9A46A] rounded-2xl shrink-0 border border-[#E8DCC3]">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </Card>

            {/* Pending Balance */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Pending Payouts</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">${pendingBalance.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-[#F0E7D5] text-[#C9A46A] rounded-2xl shrink-0 border border-[#E8DCC3]">
                <Clock className="h-6 w-6" />
              </div>
            </Card>

            {/* Withdraw Action Card */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-[#FAF6F0] p-5 flex flex-col justify-center gap-2 rounded-2xl">
              <span className="text-[10px] font-bold text-[#1F1D1A] uppercase tracking-wider">Authorize Transfer</span>
              <Button
                onClick={() => setIsWithdrawOpen(true)}
                className="w-full h-9.5 bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs rounded-xl shadow-2xs border border-[#E8DCC3] cursor-pointer"
              >
                Withdraw Cleared Funds
              </Button>
            </Card>

          </div>
        </section>

        {/* DETAILS GRID LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#2B522B]" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN: PAYOUT CHART & TRANSACTIONS */}
            <div className="lg:col-span-8 space-y-6">

              {/* ANALYTICS CHART */}
              <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#1F1D1A]">Earnings Performance</CardTitle>
                      <CardDescription className="text-xs text-[#7A7266]">Compare monthly shifts or daily payouts</CardDescription>
                    </div>
                  </div>

                  {/* Chart view toggler */}
                  <div className="flex bg-[#F0E7D5] border border-[#E8DCC3] p-1 rounded-xl h-9 shrink-0">
                    <button
                      type="button"
                      onClick={() => setChartView("daily")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1 transition-all ${chartView === "daily"
                        ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                        : "text-[#5A5146] hover:text-[#1F1D1A]"
                        }`}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartView("monthly")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1 transition-all ${chartView === "monthly"
                        ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                        : "text-[#5A5146] hover:text-[#1F1D1A]"
                        }`}
                    >
                      Monthly
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  {isLoading ? (
                    <div className="h-[150px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#C9A46A]" />
                    </div>
                  ) : (
                    /* SVG Bars chart */
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="min-w-[400px] h-[160px] relative">
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">

                          <line x1="20" y1="20" x2="480" y2="20" stroke="#E8DCC3" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="20" y1="65" x2="480" y2="65" stroke="#E8DCC3" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="20" y1="110" x2="480" y2="110" stroke="#E8DCC3" strokeWidth="1.5" />

                          {activeChartData.map((d, index) => {
                            const x = index * spacing + 25;
                            const barHeight = (d.amount / maxVal) * (chartHeight - 40);
                            const y = chartHeight - barHeight - 20;
                            return (
                              <g key={d.label} className="group cursor-pointer">
                                <rect
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={barHeight}
                                  rx="4"
                                  fill="#C9A46A"
                                  className="transition-colors hover:fill-[#b89359]"
                                />

                                <text
                                  x={x + barWidth / 2}
                                  y={y - 8}
                                  textAnchor="middle"
                                  className="text-[9px] font-bold fill-[#1F1D1A]"
                                >
                                  ${d.amount}
                                </text>

                                <text
                                  x={x + barWidth / 2}
                                  y={chartHeight - 4}
                                  textAnchor="middle"
                                  className="text-[9px] font-bold fill-[#7A7266]"
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
              <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6">
                <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-[#1F1D1A]">Transaction History</CardTitle>
                    <CardDescription className="text-xs text-[#7A7266]">Settle logs and verification audits</CardDescription>
                  </div>

                  {/* Status buttons */}
                  <div className="flex bg-[#F0E7D5] border border-[#E8DCC3] p-1 rounded-xl h-9 shrink-0">
                    {[
                      { id: "all", label: "All" },
                      { id: "cleared", label: "Cleared" },
                      { id: "processing", label: "Processing" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`rounded-lg text-[10px] font-bold px-3.5 py-1 transition-all ${statusFilter === tab.id
                          ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                          : "text-[#5A5146] hover:text-[#1F1D1A]"
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6 space-y-4">

                  {/* SEARCH AND DATE RANGES */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-[#FAF6F0] p-4 border border-[#E8DCC3] rounded-2xl">
                    <div className="space-y-1.5">
                      <Label htmlFor="searchQuery" className="text-[10px] font-bold text-[#7A7266]">Search</Label>
                      <Input
                        id="searchQuery"
                        placeholder="TXN ID, name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="dateFrom" className="text-[10px] font-bold text-[#7A7266]">From Date</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="dateTo" className="text-[10px] font-bold text-[#7A7266]">To Date</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                      />
                    </div>
                  </div>

                  {/* TABLE LISTING */}
                  {filteredTransactions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#7A7266] font-medium">
                      No transactions match your queries.
                    </div>
                  ) : (
                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-[#E8DCC3] text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
                            <th className="py-2.5 px-1">TXN ID</th>
                            <th className="py-2.5">Customer</th>
                            <th className="py-2.5">Date</th>
                            <th className="py-2.5">Service</th>
                            <th className="py-2.5">Amount</th>
                            <th className="py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC3] font-medium text-[#5A5146]">
                          {filteredTransactions.map(txn => (
                            <tr key={txn.id} className="hover:bg-[#FAF6F0] transition-colors">
                              <td className="py-3 px-1 font-bold text-[#7A7266]">{txn.id}</td>
                              <td className="py-3 font-bold text-[#1F1D1A]">{txn.customerName}</td>
                              <td className="py-3">{txn.date}</td>
                              <td className="py-3 truncate max-w-[130px]">{txn.serviceName}</td>
                              <td className="py-3 font-bold text-[#1F1D1A]">${txn.amount.toFixed(2)}</td>
                              <td className="py-3 text-right">
                                <Badge className={`rounded-lg text-[9px] font-bold px-2 py-0.5 border-0 leading-none ${
                                  txn.status === "cleared" ? "bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30" : "bg-[#F0E7D5] text-[#C9A46A] border border-[#E8DCC3]"
                                }`}>
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
              <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block border-b border-[#E8DCC3] pb-2">Payout History</span>

                <div className="space-y-3">
                  {payouts.map(p => (
                    <div key={p.id} className="p-3.5 border border-[#E8DCC3] rounded-xl bg-white shadow-2xs flex items-center justify-between gap-3 hover:border-[#C9A46A] transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-[#7A7266] uppercase tracking-wider">Ref: {p.id}</span>
                          <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 font-bold rounded-lg text-[8px] py-0 px-1 leading-none uppercase">Success</Badge>
                        </div>
                        <h5 className="font-bold text-[#1F1D1A] text-xs mt-1 truncate max-w-[180px]">{p.method}</h5>
                        <span className="text-[9px] text-[#7A7266] font-medium block">{p.date}</span>
                      </div>

                      <span className="font-bold text-[#1F1D1A] text-sm shrink-0">${p.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* SECURITY ASSURANCES CARD */}
              <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3 text-[#1F1D1A]">
                  <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl shrink-0 mt-0.5 border border-[#E8DCC3]">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs">Direct Deposits</h4>
                    <p className="text-[10px] text-[#5A5146] leading-relaxed font-medium">
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
        <DialogContent className="max-w-md bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1F1D1A] flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#C9A46A]" />
              Withdraw Cleared Balance
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7266] pt-0.5">
              Select your payment gateway transfer endpoint and specify withdraw values
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-3">

            {/* Display Withdrawable Balance */}
            <div className="p-3 bg-[#F0E7D5] border border-[#E8DCC3] rounded-xl flex justify-between items-center text-xs">
              <span className="font-bold text-[#1F1D1A]">Withdrawable Balance:</span>
              <span className="font-bold text-[#1F1D1A] text-sm">${withdrawableBalance.toFixed(2)}</span>
            </div>

            {withdrawError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl shadow-2xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#8C4B3E]" />
                <span>{withdrawError}</span>
              </div>
            )}

            {/* Withdrawal Method */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1F1D1A]">Transfer Endpoint</Label>
              <div className="grid grid-cols-2 bg-[#F0E7D5] border border-[#E8DCC3] p-1 rounded-xl h-10">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod("bank")}
                  className={`rounded-lg text-xs font-bold transition-all ${withdrawMethod === "bank"
                    ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                    : "text-[#5A5146] hover:text-[#1F1D1A]"
                    }`}
                >
                  Chase Bank
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod("upi")}
                  className={`rounded-lg text-xs font-bold transition-all ${withdrawMethod === "upi"
                    ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                    : "text-[#5A5146] hover:text-[#1F1D1A]"
                    }`}
                >
                  UPI Paytm / GPay
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs font-bold text-[#1F1D1A]">Withdraw Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 200"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWithdrawOpen(false)}
                className="rounded-xl border-[#E8DCC3] bg-[#FAF6F0] text-xs h-9.5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isWithdrawing}
                className="rounded-xl bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto flex items-center justify-center gap-1.5 border border-[#E8DCC3] cursor-pointer"
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

    </DashboardLayout>
  );
}
