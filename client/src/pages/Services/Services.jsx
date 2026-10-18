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
    clearAllFilters,
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

      <div className="py-10 sm:py-14 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
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
              {/* Toolbar */}
              <div className="card-chai p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">
                  Showing{" "}
                  <strong className="text-foreground font-mono">
                    {paginatedServices.length}
                  </strong>{" "}
                  services
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort services"
                    className="text-xs font-medium text-foreground bg-card/60 border border-border/80 rounded-md px-2.5 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="popularity" className="bg-card text-foreground">
                      Most popular
                    </option>
                    <option value="rating" className="bg-card text-foreground">
                      Highest rated
                    </option>
                    <option value="price-asc" className="bg-card text-foreground">
                      Price: low to high
                    </option>
                    <option value="price-desc" className="bg-card text-foreground">
                      Price: high to low
                    </option>
                    <option value="newest" className="bg-card text-foreground">
                      Newest first
                    </option>
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
