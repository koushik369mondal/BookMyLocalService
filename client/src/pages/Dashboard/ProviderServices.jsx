import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "../../context/AuthContext";
import { servicesService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Layers,
  Star,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  X,
  Loader2,
  ShieldAlert,
  TrendingUp,
  Activity,
  Check,
  RefreshCw,
  Info
} from "lucide-react";

// Predefined Category List
const CATEGORIES = [
  "Home Cleaning",
  "Plumbing",
  "Electrical",
  "Moving & Packing",
  "Lawn & Garden",
  "Wellness & Personal"
];

// Predefined Location Options
const LOCATIONS = [
  "Kolkata, WB",
  "Delhi NCR",
  "Mumbai, MH",
  "Bengaluru, KA",
  "Hyderabad, TS",
  "Chennai, TN",
  "Pune, MH",
  "Jaipur, RJ",
  "Siliguri, WB",
  "Jalpaiguri, WB"
];

export default function ProviderServices() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingService, setDeletingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: "",
    category: "Home Cleaning",
    price: "",
    priceType: "/hr",
    location: "Kolkata, WB",
    availability: "today",
    status: "Active",
    badge: "",
    imageUrl: "",
    description: ""
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesService.getProviderServices();
      if (response.success && Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to fetch provider services from database:", err);
      toast.error("Error loading services from database.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Load provider services on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchServices();
  }, [user]);

  // Open Form Modal for Create
  const handleOpenCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      category: "Home Cleaning",
      price: "",
      priceType: "/hr",
      location: "Kolkata, WB",
      availability: "today",
      status: "Active",
      badge: "",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      description: ""
    });
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Edit
  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      category: service.category,
      price: service.price ? service.price.toString() : "",
      priceType: service.priceType || "/hr",
      location: service.location || "Kolkata, WB",
      availability: service.availability || "today",
      status: service.status || "Active",
      badge: service.badge || "",
      imageUrl: service.imageUrl || "",
      description: service.description || ""
    });
    setIsFormModalOpen(true);
  };

  // Save Service (Create or Update) directly to DB
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        priceType: formData.priceType,
        location: formData.location,
        availability: formData.availability,
        badge: formData.badge,
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
        description: formData.description.trim()
      };

      if (editingService) {
        // Update existing service in database
        const response = await servicesService.updateProviderService(editingService.id, payload);
        if (response.success) {
          toast.success(`Service "${formData.title}" updated successfully in database!`);
          await fetchServices();
        } else {
          toast.error(response.message || "Failed to update service.");
        }
      } else {
        // Create new service in database
        const response = await servicesService.createProviderService(payload);
        if (response.success) {
          toast.success(`New service "${formData.title}" saved to database!`);
          await fetchServices();
        } else {
          toast.error(response.message || "Failed to create service.");
        }
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Save service error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to save service to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Pause / Activate Status
  const handleToggleStatus = async (service) => {
    const nextStatus = service.status === "Active" ? "Paused" : "Active";
    try {
      await servicesService.updateProviderService(service.id, { status: nextStatus });
      toast.success(`Service "${service.title}" is now ${nextStatus.toLowerCase()}.`);
      await fetchServices();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  // Duplicate Service
  const handleDuplicateService = async (service) => {
    try {
      const payload = {
        title: `Copy of ${service.title}`,
        category: service.category,
        price: service.price,
        priceType: service.priceType,
        location: service.location,
        availability: service.availability,
        badge: "Draft",
        imageUrl: service.imageUrl,
        description: service.description
      };
      await servicesService.createProviderService(payload);
      toast.success(`Duplicated "${service.title}" to database.`);
      await fetchServices();
    } catch (err) {
      toast.error("Failed to duplicate service.");
    }
  };

  // Delete Service from DB
  const handleDeleteService = async () => {
    if (!deletingService) return;
    try {
      const response = await servicesService.deleteProviderService(deletingService.id);
      if (response.success) {
        toast.success(`Service "${deletingService.title}" deleted from database.`);
        await fetchServices();
      } else {
        toast.error(response.message || "Failed to delete service.");
      }
    } catch (err) {
      console.error("Delete service error:", err);
      toast.error("Failed to delete service from database.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingService(null);
    }
  };

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesSearch =
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          s.status.toLowerCase() === statusFilter.toLowerCase();

        const matchesCategory =
          categoryFilter === "all" || s.category === categoryFilter;

        const matchesAvailability =
          availabilityFilter === "all" || s.availability === availabilityFilter;

        return (
          matchesSearch && matchesStatus && matchesCategory && matchesAvailability
        );
      })
      .sort((a, b) => {
        if (sortBy === "highest-rating") return b.rating - a.rating;
        if (sortBy === "highest-price") return b.price - a.price;
        if (sortBy === "lowest-price") return a.price - b.price;
        if (sortBy === "most-bookings") return b.bookingsCount - a.bookingsCount;
        return 0;
      });
  }, [services, searchQuery, statusFilter, categoryFilter, availabilityFilter, sortBy]);

  // Catalog KPI Summary Stats
  const catalogStats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.status === "Active").length;
    const pausedOrDraft = services.filter((s) => s.status !== "Active").length;
    const totalRevenue = services.reduce((acc, s) => acc + (s.revenue || 0), 0);
    const avgRating =
      total > 0
        ? (services.reduce((acc, s) => acc + s.rating, 0) / total).toFixed(2)
        : "5.0";

    return { total, active, pausedOrDraft, totalRevenue, avgRating };
  }, [services]);

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        {/* RETRO BRAND HERO BANNER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 px-4 sm:px-6 lg:px-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF6F0] text-[#C9A46A] border border-[#E8DCC3] rounded-lg text-xs font-extrabold uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5 text-[#C9A46A]" /> Service Catalog Manager
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F1D1A]">
                My Service Catalog
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5146] font-medium max-w-2xl leading-relaxed">
                Manage the services you offer to customers, update pricing, toggle availability, and track catalog performance.
              </p>
            </div>

            <Button
              onClick={handleOpenCreateModal}
              className="bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs h-11 px-6 rounded-xl shadow-md border border-[#E8DCC3] flex items-center gap-2 cursor-pointer shrink-0 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" /> Add New Service
            </Button>
          </div>

          {/* KPI STATS SUMMARY STRIP */}
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#E8DCC3]">
            <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DCC3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7266]">Total Listed</span>
              <p className="text-lg font-black text-[#1F1D1A] mt-0.5">{catalogStats.total} Services</p>
            </div>

            <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DCC3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7266]">Active Services</span>
              <p className="text-lg font-black text-emerald-700 mt-0.5">{catalogStats.active} Active</p>
            </div>

            <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DCC3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7266]">Paused / Draft</span>
              <p className="text-lg font-black text-amber-700 mt-0.5">{catalogStats.pausedOrDraft} Services</p>
            </div>

            <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DCC3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7266]">Average Rating</span>
              <p className="text-lg font-black text-[#C9A46A] mt-0.5 flex items-center gap-1">
                ⭐ {catalogStats.avgRating}
              </p>
            </div>

            <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DCC3] col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7266]">Catalog Revenue</span>
              <p className="text-lg font-black text-[#2B522B] mt-0.5">
                {formatPrice(catalogStats.totalRevenue, { decimals: true })}
              </p>
            </div>
          </div>
        </section>

        {/* CONTAINER FOR CONTROLS & CATALOG GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white border border-[#E8DCC3] p-4 sm:p-5 rounded-2xl shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266] pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search my services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 h-11 bg-[#FAF6F0] border-[#E8DCC3] text-[#1F1D1A] placeholder:text-[#7A7266] focus:border-[#C9A46A] rounded-xl text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7266] hover:text-[#1F1D1A]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-[#E8DCC3] overflow-x-auto shrink-0">
                {["all", "Active", "Paused", "Draft"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === st
                        ? "bg-[#F0E7D5] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                        : "text-[#5A5146] hover:text-[#1F1D1A]"
                    }`}
                  >
                    {st === "all" ? "All Statuses" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown Filters & Sorting Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E8DCC3]">
              {/* Category Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7266] mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-9.5 px-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium outline-none focus:border-[#C9A46A]"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7266] mb-1">
                  Availability
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full h-9.5 px-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium outline-none focus:border-[#C9A46A]"
                >
                  <option value="all">All Schedules</option>
                  <option value="today">Available Today</option>
                  <option value="this-week">Available This Week</option>
                  <option value="weekend">Weekend Shifts</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7266] mb-1">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-9.5 px-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium outline-none focus:border-[#C9A46A]"
                >
                  <option value="newest">Newest First</option>
                  <option value="highest-rating">Highest Rating</option>
                  <option value="highest-price">Price: High to Low</option>
                  <option value="lowest-price">Price: Low to High</option>
                  <option value="most-bookings">Most Bookings</option>
                </select>
              </div>
            </div>
          </div>

          {/* PROVIDER SERVICES CATALOG GRID */}
          {filteredServices.length === 0 ? (
            <Card className="border border-[#E8DCC3] bg-white rounded-2xl p-12 text-center shadow-2xs">
              <Layers className="h-12 w-12 text-[#7A7266] mx-auto mb-3 opacity-30" />
              <h3 className="text-base font-bold text-[#1F1D1A]">No services found</h3>
              <p className="text-xs text-[#5A5146] mt-1 max-w-md mx-auto">
                No matching services were found with the current filters. Try resetting search parameters or create a new service.
              </p>
              <Button
                onClick={handleOpenCreateModal}
                className="mt-4 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs border border-[#E8DCC3]"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add New Service
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="border border-[#E8DCC3] rounded-2xl bg-white overflow-hidden shadow-2xs hover:border-[#C9A46A] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image with Badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#F0E7D5]">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border shadow-2xs ${
                            service.status === "Active"
                              ? "bg-emerald-500 text-white border-emerald-400"
                              : service.status === "Paused"
                              ? "bg-amber-500 text-white border-amber-400"
                              : "bg-stone-500 text-white border-stone-400"
                          }`}
                        >
                          {service.status}
                        </span>
                        {service.badge && (
                          <span className="bg-[#FAF6F0] text-[#C9A46A] border border-[#E8DCC3] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Price Badge Overlay */}
                      <div className="absolute bottom-3 right-3 bg-[#FAF6F0] text-[#1F1D1A] px-3 py-1 rounded-xl border border-[#E8DCC3] text-xs font-black shadow-md">
                        {formatPrice(service.price, { priceType: service.priceType, decimals: true })}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A46A] block">
                          {service.category} • {service.location}
                        </span>
                        <h3 className="font-bold text-sm text-[#1F1D1A] leading-snug mt-0.5 line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-xs text-[#5A5146] line-clamp-2 mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* OPERATIONAL METRICS BAR */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3] text-xs font-semibold text-[#5A5146]">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-[#C9A46A] fill-[#C9A46A]" />
                          <span>
                            <strong className="text-[#1F1D1A]">{service.rating}</strong> ({service.reviewCount})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#7A7266]" />
                          <span>
                            <strong className="text-[#1F1D1A]">{service.bookingsCount}</strong> Bookings
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-[#2B522B]" />
                          <span className="text-[#2B522B] font-bold">
                            {formatPrice(service.revenue || 0)} Rev
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#C9A46A]" />
                          <span className="capitalize text-[11px]">
                            {service.availability.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROVIDER ACTIONS FOOTER BAR */}
                  <div className="p-3 bg-[#F0E7D5]/40 border-t border-[#E8DCC3] flex items-center justify-between gap-1.5">
                    {/* Toggle Status Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => handleToggleStatus(service)}
                      className={`h-8 text-[11px] font-bold rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                        service.status === "Active"
                          ? "border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
                          : "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                      title={service.status === "Active" ? "Pause Service" : "Activate Service"}
                    >
                      {service.status === "Active" ? (
                        <>
                          <PauseCircle className="h-3.5 w-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-3.5 w-3.5" /> Activate
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-1">
                      {/* View Details Button */}
                      <button
                        onClick={() => {
                          setViewingService(service);
                          setIsViewModalOpen(true);
                        }}
                        className="p-2 text-[#5A5146] hover:text-[#1F1D1A] hover:bg-[#F0E7D5] rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="p-2 text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#F0E7D5] rounded-lg transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      {/* Duplicate Button */}
                      <button
                        onClick={() => handleDuplicateService(service)}
                        className="p-2 text-[#5A5146] hover:text-[#2B522B] hover:bg-[#F0E7D5] rounded-lg transition-colors cursor-pointer"
                        title="Duplicate Service"
                      >
                        <Copy className="h-4 w-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setDeletingService(service);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CREATE / EDIT SERVICE DIALOG MODAL */}
        {/* ------------------------------------------------------------- */}
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogContent className="max-w-lg bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#1F1D1A] flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#C9A46A]" />
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5A5146]">
                Configure catalog details, pricing rates, location coverage, and availability status.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveService} className="space-y-4 pt-2">
              {/* Service Title */}
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs font-bold text-[#1F1D1A]">
                  Service Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Deep Home Cleaning & Sanitization"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-10 border-[#E8DCC3] bg-white rounded-xl text-xs text-[#1F1D1A]"
                  required
                />
              </div>

              {/* Category & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Category *</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium"
                    required
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Location Area *</Label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium"
                    required
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Price Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="price" className="text-xs font-bold text-[#1F1D1A]">
                    Price ($) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="35.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="h-10 border-[#E8DCC3] bg-white rounded-xl text-xs text-[#1F1D1A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Rate Type *</Label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium"
                  >
                    <option value="/hr">Per Hour (/hr)</option>
                    <option value="/flat">Flat Rate (/flat)</option>
                    <option value="/job">Per Job (/job)</option>
                  </select>
                </div>
              </div>

              {/* Status & Availability Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Availability</Label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium"
                  >
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Badge Tag</Label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] font-medium"
                  >
                    <option value="">None</option>
                    <option value="Top Rated">Top Rated</option>
                    <option value="Verified">Verified</option>
                    <option value="Eco Friendly">Eco Friendly</option>
                    <option value="Emergency">Emergency</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <Label htmlFor="imageUrl" className="text-xs font-bold text-[#1F1D1A]">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="h-10 border-[#E8DCC3] bg-white rounded-xl text-xs text-[#1F1D1A]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs font-bold text-[#1F1D1A]">
                  Service Description *
                </Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Describe your service in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-white border border-[#E8DCC3] rounded-xl text-xs text-[#1F1D1A] focus:outline-none focus:border-[#C9A46A]"
                  required
                />
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-xl border-[#E8DCC3] bg-[#FAF6F0] text-[#5A5146] hover:bg-[#F0E7D5] text-xs h-10 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-10 px-6 w-full sm:w-auto border border-[#E8DCC3] flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingService ? "Update Service" : "Publish Service"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ------------------------------------------------------------- */}
        {/* VIEW DETAILS PREVIEW DIALOG MODAL */}
        {/* ------------------------------------------------------------- */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-md bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A]">
            {viewingService && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                        viewingService.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : viewingService.status === "Paused"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-stone-100 text-stone-800 border border-stone-300"
                      }`}
                    >
                      {viewingService.status}
                    </span>
                    <span className="text-xs text-[#C9A46A] font-bold">{viewingService.category}</span>
                  </div>
                  <DialogTitle className="text-base font-bold text-[#1F1D1A]">
                    {viewingService.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#5A5146]">
                    {viewingService.location}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  <div className="h-40 rounded-xl overflow-hidden border border-[#E8DCC3]">
                    <img
                      src={viewingService.imageUrl}
                      alt={viewingService.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-xs text-[#5A5146] leading-relaxed">
                    {viewingService.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#E8DCC3] text-xs font-medium">
                    <div>
                      <span className="text-[10px] text-[#7A7266] uppercase font-bold block">Rate</span>
                      <span className="font-extrabold text-[#1F1D1A]">
                        ${viewingService.price.toFixed(2)} {viewingService.priceType}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7A7266] uppercase font-bold block">Rating</span>
                      <span className="font-extrabold text-[#C9A46A]">
                        ⭐ {viewingService.rating} ({viewingService.reviewCount} reviews)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7A7266] uppercase font-bold block">Completed Bookings</span>
                      <span className="font-extrabold text-[#1F1D1A]">{viewingService.bookingsCount}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7A7266] uppercase font-bold block">Total Revenue</span>
                      <span className="font-extrabold text-[#2B522B]">
                        ${(viewingService.revenue || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    onClick={() => setIsViewModalOpen(false)}
                    className="w-full rounded-xl bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-10 border border-[#E8DCC3]"
                  >
                    Close Preview
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ------------------------------------------------------------- */}
        {/* DELETE CONFIRMATION DIALOG MODAL */}
        {/* ------------------------------------------------------------- */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#8C4B3E] flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                Delete Service
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5A5146] pt-1">
                Are you sure you want to delete{" "}
                <strong className="text-[#1F1D1A]">
                  "{deletingService?.title}"
                </strong>
                ? This operation will remove the service from your active catalog.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl border-[#E8DCC3] bg-[#FAF6F0] text-[#5A5146] hover:bg-[#F0E7D5] text-xs h-10 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteService}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-10 px-6 w-full sm:w-auto shadow-md"
              >
                Yes, Delete Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
