import React, { useState, useEffect } from "react";
import { Star, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoriesService } from "@/services/categoriesService";

export function ServicesFilters({
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
  onClearAll,
}) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesService.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to load filter categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="card-chai p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-muted-foreground" />
          <span>Filters</span>
        </h3>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-brand transition-colors cursor-pointer font-medium"
        >
          Clear all
        </button>
      </div>

      {/* Categories Multi-Select */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold text-foreground">
          Categories
        </Label>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
              <Loader2 className="size-3.5 animate-spin" /> Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              No categories available
            </span>
          ) : (
            categories.map((cat) => {
              const catName = typeof cat === "string" ? cat : cat.name;
              const isChecked = selectedCategories.includes(catName);
              return (
                <label
                  key={cat.id || catName}
                  className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1 select-none"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(catName)}
                      className="rounded border-border text-foreground focus:ring-0 size-3.5 accent-neutral-800 dark:accent-neutral-200"
                    />
                    <span className="truncate">{catName}</span>
                  </div>
                  {cat.serviceCount !== undefined && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {cat.serviceCount}
                    </span>
                  )}
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2.5 pt-4 border-t border-border/70">
        <Label className="text-xs font-semibold text-foreground">
          Price range (₹ INR)
        </Label>
        <div className="space-y-1.5">
          {[
            { id: "all", label: "All prices" },
            { id: "under-50", label: "Under ₹500" },
            { id: "50-100", label: "₹500 to ₹1,500" },
            { id: "100-plus", label: "₹1,500 and above" },
            { id: "custom", label: "Custom range" },
          ].map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer py-0.5 select-none"
            >
              <input
                type="radio"
                name="priceRange"
                checked={priceRange === option.id}
                onChange={() => setPriceRange(option.id)}
                className="text-foreground focus:ring-0 size-3.5 accent-neutral-800 dark:accent-neutral-200"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {priceRange === "custom" && (
          <div className="flex items-center gap-2 pt-2">
            <Input
              type="number"
              placeholder="Min ₹"
              value={customMinPrice}
              onChange={(e) => setCustomMinPrice(e.target.value)}
              className="h-8 text-xs bg-card/40 border-border rounded-md"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max ₹"
              value={customMaxPrice}
              onChange={(e) => setCustomMaxPrice(e.target.value)}
              className="h-8 text-xs bg-card/40 border-border rounded-md"
            />
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-border/70">
        <Label className="text-xs font-semibold text-foreground">
          Minimum rating
        </Label>
        <div className="flex items-center gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(r)}
              className={`flex-1 h-8 rounded-md text-xs font-medium flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                minRating === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 text-muted-foreground border-border hover:text-foreground hover:bg-card"
              }`}
            >
              {r === 0 ? "Any" : `${r}+`}
              {r > 0 && <Star className="size-3 fill-amber-500 text-amber-500" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
