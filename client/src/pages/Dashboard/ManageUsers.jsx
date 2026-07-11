import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
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
  UserCheck, 
  UserX, 
  UserPlus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  Eye,
  FileSpreadsheet,
  Download,
  AlertCircle
} from "lucide-react";

// Mock Users Database
const initialUsers = [
  { id: "1", name: "Chloe Bennett", email: "chloe.bennett@example.com", phone: "555-019-2834", role: "customer", status: "active", date: "2026-07-06", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "2", name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "555-021-9988", role: "provider", status: "active", date: "2026-07-01", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "3", name: "John Doe", email: "john.doe@example.com", phone: "555-032-1100", role: "provider", status: "blocked", date: "2026-06-25", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "4", name: "Amanda Watson", email: "amanda@example.com", phone: "555-045-8832", role: "customer", status: "active", date: "2026-07-08", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "5", name: "Gary Woods", email: "gary.woods@example.com", phone: "555-098-7766", role: "provider", status: "active", date: "2026-07-07", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }
];

export default function ManageUsers() {
  const navigate = useNavigate();

  // Users states
  const [usersList, setUsersList] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Selection states
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Modals active states
  const [viewingUser, setViewingUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("customer");
  const [editStatus, setEditStatus] = useState("active");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState(null); // { action: "block"|"delete"|"bulk-block"|"bulk-delete", data: any }
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
  }, [roleFilter, statusFilter, sortBy]);

  // Selection toggles
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, id]);
    } else {
      setSelectedUserIds(selectedUserIds.filter(userId => userId !== id));
    }
  };

  // Dialog triggers
  const handleOpenView = (user) => {
    setViewingUser(user);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
    setEditStatus(user.status);
    setIsEditOpen(true);
  };

  const onEditSaveSubmit = (e) => {
    e.preventDefault();
    setUsersList(prev => prev.map(u => u.id === editingUser.id ? {
      ...u,
      name: editName,
      email: editEmail,
      phone: editPhone,
      role: editRole,
      status: editStatus
    } : u));
    setIsEditOpen(false);
    setSuccessMsg("User profile updated successfully!");
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

    if (action === "block") {
      setUsersList(prev => prev.map(u => u.id === data.id ? { ...u, status: u.status === "blocked" ? "active" : "blocked" } : u));
      setSuccessMsg(`User successfully ${data.status === "blocked" ? "unblocked" : "blocked"}!`);
    } else if (action === "delete") {
      setUsersList(prev => prev.filter(u => u.id !== data.id));
      setSelectedUserIds(selectedUserIds.filter(id => id !== data.id));
      setSuccessMsg("User account deleted successfully!");
    } else if (action === "bulk-block") {
      setUsersList(prev => prev.map(u => selectedUserIds.includes(u.id) ? { ...u, status: "blocked" } : u));
      setSelectedUserIds([]);
      setSuccessMsg("Selected users blocked successfully!");
    } else if (action === "bulk-delete") {
      setUsersList(prev => prev.filter(u => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
      setSuccessMsg("Selected users deleted successfully!");
    }

    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleBulkExport = () => {
    setSuccessMsg(`Exporting details of ${selectedUserIds.length} users to Excel/CSV...`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Calculation for filters
  const filteredUsers = React.useMemo(() => {
    let result = [...usersList];

    // Search query matching
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
      );
    }

    // Role matching
    if (roleFilter !== "all") {
      result = result.filter(u => u.role === roleFilter);
    }

    // Status matching
    if (statusFilter !== "all") {
      result = result.filter(u => u.status === statusFilter);
    }

    // Sort matching
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else { // date-desc
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [usersList, searchQuery, roleFilter, statusFilter, sortBy]);

  // Pagination parameters
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Statistics counters
  const stats = React.useMemo(() => {
    const total = usersList.length + 4245;
    const active = usersList.filter(u => u.status === "active").length + 4115;
    const blocked = usersList.filter(u => u.status === "blocked").length + 111;
    const newCount = 18;
    return { total, active, blocked, newCount };
  }, [usersList]);

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Manage Platform Users</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Audit profiles, modify roles, block accounts, or export databases</p>
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
              <span className="block text-2xl font-black text-slate-900">{stats.total}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
            </div>
            
            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-emerald-600">{stats.active}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Users</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-rose-600">{stats.blocked}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blocked Users</span>
            </div>

            <div className="text-center space-y-1 py-1 border-l border-slate-100">
              <span className="block text-2xl font-black text-slate-900">+{stats.newCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Today</span>
            </div>

          </div>
        </section>

        {/* MAIN GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDEBAR: FILTERS */}
            <div className="lg:col-span-3 space-y-5 shrink-0">
              
              {/* Search */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5 flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-slate-900" /> Search Users
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-[50%] translate-y-[-50%] text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <Input 
                    placeholder="Search name, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                  />
                </div>
              </Card>

              {/* Roles */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5">Filter by Role</span>
                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">All Roles</option>
                    <option value="customer">Customers</option>
                    <option value="provider">Service Providers</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
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
                    <option value="active">Active only</option>
                    <option value="blocked">Blocked only</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

              {/* Sort */}
              <Card className="border border-slate-100 bg-white p-4.5 rounded-2xl shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-2.5">Sort Options</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="date-desc">Join Date: Newest First</option>
                    <option value="date-asc">Join Date: Oldest First</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </div>
                </div>
              </Card>

            </div>

            {/* RIGHT COLUMN: USERS LISTINGS */}
            <main className="lg:col-span-9 space-y-6">
              
              {/* BULK ACTIONS HEADER PANEL */}
              {selectedUserIds.length > 0 && (
                <div className="p-4 bg-slate-900 border border-slate-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-md">
                  <span className="text-xs font-extrabold flex items-center gap-2">
                    <SlidersHorizontal className="h-4.5 w-4.5 text-slate-700" />
                    {selectedUserIds.length} Users Selected
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
                      onClick={() => handleConfirmAction("bulk-block")}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs h-9 font-bold flex items-center gap-1.5 w-full sm:w-auto border-0"
                    >
                      <Lock className="h-4 w-4" /> Block Accounts
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleConfirmAction("bulk-delete")}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs h-9 font-bold flex items-center gap-1.5 w-full sm:w-auto border-0"
                    >
                      <Trash2 className="h-4 w-4" /> Delete Accounts
                    </Button>
                  </div>
                </div>
              )}

              {isLoading ? (
                /* SKELTON LOADING BOARD */
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border border-slate-100 bg-white p-5 rounded-2xl animate-pulse flex items-center gap-4">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 bg-slate-200 w-1/4 rounded" />
                        <Skeleton className="h-3.5 bg-slate-200 w-1/3 rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : paginatedUsers.length === 0 ? (
                /* EMPTY STATE BOARD */
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto shadow-2xs mt-4">
                  <div className="p-4 bg-slate-900/5 text-slate-900 rounded-full border border-slate-900/10">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">No Users Found</h3>
                  <p className="text-xs text-slate-450 max-w-sm leading-relaxed">
                    We couldn't find any user profiles matching your selected criteria. Clear search queries.
                  </p>
                </div>
              ) : (
                /* USERS MATRIX TABLE */
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                          <th className="py-2.5 px-1 shrink-0 w-8">
                            <Checkbox 
                              id="selectAll"
                              checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                              onCheckedChange={handleSelectAll}
                              className="rounded border-slate-400"
                            />
                          </th>
                          <th className="py-2.5">User</th>
                          <th className="py-2.5">Contact Details</th>
                          <th className="py-2.5">Role</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5">Join Date</th>
                          <th className="py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {paginatedUsers.map(user => {
                          const isSelected = selectedUserIds.includes(user.id);
                          return (
                            <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? "bg-slate-900/5/10" : ""}`}>
                              <td className="py-3 px-1 shrink-0 w-8">
                                <Checkbox 
                                  checked={isSelected}
                                  onCheckedChange={(checked) => handleSelectRow(user.id, checked === true)}
                                  className="rounded border-slate-400"
                                />
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-9 h-9 border border-slate-100 overflow-hidden shrink-0">
                                    <AvatarImage src={user.avatar} className="object-cover" />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="block text-slate-800 font-bold">{user.name}</span>
                                    <span className="text-[9px] text-slate-450 font-bold">UID: {user.id}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3">
                                <span className="block text-slate-600">{user.email}</span>
                                <span className="text-[10px] text-slate-450 font-semibold">{user.phone}</span>
                              </td>
                              <td className="py-3">
                                <Badge variant="secondary" className="capitalize rounded-lg text-[9px] font-bold py-0.5 px-2.5 border-slate-200">
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <Badge variant={user.status === "active" ? "success" : "destructive"} className="capitalize rounded-lg text-[9px] font-bold py-0.5 px-2.5 border-0">
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="py-3 text-slate-500 font-semibold">{user.date}</td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleOpenView(user)}
                                    className="h-7 text-[9px] font-bold border-slate-200 hover:bg-slate-50 bg-white"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleOpenEdit(user)}
                                    className="h-7 text-[9px] font-bold border-slate-200 hover:bg-slate-50 bg-white"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleConfirmAction("block", user)}
                                    className={`h-7 text-[9px] font-bold rounded-lg border bg-white ${
                                      user.status === "blocked" 
                                        ? "border-emerald-300 hover:bg-emerald-50 text-emerald-600"
                                        : "border-amber-200 hover:bg-amber-50 text-amber-600"
                                    }`}
                                  >
                                    {user.status === "blocked" ? "Unblock" : "Block"}
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleConfirmAction("delete", user)}
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
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-9 font-semibold text-xs"
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
        {viewingUser && (
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
            <DialogHeader className="border-b border-slate-50 pb-4">
              <DialogTitle className="text-base font-extrabold text-slate-900">User Audit Profile</DialogTitle>
              <DialogDescription className="text-xs">System logs reference audit</DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4 py-4">
              <Avatar className="w-16 h-16 border border-slate-100 overflow-hidden shrink-0">
                <AvatarImage src={viewingUser.avatar} className="object-cover" />
                <AvatarFallback>{viewingUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{viewingUser.name}</h4>
                <span className="text-[10px] text-slate-450 font-bold block mt-0.5">UID: {viewingUser.id}</span>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="capitalize text-[8px] px-2 border-slate-200 font-extrabold">{viewingUser.role}</Badge>
                  <Badge variant={viewingUser.status === "active" ? "success" : "destructive"} className="capitalize text-[8px] px-2 font-extrabold border-0">{viewingUser.status}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-4 font-semibold text-slate-550">
              <div className="flex justify-between">
                <span>Email Address:</span>
                <span className="text-slate-800">{viewingUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone Contact:</span>
                <span className="text-slate-800">{viewingUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Registration Date:</span>
                <span className="text-slate-800">{viewingUser.date}</span>
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

      {/* DIALOG 2: EDIT USER DETAILS FORM */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {editingUser && (
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-slate-900" />
                Modify User Details
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 pt-0.5">
                Edit registration variables on the platform data files
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onEditSaveSubmit} className="space-y-4 pt-3">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="editName" className="text-xs font-bold text-slate-700">Full Name</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="editEmail" className="text-xs font-bold text-slate-700">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="editPhone" className="text-xs font-bold text-slate-700">Phone Contact</Label>
                <Input
                  id="editPhone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                  required
                />
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="editRole" className="text-xs font-bold text-slate-700">Role</Label>
                  <div className="relative">
                    <select
                      id="editRole"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="customer">Customer</option>
                      <option value="provider">Provider</option>
                    </select>
                    <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editStatus" className="text-xs font-bold text-slate-700">Status</Label>
                  <div className="relative">
                    <select
                      id="editStatus"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    <ChevronDown className="h-4 w-4 opacity-60 absolute right-2.5 top-[50%] translate-y-[-50%] pointer-events-none text-slate-400" />
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-xl bg-slate-900 hover:bg-slate-900 text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* DIALOG 3: BLOCK/DELETE ACTIONS CONFIRMATION */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {confirmTarget && (
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600 animate-pulse" />
                Confirm Administrative Action
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 pt-0.5">
                Are you sure you want to perform this action? Verification requires approval.
              </DialogDescription>
            </DialogHeader>

            {confirmTarget.data && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Details</span>
                {confirmTarget.action.startsWith("bulk") ? (
                  <span className="text-slate-800">{selectedUserIds.length} Selected Users</span>
                ) : (
                  <>
                    <span className="text-slate-800 block">Name: {confirmTarget.data.name}</span>
                    <span className="text-slate-500 block">Email: {confirmTarget.data.email}</span>
                  </>
                )}
              </div>
            )}

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
                    Confirm & Proceed
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

    </MainLayout>
  );
}


