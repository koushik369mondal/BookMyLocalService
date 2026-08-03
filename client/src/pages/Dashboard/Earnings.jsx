import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
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
  { label: "Mon", amount: 1200 },
  { label: "Tue", amount: 1500 },
  { label: "Wed", amount: 800 },
  { label: "Thu", amount: 2200 },
  { label: "Fri", amount: 1900 },
  { label: "Sat", amount: 2500 },
  { label: "Sun", amount: 3100 }
];

// Mock monthly earnings
const monthlyEarnings = [
  { label: "Jan", amount: 12000 },
  { label: "Feb", amount: 9800 },
  { label: "Mar", amount: 15500 },
  { label: "Apr", amount: 13000 },
  { label: "May", amount: 17500 },
  { label: "Jun", amount: 21000 },
  { label: "Jul", amount: 24000 }
];

// Mock Transaction Database
const initialTransactions = [
  { id: "TXN-88391", customerName: "Ananya Sen", serviceName: "Deep Home Cleaning & Sanitization", date: "2026-07-08", amount: 1499.00, status: "cleared" },
  { id: "TXN-66382", customerName: "Priya Patel", serviceName: "Expert Plumbing & Leakage Repair", date: "2026-07-05", amount: 499.00, status: "cleared" },
  { id: "TXN-44281", customerName: "Amit Verma", serviceName: "Split & Window AC Servicing", date: "2026-07-02", amount: 699.00, status: "processing" },
  { id: "TXN-10943", customerName: "Neha Gupta", serviceName: "Deep Home Cleaning & Sanitization", date: "2026-06-28", amount: 1499.00, status: "cleared" },
  { id: "TXN-99382", customerName: "Vikram Singh", serviceName: "Home Electrical & Appliance Repair", date: "2026-06-15", amount: 399.00, status: "cleared" }
];

// Mock Payouts archive transfers
const payoutHistory = [
  { id: "PAY-99381", date: "2026-07-01", amount: 12500.00, method: "UPI / HDFC Bank (****1290)", status: "success" },
  { id: "PAY-88291", date: "2026-06-01", amount: 9800.00, method: "UPI / HDFC Bank (****1290)", status: "success" }
];

export default function Earnings() {
  const navigate = useNavigate();

  // Transactions list & balance states
  const [transactions, setTransactions] = useState(initialTransactions);
  const [pendingBalance, setPendingBalance] = useState(2400.00);
  const [withdrawableBalance, setWithdrawableBalance] = useState(18500.00);
  const [payouts, setPayouts] = useState(payoutHistory);

  // Filters & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Withdraw Modal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [withdrawError, setWithdrawError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [chartView, setChartView] = useState("daily"); // "daily" or "monthly"
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setSuccessMsg("Simulating Earnings Statement PDF download...");
      setTimeout(() => setSuccessMsg(""), 2500);
    }, 1200);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setWithdrawError("");

    const amountVal = parseFloat(withdrawAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      setWithdrawError("Please enter a valid transfer amount.");
      return;
    }

    if (amountVal > withdrawableBalance) {
      setWithdrawError(`Transfer value exceeds your available balance of ${formatPrice(withdrawableBalance, { decimals: true })}.`);
      return;
    }

    // Process withdrawal
    setWithdrawableBalance(prev => prev - amountVal);
    setIsWithdrawOpen(false);

    const newPayout = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      amount: amountVal,
      method: withdrawMethod === "bank" ? "UPI / HDFC Bank (****1290)" : "Paytm Wallet (****9812)",
      status: "success"
    };

    setPayouts([newPayout, ...payouts]);
    setSuccessMsg(`Withdrawal of ${formatPrice(amountVal, { decimals: true })} authorized successfully!`);
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
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">{formatPrice(withdrawableBalance + 22300, { decimals: true })}</span>
              </div>
              <div className="p-3 bg-[#7DAB7D]/20 text-[#2B522B] rounded-2xl shrink-0 border border-[#7DAB7D]/30">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            {/* Withdrawable Balance */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Cleared Balance</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">{formatPrice(withdrawableBalance, { decimals: true })}</span>
              </div>
              <div className="p-3 bg-[#F0E7D5] text-[#C9A46A] rounded-2xl shrink-0 border border-[#E8DCC3]">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </Card>

            {/* Pending Balance */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Pending Payouts</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">{formatPrice(pendingBalance, { decimals: true })}</span>
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
                      <CardTitle className="text-base font-bold text-[#1F1D1A]">Earnings Analytics</CardTitle>
                      <CardDescription className="text-xs text-[#7A7266]">Daily and monthly payout trends</CardDescription>
                    </div>
                  </div>

                  <div className="flex bg-[#F0E7D5]/70 border border-[#E8DCC3] p-1 rounded-xl h-9 shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setChartView("daily")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1 transition-all ${chartView === "daily"
                        ? "bg-[#F0E7D5] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                        : "text-[#5A5146] hover:text-[#1F1D1A]"
                        }`}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartView("monthly")}
                      className={`rounded-lg text-[10px] font-bold px-3 py-1 transition-all ${chartView === "monthly"
                        ? "bg-[#F0E7D5] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                        : "text-[#5A5146] hover:text-[#1F1D1A]"
                        }`}
                    >
                      Monthly
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[460px] h-[150px] relative">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                        <line x1="20" y1="20" x2="480" y2="20" stroke="#E8DCC3" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="60" x2="480" y2="60" stroke="#E8DCC3" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="100" x2="480" y2="100" stroke="#E8DCC3" strokeWidth="1.5" />

                        {activeChartData.map((d, index) => {
                          const x = index * spacing + 30;
                          const barHeight = (d.amount / maxVal) * (chartHeight - 45);
                          const y = chartHeight - barHeight - 30;

                          return (
                            <g key={d.label}>
                              <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx="4"
                                fill="#C9A46A"
                                className="hover:fill-[#b89359] transition-colors cursor-pointer"
                              />
                              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[9px] font-bold fill-[#1F1D1A]">{formatPrice(d.amount)}</text>
                              <text x={x + barWidth / 2} y={chartHeight - 12} textAnchor="middle" className="text-[9px] font-medium fill-[#7A7266]">{d.label}</text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* TRANSACTIONS AUDIT TABLE */}
              <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6 space-y-4">
                <CardHeader className="p-0 pb-3 border-b border-[#E8DCC3]">
                  <CardTitle className="text-base font-bold text-[#1F1D1A]">Recent Transactions</CardTitle>
                  <CardDescription className="text-xs text-[#7A7266]">Itemized log of completed job receipts and payouts</CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-4 pt-2">

                  {/* Filter Toolbar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF6F0] p-3 border border-[#E8DCC3] rounded-xl">
                    <Input
                      placeholder="Search TXN / Customer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                    />

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-9.5 border border-[#E8DCC3] focus:outline-none focus:ring-2 focus:ring-[#C9A46A]/20 rounded-xl bg-white text-xs font-medium text-[#1F1D1A] px-3 cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="cleared">Cleared</option>
                      <option value="processing">Processing</option>
                    </select>

                    <div className="flex items-center gap-1.5">
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                      />
                      <Input
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
                              <td className="py-3 font-bold text-[#1F1D1A]">{formatPrice(txn.amount, { decimals: true })}</td>
                              <td className="py-3 text-right">
                                <Badge className={`rounded-lg text-[9px] font-bold px-2 py-0.5 border-0 leading-none ${txn.status === "cleared" ? "bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30" : "bg-[#F0E7D5] text-[#C9A46A] border border-[#E8DCC3]"
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

                      <span className="font-bold text-[#1F1D1A] text-sm shrink-0">{formatPrice(p.amount, { decimals: true })}</span>
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
                    <h4 className="font-bold text-xs">Direct UPI & Bank Payouts</h4>
                    <p className="text-[10px] text-[#5A5146] leading-relaxed font-medium">
                      Withdrawals take 24-48 hours to settle to your verified bank account. Zero transfer fees on linked UPI accounts.
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
              <span className="font-bold text-[#1F1D1A] text-sm">{formatPrice(withdrawableBalance, { decimals: true })}</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1F1D1A]">Amount to Withdraw (₹)</Label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1F1D1A]">Payout Endpoint</Label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full h-10 border border-[#E8DCC3] focus:outline-none focus:ring-2 focus:ring-[#C9A46A]/20 rounded-xl bg-white text-xs font-medium text-[#1F1D1A] px-3 cursor-pointer"
              >
                <option value="bank">UPI / Bank Account (HDFC ****1290)</option>
                <option value="paytm">Paytm Wallet (****9812)</option>
              </select>
            </div>

            {withdrawError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <DialogFooter className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWithdrawOpen(false)}
                className="h-9.5 px-4 border-[#E8DCC3] text-xs font-bold rounded-xl text-[#5A5146] hover:bg-[#FAF6F0] cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-9.5 px-5 bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
              >
                Authorize Transfer
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
