import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { providerService } from "@/services/providerService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CheckCircle2,
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
      setSuccessMsg("Earnings statement downloaded.");
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
      <div className="space-y-8 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Financials & earnings</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Track cleared revenue, pending payouts, and payout settlements</p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReport}
              disabled={isDownloading || isLoading}
              className="flex items-center gap-1.5"
            >
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Statement PDF
            </Button>

            <Link to="/provider/dashboard">
              <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* FEEDBACK */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* BALANCE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="card-chai p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Total net revenue</span>
              <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatPrice(earningsData.totalEarnings, { decimals: true })}
              </span>
              <span className="text-[11px] font-medium text-emerald-400 block mt-1">Live database settlement</span>
            </div>
          </div>

          <div className="card-chai p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Withdrawable balance</span>
              <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatPrice(earningsData.clearedBalance, { decimals: true })}
              </span>
              <div className="mt-3">
                <Button
                  size="xs"
                  variant="solid"
                  onClick={() => setIsWithdrawOpen(true)}
                  disabled={isLoading || earningsData.clearedBalance <= 0}
                  className="flex items-center gap-1"
                >
                  Request payout
                </Button>
              </div>
            </div>
          </div>

          <div className="card-chai p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Pending dispatches</span>
              <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatPrice(earningsData.pendingBalance, { decimals: true })}
              </span>
              <span className="text-[11px] font-normal text-neutral-500 block mt-1">Clears upon job completion</span>
            </div>
          </div>

        </div>

        {/* REVENUE ANALYTICS CHART */}
        <div className="card-chai p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Revenue trends</h2>
              <p className="text-xs text-neutral-400">Settlements grouped by booking dates</p>
            </div>

            <div className="flex bg-neutral-900/60 border border-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setChartView("daily")}
                className={`text-xs font-semibold px-3 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                  chartView === "daily" ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setChartView("monthly")}
                className={`text-xs font-semibold px-3 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                  chartView === "monthly" ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"
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
                  <span className="text-[10px] font-mono font-medium text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(item.amount)}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] bg-white/[0.08] group-hover:bg-white border border-white/10 rounded-t-xl transition-all duration-300"
                  />
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TRANSACTIONS HISTORY TABLE */}
        <div className="card-chai p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Transaction activity</h2>
              <p className="text-xs text-neutral-400">Itemized job dispatch settlements from database</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Input
                placeholder="Search customer, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 text-xs"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 text-xs font-medium border border-white/10 rounded-xl px-3 bg-neutral-900/60 text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-neutral-900 text-white">All statuses</option>
                <option value="cleared" className="bg-neutral-900 text-white">Cleared</option>
                <option value="processing" className="bg-neutral-900 text-white">Processing</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-6 w-6 text-neutral-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-neutral-400">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-white">No matching transactions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider bg-white/[0.02]">
                    <th className="py-3 px-4">Txn ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-white">{tx.id}</td>
                      <td className="py-3.5 px-4 text-neutral-300">{tx.customerName}</td>
                      <td className="py-3.5 px-4 font-medium text-white">{tx.serviceName}</td>
                      <td className="py-3.5 px-4 text-neutral-400 font-mono">{tx.date}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">{formatPrice(tx.amount, { decimals: true })}</td>
                      <td className="py-3.5 px-4 text-center">
                        {tx.status === "cleared" ? (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-medium rounded-lg px-2 py-0.5 text-[9px] uppercase">Cleared</Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-400/30 text-amber-400 font-medium rounded-lg px-2 py-0.5 text-[9px] uppercase">Processing</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* WITHDRAW MODAL */}
        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogContent className="card-chai border-white/10 max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white">Initiate payout transfer</DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Available withdrawable balance: {formatPrice(earningsData.clearedBalance, { decimals: true })}
              </DialogDescription>
            </DialogHeader>

            {withdrawError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{withdrawError}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="withdrawAmount" className="text-xs font-medium text-neutral-300">Amount (₹)</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="e.g. 5000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Settlement channel</Label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full h-10 border border-white/10 rounded-xl px-3 text-xs font-medium bg-neutral-900/60 text-white focus:outline-none cursor-pointer"
                >
                  <option value="bank" className="bg-neutral-900 text-white">Bank wire transfer</option>
                  <option value="upi" className="bg-neutral-900 text-white">Direct instant UPI transfer</option>
                </select>
              </div>

              <DialogFooter className="pt-4 border-t border-white/10">
                <Button type="button" variant="outline" onClick={() => setIsWithdrawOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="solid" className="text-xs">
                  Submit payout request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}
