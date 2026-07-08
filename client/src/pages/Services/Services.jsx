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

// Predefined categories matching the Home page aesthetics
const categories = [
  { name: "Home Cleaning", icon: Paintbrush, count: "120+ Providers", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Plumbing", icon: Droplet, count: "80+ Providers", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "Electrical", icon: Zap, count: "95+ Providers", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Moving & Packing", icon: Truck, count: "60+ Providers", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "Lawn & Garden", icon: Flower2, count: "75+ Providers", color: "bg-lime-50 text-lime-600 border-lime-100" },
  { name: "Wellness & Personal", icon: Heart, count: "110+ Providers", color: "bg-rose-50 text-rose-600 border-rose-100" },
];

// Rich dummy services dataset
const initialServices = [
  {
    id: 1,
    name: "Deep Home Cleaning Service",
    category: "Home Cleaning",
    providerName: "Sarah Jenkins",
    providerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewsCount: 142,
    price: 35,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    description: "Complete top-to-bottom cleaning of all rooms including dusting, vacuuming, kitchen sanitization, and window washing.",
    availability: "today",
    popularity: 98,
    dateAdded: "2026-07-01",
    badge: "Top Rated"
  },
  {
    id: 2,
    name: "Expert Plumbing & Leak Repair",
    category: "Plumbing",
    providerName: "David Miller",
    providerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Queens, NY",
    rating: 4.8,
    reviewsCount: 98,
    price: 50,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    description: "Resolving leakages, clogged drains, toilet repairs, pipe installations, and hot water heater repair with guarantee.",
    availability: "this-week",
    popularity: 85,
    dateAdded: "2026-06-28",
    badge: "Verified"
  },
  {
    id: 3,
    name: "Licensed Smart Home Wiring",
    category: "Electrical",
    providerName: "Marcus Vance",
    providerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Manhattan, NY",
    rating: 4.9,
    reviewsCount: 115,
    price: 65,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    description: "Installation of smart lighting panels, smart thermostats, EV charger setups, and general home electrical upgrades.",
    availability: "today",
    popularity: 92,
    dateAdded: "2026-07-05",
    badge: "Top Rated"
  },
  {
    id: 4,
    name: "Local Office & Home Moving Pro",
    category: "Moving & Packing",
    providerName: "Robert Garcia",
    providerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Brooklyn, NY",
    rating: 4.7,
    reviewsCount: 78,
    price: 80,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    description: "Reliable packing, secure loading, transit, and careful unloading services with optional premium protective wrapping.",
    availability: "weekend",
    popularity: 74,
    dateAdded: "2026-06-20",
    badge: ""
  },
  {
    id: 5,
    name: "Premium Lawn Care & Landscaping",
    category: "Lawn & Garden",
    providerName: "Emily Taylor",
    providerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Staten Island, NY",
    rating: 4.6,
    reviewsCount: 45,
    price: 40,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1558905619-1715497e68c6?auto=format&fit=crop&w=600&q=80",
    description: "Lawn mowing, branch pruning, landscape designing, fertilization, weed prevention, and sod installation.",
    availability: "this-week",
    popularity: 60,
    dateAdded: "2026-07-03",
    badge: "New"
  },
  {
    id: 6,
    name: "Swedish Massage & Reflexology",
    category: "Wellness & Personal",
    providerName: "Chloe Bennett",
    providerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Manhattan, NY",
    rating: 4.9,
    reviewsCount: 89,
    price: 90,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    description: "Relaxing Swedish massage, warm oil aromatherapy, deep tissue therapy, and reflexology sessions at your location.",
    availability: "weekend",
    popularity: 88,
    dateAdded: "2026-06-30",
    badge: "Top Rated"
  },
  {
    id: 7,
    name: "Eco-Friendly House Cleaning",
    category: "Home Cleaning",
    providerName: "Jessica Alba",
    providerImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Manhattan, NY",
    rating: 4.8,
    reviewsCount: 62,
    price: 38,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
    description: "Eco-friendly cleaning with organic, biodegradable solutions safe for children, seniors, and domestic pets.",
    availability: "this-week",
    popularity: 72,
    dateAdded: "2026-07-02",
    badge: "Eco Friendly"
  },
  {
    id: 8,
    name: "Emergency 24/7 Plumber Pro",
    category: "Plumbing",
    providerName: "Thomas Wright",
    providerImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Bronx, NY",
    rating: 4.5,
    reviewsCount: 34,
    price: 70,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1607472586893-edb5caba0c55?auto=format&fit=crop&w=600&q=80",
    description: "Sewer backups, frozen pipes, sudden boiler issues, and major pipe leaks. Prompt response in under 60 minutes.",
    availability: "today",
    popularity: 68,
    dateAdded: "2026-07-06",
    badge: "Emergency"
  },
  {
    id: 9,
    name: "Commercial Electrical Service",
    category: "Electrical",
    providerName: "Alan Turing",
    providerImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Queens, NY",
    rating: 4.7,
    reviewsCount: 51,
    price: 75,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80",
    description: "Wiring layout designs, commercial building power distribution systems, inspections, and high-voltage repairs.",
    availability: "this-week",
    popularity: 58,
    dateAdded: "2026-06-15",
    badge: ""
  },
  {
    id: 10,
    name: "Interstate Moving Solutions",
    category: "Moving & Packing",
    providerName: "Swift Transports",
    providerImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Bronx, NY",
    rating: 4.9,
    reviewsCount: 104,
    price: 120,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=600&q=80",
    description: "Full interstate moves, specialized furniture protection, vehicle transportation, and secured warehouse storage.",
    availability: "weekend",
    popularity: 90,
    dateAdded: "2026-07-04",
    badge: "Top Rated"
  },
  {
    id: 11,
    name: "Hedge Trimming & Tree Removal",
    category: "Lawn & Garden",
    providerName: "Gary Woods",
    providerImage: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Staten Island, NY",
    rating: 4.8,
    reviewsCount: 82,
    price: 55,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    description: "Vetted arborists offering tree felling, hedge maintenance, root removal, and green garden cleanup.",
    availability: "weekend",
    popularity: 76,
    dateAdded: "2026-06-22",
    badge: "Verified"
  },
  {
    id: 12,
    name: "1-on-1 Personal Fitness Coaching",
    category: "Wellness & Personal",
    providerName: "Alex Mercer",
    providerImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&h=150&q=80",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewsCount: 73,
    price: 60,
    priceType: "/hr",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    description: "Customized workout blueprints, strength training, core stability improvement, and custom nutritional programs.",
    availability: "today",
    popularity: 81,
    dateAdded: "2026-07-07",
    badge: "New"
  }
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
      return "bg-blue-50 text-blue-600 border-blue-100";
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
  const [isLoading, setIsLoading] = React.useState(false);

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
  const filteredServices = initialServices.filter((service) => {
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
        <section className="relative overflow-hidden py-16 lg:py-20 bg-white border-b border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
              <Sparkles className="h-3.5 w-3.5 fill-blue-600" /> Vetted Local Specialists
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight max-w-3xl">
              Find and Book the Best <span className="text-blue-600">Local Services</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl">
              Instantly match with verified professionals in your neighborhood. Compare reviews, pricing, and book your service online with peace of mind.
            </p>

            {/* HERO SEARCH BAR */}
            <form 
              onSubmit={handleHeroSearchSubmit}
              className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl flex flex-col md:flex-row gap-3 items-center mt-4"
            >
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3.5 top-3 h-5 w-5 text-blue-500" />
                <Input 
                  placeholder="What service do you need?" 
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="pl-11 h-11 border-gray-200 focus-visible:ring-blue-500 rounded-xl bg-gray-50/50 text-sm" 
                />
              </div>
              
              <div className="relative w-full md:w-60">
                <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-blue-500" />
                <select
                  value={heroLocation}
                  onChange={(e) => setHeroLocation(e.target.value)}
                  className="w-full pl-11 pr-4 h-11 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-gray-50/50 text-sm text-gray-700 cursor-pointer appearance-none"
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
              
              <Button type="submit" className="w-full md:w-auto h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-sm transition-all font-semibold">
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
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
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
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 -translate-y-0.5"
                        : "bg-white text-gray-900 border-gray-100 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    <div className={`p-2.5 rounded-full mb-3 transition-colors ${
                      isSelected 
                        ? "bg-blue-500 text-white" 
                        : cat.color
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold">{cat.name}</span>
                    <span className={`text-[10px] mt-1 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
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
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                  className="w-full h-10 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-gray-50/50 px-3 text-sm text-gray-700 cursor-pointer"
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
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
                      className={`flex items-center justify-between text-left px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        minRating === opt.value
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {opt.value > 0 && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        {opt.label}
                      </span>
                      {opt.value > 0 && (
                        <span className="text-[10px] text-gray-400 font-normal">
                          ({initialServices.filter((s) => s.rating >= opt.value).length})
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
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
                    <span className="flex items-center justify-center bg-blue-600 text-white rounded-full text-[10px] w-5 h-5 font-bold">
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
                      className="w-full h-9 pl-3 pr-8 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-white text-xs font-semibold text-gray-700 cursor-pointer appearance-none shadow-2xs"
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
                    className="text-xs font-semibold text-blue-600 hover:underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* SERVICES LISTINGS GRID (WITH SKELETON LOADING EFFECTS) */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden p-0 py-0 gap-0 border border-gray-150 flex flex-col h-full bg-white rounded-2xl">
                      <Skeleton className="h-48 w-full rounded-t-2xl rounded-b-none" />
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex items-center gap-2 mt-auto border-t border-gray-50 pt-3">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24 ml-auto" />
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-9 w-24 rounded-xl" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : sortedServices.length === 0 ? (
                /* NO RESULTS FOUND STATE */
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto mt-8 shadow-xs">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                    <Info className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">No Services Found</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    We couldn't find any service matching your selection. Try clearing search filters or picking a different category.
                  </p>
                  <Button onClick={handleClearFilters} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-2 font-semibold">
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                /* ACTUAL CARDS LISTINGS GRID */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedServices.map((service) => (
                      <Card 
                        key={service.id} 
                        className="group overflow-hidden p-0 py-0 gap-0 hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 flex flex-col h-full bg-white rounded-2xl relative"
                      >
                        
                        {/* Service Photo */}
                        <div className="relative h-48 w-full overflow-hidden">
                          <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          
                          {/* Badge tag like "Top Rated" */}
                          {service.badge && (
                            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                              {service.badge}
                            </span>
                          )}

                          {/* Category Badge overlay on image */}
                          <span className={`absolute bottom-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-xs ${getCategoryStyles(service.category)}`}>
                            {service.category}
                          </span>
                        </div>

                        {/* Card Contents */}
                        <div className="p-5 flex flex-col gap-3 flex-1">
                          
                          {/* Rating and reviews */}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-extrabold text-gray-900 text-sm">{service.rating}</span>
                            <span className="text-gray-400 text-xs font-semibold">({service.reviewsCount} reviews)</span>
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-950 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                              <NavLink to={`/services/${service.id}`}>
                                {service.name}
                              </NavLink>
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1.5 line-clamp-2">
                              {service.description}
                            </p>
                          </div>

                          {/* Provider and Location Details */}
                          <div className="flex items-center gap-2 mt-auto border-t border-gray-50 pt-3.5">
                            <img 
                              src={service.providerImage} 
                              alt={service.providerName} 
                              className="h-6 w-6 rounded-full object-cover border border-gray-150"
                            />
                            <span className="text-xs font-bold text-gray-700">{service.providerName}</span>
                            
                            <div className="flex items-center gap-0.5 text-xs text-gray-400 ml-auto font-medium">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>{service.location}</span>
                            </div>
                          </div>

                          {/* Price Tag & CTA Book Button */}
                          <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Starting from</span>
                              <span className="font-extrabold text-gray-950 text-base">${service.price}<span className="text-gray-400 text-xs font-semibold">{service.priceType}</span></span>
                            </div>
                            <NavLink to={`/booking?serviceId=${service.id}`}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-4 font-bold shadow-xs">
                                Book Now
                              </Button>
                            </NavLink>
                          </div>
                        </div>

                      </Card>
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
                              className={`h-8 w-8 text-xs font-bold rounded-xl transition-all ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white py-12 px-6 sm:px-12 md:py-16 md:px-20 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6 items-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Grow Your Service Business with Us
              </h2>
              <p className="text-blue-100 text-base md:text-lg max-w-2xl">
                Are you a local service specialist? Register as a provider on BookMyLocalService to discover new clients, coordinate schedules, and build your local reputation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-3">
                <NavLink to="/provider/dashboard">
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-600 rounded-full font-bold shadow-md px-8 h-12 transition-transform hover:scale-[1.02]">
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
                  className="w-full text-xs text-blue-600 font-semibold border-blue-200 bg-blue-50/30 hover:bg-blue-50/70"
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                  className="w-full h-10 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-gray-50/50 px-3 text-sm text-gray-700 cursor-pointer"
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
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
                      className={`flex items-center justify-between text-left px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        minRating === opt.value
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {opt.value > 0 && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        {opt.label}
                      </span>
                      {opt.value > 0 && (
                        <span className="text-[10px] text-gray-400 font-normal">
                          ({initialServices.filter((s) => s.rating >= opt.value).length})
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
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold mt-auto h-11"
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
