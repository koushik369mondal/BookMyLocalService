import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { providerService } from "@/services/providerService";
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
  Clock,
  Download,
  CreditCard,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function Earnings() {
  const navigate = useNavigate();

  // Transactions list & balance states
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    clearedBalance: 0,
    pendingBalance: 0,
    transactions: [],
    dailyEarnings: [],
    monthlyEarnings: [],
    payoutHistory: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Withdraw Modal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [withdrawError, setWithdrawError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [chartView, setChartView] = useState("daily");
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchEarnings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await providerService.getEarnings();
      if (response.success && response.data) {
        setEarningsData(response.data);
      } else {
        setError(response.message || "Failed to load earnings metrics.");
      }
    } catch (err) {
      console.error("Fetch earnings error:", err);
      setError(err.message || "Failed to fetch provider earnings from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const handleDownloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setSuccessMsg("Earnings Statement downloaded.");
      setTimeout(() => setSuccessMsg(""), 2500);
    }, 1000);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setWithdrawError("");
    const amt = parseFloat(withdrawAmount);

    if (isNaN(amt) || amt <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }

    if (amt > earningsData.clearedBalance) {
      setWithdrawError("Requested amount exceeds available withdrawable balance.");
      return;
    }

    setIsWithdrawOpen(false);
    setWithdrawAmount("");
    setSuccessMsg(`Payout request for ${formatPrice(amt, { decimals: true })} initiated.`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Filtered transactions
  const filteredTransactions = earningsData.transactions.filter((tx) => {
    const matchesSearch =
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const chartData = chartView === "daily" ? earningsData.dailyEarnings : earningsData.monthlyEarnings;
  const maxChartAmount = Math.max(...chartData.map(d => d.amount), 1);

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Financials & Earnings</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Track cleared revenue, pending payouts, and payout settlements</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                disabled={isDownloading || isLoading}
                className="border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#1F1D1A] font-bold text-xs rounded-xl h-9.5 px-4 cursor-pointer shadow-2xs"
              >
                {isDownloading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Download className="h-4 w-4 text-[#C9A46A] mr-1" />}
                Statement PDF
              </Button>

              <Link to="/provider/dashboard">
                <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] border border-[#E8DCC3] text-white font-bold text-xs rounded-xl h-9.5 px-4 cursor-pointer shadow-2xs">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {successMsg && (
            <div className="flex items-center gap-2 p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl shadow-2xs">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{error}</span>
            </div>
          )}

          {/* BALANCE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Total Net Revenue</span>
                <div className="p-2.5 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A]">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatPrice(earningsData.totalEarnings, { decimals: true })}
                </span>
                <span className="text-[11px] font-semibold text-[#2B522B] block mt-1">Live Database Settlement</span>
              </div>
            </Card>

            <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Withdrawable Balance</span>
                <div className="p-2.5 bg-[#7DAB7D]/10 text-[#2B522B] rounded-xl border border-[#7DAB7D]/30">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A]">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatPrice(earningsData.clearedBalance, { decimals: true })}
                </span>
                <div className="mt-3">
                  <Button
                    size="xs"
                    onClick={() => setIsWithdrawOpen(true)}
                    disabled={isLoading || earningsData.clearedBalance <= 0}
                    className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-[10px] uppercase rounded-xl h-8 px-4 border border-[#E8DCC3] cursor-pointer"
                  >
                    Request Payout
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Pending Dispatches</span>
                <div className="p-2.5 bg-[#FAF6F0] text-[#7A7266] rounded-xl border border-[#E8DCC3]">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-[#1F1D1A]">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatPrice(earningsData.pendingBalance, { decimals: true })}
                </span>
                <span className="text-[11px] font-medium text-[#7A7266] block mt-1">Clears upon completion</span>
              </div>
            </Card>

          </div>

          {/* REVENUE ANALYTICS CHART */}
          <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCC3] pb-4">
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">Revenue Trends</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Settlements grouped by booking dates</CardDescription>
              </div>

              <div className="flex bg-[#FAF6F0] border border-[#E8DCC3] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setChartView("daily")}
                  className={`text-xs font-bold px-3 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                    chartView === "daily" ? "bg-[#C9A46A] text-white" : "text-[#7A7266]"
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setChartView("monthly")}
                  className={`text-xs font-bold px-3 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                    chartView === "monthly" ? "bg-[#C9A46A] text-white" : "text-[#7A7266]"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* BAR CHART GRAPH */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
              {chartData.map((item, idx) => {
                const heightPercent = Math.max(12, Math.round((item.amount / maxChartAmount) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-[#1F1D1A] opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatPrice(item.amount)}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-[#F0E7D5] group-hover:bg-[#C9A46A] border border-[#E8DCC3] rounded-t-xl transition-all duration-300"
                    ></div>
                    <span className="text-[10px] font-bold text-[#7A7266] uppercase">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* TRANSACTIONS HISTORY TABLE */}
          <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DCC3] pb-4">
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">Transaction Activity</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Itemized job dispatch settlements from database</CardDescription>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Input
                  placeholder="Search customer, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 text-xs border-[#E8DCC3] focus-visible:ring-[#C9A46A] rounded-xl bg-[#FAF6F0]"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 text-xs font-bold border border-[#E8DCC3] rounded-xl px-3 bg-[#FAF6F0] text-[#1F1D1A] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="cleared">Cleared</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="h-6 w-6 text-[#C9A46A] animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#5A5146]">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="py-12 text-center">
                <Briefcase className="h-8 w-8 text-[#7A7266] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#1F1D1A]">No matching transactions</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DCC3] text-[10px] font-bold text-[#7A7266] uppercase tracking-wider bg-[#FAF6F0]">
                      <th className="py-3 px-4">TXN ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCC3]/60">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">{tx.id}</td>
                        <td className="py-3.5 px-4 font-medium text-[#5A5146]">{tx.customerName}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#1F1D1A]">{tx.serviceName}</td>
                        <td className="py-3.5 px-4 text-[#7A7266]">{tx.date}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#1F1D1A]">{formatPrice(tx.amount, { decimals: true })}</td>
                        <td className="py-3.5 px-4 text-center">
                          {tx.status === "cleared" ? (
                            <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 font-bold rounded-lg px-2 py-0.5 text-[9px] uppercase">Cleared</Badge>
                          ) : (
                            <Badge className="bg-[#C9A46A]/20 text-[#1F1D1A] border border-[#C9A46A]/30 font-bold rounded-lg px-2 py-0.5 text-[9px] uppercase">Processing</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>

        {/* WITHDRAW MODAL */}
        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogContent className="bg-white border-[#E8DCC3] rounded-2xl max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#1F1D1A]">Initiate Payout Transfer</DialogTitle>
              <DialogDescription className="text-xs text-[#7A7266]">
                Available Withdrawable Balance: <strong>{formatPrice(earningsData.clearedBalance, { decimals: true })}</strong>
              </DialogDescription>
            </DialogHeader>

            {withdrawError && (
              <div className="p-3 bg-[#8C4B3E]/15 border border-[#8C4B3E]/30 text-[#8C4B3E] text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{withdrawError}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="withdrawAmount" className="text-xs font-bold text-[#1F1D1A]">Amount (₹)</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="e.g. 5000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="h-10 border-[#E8DCC3] focus-visible:ring-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#1F1D1A]">Settlement Channel</Label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full h-10 border border-[#E8DCC3] rounded-xl px-3 text-xs font-bold bg-white text-[#1F1D1A] focus:outline-none"
                >
                  <option value="bank">Bank Wire Transfer (HDFC Bank ****1290)</option>
                  <option value="upi">Direct Instant UPI Transfer</option>
                </select>
              </div>

              <DialogFooter className="pt-4 border-t border-[#E8DCC3]">
                <Button type="button" variant="outline" onClick={() => setIsWithdrawOpen(false)} className="border-[#E8DCC3] text-[#5A5146] font-bold text-xs h-9 rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-9 rounded-xl border border-[#E8DCC3]">
                  Submit Payout Request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}
