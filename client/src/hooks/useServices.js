import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { servicesService } from "../services/servicesService";

export function useServices() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "all";

  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );

  const [heroSearch, setHeroSearch] = useState(initialSearch);
  const [heroLocation, setHeroLocation] = useState(initialLocation);

  const [priceRange, setPriceRange] = useState("all");
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState("all");

  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setError(null);
      try {
        const response = await servicesService.getServices();
        if (response.success) {
          const mappedData = response.data.map(service => ({
            id: service.id,
            name: service.title,
            category: typeof service.category === "object" ? (service.category?.name || "General") : (service.category || "General"),
            categoryId: typeof service.category === "object" ? service.category?.id : service.categoryId,
            categorySlug: typeof service.category === "object" ? service.category?.slug : "",
            providerName: service.provider?.fullName || "Verified Provider",
            providerImage: service.provider?.avatar || "",
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
            badge: service.badge,
            slug: service.slug
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

  useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    const loc = searchParams.get("location");

    if (cat) setSelectedCategories([cat]);
    if (search !== null) {
      setSearchQuery(search);
      setHeroSearch(search);
    }
    if (loc !== null) {
      setSelectedLocation(loc);
      setHeroLocation(loc);
    }
  }, [searchParams]);

  const updateUrlParameters = (categoriesList, searchVal, locVal) => {
    const params = {};
    if (searchVal) params.search = searchVal;
    if (locVal && locVal !== "all") params.location = locVal;
    if (categoriesList.length === 1) params.category = categoriesList[0];
    setSearchParams(params);
  };

  const toggleCategory = (catName) => {
    const nextCategories = selectedCategories.includes(catName)
      ? selectedCategories.filter((c) => c !== catName)
      : [...selectedCategories, catName];

    setSelectedCategories(nextCategories);
    updateUrlParameters(nextCategories, searchQuery, selectedLocation);
    setCurrentPage(1);
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(heroSearch);
    setSelectedLocation(heroLocation);
    updateUrlParameters(selectedCategories, heroSearch, heroLocation);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
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
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesCategory = service.category.toLowerCase().includes(query);
        const matchesDesc = service.description ? service.description.toLowerCase().includes(query) : false;
        const matchesProvider = service.providerName.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesProvider) return false;
      }

      if (selectedLocation !== "all" && service.location !== selectedLocation) return false;

      if (selectedCategories.length > 0 && !selectedCategories.includes(service.category)) return false;

      if (priceRange === "under-50" && service.price >= 50) return false;
      if (priceRange === "50-100" && (service.price < 50 || service.price > 100)) return false;
      if (priceRange === "100-plus" && service.price <= 100) return false;
      if (priceRange === "custom") {
        if (customMinPrice !== "" && service.price < parseFloat(customMinPrice)) return false;
        if (customMaxPrice !== "" && service.price > parseFloat(customMaxPrice)) return false;
      }

      if (minRating > 0 && service.rating < minRating) return false;
      if (availability !== "all" && service.availability !== availability) return false;

      return true;
    });
  }, [
    services, searchQuery, selectedLocation, selectedCategories,
    priceRange, customMinPrice, customMaxPrice, minRating, availability
  ]);

  const sortedServices = useMemo(() => {
    const list = [...filteredServices];
    if (sortBy === "popularity") list.sort((a, b) => b.popularity - a.popularity);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    return list;
  }, [filteredServices, sortBy]);

  const totalPages = Math.ceil(sortedServices.length / ITEMS_PER_PAGE);
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedServices.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedServices, currentPage]);

  return {
    services,
    filteredServices,
    paginatedServices,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedLocation,
    setSelectedLocation,
    selectedCategories,
    toggleCategory,
    heroSearch,
    setHeroSearch,
    heroLocation,
    setHeroLocation,
    handleHeroSearchSubmit,
    priceRange,
    setPriceRange,
    customMinPrice,
    setCustomMinPrice,
    customMaxPrice,
    setCustomMaxPrice,
    minRating,
    setMinRating,
    availability,
    setAvailability,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    clearAllFilters
  };
}
