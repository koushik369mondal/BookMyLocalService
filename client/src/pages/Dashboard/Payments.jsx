import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  RotateCcw, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  FileText,
  AlertCircle,
  Calendar
} from "lucide-react";

// Mock Payments Database
const initialTransactions = [
  { id: "TXN-90284", bookingId: "BMLS-98394", customer: "Amanda Watson", provider: "Sarah Jenkins", service: "Deep Home Cleaning Service", amount: 55.00, method: "Credit Card", status: "completed", date: "2026-07-09 10:15 AM" },
  { id: "TXN-80392", bookingId: "BMLS-88294", customer: "Robert Garcia", provider: "David Miller", service: "Expert Plumbing & Leak Repair", amount: 98.00, method: "UPI", status: "completed", date: "2026-07-08 04:30 PM" },
  { id: "TXN-70492", bookingId: "BMLS-77291", customer: "Sarah Connor", provider: "Marcus Vance", service: "Licensed Smart Home Wiring", amount: 115.00, method: "Net Banking", status: "pending", date: "2026-07-09 11:20 AM" },
  { id: "TXN-60591", bookingId: "BMLS-66102", customer: "Chloe Bennett", provider: "Gary Woods", service: "Hedge Trimming & Tree Removal", amount: 82.00, method: "Wallet", status: "refunded", date: "2026-07-05 02:45 PM" }
];

export default function Payments() {
  const navigate = useNavigate();

  // Payments states
  const [txnList, setTxnList] = useState(initialTransactions);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // Modals active states
  const [viewingTxn, setViewingTxn] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState(null); // { action: "refund" | "mark-paid", data: any }
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // UI state notifications
  const [successMsg, setSuccessMsg] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // Shimmer skeleton simulator on filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [statusFilter, methodFilter, sortBy]);

  // Dialog triggers
  const handleOpenView = (txn) => {
    setViewingTxn(txn);
    setIsViewOpen(true);
  };

  const handleOpenConfirm = (action, txn) => {
    setConfirmTarget({ action, txn });
    setIsConfirmOpen(true);
  };

  const executeConfirmAction = async () => {
    setIsActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsActionLoading(false);
    setIsConfirmOpen(false);

    const { action, txn } = confirmTarget;

    if (action === "refund") {
      setTxnList(prev => prev.map(t => t.id === txn.id ? { ...t, status: "refunded" } : t));
      setSuccessMsg(`Refund successfully processed for Transaction ${txn.id}!`);
    } else if (action === "mark-paid") {
      setTxnList(prev => prev.map(t => t.id === txn.id ? { ...t, status: "completed" } : t));
      setSuccessMsg(`Transaction ${txn.id} marked as Paid!`);
    }

    setTimeout(() => setSuccessMsg(""), 2000);
  };

  // Download Invoice action
  const handleDownloadInvoice = (txnId) => {
    setSuccessMsg(`Downloading invoice receipt for transaction: ${txnId}...`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Calculation for filters
  const filteredTxns = React.useMemo(() => {
    let result = [...txnList];

    // Search query matching
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.id.toLowerCase().includes(q) || 
        t.bookingId.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.provider.toLowerCase().includes(q)
      );
    }

    // Status matching
    if (statusFilter !== "all") {
      result = result.filter(t => t.status === statusFilter);
    }

    // Method matching
    if (methodFilter !== "all") {
      result = result.filter(t => t.method === methodFilter);
    }

    // Date range matching
    if (dateFrom) {
      result = result.filter(t => new Date(t.date).getTime() >= new Date(dateFrom).getTime());
    }
    if (dateTo) {
      result = result.filter(t => new Date(t.date).getTime() <= new Date(dateTo).getTime() + 86400000);
    }

    // Sort matching
    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      } else { // amount-asc
        return a.amount - b.amount;
      }
    });

    return result;
  }, [txnList, searchQuery, statusFilter, methodFilter, dateFrom, dateTo, sortBy]);

  // Pagination parameters
  const totalPages = Math.ceil(filteredTxns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTxns = filteredTxns.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Statistics counters
  const stats = React.useMemo(() => {
    const total = 42850.00 + txnList.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0) - initialTransactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
    const today = 1240.00;
    const pending = 4520.00 + txnList.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0) - initialTransactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);
    const refunded = 1850.00 + txnList.filter(t => t.status === "refunded").reduce((sum, t) => sum + t.amount, 0) - initialTransactions.filter(t => t.status === "refunded").reduce((sum, t) => sum + t.amount, 0);
    return { total, today, pending, refunded };
  }, [txnList]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Paid</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Pending</Badge>;
      default: // refunded
        return <Badge className="bg-rose-500 hover:bg-rose-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Refunded</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Payments Ledger</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Audit platform transactions, process refunds, verify invoice bills</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-md">
            
            <div className="text-center space-y-1 py-1">
              <span className="block text-2xl font-black text-slate-900">${stats.total.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
            </div>
            
            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-emerald-600">${stats.today.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Revenue</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-amber-600">${stats.pending.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Escrow</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-rose-600">${stats.refunded.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Refunded Volume</span>
            </div>

          </div>
        </section>

        {/* MAIN CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDEBAR: FILTERS */}
            <div className="lg:col-span-3 space-y-5 shrink-0">
              
              {/* Search */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5 flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-slate-900" /> Search Payments
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-[50%] translate-y-[-50%] text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <Input 
                    placeholder="TXN ID, Booking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                  />
                </div>
              </Card>

              {/* Status */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5">Filter by Status</span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

              {/* Method */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5">Payment Method</span>
                <div className="relative">
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Methods</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Wallet">Wallet</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

              {/* Dates */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs space-y-3.5">
                <span className="text-xs font-bold text-slate-800 block border-b border-slate-50 pb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-900" /> Date Range
                </span>
                
                <div className="space-y-1">
                  <Label htmlFor="dateFrom" className="text-[10px] font-bold text-slate-400 uppercase">From Date</Label>
                  <Input 
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-9 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="dateTo" className="text-[10px] font-bold text-slate-400 uppercase">To Date</Label>
                  <Input 
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-9 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white cursor-pointer"
                  />
                </div>
              </Card>

              {/* Sort Options */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5">Sort Options</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="date-desc">Date: Newest First</option>
                    <option value="date-asc">Date: Oldest First</option>
                    <option value="amount-desc">Amount: High to Low</option>
                    <option value="amount-asc">Amount: Low to High</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

            </div>

            {/* RIGHT COLUMN: TRANSACTIONS TABLE LIST */}
            <main className="lg:col-span-9 space-y-6">
              
              {successMsg && (
                <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {isLoading ? (
                /* LOADING SHIMMER SKELETONS */
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border border-slate-100 bg-white p-5 rounded-2xl animate-pulse flex items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 bg-slate-200 w-1/4 rounded" />
                        <Skeleton className="h-3.5 bg-slate-200 w-1/3 rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : paginatedTxns.length === 0 ? (
                /* EMPTY STATE BOARD */
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto shadow-2xs mt-4">
                  <div className="p-4 bg-slate-900/5 text-slate-900 rounded-full border border-slate-900/10">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">No Transactions Found</h3>
                  <p className="text-xs text-slate-450 max-w-sm leading-relaxed">
                    We couldn't find any transaction payments matching your selected criteria. Clear search queries.
                  </p>
                </div>
              ) : (
                /* TRANSACTIONS MATRIX TABLE */
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                          <th className="py-2.5 px-1">TXN ID</th>
                          <th className="py-2.5">Booking</th>
                          <th className="py-2.5">Parties</th>
                          <th className="py-2.5">Service</th>
                          <th className="py-2.5">Amount</th>
                          <th className="py-2.5">Method</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {paginatedTxns.map(txn => (
                          <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-1 font-bold text-slate-450">{txn.id}</td>
                            <td className="py-3 font-semibold text-slate-600">{txn.bookingId}</td>
                            <td className="py-3">
                              <span className="block text-slate-800 font-bold">Client: {txn.customer}</span>
                              <span className="text-[10px] text-slate-450 font-semibold block mt-0.5">Pro: {txn.provider}</span>
                            </td>
                            <td className="py-3 truncate max-w-[130px]">{txn.service}</td>
                            <td className="py-3 font-black text-slate-950 text-sm">${txn.amount.toFixed(2)}</td>
                            <td className="py-3 text-slate-500 font-bold">{txn.method}</td>
                            <td className="py-3">{getStatusBadge(txn.status)}</td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button
                                  size="xs"
                                  variant="outline"
                                  onClick={() => handleOpenView(txn)}
                                  className="h-7 text-[9px] font-bold border-slate-200 hover:bg-slate-50 bg-white"
                                >
                                  View Details
                                </Button>
                                
                                <Button
                                  size="xs"
                                  variant="outline"
                                  onClick={() => handleDownloadInvoice(txn.id)}
                                  className="h-7 text-[9px] font-bold border-slate-200 hover:bg-slate-50 bg-white text-slate-600"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                </Button>

                                {txn.status === "pending" && (
                                  <Button
                                    size="xs"
                                    onClick={() => handleOpenConfirm("mark-paid", txn)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-7 rounded-lg text-[9px] py-0 px-2 border-0 shadow-2xs"
                                  >
                                    Paid
                                  </Button>
                                )}

                                {txn.status === "completed" && (
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleOpenConfirm("refund", txn)}
                                    className="h-7 text-[9px] font-bold border-rose-200 bg-white hover:bg-rose-50 text-rose-600 rounded-lg"
                                  >
                                    Refund
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-9 font-semibold text-xs"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1.5" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1.5">
                        {[...Array(totalPages)].map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`h-8 w-8 text-xs font-bold rounded-xl transition-all ${
                                currentPage === pageNum
                                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="rounded-xl border-slate-200 text-slate-655 hover:bg-slate-50 h-9 font-semibold text-xs"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </div>
                  )}

                </Card>
              )}

            </main>

          </div>
        </div>

      </div>

      {/* DIALOG 1: VIEW DETAILS MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        {viewingTxn && (
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
            <DialogHeader className="border-b border-slate-50 pb-4">
              <DialogTitle className="text-base font-extrabold text-slate-900">Transaction Details Summary</DialogTitle>
              <DialogDescription className="text-xs">Database audit reference log</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Transaction Ref ID:</span>
                <span className="text-slate-900 font-extrabold">{viewingTxn.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Booking Reference:</span>
                <span className="text-slate-900 font-bold">{viewingTxn.bookingId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Client (Customer):</span>
                <span className="text-slate-900">{viewingTxn.customer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Specialist (Provider):</span>
                <span className="text-slate-900">{viewingTxn.provider}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Service Category:</span>
                <span className="text-slate-900">{viewingTxn.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Payment Method:</span>
                <span className="text-slate-900">{viewingTxn.method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Execution Time:</span>
                <span className="text-slate-900">{viewingTxn.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Audit Status:</span>
                <span>{getStatusBadge(viewingTxn.status)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-sm font-bold text-slate-800">Total Settlement:</span>
                <span className="text-slate-950 text-base font-black">${viewingTxn.amount.toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-50">
              <Button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs h-9.5 px-5 w-full sm:w-auto"
              >
                Close View
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* DIALOG 2: REFUND / MARK PAID CONFIRMATION WARNING */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {confirmTarget && confirmTarget.txn && (
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600 animate-pulse" />
                Confirm Settlement Action
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 pt-0.5">
                Are you sure you want to perform this transaction adjustment? Verification is required.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Details</span>
              <span className="text-slate-800 block">Transaction ID: {confirmTarget.txn.id}</span>
              <span className="text-slate-500 block">Client: {confirmTarget.txn.customer}</span>
              <span className="text-slate-900 block border-t border-slate-200 pt-1.5 mt-1 text-sm font-black">Settlement: ${confirmTarget.txn.amount.toFixed(2)}</span>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
              >
                Close Dialog
              </Button>
              <Button 
                type="button" 
                onClick={executeConfirmAction}
                disabled={isActionLoading}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto flex items-center justify-center gap-1.5 border-0"
              >
                {isActionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Executing...
                  </>
                ) : (
                  <>
                    Confirm Adjustment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

    </DashboardLayout>
  );
}


