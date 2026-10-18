import React, { useState, useEffect, useMemo } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "../../context/AuthContext";
import { servicesService } from "../../services/servicesService";
import { categoriesService } from "@/services/categoriesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ServiceImage } from "@/components/common/ServiceImage";
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
  Info,
  Upload,
  Image as ImageIcon
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

function ProviderServicesContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Cloudinary Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);

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
      const [servRes, catRes] = await Promise.all([
        servicesService.getProviderServices(),
        categoriesService.getCategories()
      ]);

      if (servRes.success && Array.isArray(servRes.data)) {
        setServices(servRes.data);
      } else {
        setServices([]);
      }

      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch provider services/categories from database:", err);
      toast.error("Error loading data from database.");
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

  // Handle Image Selection for Cloudinary Upload
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      const msg = "Only JPG, JPEG, PNG, and WebP image formats are allowed.";
      toast.error(msg);
      setImageError(msg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = "File size exceeds 5MB limit.";
      toast.error(msg);
      setImageError(msg);
      return;
    }

    setImageError(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Open Form Modal for Create
  const handleOpenCreateModal = () => {
    setEditingService(null);
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);

    const defaultCat = categories.length > 0 ? (categories[0].id || categories[0].name) : "cat_home_cleaning";
    setFormData({
      title: "",
      category: defaultCat,
      price: "",
      priceType: "/hr",
      location: "Kolkata, WB",
      availability: "today",
      status: "Active",
      badge: "",
      imageUrl: "",
      description: ""
    });
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Edit
  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setImageFile(null);
    setImagePreview(service.imageUrl || null);
    setImageError(null);

    const catVal = service.categoryId || (typeof service.category === "object" ? service.category?.id : service.category);
    setFormData({
      title: service.title,
      category: catVal || (categories.length > 0 ? categories[0].id : "cat_home_cleaning"),
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

  // Save Service (Create or Update) directly to DB & Cloudinary
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!editingService && !imageFile && !formData.imageUrl) {
      toast.error("Please upload a cover image for your service.");
      setImageError("Service cover image is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategory = formData.category || (categories.length > 0 ? (categories[0].id || categories[0].name) : "cat_home_cleaning");
      
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("categoryId", selectedCategory);
      payload.append("category", selectedCategory);
      payload.append("price", parseFloat(formData.price));
      payload.append("priceType", formData.priceType || "/hr");
      payload.append("location", formData.location || "Kolkata, WB");
      payload.append("availability", formData.availability || "today");
      payload.append("badge", formData.badge || "");
      payload.append("description", formData.description.trim());
      payload.append("status", formData.status || "Active");

      if (imageFile) {
        payload.append("image", imageFile);
      } else if (formData.imageUrl) {
        payload.append("imageUrl", formData.imageUrl);
      }

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
        // Create new service in database & upload image to Cloudinary
        const response = await servicesService.createProviderService(payload);
        if (response.success) {
          toast.success(`New service "${formData.title}" saved to database & Cloudinary!`);
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
        const titleStr = (s.title || "").toLowerCase();
        const catName = typeof s.category === "object" ? (s.category?.name || "") : (s.category || "");
        const catStr = catName.toLowerCase();
        const descStr = (s.description || "").toLowerCase();
        const query = (searchQuery || "").toLowerCase();

        const matchesSearch = !query || titleStr.includes(query) || catStr.includes(query) || descStr.includes(query);

        const statusStr = (s.status || "Active").toLowerCase();
        const matchesStatus =
          statusFilter === "all" || statusStr === statusFilter.toLowerCase();

        const catId = s.categoryId || (typeof s.category === "object" ? s.category?.id : s.category);
        const matchesCategory =
          categoryFilter === "all" || catId === categoryFilter || catName === categoryFilter;

        const availStr = s.availability || "today";
        const matchesAvailability =
          availabilityFilter === "all" || availStr === availabilityFilter;

        return (
          matchesSearch && matchesStatus && matchesCategory && matchesAvailability
        );
      })
      .sort((a, b) => {
        const ratingA = Number(a.rating) || 5;
        const ratingB = Number(b.rating) || 5;
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        const bookingsA = Number(a.bookingsCount) || 0;
        const bookingsB = Number(b.bookingsCount) || 0;

        if (sortBy === "highest-rating") return ratingB - ratingA;
        if (sortBy === "highest-price") return priceB - priceA;
        if (sortBy === "lowest-price") return priceA - priceB;
        if (sortBy === "most-bookings") return bookingsB - bookingsA;
        return 0;
      });
  }, [services, searchQuery, statusFilter, categoryFilter, availabilityFilter, sortBy]);

  // Catalog KPI Summary Stats
  const catalogStats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => (s.status || "Active") === "Active").length;
    const pausedOrDraft = services.filter((s) => (s.status || "Active") !== "Active").length;
    const totalRevenue = services.reduce((acc, s) => acc + (Number(s.revenue) || 0), 0);
    const avgRating =
      total > 0
        ? (services.reduce((acc, s) => acc + (Number(s.rating) || 5), 0) / total).toFixed(2)
        : "5.0";

    return { total, active, pausedOrDraft, totalRevenue, avgRating };
  }, [services]);

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        {/* HERO BANNER */}
        <div className="pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Service catalog
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Manage the services you offer to customers, update pricing, toggle availability, and track catalog performance.
            </p>
          </div>

          <Button
            onClick={handleOpenCreateModal}
            variant="solid"
            className="flex items-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" /> Add service
          </Button>
        </div>

        {/* KPI STATS SUMMARY STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="card-chai p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Total listed</span>
            <p className="text-lg font-bold text-white mt-0.5">{catalogStats.total} services</p>
          </div>

          <div className="card-chai p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Active services</span>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{catalogStats.active} active</p>
          </div>

          <div className="card-chai p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Paused / draft</span>
            <p className="text-lg font-bold text-amber-400 mt-0.5">{catalogStats.pausedOrDraft} services</p>
          </div>

          <div className="card-chai p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Average rating</span>
            <p className="text-lg font-bold text-white mt-0.5 flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" /> {catalogStats.avgRating}
            </p>
          </div>

          <div className="card-chai p-3.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Catalog revenue</span>
            <p className="text-lg font-bold font-mono text-white mt-0.5">
              {formatPrice(catalogStats.totalRevenue, { decimals: true })}
            </p>
          </div>
        </div>

        {/* CONTROLS & CATALOG GRID */}
        <div className="space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <div className="card-chai p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search my services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 h-10 text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex bg-neutral-900/60 p-1 rounded-xl border border-white/10 overflow-x-auto shrink-0">
                {["all", "Active", "Paused", "Draft"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === st
                        ? "bg-white text-neutral-950 font-semibold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {st === "all" ? "All statuses" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown Filters & Sorting Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
              {/* Category Filter */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-9.5 px-3 bg-neutral-900/60 border border-white/10 rounded-xl text-xs text-white font-medium outline-none cursor-pointer"
                >
                  <option value="all" className="bg-neutral-900 text-white">All categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-neutral-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Availability
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full h-9.5 px-3 bg-neutral-900/60 border border-white/10 rounded-xl text-xs text-white font-medium outline-none cursor-pointer"
                >
                  <option value="all" className="bg-neutral-900 text-white">All schedules</option>
                  <option value="today" className="bg-neutral-900 text-white">Available today</option>
                  <option value="this-week" className="bg-neutral-900 text-white">Available this week</option>
                  <option value="weekend" className="bg-neutral-900 text-white">Weekend shifts</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Sort order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-9.5 px-3 bg-neutral-900/60 border border-white/10 rounded-xl text-xs text-white font-medium outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-neutral-900 text-white">Newest first</option>
                  <option value="highest-rating" className="bg-neutral-900 text-white">Highest rating</option>
                  <option value="highest-price" className="bg-neutral-900 text-white">Price: High to low</option>
                  <option value="lowest-price" className="bg-neutral-900 text-white">Price: Low to high</option>
                  <option value="most-bookings" className="bg-neutral-900 text-white">Most bookings</option>
                </select>
              </div>
            </div>
          </div>

          {/* PROVIDER SERVICES CATALOG GRID */}
          {filteredServices.length === 0 ? (
            <div className="card-chai p-12 text-center">
              <Layers className="h-12 w-12 text-neutral-600 mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-white">No services found</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                No matching services were found with the current filters. Try resetting search parameters or create a new service.
              </p>
              <Button
                onClick={handleOpenCreateModal}
                variant="solid"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add service
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="card-chai overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image with Badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                      <ServiceImage
                        service={service}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        width={600}
                        height={350}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${
                            service.status === "Active"
                              ? "bg-emerald-500/80 text-white border-emerald-400/40"
                              : service.status === "Paused"
                              ? "bg-amber-500/80 text-white border-amber-400/40"
                              : "bg-neutral-700 text-white border-neutral-600"
                          }`}
                        >
                          {service.status}
                        </span>
                        {service.badge && (
                          <span className="bg-white/[0.1] text-white border border-white/20 px-2 py-0.5 rounded-lg text-[10px] font-medium backdrop-blur-sm">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Price Badge Overlay */}
                      <div className="absolute bottom-3 right-3 bg-neutral-950/80 text-white px-3 py-1 rounded-xl border border-white/10 text-xs font-mono font-bold backdrop-blur-md">
                        {formatPrice(service.price, { priceType: service.priceType, decimals: true })}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                          {typeof service.category === "object" ? (service.category?.name || "General") : (service.category || "General")} • {service.location}
                        </span>
                        <h3 className="font-bold text-sm text-white leading-snug mt-0.5 line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* OPERATIONAL METRICS BAR */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-white/[0.02] rounded-xl border border-white/10 text-xs font-medium text-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span>
                            <strong className="text-white">{service.rating}</strong> ({service.reviewCount})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                          <span>
                            <strong className="text-white">{service.bookingsCount}</strong> bookings
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="font-mono text-white">
                            {formatPrice(service.revenue || 0)} rev
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="capitalize text-[11px]">
                            {(service.availability || "available").replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROVIDER ACTIONS FOOTER BAR */}
                  <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-1.5">
                    {/* Toggle Status Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => handleToggleStatus(service)}
                      className={`h-8 text-[11px] font-medium rounded-lg flex items-center gap-1 ${
                        service.status === "Active"
                          ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                      title={service.status === "Active" ? "Pause service" : "Activate service"}
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
                        className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
                        title="Edit service"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      {/* Duplicate Button */}
                      <button
                        onClick={() => handleDuplicateService(service)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
                        title="Duplicate service"
                      >
                        <Copy className="h-4 w-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setDeletingService(service);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CREATE / EDIT SERVICE DIALOG MODAL */}
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogContent className="card-chai border-white/10 max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-neutral-400" />
                {editingService ? "Edit service" : "Add service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Configure catalog details, pricing rates, location coverage, and availability status.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveService} className="space-y-4 pt-2">
              {/* Service Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium text-neutral-300">
                  Service title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Deep Home Cleaning & Sanitization"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Category & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Category *</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white font-medium cursor-pointer"
                    required
                  >
                    {categories.map((c) => {
                      const name = typeof c === "string" ? c : c.name;
                      const val = typeof c === "string" ? c : (c.id || c.name);
                      return (
                        <option key={c.id || name} value={val} className="bg-neutral-900 text-white">
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Location area *</Label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 px-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white font-medium cursor-pointer"
                    required
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-neutral-900 text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Price Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-medium text-neutral-300">
                    Price (₹) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="499.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Rate type *</Label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full h-10 px-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white font-medium cursor-pointer"
                  >
                    <option value="/hr" className="bg-neutral-900 text-white">Per hour (/hr)</option>
                    <option value="/flat" className="bg-neutral-900 text-white">Flat rate (/flat)</option>
                    <option value="/job" className="bg-neutral-900 text-white">Per job (/job)</option>
                  </select>
                </div>
              </div>

              {/* Status & Availability Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white font-medium cursor-pointer"
                  >
                    <option value="Active" className="bg-neutral-900 text-white">Active</option>
                    <option value="Paused" className="bg-neutral-900 text-white">Paused</option>
                    <option value="Draft" className="bg-neutral-900 text-white">Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Availability</Label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full h-10 px-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white font-medium cursor-pointer"
                  >
                    <option value="today" className="bg-neutral-900 text-white">Today</option>
                    <option value="this-week" className="bg-neutral-900 text-white">This week</option>
                    <option value="weekend" className="bg-neutral-900 text-white">Weekend</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Badge tag</Label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full h-10 px-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white font-medium cursor-pointer"
                  >
                    <option value="" className="bg-neutral-900 text-white">None</option>
                    <option value="Top Rated" className="bg-neutral-900 text-white">Top Rated</option>
                    <option value="Verified" className="bg-neutral-900 text-white">Verified</option>
                    <option value="Eco Friendly" className="bg-neutral-900 text-white">Eco Friendly</option>
                    <option value="Emergency" className="bg-neutral-900 text-white">Emergency</option>
                    <option value="New" className="bg-neutral-900 text-white">New</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Component */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">
                  Service cover image * <span className="text-[11px] text-neutral-500">(JPG, PNG, WebP up to 5MB)</span>
                </Label>

                {imagePreview ? (
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 group">
                    <img src={imagePreview} alt="Service cover preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label htmlFor="service-image-input" className="cursor-pointer bg-white text-neutral-950 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
                        <Upload className="h-4 w-4" /> Change image
                      </label>
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); setFormData({ ...formData, imageUrl: "" }); }}
                        className="cursor-pointer bg-red-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" /> Remove
                      </button>
                    </div>
                    <input
                      id="service-image-input"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <label htmlFor="service-image-input" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl cursor-pointer transition-all text-center">
                    <div className="p-3 bg-white/[0.04] text-neutral-300 rounded-2xl border border-white/10 mb-2">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-neutral-200">Click to select & upload image</span>
                    <span className="text-[11px] text-neutral-500 mt-0.5">JPG, PNG, WebP files up to 5MB</span>
                    <input
                      id="service-image-input"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}
                {imageError && <p className="text-[11px] text-red-400 font-medium mt-1">{imageError}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium text-neutral-300">
                  Service description *
                </Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Describe your service in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                  required
                />
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-xs h-10 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="solid"
                  className="text-xs h-10 px-6 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingService ? "Update service" : "Publish service"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* VIEW DETAILS PREVIEW DIALOG MODAL */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="card-chai border-white/10 max-w-md p-6">
            {viewingService && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase ${
                        viewingService.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : viewingService.status === "Paused"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-neutral-800 text-neutral-400 border border-white/10"
                      }`}
                    >
                      {viewingService.status}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {typeof viewingService.category === "object" ? (viewingService.category?.name || "General") : (viewingService.category || "General")}
                    </span>
                  </div>
                  <DialogTitle className="text-base font-bold text-white">
                    {viewingService.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-neutral-400">
                    {viewingService.location}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  <div className="h-40 rounded-xl overflow-hidden border border-white/10">
                    <ServiceImage
                      service={viewingService}
                      alt={viewingService.title}
                      className="w-full h-full object-cover"
                      width={600}
                      height={350}
                    />
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {viewingService.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/10 text-xs font-medium">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Rate</span>
                      <span className="font-bold text-white font-mono">
                        {formatPrice(viewingService.price)} {viewingService.priceType}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Rating</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {viewingService.rating} ({viewingService.reviewCount} reviews)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Completed bookings</span>
                      <span className="font-bold text-white">{viewingService.bookingsCount}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Total revenue</span>
                      <span className="font-bold font-mono text-white">
                        {formatPrice(viewingService.revenue || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    onClick={() => setIsViewModalOpen(false)}
                    variant="solid"
                    className="w-full text-xs"
                  >
                    Close preview
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION DIALOG MODAL */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="card-chai border-white/10 max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-red-400 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Delete service
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400 pt-1">
                Are you sure you want to delete <strong className="text-white">"{deletingService?.title}"</strong>? This operation will remove the service from your active catalog.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-xs h-10 w-full sm:w-auto font-medium"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteService}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-xs h-10 px-6 w-full sm:w-auto font-medium"
              >
                Yes, delete service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default function ProviderServices() {
  return (
    <ErrorBoundary>
      <ProviderServicesContent />
    </ErrorBoundary>
  );
}
