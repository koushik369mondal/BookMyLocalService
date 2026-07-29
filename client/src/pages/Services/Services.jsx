import React from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { useServices } from "@/hooks/useServices";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesFilters } from "@/components/services/ServicesFilters";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServicesPagination } from "@/components/services/ServicesPagination";

export default function Services() {
  const { user } = useAuth();

  if (user?.role === "PROVIDER") {
    return <Navigate to="/provider/services" replace />;
  }

  const {
    isLoading,
    error,
    paginatedServices,
    heroSearch,
    setHeroSearch,
    heroLocation,
    setHeroLocation,
    handleHeroSearchSubmit,
    selectedCategories,
    toggleCategory,
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
    clearAllFilters
  } = useServices();

  return (
    <MainLayout>
      <ServicesHero
        heroSearch={heroSearch}
        setHeroSearch={setHeroSearch}
        heroLocation={heroLocation}
        setHeroLocation={setHeroLocation}
        onSearchSubmit={handleHeroSearchSubmit}
      />

      <div className="py-12 bg-[#FAF6F0] min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar Filters */}
            <div className="lg:col-span-3">
              <ServicesFilters
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                customMinPrice={customMinPrice}
                setCustomMinPrice={setCustomMinPrice}
                customMaxPrice={customMaxPrice}
                setCustomMaxPrice={setCustomMaxPrice}
                minRating={minRating}
                setMinRating={setMinRating}
                availability={availability}
                setAvailability={setAvailability}
                onClearAll={clearAllFilters}
              />
            </div>

            {/* Main Content Grid & Pagination */}
            <div className="lg:col-span-9 space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E8DCC3]">
                <span className="text-xs font-bold text-[#5A5146]">
                  Showing <strong className="text-[#1F1D1A]">{paginatedServices.length}</strong> results
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#7A7266]">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-extrabold text-[#1F1D1A] bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              <ServicesGrid
                isLoading={isLoading}
                error={error}
                services={paginatedServices}
                onClearAll={clearAllFilters}
              />

              <ServicesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
