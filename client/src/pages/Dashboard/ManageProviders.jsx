import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  ShieldAlert, 
  Star, 
  Trash2, 
  Edit3, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  FileSpreadsheet, 
  UserCheck, 
  Lock,
  Eye,
  Info,
  Check
} from "lucide-react";

// Mock Providers Database
const initialProviders = [
  { id: "1", name: "Sarah Jenkins", serviceName: "Deep Home Cleaning Service", category: "Home Cleaning", email: "sarah.j@example.com", phone: "555-021-9988", rating: 4.9, location: "Brooklyn, NY", status: "verified", date: "2026-07-01", bookings: 142, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "2", name: "David Miller", serviceName: "Expert Plumbing & Leak Repair", category: "Plumbing", email: "david.m@example.com", phone: "555-023-1122", rating: 4.8, location: "Queens, NY", status: "verified", date: "2026-06-28", bookings: 98, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "3", name: "Marcus Vance", serviceName: "Licensed Smart Home Wiring", category: "Electrical", email: "marcus.v@example.com", phone: "555-032-1100", rating: 4.9, location: "Manhattan, NY", status: "pending", date: "2026-07-05", bookings: 115, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "4", name: "Gary Woods", serviceName: "Hedge Trimming & Tree Removal", category: "Lawn & Garden", email: "gary.woods@example.com", phone: "555-098-7766", rating: 4.8, location: "Staten Island, NY", status: "verified", date: "2026-06-22", bookings: 82, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "5", name: "Chloe Bennett", serviceName: "Swedish Massage & Wellness", category: "Wellness & Personal", email: "chloe.b@example.com", phone: "555-019-2834", rating: 4.9, location: "Manhattan, NY", status: "suspended", date: "2026-06-30", bookings: 89, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" }
];

export default function ManageProviders() {
  const navigate = useNavigate();

  // Providers states
  const [providersList, setProvidersList] = useState(initialProviders);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("bookings-desc");

  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals active states
  const [viewingProvider, setViewingProvider] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [editingProvider, setEditingProvider] = useState(null);
  const [editName, setEditName] = useState("");
  const [editServiceName, setEditServiceName] = useState("");
  const [editCategory, setEditCategory] = useState("Home Cleaning");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState("verified");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState(null); // { action: "verify"|"suspend"|"delete"|"bulk-verify"|"bulk-suspend", data: any }
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // General notification triggers
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
  }, [categoryFilter, statusFilter, sortBy]);

  // Selection toggles
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredProviders.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(userId => userId !== id));
    }
  };

  // Dialog triggers
  const handleOpenView = (provider) => {
    setViewingProvider(provider);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (provider) => {
    setEditingProvider(provider);
    setEditName(provider.name);
    setEditServiceName(provider.serviceName);
    setEditCategory(provider.category);
    setEditLocation(provider.location);
    setEditStatus(provider.status);
    setIsEditOpen(true);
  };

  const onEditSaveSubmit = (e) => {
    e.preventDefault();
    setProvidersList(prev => prev.map(p => p.id === editingProvider.id ? {
      ...p,
      name: editName,
      serviceName: editServiceName,
      category: editCategory,
      location: editLocation,
      status: editStatus
    } : p));
    setIsEditOpen(false);
    setSuccessMsg("Provider catalog details updated successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleConfirmAction = (action, data) => {
    setConfirmTarget({ action, data });
    setIsConfirmOpen(true);
  };

  const executeConfirmAction = async () => {
    setIsActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsActionLoading(false);
    setIsConfirmOpen(false);

    const { action, data } = confirmTarget;

    if (action === "verify") {
      setProvidersList(prev => prev.map(p => p.id === data.id ? { ...p, status: "verified" } : p));
      setSuccessMsg("Provider account successfully verified!");
    } else if (action === "suspend") {
      setProvidersList(prev => prev.map(p => p.id === data.id ? { ...p, status: data.status === "suspended" ? "verified" : "suspended" } : p));
      setSuccessMsg(`Provider successfully ${data.status === "suspended" ? "activated" : "suspended"}!`);
    } else if (action === "delete") {
      setProvidersList(prev => prev.filter(p => p.id !== data.id));
      setSelectedIds(selectedIds.filter(id => id !== data.id));
      setSuccessMsg("Provider account deleted successfully!");
    } else if (action === "bulk-verify") {
      setProvidersList(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: "verified" } : p));
      setSelectedIds([]);
      setSuccessMsg("Selected providers verified successfully!");
    } else if (action === "bulk-suspend") {
      setProvidersList(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: "suspended" } : p));
      setSelectedIds([]);
      setSuccessMsg("Selected providers suspended successfully!");
    }

    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleBulkExport = () => {
    setSuccessMsg(`Exporting details of ${selectedIds.length} providers to Excel/CSV...`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Calculation for filters
  const filteredProviders = React.useMemo(() => {
    let result = [...providersList];

    // Search query matching
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.serviceName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }

    // Category matching
    if (categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Status matching
    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sort matching
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "rating-desc") {
        return b.rating - a.rating;
      } else if (sortBy === "bookings-desc") {
        return b.bookings - a.bookings;
      } else { // date-desc
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [providersList, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Pagination parameters
  const totalPages = Math.ceil(filteredProviders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProviders = filteredProviders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Statistics counters
  const stats = React.useMemo(() => {
    const total = providersList.length + 375;
    const verified = providersList.filter(p => p.status === "verified").length + 338;
    const pending = providersList.filter(p => p.status === "pending").length + 11;
    const suspended = providersList.filter(p => p.status === "suspended").length + 25;
    return { total, verified, pending, suspended };
  }, [providersList]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Verified</Badge>;
      case "pending":
        return <Badge className="bg-[#B2563B] hover:bg-amber-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Pending</Badge>;
      default: // suspended
        return <Badge className="bg-rose-500 hover:bg-rose-600 border-0 text-white font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Suspended</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-violet-950 via-violet-800 to-violet-950 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Manage Service Specialists</h1>
              <p className="text-[#7A7266] text-xs sm:text-sm font-medium">Verify credentials, edit pricing categories, suspend accounts, or export databases</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-[#5A5146]/15 p-5 rounded-2xl shadow-md">
            
            <div className="text-center space-y-1 py-1">
              <span className="block text-2xl font-black text-[#1F1D1A]">{stats.total}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Specialists</span>
            </div>
            
            <div className="text-center space-y-1 py-1 border-l border-[#5A5146]/15">
              <span className="block text-2xl font-black text-emerald-600">{stats.verified}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Verified Pros</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-[#5A5146]/15">
              <span className="block text-2xl font-black text-[#B2563B]">{stats.pending}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Pending Approval</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-[#5A5146]/15">
              <span className="block text-2xl font-black text-rose-600">{stats.suspended}</span>
              <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Suspended Accounts</span>
            </div>

          </div>
        </section>

        {/* MAIN CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: FILTERS */}
            <div className="lg:col-span-3 space-y-5 shrink-0">
              
              {/* Search */}
              <Card className="border border-[#5A5146]/15 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-[#1F1D1A] block mb-2.5 flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-[#1F1D1A]" /> Search Specialists
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-[50%] translate-y-[-50%] text-[#7A7266]">
                    <Search className="h-4 w-4" />
                  </span>
                  <Input 
                    placeholder="Search name, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                  />
                </div>
              </Card>

              {/* Categories */}
              <Card className="border border-[#5A5146]/15 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-[#1F1D1A] block mb-2.5">Filter by Category</span>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#B2563B] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Categories</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Lawn & Garden">Lawn & Garden</option>
                    <option value="Wellness & Personal">Wellness & Personal</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7A7266]">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

              {/* Verification Status */}
              <Card className="border border-[#5A5146]/15 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-[#1F1D1A] block mb-2.5">Verification Status</span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#B2563B] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7A7266]">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

              {/* Sort options */}
              <Card className="border border-[#5A5146]/15 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-[#1F1D1A] block mb-2.5">Sort Options</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#B2563B] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="bookings-desc">Bookings: High to Low</option>
                    <option value="rating-desc">Rating: Highest First</option>
                    <option value="date-desc">Join Date: Newest First</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7A7266]">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

            </div>

            {/* RIGHT COLUMN: PROVIDERS GRID LIST */}
            <main className="lg:col-span-9 space-y-6">
              
              {/* BULK ACTIONS PANEL */}
              {selectedIds.length > 0 && (
                <div className="p-4 bg-[#B2563B] border border-violet-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-md">
                  <span className="text-xs font-extrabold flex items-center gap-2">
                    <Briefcase className="h-4.5 w-4.5 text-[#B2563B]" />
                    {selectedIds.length} Providers Selected
                  </span>
                  
                  <div className="flex gap-2.5 w-full sm:w-auto">
                    <Button
                      size="sm"
                      onClick={handleBulkExport}
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/5 rounded-xl text-xs h-9 font-bold flex items-center gap-1.5 w-full sm:w-auto"
                    >
                      <FileSpreadsheet className="h-4 w-4" /> Export Data
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleConfirmAction("bulk-verify")}
                      className="bg-emerald-655 hover:bg-emerald-700 text-white rounded-xl text-xs h-9 font-bold flex items-center gap-1.5 w-full sm:w-auto border-0"
                    >
                      <UserCheck className="h-4 w-4" /> Approve Accounts
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleConfirmAction("bulk-suspend")}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs h-9 font-bold flex items-center gap-1.5 w-full sm:w-auto border-0"
                    >
                      <Lock className="h-4 w-4" /> Suspend Accounts
                    </Button>
                  </div>
                </div>
              )}

              {isLoading ? (
                /* LOADING SHIMMER CARDS */
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border border-[#5A5146]/15 bg-white p-5 rounded-2xl animate-pulse flex items-center gap-4">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="w-10 h-10 rounded-full bg-[#E8DCC3]" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 bg-[#E8DCC3] w-1/4 rounded" />
                        <Skeleton className="h-3.5 bg-[#E8DCC3] w-1/3 rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : paginatedProviders.length === 0 ? (
                /* EMPTY STATE BOARD */
                <div className="bg-white border border-[#5A5146]/15 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto shadow-2xs mt-4">
                  <div className="p-4 bg-[#B2563B]/5 text-[#1F1D1A] rounded-full border border-violet-950/10">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F1D1A] mt-2">No Providers Found</h3>
                  <p className="text-xs text-[#7A7266] max-w-sm leading-relaxed">
                    We couldn't find any specialist profiles matching your selected criteria. Clear search queries.
                  </p>
                </div>
              ) : (
                /* PROVIDERS TABLE GRID */
                <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[#5A5146]/15 text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
                          <th className="py-2.5 px-1 shrink-0 w-8">
                            <Checkbox 
                              id="selectAll"
                              checked={selectedIds.length === filteredProviders.length && filteredProviders.length > 0}
                              onCheckedChange={handleSelectAll}
                              className="rounded border-stone-400"
                            />
                          </th>
                          <th className="py-2.5">Provider</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5">Rating</th>
                          <th className="py-2.5">Bookings</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5">Join Date</th>
                          <th className="py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50 font-medium text-[#B2563B]">
                        {paginatedProviders.map(prov => {
                          const isSelected = selectedIds.includes(prov.id);
                          return (
                            <tr key={prov.id} className={`hover:bg-[#FAF6F0] transition-colors ${isSelected ? "bg-[#B2563B]/5/10" : ""}`}>
                              <td className="py-3 px-1 shrink-0 w-8">
                                <Checkbox 
                                  checked={isSelected}
                                  onCheckedChange={(checked) => handleSelectRow(prov.id, checked === true)}
                                  className="rounded border-stone-400"
                                />
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-9 h-9 border border-[#5A5146]/15 overflow-hidden shrink-0">
                                    <AvatarImage src={prov.avatar} className="object-cover" />
                                    <AvatarFallback>{prov.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="block text-[#1F1D1A] font-bold">{prov.name}</span>
                                    <span className="text-[10px] text-[#7A7266] font-semibold flex items-center gap-0.5 mt-0.5"><MapPin className="h-3 w-3" /> {prov.location}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3">
                                <span className="block text-[#B2563B]">{prov.category}</span>
                                <span className="text-[9px] text-[#7A7266] font-bold uppercase tracking-wider">{prov.serviceName}</span>
                              </td>
                              <td className="py-3 font-bold text-[#1F1D1A]">
                                <span className="flex items-center gap-0.5">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-[#C9A46A]" /> {prov.rating}
                                </span>
                              </td>
                              <td className="py-3 font-bold text-[#1F1D1A]">{prov.bookings} jobs</td>
                              <td className="py-3">{getStatusBadge(prov.status)}</td>
                              <td className="py-3 text-[#7A7266] font-semibold">{prov.date}</td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleOpenView(prov)}
                                    className="h-7 text-[9px] font-bold border-[#5A5146]/20 hover:bg-[#FAF6F0] bg-white"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleOpenEdit(prov)}
                                    className="h-7 text-[9px] font-bold border-[#5A5146]/20 hover:bg-[#FAF6F0] bg-white"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>

                                  {prov.status === "pending" ? (
                                    <Button
                                      size="xs"
                                      onClick={() => handleConfirmAction("verify", prov)}
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-7 rounded-lg text-[9px] py-0 px-2.5 border-0 shadow-2xs"
                                    >
                                      Verify
                                    </Button>
                                  ) : (
                                    <Button
                                      size="xs"
                                      variant="outline"
                                      onClick={() => handleConfirmAction("suspend", prov)}
                                      className={`h-7 text-[9px] font-bold rounded-lg border bg-white ${
                                        prov.status === "suspended" 
                                          ? "border-emerald-300 hover:bg-emerald-50 text-emerald-600"
                                          : "border-[#C9A46A]/40 hover:bg-amber-50 text-[#B2563B]"
                                      }`}
                                    >
                                      {prov.status === "suspended" ? "Activate" : "Suspend"}
                                    </Button>
                                  )}

                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleConfirmAction("delete", prov)}
                                    className="h-7 text-[9px] font-bold border-rose-200 bg-white hover:bg-rose-50 text-rose-600 rounded-lg"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
                                  ? "bg-[#B2563B] text-white shadow-md shadow-2xs"
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

                </Card>
              )}

            </main>

          </div>
        </div>

      </div>

      {/* DIALOG 1: VIEW DETAILS MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        {viewingProvider && (
          <DialogContent className="max-w-md bg-white border border-[#5A5146]/20 rounded-2xl shadow-xl p-6">
            <DialogHeader className="border-b border-stone-50 pb-4">
              <DialogTitle className="text-base font-extrabold text-[#1F1D1A]">Provider Audit Profile</DialogTitle>
              <DialogDescription className="text-xs">Platform database specialist catalog logs</DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4 py-4">
              <Avatar className="w-16 h-16 border border-[#5A5146]/15 overflow-hidden shrink-0">
                <AvatarImage src={viewingProvider.avatar} className="object-cover" />
                <AvatarFallback>{viewingProvider.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-extrabold text-[#1F1D1A] text-base">{viewingProvider.name}</h4>
                <span className="text-[10px] text-[#7A7266] font-bold block mt-0.5">Specialist ID: {viewingProvider.id}</span>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="capitalize text-[8px] px-2 border-[#5A5146]/20 font-extrabold">{viewingProvider.category}</Badge>
                  <Badge variant={viewingProvider.status === "verified" ? "success" : "destructive"} className="capitalize text-[8px] px-2 font-extrabold border-0">{viewingProvider.status}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-[#5A5146]/15 pt-4 font-semibold text-slate-550">
              <div className="flex justify-between">
                <span>Primary Service:</span>
                <span className="text-[#1F1D1A]">{viewingProvider.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span>Rating Score:</span>
                <span className="text-[#1F1D1A] flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-[#C9A46A]" /> {viewingProvider.rating}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Bookings Placed:</span>
                <span className="text-[#1F1D1A]">{viewingProvider.bookings} completed jobs</span>
              </div>
              <div className="flex justify-between">
                <span>Email Address:</span>
                <span className="text-[#1F1D1A]">{viewingProvider.email}</span>
              </div>
              <div className="flex justify-between">
                <span>State Location:</span>
                <span className="text-[#1F1D1A]">{viewingProvider.location}</span>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-stone-50">
              <Button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="rounded-xl bg-[#B2563B] hover:bg-black text-white font-bold text-xs h-9.5 px-5 w-full sm:w-auto"
              >
                Close View
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* DIALOG 2: EDIT PROVIDER DETAILS FORM */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {editingProvider && (
          <DialogContent className="max-w-md bg-white border border-[#5A5146]/20 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-[#1F1D1A] flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-[#1F1D1A]" />
                Modify Specialist Details
              </DialogTitle>
              <DialogDescription className="text-xs text-[#7A7266] pt-0.5">
                Edit catalog details for public platform listing parameters
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onEditSaveSubmit} className="space-y-4 pt-3">
              {/* Provider Name */}
              <div className="space-y-1.5">
                <Label htmlFor="editName" className="text-xs font-bold text-[#B2563B]">Provider Name</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                  required
                />
              </div>

              {/* Service Title */}
              <div className="space-y-1.5">
                <Label htmlFor="editService" className="text-xs font-bold text-[#B2563B]">Service Title</Label>
                <Input
                  id="editService"
                  value={editServiceName}
                  onChange={(e) => setEditServiceName(e.target.value)}
                  className="h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label htmlFor="editLocation" className="text-xs font-bold text-[#B2563B]">Location</Label>
                <Input
                  id="editLocation"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                  required
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="editCategory" className="text-xs font-bold text-[#B2563B]">Category Group</Label>
                  <div className="relative">
                    <select
                      id="editCategory"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#B2563B] cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="Home Cleaning">Home Cleaning</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Lawn & Garden">Lawn & Garden</option>
                      <option value="Wellness & Personal">Wellness & Personal</option>
                    </select>
                    <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-[#7A7266]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editStatus" className="text-xs font-bold text-[#B2563B]">Verification Status</Label>
                  <div className="relative">
                    <select
                      id="editStatus"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#B2563B] cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-[#7A7266]" />
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl border-[#5A5146]/20 text-xs h-9.5 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-xl bg-[#B2563B] hover:bg-[#B2563B] text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* DIALOG 3: VERIFY/SUSPEND/DELETE ACTIONS CONFIRMATION */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {confirmTarget && (
          <DialogContent className="max-w-md bg-white border border-[#5A5146]/20 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-[#1F1D1A] flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600 animate-pulse" />
                Confirm Administrative Action
              </DialogTitle>
              <DialogDescription className="text-xs text-[#7A7266] pt-0.5">
                Are you sure you want to perform this action? Verification requires approval.
              </DialogDescription>
            </DialogHeader>

            {confirmTarget.data && (
              <div className="p-4 bg-[#FAF6F0] border border-[#5A5146]/15 rounded-xl text-xs font-bold space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wide">Target Details</span>
                {confirmTarget.action.startsWith("bulk") ? (
                  <span className="text-[#1F1D1A]">{selectedIds.length} Selected Service Specialists</span>
                ) : (
                  <>
                    <span className="text-[#1F1D1A] block">Name: {confirmTarget.data.name}</span>
                    <span className="text-[#7A7266] block">Service: {confirmTarget.data.serviceName}</span>
                  </>
                )}
              </div>
            )}

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-xl border-[#5A5146]/20 text-xs h-9.5 w-full sm:w-auto"
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
                    Confirm & Proceed
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


