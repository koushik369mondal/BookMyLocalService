import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
  { id: "TXN-90284", bookingId: "BMLS-98394", customer: "Ananya Sen", provider: "Sunita Rao", service: "Deep Home Cleaning & Sanitization", amount: 1499.00, method: "UPI", status: "completed", date: "2026-07-09 10:15 AM" },
  { id: "TXN-80392", bookingId: "BMLS-88294", customer: "Priya Patel", provider: "Rajesh Sharma", service: "Expert Plumbing & Leakage Repair", amount: 499.00, method: "UPI", status: "completed", date: "2026-07-08 04:30 PM" },
  { id: "TXN-70492", bookingId: "BMLS-77291", customer: "Amit Das", provider: "Amit Verma", service: "Certified Home Electrical Repair", amount: 399.00, method: "Net Banking", status: "pending", date: "2026-07-09 11:20 AM" },
  { id: "TXN-60591", bookingId: "BMLS-66102", customer: "Neha Gupta", provider: "Manoj Mali", service: "Hedge Trimming & Tree Pruning", amount: 799.00, method: "Wallet", status: "refunded", date: "2026-07-05 02:45 PM" }
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
    setTimeout(() => {
      if (confirmTarget) {
        const { action, txn } = confirmTarget;
        setTxnList(prev => prev.map(t => {
          if (t.id === txn.id) {
            return {
              ...t,
              status: action === "refund" ? "refunded" : "completed"
            };
          }
          return t;
        }));

        setSuccessMsg(`Transaction ${txn.id} was updated (${action === "refund" ? "Refund Processed" : "Marked as Paid"}) successfully!`);
        setTimeout(() => setSuccessMsg(""), 3000);
      }

      setIsActionLoading(false);
      setIsConfirmOpen(false);
    }, 800);
  };

  const handleDownloadInvoice = (txnId) => {
    setSuccessMsg(`Simulating PDF invoice generation for transaction ${txnId}...`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Filter calculations
  const filteredTxns = React.useMemo(() => {
    let result = [...txnList];

    // Search query matching
    if (searchQuery.trim()) {
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
    const total = 342850.00 + txnList.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0) - initialTransactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
    const today = 12400.00;
    const pending = 35200.00 + txnList.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0) - initialTransactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);
    const refunded = 18500.00 + txnList.filter(t => t.status === "refunded").reduce((sum, t) => sum + t.amount, 0) - initialTransactions.filter(t => t.status === "refunded").reduce((sum, t) => sum + t.amount, 0);
    return { total, today, pending, refunded };
  }, [txnList]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Paid</Badge>;
      case "pending":
        return <Badge className="bg-[#8C4B3E] hover:bg-amber-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Pending</Badge>;
      default: // refunded
        return <Badge className="bg-rose-500 hover:bg-rose-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Refunded</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Payments Ledger</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Audit platform transactions, process refunds, verify invoice bills</p>
            </div>
            
            {/* Quick dashboard back button */}
            <Link to="/admin/dashboard">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] text-white border border-[#E8DCC3] rounded-xl text-xs font-bold px-5 h-9.5 shadow-2xs flex items-center gap-1 cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* STATISTICS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-[#E8DCC3] p-5 rounded-2xl shadow-2xs">
            
            <div className="text-center space-y-1 py-1">
              <span className="block text-2xl font-bold text-[#1F1D1A]">₹{stats.total.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Revenue</span>
            </div>
            
            <div className="text-center space-y-1 py-1 border-l border-[#E8DCC3]">
              <span className="block text-2xl font-bold text-[#2B522B]">₹{stats.today.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Today's Revenue</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-[#E8DCC3]">
              <span className="block text-2xl font-bold text-[#C9A46A]">₹{stats.pending.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Pending Escrow</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-[#E8DCC3]">
              <span className="block text-2xl font-bold text-[#8C4B3E]">₹{stats.refunded.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Refunded Volume</span>
            </div>

          </div>
        </section>

        {/* MAIN CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDEBAR: FILTERS */}
            <div className="lg:col-span-3 space-y-5 shrink-0">
              
              {/* Search */}
              <Card className="border border-[#5A5146]/15 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-[#1F1D1A] block mb-2.5 flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-[#1F1D1A]" /> Search Payments
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-[50%] translate-y-[-50%] text-[#7A7266]">
                    <Search className="h-4 w-4" />
                  </span>
                  <Input 
                    placeholder="TXN ID, Booking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                  />
                </div>
              </Card>

              {/* Status */}
              <Card className="border border-[#5A5146]/15 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-[#1F1D1A] block mb-2.5">Filter by Status</span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#8C4B3E] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed / Paid</option>
                    <option value="pending">Pending Escrow</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-[#7A7266]" />
                </div>
              </Card>

              {/* Method */}
              <Card className="border border-[#5A5146]/15 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-[#1F1D1A] block mb-2.5">Payment Method</span>
                <div className="relative">
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#8C4B3E] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Methods</option>
                    <option value="UPI">UPI Transfer</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Credit Card">Credit/Debit Card</option>
                    <option value="Wallet">Digital Wallet</option>
                  </select>
                  <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-[#7A7266]" />
                </div>
              </Card>

            </div>

            {/* RIGHT SIDE: TABLE & PAGINATION */}
            <div className="lg:col-span-9 space-y-6">
              
              {successMsg && (
                <div className="flex items-start gap-2.5 p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl shadow-2xs">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#2B522B]" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Card className="border border-[#5A5146]/15 bg-white p-6 rounded-2xl shadow-2xs space-y-4">
                
                {/* Header & Sorting controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-50">
                  <div>
                    <h3 className="text-base font-extrabold text-[#1F1D1A]">Audit Ledger Records</h3>
                    <p className="text-xs text-[#7A7266]">Showing {paginatedTxns.length} of {filteredTxns.length} records</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#7A7266] font-semibold shrink-0">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-8 pl-2.5 pr-7 border border-[#5A5146]/20 focus:outline-none focus:ring-1 focus:ring-violet-950 rounded-lg bg-white text-xs font-bold text-[#8C4B3E] cursor-pointer appearance-none"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="amount-desc">Highest Value</option>
                      <option value="amount-asc">Lowest Value</option>
                    </select>
                  </div>
                </div>

                {/* Table content */}
                {isLoading ? (
                  <div className="py-12 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#C9A46A]" />
                  </div>
                ) : filteredTxns.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#7A7266] font-bold">
                    No transaction records match your filtering parameters.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-[#5A5146]/15 text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
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
                        <tbody className="divide-y divide-stone-50 font-medium text-[#8C4B3E]">
                          {paginatedTxns.map(txn => (
                            <tr key={txn.id} className="hover:bg-[#FAF6F0] transition-colors">
                              <td className="py-3 px-1 font-bold text-[#7A7266]">{txn.id}</td>
                              <td className="py-3 font-semibold text-[#5A5146]">{txn.bookingId}</td>
                              <td className="py-3">
                                <span className="block text-[#1F1D1A] font-bold">Client: {txn.customer}</span>
                                <span className="text-[10px] text-[#7A7266] font-semibold block mt-0.5">Pro: {txn.provider}</span>
                              </td>
                              <td className="py-3 truncate max-w-[130px]">{txn.service}</td>
                              <td className="py-3 font-black text-[#1F1D1A] text-sm">₹{txn.amount.toFixed(2)}</td>
                              <td className="py-3 text-[#7A7266] font-bold">{txn.method}</td>
                              <td className="py-3">{getStatusBadge(txn.status)}</td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleOpenView(txn)}
                                    className="h-7 text-[9px] font-bold border-[#5A5146]/20 hover:bg-[#FAF6F0] bg-white"
                                  >
                                    View Details
                                  </Button>
                                  
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleDownloadInvoice(txn.id)}
                                    className="h-7 text-[9px] font-bold border-[#5A5146]/20 hover:bg-[#FAF6F0] bg-white text-[#5A5146]"
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
                      <div className="flex items-center justify-between border-t border-[#5A5146]/15 pt-5 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          className="rounded-xl border-[#5A5146]/20 text-[#5A5146] hover:bg-[#FAF6F0] h-9 font-semibold text-xs"
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
                                    ? "bg-[#8C4B3E] text-white shadow-md shadow-2xs"
                                    : "text-[#5A5146] hover:bg-[#F0E7D5]"
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
                          className="rounded-xl border-[#5A5146]/20 text-[#5A5146] hover:bg-[#FAF6F0] h-9 font-semibold text-xs"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

              </Card>

            </div>

          </div>
        </div>

      </div>

      {/* DIALOG 1: VIEW TRANSACTION DETAILS */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        {viewingTxn && (
          <DialogContent className="max-w-md bg-white border border-[#5A5146]/20 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-[#1F1D1A] flex items-center justify-between">
                <span>Transaction Breakdown</span>
                <span className="text-xs font-bold text-[#7A7266]">Ref #{viewingTxn.id}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-[#7A7266]">
                System payment receipt audit details for Booking #{viewingTxn.bookingId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs font-medium text-[#5A5146] py-3">
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span>Client (Customer):</span>
                <span className="text-[#1F1D1A]">{viewingTxn.customer}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span>Specialist (Provider):</span>
                <span className="text-[#1F1D1A]">{viewingTxn.provider}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span>Service Category:</span>
                <span className="text-[#1F1D1A]">{viewingTxn.service}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span>Payment Method:</span>
                <span className="text-[#1F1D1A]">{viewingTxn.method}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span>Execution Time:</span>
                <span className="text-[#1F1D1A]">{viewingTxn.date}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span>Audit Status:</span>
                <span>{getStatusBadge(viewingTxn.status)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-sm font-bold text-[#1F1D1A]">Total Settlement:</span>
                <span className="text-[#1F1D1A] text-base font-black">₹{viewingTxn.amount.toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-stone-50">
              <Button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="rounded-xl bg-[#8C4B3E] hover:bg-black text-white font-bold text-xs h-9.5 px-5 w-full sm:w-auto"
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
          <DialogContent className="max-w-md bg-white border border-[#5A5146]/20 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-[#1F1D1A] flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600 animate-pulse" />
                Confirm Settlement Action
              </DialogTitle>
              <DialogDescription className="text-xs text-[#7A7266] pt-0.5">
                Are you sure you want to perform this transaction adjustment? Verification is required.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-[#FAF6F0] border border-[#5A5146]/15 rounded-xl text-xs font-bold space-y-1">
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wide">Target Details</span>
              <span className="text-[#1F1D1A] block">Transaction ID: {confirmTarget.txn.id}</span>
              <span className="text-[#7A7266] block">Client: {confirmTarget.txn.customer}</span>
              <span className="text-[#1F1D1A] block border-t border-[#5A5146]/20 pt-1.5 mt-1 text-sm font-black">Settlement: ₹{confirmTarget.txn.amount.toFixed(2)}</span>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-xl border-[#5A5146]/20 text-xs h-9.5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={executeConfirmAction}
                disabled={isActionLoading}
                className={`rounded-xl font-bold text-xs h-9.5 w-full sm:w-auto text-white ${
                  confirmTarget.action === "refund" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Action"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
