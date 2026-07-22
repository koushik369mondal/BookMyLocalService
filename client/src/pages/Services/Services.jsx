import React from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Search,
  Paintbrush,
  Droplet,
  Zap,
  Truck,
  Flower2,
  Heart,
  Star,
  ShieldAlert,
  ArrowRight,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info
} from "lucide-react";
import { ServiceCard, ServiceCardSkeleton } from "@/components/ui/ServiceCard";
import { servicesService } from "../../services/api";

// Predefined categories matching the Home page aesthetics
const categories = [
  { name: "Home Cleaning", icon: Paintbrush, count: "120+ Providers", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Plumbing", icon: Droplet, count: "80+ Providers", color: "bg-slate-900/5 text-slate-900 border-slate-900/10" },
  { name: "Electrical", icon: Zap, count: "95+ Providers", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Moving & Packing", icon: Truck, count: "60+ Providers", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "Lawn & Garden", icon: Flower2, count: "75+ Providers", color: "bg-lime-50 text-lime-600 border-lime-100" },
  { name: "Wellness & Personal", icon: Heart, count: "110+ Providers", color: "bg-rose-50 text-rose-600 border-rose-100" },
];

// Locations list
const locations = [
  "All Locations",
  "Brooklyn, NY",
  "Queens, NY",
  "Manhattan, NY",
  "Bronx, NY",
  "Staten Island, NY"
];

// Helper to get matching category styling
const getCategoryStyles = (category) => {
  switch (category) {
    case "Home Cleaning":
      return "bg-pink-50 text-pink-600 border-pink-100";
    case "Plumbing":
      return "bg-slate-900/5 text-slate-900 border-slate-900/10";
    case "Electrical":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "Moving & Packing":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Lawn & Garden":
      return "bg-lime-50 text-lime-600 border-lime-100";
    case "Wellness & Personal":
      return "bg-rose-50 text-rose-600 border-rose-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract initial parameters from URL
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "all";

  // State Management
  const [services, setServices] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = React.useState(initialLocation);
  const [selectedCategories, setSelectedCategories] = React.useState(
    initialCategory ? [initialCategory] : []
  );

  // Hero values to be applied on click/submit
  const [heroSearch, setHeroSearch] = React.useState(initialSearch);
  const [heroLocation, setHeroLocation] = React.useState(initialLocation);

  // Filters state
  const [priceRange, setPriceRange] = React.useState("all");
  const [customMinPrice, setCustomMinPrice] = React.useState("");
  const [customMaxPrice, setCustomMaxPrice] = React.useState("");
  const [minRating, setMinRating] = React.useState(0);
  const [availability, setAvailability] = React.useState("all");

  // Sorting & Pagination
  const [sortBy, setSortBy] = React.useState("popularity");
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 6;

  // Mobile Filters Drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch Services from Database via API
  React.useEffect(() => {
    const fetchServices = async () => {
      setError(null);
      try {
        const response = await servicesService.getServices();
        if (response.success) {
          const mappedData = response.data.map(service => ({
            id: service.id,
            name: service.title,
            category: service.category,
            providerName: service.provider?.fullName || "Verified Provider",
            providerImage: service.provider?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
            location: service.location,
            rating: service.rating,
            reviewsCount: service.reviewCount,
            price: service.price,
            priceType: service.priceType,
            image: service.imageUrl,
            description: service.description,
            availability: service.availability,
            popularity: service.reviewCount,
            dateAdded: service.createdAt,
            badge: service.badge
          }));
          setServices(mappedData);
        } else {
          throw new Error(response.message || "Failed to load services");
        }
      } catch (err) {
        console.error("Fetch services error:", err);
        setError(err.message || "Failed to fetch services from the database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Synchronize state from URL search params on mount/update
  React.useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    const loc = searchParams.get("location");

    if (cat) {
      setSelectedCategories([cat]);
    }
    if (search !== null) {
      setSearchQuery(search);
      setHeroSearch(search);
    }
    if (loc !== null) {
      setSelectedLocation(loc);
      setHeroLocation(loc);
    }
  }, [searchParams]);

  // Synchronize filter updates back to URL parameters
  const updateUrlParameters = (categoriesList, searchVal, locVal) => {
    const params = {};
    if (searchVal) params.search = searchVal;
    if (locVal && locVal !== "all") params.location = locVal;
    if (categoriesList.length === 1) {
      params.category = categoriesList[0];
    }
    setSearchParams(params);
  };

  // Handle Category Pill selection
  const toggleCategory = (catName) => {
    const nextCategories = selectedCategories.includes(catName)
      ? selectedCategories.filter((c) => c !== catName)
      : [...selectedCategories, catName];

    setSelectedCategories(nextCategories);
    updateUrlParameters(nextCategories, searchQuery, selectedLocation);
  };

  // Handle Search Submission (Hero Search)
  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(heroSearch);
    setSelectedLocation(heroLocation);
    updateUrlParameters(selectedCategories, heroSearch, heroLocation);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setHeroSearch("");
    setSelectedLocation("all");
    setHeroLocation("all");
    setSelectedCategories([]);
    setPriceRange("all");
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setMinRating(0);
    setAvailability("all");
    setSortBy("popularity");
    setSearchParams({});
  };

  // Count active filters
  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedLocation !== "all" ? 1 : 0) +
    (selectedCategories.length) +
    (priceRange !== "all" || customMinPrice || customMaxPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (availability !== "all" ? 1 : 0);

  // Trigger loading skeleton simulation on filter/sort changes
  React.useEffect(() => {
    setCurrentPage(1);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedLocation,
    selectedCategories,
    priceRange,
    customMinPrice,
    customMaxPrice,
    minRating,
    availability,
    sortBy
  ]);

  // Filtering Logic
  const filteredServices = services.filter((service) => {
    // 1. Text Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = service.name.toLowerCase().includes(q);
      const matchDesc = service.description.toLowerCase().includes(q);
      const matchProvider = service.providerName.toLowerCase().includes(q);
      const matchCategory = service.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchProvider && !matchCategory) {
        return false;
      }
    }

    // 2. Location
    if (selectedLocation !== "all" && selectedLocation !== "") {
      if (service.location !== selectedLocation) return false;
    }

    // 3. Categories
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(service.category)) return false;
    }

    // 4. Predefined & Custom Price Range
    if (priceRange === "under-40") {
      if (service.price >= 40) return false;
    } else if (priceRange === "40-70") {
      if (service.price < 40 || service.price > 70) return false;
    } else if (priceRange === "above-70") {
      if (service.price <= 70) return false;
    }

    if (customMinPrice !== "" && service.price < parseFloat(customMinPrice)) {
      return false;
    }
    if (customMaxPrice !== "" && service.price > parseFloat(customMaxPrice)) {
      return false;
    }

    // 5. Rating
    if (minRating > 0 && service.rating < minRating) {
      return false;
    }

    // 6. Availability
    if (availability !== "all" && service.availability !== availability) {
      return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.popularity - a.popularity;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
    }
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "newest") {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
    return 0;
  });

  // Pagination bounds
  const totalPages = Math.ceil(sortedServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = sortedServices.slice(startIndex, endIndex);

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="h-3.5 w-3.5 fill-accent text-amber-500" /> Verified Local Specialists
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-3xl">
              Find and Book the Best <span className="text-amber-500">Local Services</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl">
              Instantly match with verified professionals in your neighborhood. Compare reviews, pricing, and book your service online with peace of mind.
            </p>

            {/* HERO SEARCH BAR */}
            <form
              onSubmit={handleHeroSearchSubmit}
              className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl flex flex-col md:flex-row gap-3 items-center mt-4"
            >
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-700" />
                <Input
                  placeholder="What service do you need?"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="pl-11 h-11 border-slate-200 focus-visible:ring-slate-900 rounded-xl bg-white text-sm"
                />
              </div>

              <div className="relative w-full md:w-60">
                <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-slate-700" />
                <select
                  value={heroLocation}
                  onChange={(e) => setHeroLocation(e.target.value)}
                  className="w-full pl-11 pr-4 h-11 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-sm text-gray-705 cursor-pointer appearance-none"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc === "All Locations" ? "all" : loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto h-11 bg-slate-900 hover:bg-slate-700 text-white rounded-xl px-8 shadow-sm transition-all font-semibold">
                Search
              </Button>
            </form>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* SERVICE CATEGORIES WITH ICONS */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-2">
              <div>
                <h2 className="text-xl font-bold text-gray-950">Select by Category</h2>
                <p className="text-xs text-gray-400 mt-0.5">Quickly narrow down service categories instantly</p>
              </div>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-xs font-semibold text-slate-900 hover:text-amber-500 hover:underline flex items-center gap-1"
                >
                  Reset Category
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, idx) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 -translate-y-0.5"
                        : "bg-white text-gray-900 border-gray-100 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                  >
                    <div className={`p-2.5 rounded-full mb-3 transition-colors ${isSelected
                        ? "bg-slate-700 text-white"
                        : cat.color
                      }`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold">{cat.name}</span>
                    <span className={`text-[10px] mt-1 ${isSelected ? "text-slate-300" : "text-gray-400"}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

            {/* DESKTOP SIDEBAR FILTERS */}
            <aside className="hidden lg:flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <span className="font-bold text-gray-950 text-base">Filters</span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-slate-900 hover:text-amber-500 font-semibold transition-colors"
                  >
                    Clear All ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Category Checkboxes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</h4>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => toggleCategory(cat.name)}
                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Location</h4>
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    updateUrlParameters(selectedCategories, searchQuery, e.target.value);
                  }}
                  className="w-full h-10 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-gray-50/50 px-3 text-sm text-gray-700 cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc === "All Locations" ? "all" : loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Price Range</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "All Prices", value: "all" },
                    { label: "Under $40", value: "under-40" },
                    { label: "$40 - $70", value: "40-70" },
                    { label: "Above $70", value: "above-70" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="desktopPriceRange"
                        checked={priceRange === option.value}
                        onChange={() => {
                          setPriceRange(option.value);
                          setCustomMinPrice("");
                          setCustomMaxPrice("");
                        }}
                        className="h-4 w-4 border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Custom price inputs */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-gray-400">Custom Range ($)</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={customMinPrice}
                      onChange={(e) => {
                        setCustomMinPrice(e.target.value);
                        setPriceRange("all");
                      }}
                      className="h-8 border-gray-200 rounded-lg text-xs"
                    />
                    <span className="text-gray-400 text-xs">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={customMaxPrice}
                      onChange={(e) => {
                        setCustomMaxPrice(e.target.value);
                        setPriceRange("all");
                      }}
                      className="h-8 border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Minimum Rating</h4>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "All Ratings", value: 0 },
                    { label: "4.5+ Stars", value: 4.5 },
                    { label: "4.7+ Stars", value: 4.7 },
                    { label: "4.8+ Stars", value: 4.8 },
                    { label: "4.9+ Stars", value: 4.9 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMinRating(opt.value)}
                      className={`flex items-center justify-between text-left px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${minRating === opt.value
                          ? "bg-slate-900/5 text-slate-900 border-slate-900/20"
                          : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                        }`}
                    >
                      <span className="flex items-center gap-1">
                        {opt.value > 0 && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        {opt.label}
                      </span>
                      {opt.value > 0 && (
                        <span className="text-[10px] text-gray-400 font-normal">
                          ({services.filter((s) => s.rating >= opt.value).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Availability</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Anytime", value: "all" },
                    { label: "Today", value: "today" },
                    { label: "This Week", value: "this-week" },
                    { label: "Weekend", value: "weekend" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="desktopAvailability"
                        checked={availability === option.value}
                        onChange={() => setAvailability(option.value)}
                        className="h-4 w-4 border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* MAIN LISTINGS PANEL */}
            <main className="lg:col-span-3">

              {/* SORT & SEARCH ACTIONS HEADER */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-2xs">

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px] w-5 h-5 font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="text-sm text-gray-500 hidden sm:block">
                  Showing{" "}
                  <span className="font-semibold text-gray-950">
                    {sortedServices.length === 0 ? 0 : startIndex + 1}
                  </span>
                  -
                  <span className="font-semibold text-gray-950">
                    {Math.min(endIndex, sortedServices.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-950">{sortedServices.length}</span>{" "}
                  results
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Sort by</span>
                  <div className="relative w-[180px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-gray-707 cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="rating">Rating</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE FILTER PILLS DISPLAY */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active:</span>

                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5 bg-slate-100 hover:bg-slate-200">
                      Search: {searchQuery}
                      <X className="h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => { setSearchQuery(""); setHeroSearch(""); }} />
                    </Badge>
                  )}

                  {selectedLocation !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5 bg-slate-100 hover:bg-slate-200">
                      Loc: {selectedLocation}
                      <X className="h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => { setSelectedLocation("all"); setHeroLocation("all"); }} />
                    </Badge>
                  )}

                  {selectedCategories.map(cat => (
                    <Badge key={cat} variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5 bg-slate-100 hover:bg-slate-200">
                      {cat}
                      <X className="h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => toggleCategory(cat)} />
                    </Badge>
                  ))}

                  {(priceRange !== "all" || customMinPrice || customMaxPrice) && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5 bg-slate-100 hover:bg-slate-200">
                      Price: {priceRange !== "all" ? priceRange : `${customMinPrice || "0"}-${customMaxPrice || "Any"}`}
                      <X className="h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => { setPriceRange("all"); setCustomMinPrice(""); setCustomMaxPrice(""); }} />
                    </Badge>
                  )}

                  {minRating > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5 bg-slate-100 hover:bg-slate-200">
                      Rating: {minRating}+ Stars
                      <X className="h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setMinRating(0)} />
                    </Badge>
                  )}

                  {availability !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5 bg-slate-100 hover:bg-slate-200">
                      Available: {availability}
                      <X className="h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setAvailability("all")} />
                    </Badge>
                  )}

                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-semibold text-slate-900 hover:text-amber-500 ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* SERVICES LISTINGS GRID (WITH SKELETON LOADING EFFECTS) */}
              {error ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto mt-8 shadow-xs">
                  <div className="p-4 bg-red-50 text-red-600 rounded-full border border-red-100">
                    <ShieldAlert className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">Failed to Load Services</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    {error}
                  </p>
                  <Button onClick={() => window.location.reload()} className="bg-slate-900 hover:bg-slate-700 text-white rounded-xl mt-2 font-semibold">
                    Retry
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                  ))}
                </div>
              ) : sortedServices.length === 0 ? (
                /* NO RESULTS FOUND STATE */
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto mt-8 shadow-xs">
                  <div className="p-4 bg-slate-900/5 text-slate-900 rounded-full border border-slate-900/10">
                    <Info className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">No Services Found</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    We couldn't find any service matching your selection. Try clearing search filters or picking a different category.
                  </p>
                  <Button onClick={handleClearFilters} className="bg-slate-900 hover:bg-slate-700 text-white rounded-xl mt-2 font-semibold">
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                /* ACTUAL CARDS LISTINGS GRID */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        ctaText="Book Now"
                        ctaLink={`/services/${service.id}`}
                      />
                    ))}
                  </div>

                  {/* COMPACT INTERACTIVE PAGINATION PANEL */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-10">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-9 font-semibold"
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
                              className={`h-8 w-8 text-xs font-bold rounded-xl transition-all ${currentPage === pageNum
                                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                                  : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
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
                        className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-9 font-semibold"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </div>
                  )}
                </>
              )}

            </main>
          </div>
        </div>

        {/* CALL TO ACTION SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl text-white py-12 px-6 sm:px-12 md:py-16 md:px-20 text-center relative overflow-hidden shadow-xl border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)] pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6 items-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Grow Your Service Business with Us
              </h2>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl">
                Are you a local service specialist? Register as a provider on BookMyLocalService to discover new clients, coordinate schedules, and build your local reputation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-3">
                <NavLink to="/provider/dashboard">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-500/90 text-slate-900 rounded-full font-bold shadow-md px-8 h-12 transition-transform hover:scale-[1.02]">
                    Become a Provider
                  </Button>
                </NavLink>
                <NavLink to="/register">
                  <Button size="lg" variant="outline" className="border-white/40 hover:bg-white/10 text-white rounded-full font-bold px-8 h-12">
                    Create Client Account
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE SLIDE-OUT DRAWER FILTERS */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            ></div>

            {/* Drawer Panel */}
            <div className="fixed top-0 bottom-0 left-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="font-bold text-gray-950 text-lg">Filters</span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Reset button inside mobile filters */}
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleClearFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full text-xs text-slate-900 font-semibold border-slate-900/20 bg-slate-900/5 hover:bg-slate-900/10"
                >
                  Reset Active Filters ({activeFilterCount})
                </Button>
              )}

              {/* Category Checkboxes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</h4>
                <div className="flex flex-col gap-2.5">
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => toggleCategory(cat.name)}
                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Location</h4>
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    updateUrlParameters(selectedCategories, searchQuery, e.target.value);
                  }}
                  className="w-full h-10 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-gray-50/50 px-3 text-sm text-gray-700 cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc === "All Locations" ? "all" : loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Price Range</h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "All Prices", value: "all" },
                    { label: "Under $40", value: "under-40" },
                    { label: "$40 - $70", value: "40-70" },
                    { label: "Above $70", value: "above-70" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="mobilePriceRange"
                        checked={priceRange === option.value}
                        onChange={() => {
                          setPriceRange(option.value);
                          setCustomMinPrice("");
                          setCustomMaxPrice("");
                        }}
                        className="h-4 w-4 border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-gray-400">Custom Range ($)</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={customMinPrice}
                      onChange={(e) => {
                        setCustomMinPrice(e.target.value);
                        setPriceRange("all");
                      }}
                      className="h-8 border-gray-200 rounded-lg text-xs"
                    />
                    <span className="text-gray-400 text-xs">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={customMaxPrice}
                      onChange={(e) => {
                        setCustomMaxPrice(e.target.value);
                        setPriceRange("all");
                      }}
                      className="h-8 border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Minimum Rating</h4>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "All Ratings", value: 0 },
                    { label: "4.5+ Stars", value: 4.5 },
                    { label: "4.7+ Stars", value: 4.7 },
                    { label: "4.8+ Stars", value: 4.8 },
                    { label: "4.9+ Stars", value: 4.9 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMinRating(opt.value)}
                      className={`flex items-center justify-between text-left px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${minRating === opt.value
                          ? "bg-slate-900/5 text-slate-900 border-slate-900/20"
                          : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                        }`}
                    >
                      <span className="flex items-center gap-1">
                        {opt.value > 0 && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        {opt.label}
                      </span>
                      {opt.value > 0 && (
                        <span className="text-[10px] text-gray-400 font-normal">
                          ({services.filter((s) => s.rating >= opt.value).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Availability</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Anytime", value: "all" },
                    { label: "Today", value: "today" },
                    { label: "This Week", value: "this-week" },
                    { label: "Weekend", value: "weekend" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="mobileAvailability"
                        checked={availability === option.value}
                        onChange={() => setAvailability(option.value)}
                        className="h-4 w-4 border-gray-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-bold mt-auto h-11"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
