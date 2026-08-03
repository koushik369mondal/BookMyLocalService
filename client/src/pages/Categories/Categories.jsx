import React, { useState, useEffect } from "react";
import { ServiceImagePlaceholder } from "@/components/ui/ServiceImagePlaceholder";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  RefreshCw,
  Users,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { categoriesService } from "@/services/categoriesService";
import { getCategoryIconComponent } from "@/utils/categoryIconMap";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoriesService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        throw new Error(response.message || "Failed to load categories.");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Something went wrong while loading categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleExplore = (categoryName) => {
    navigate(`/services?category=${encodeURIComponent(categoryName)}`);
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen">

        {/* PAGE HEADER */}
        <section className="py-12 bg-[#FAF6F0] border-b border-[#5A5146]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1D1A] leading-tight max-w-3xl">
              Browse <span className="text-[#C9A46A]">Service Categories</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5146] font-normal leading-relaxed max-w-xl">
              Find trusted professionals for every household and business need. Compare rates, reviews, and book instantly.
            </p>

            {/* SEARCH BAR */}
            <div className="w-full max-w-md flex items-center mt-1">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#7A7266]" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-[#5A5146]/20 focus-visible:ring-violet-950 rounded-xl bg-white text-xs text-[#1F1D1A]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* LISTINGS CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* LOADING SKELETON - Styled precisely like Services.jsx */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden p-0 py-0 gap-0 border border-gray-100 flex flex-col h-full bg-white rounded-2xl">
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
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto mt-8 shadow-xs">
              <div className="p-4 bg-red-50 text-red-600 rounded-full border border-red-100">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-2">Failed to Load Categories</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {error}
              </p>
              <Button onClick={fetchCategories} className="bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white rounded-xl mt-2 font-semibold">
                Retry
              </Button>
            </div>
          )}

          {/* DYNAMIC CATEGORIES GRID */}
          {!loading && !error && filteredCategories.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.06)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCategories.map((category) => {
                const IconComponent = getCategoryIconComponent(category.icon);

                return (
                  <motion.div key={category.id || category.name} variants={fadeInUp}>
                    <Card
                      className="group overflow-hidden p-0 py-0 gap-0 hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 flex flex-col h-full bg-white rounded-2xl relative"
                    >
                      {/* Category Photo Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <ServiceImagePlaceholder title={category.name} />
                        )}

                        {/* Floating Category Badge Overlay */}
                        <span className="absolute bottom-3 right-3 text-[10px] font-extrabold px-3 py-1 rounded-full border shadow-xs bg-white/90 text-[#8C4B3E] border-[#E8DCC3] backdrop-blur-xs">
                          {category.name}
                        </span>
                      </div>

                      {/* Card Contents */}
                      <div className="p-5 flex flex-col gap-3 flex-1">

                        {/* Badge / icon header */}
                        <div className="flex items-center gap-1.5">
                          <span className="p-1 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-md">
                            <IconComponent className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-gray-400 text-xs font-semibold">Service Directory</span>
                        </div>

                        {/* Title and description */}
                        <div>
                          <h3 className="font-bold text-[#1F1D1A] text-base leading-snug group-hover:text-[#C9A46A] transition-colors line-clamp-1">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed mt-1.5 line-clamp-2">
                            {category.description}
                          </p>
                        </div>

                        {/* Category Counts & Stats */}
                        <div className="flex items-center gap-2 mt-auto border-t border-gray-50 pt-3.5">
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                            <Layers className="h-3.5 w-3.5 text-gray-400" />
                            <span>{category.serviceCount} Services</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto font-medium">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-bold text-gray-700">{category.providerCount} Providers</span>
                          </div>
                        </div>

                        {/* Instant Book tag & Explore Action Button */}
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Access level</span>
                            <span className="font-extrabold text-[#1F1D1A] text-sm">Instant Book</span>
                          </div>
                          <Button
                            onClick={() => handleExplore(category.name)}
                            size="sm"
                            className="bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white rounded-xl h-9 px-4 font-bold shadow-xs flex items-center gap-1 group-hover:scale-[1.01] transition-transform"
                          >
                            Explore Services
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </div>
                      </div>

                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* EMPTY SEARCH STATE - Styled precisely like Services.jsx */}
          {!loading && !error && filteredCategories.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto mt-8 shadow-xs">
              <div className="p-4 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-full border border-violet-950/10">
                <Info className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-2">No Categories Found</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                We couldn't find any category matching "{searchQuery}". Try typing another service name or clearing the search.
              </p>
              <Button onClick={() => setSearchQuery("")} className="bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white rounded-xl mt-2 font-semibold">
                Clear Search
              </Button>
            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}
