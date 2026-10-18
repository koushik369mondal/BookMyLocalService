import React, { useState, useEffect } from "react";
import { ServiceImagePlaceholder } from "@/components/ui/ServiceImagePlaceholder";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Layers,
  Users,
  ArrowRight,
  ShieldAlert,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { categoriesService } from "@/services/categoriesService";
import { getCategoryIconComponent } from "@/utils/categoryIconMap";
import { fadeInUp, staggerContainer } from "@/utils/motion";
import AnimatedBadge from "@/components/ui/AnimatedBadge";

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
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Page Header */}
        <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 text-center flex flex-col items-center gap-4">
            <AnimatedBadge>
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Full service taxonomy</span>
            </AnimatedBadge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground max-w-2xl">
              Service categories
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              Find verified professionals for every household and business need with{" "}
              <span className="highlight">dedicated trade specializations</span>.
            </p>

            {/* Search Input */}
            <div className="w-full max-w-md card-chai p-1.5 flex items-center mt-2">
              <Search className="size-4 text-muted-foreground ml-3 shrink-0" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search categories"
                className="h-9 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none"
              />
            </div>
          </div>
        </section>

        {/* Categories Grid Container */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-chai overflow-hidden flex flex-col">
                  <Skeleton className="aspect-video w-full bg-card/60" />
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <Skeleton className="h-4 w-20 bg-card/60" />
                    <Skeleton className="h-5 w-3/4 bg-card/60" />
                    <Skeleton className="h-3 w-full bg-card/60" />
                    <Skeleton className="h-8 w-full mt-auto bg-card/60 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="card-chai p-12 text-center flex flex-col items-center gap-3 max-w-md mx-auto">
              <div className="p-3 rounded-full border border-red-500/20 bg-red-500/5 text-red-500">
                <ShieldAlert className="size-6" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">
                Failed to load categories
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">{error}</p>
              <Button
                onClick={fetchCategories}
                variant="default"
                size="sm"
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Dynamic Categories Grid */}
          {!loading && !error && filteredCategories.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.06, 0)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCategories.map((category) => {
                const IconComponent = getCategoryIconComponent(category.icon);

                return (
                  <motion.div
                    key={category.id || category.name}
                    variants={fadeInUp}
                  >
                    <article className="card-chai group overflow-hidden flex flex-col h-full sm:opacity-90 sm:hover:opacity-100 transition-all">
                      {/* Photo Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-card/60 border-b border-border/60">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <ServiceImagePlaceholder title={category.name} />
                        )}

                        <span className="absolute bottom-2.5 right-2.5 text-[11px] font-medium px-2.5 py-0.5 rounded border border-border/80 bg-card/90 text-foreground backdrop-blur-md">
                          {category.name}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <IconComponent className="size-3.5" />
                          <span>Specialization</span>
                        </div>

                        <div>
                          <h3 className="font-display font-semibold text-base text-foreground group-hover:text-brand transition-colors line-clamp-1">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        </div>

                        {/* Counts */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mt-auto border-t border-border/60 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Layers className="size-3.5 text-muted-foreground" />
                            <span>{category.serviceCount || 0} services</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="size-3.5 text-muted-foreground" />
                            <span>{category.providerCount || 0} providers</span>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="pt-2 border-t border-border/60">
                          <Button
                            onClick={() => handleExplore(category.name)}
                            variant="default"
                            size="sm"
                            className="w-full justify-center font-display font-semibold text-xs"
                          >
                            <span>Explore services</span>
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Empty Search */}
          {!loading && !error && filteredCategories.length === 0 && (
            <div className="card-chai p-12 text-center flex flex-col items-center gap-3 max-w-md mx-auto">
              <Info className="size-6 text-muted-foreground" />
              <h3 className="font-display text-base font-semibold text-foreground">
                No categories found
              </h3>
              <p className="text-xs text-muted-foreground">
                No categories matched "{searchQuery}". Try a different keyword or reset the search.
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
