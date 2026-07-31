import React from "react";
import { Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories = [
  "Home Cleaning",
  "Plumbing",
  "Electrical",
  "Moving & Packing",
  "Lawn & Garden",
  "Wellness & Personal"
];

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
  onClearAll
}) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-[#E8DCC3] shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DCC3]">
        <h3 className="text-sm font-extrabold text-[#1F1D1A] flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#8C4B3E]" />
          Filter Services
        </h3>
        <Button variant="ghost" onClick={onClearAll} className="h-8 text-[11px] font-bold text-[#8C4B3E] hover:text-[#783E33] hover:bg-[#8C4B3E]/5 px-2">
          Clear All
        </Button>
      </div>

      {/* Categories Multi-Select */}
      <div className="space-y-2.5">
        <Label className="text-xs font-bold text-[#1F1D1A]">Category</Label>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label key={cat} className="flex items-center gap-2.5 text-xs text-[#5A5146] font-medium cursor-pointer hover:text-[#1F1D1A]">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat)}
                  className="rounded border-[#E8DCC3] text-[#8C4B3E] focus:ring-[#8C4B3E] h-4 w-4"
                />
                <span>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#E8DCC3]">
        <Label className="text-xs font-bold text-[#1F1D1A]">Price Range (₹ INR)</Label>
        <div className="space-y-1.5">
          {[
            { id: "all", label: "All Prices" },
            { id: "under-50", label: "Under ₹500" },
            { id: "50-100", label: "₹500 - ₹1,500" },
            { id: "100-plus", label: "₹1,500+" },
            { id: "custom", label: "Custom Range" }
          ].map((option) => (
            <label key={option.id} className="flex items-center gap-2.5 text-xs text-[#5A5146] font-medium cursor-pointer hover:text-[#1F1D1A]">
              <input
                type="radio"
                name="priceRange"
                checked={priceRange === option.id}
                onChange={() => setPriceRange(option.id)}
                className="text-[#8C4B3E] focus:ring-[#8C4B3E] h-4 w-4"
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
              className="h-8 text-xs border-[#E8DCC3] rounded-lg"
            />
            <span className="text-xs text-[#7A7266]">-</span>
            <Input
              type="number"
              placeholder="Max ₹"
              value={customMaxPrice}
              onChange={(e) => setCustomMaxPrice(e.target.value)}
              className="h-8 text-xs border-[#E8DCC3] rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#E8DCC3]">
        <Label className="text-xs font-bold text-[#1F1D1A]">Minimum Rating</Label>
        <div className="flex items-center gap-1">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(r)}
              className={`flex-1 h-8 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                minRating === r
                  ? "bg-[#8C4B3E] text-white border-[#8C4B3E]"
                  : "bg-[#FAF6F0] text-[#5A5146] border-[#E8DCC3] hover:border-[#8C4B3E]"
              }`}
            >
              {r === 0 ? "Any" : `${r}+ `}
              {r > 0 && <Star className="h-3 w-3 fill-current" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
