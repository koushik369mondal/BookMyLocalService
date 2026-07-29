import React from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const locations = [
  "All Locations",
  "Brooklyn, NY",
  "Queens, NY",
  "Manhattan, NY",
  "Bronx, NY",
  "Staten Island, NY"
];

export function ServicesHero({
  heroSearch,
  setHeroSearch,
  heroLocation,
  setHeroLocation,
  onSearchSubmit
}) {
  return (
    <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#E8DCC3] py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C4B3E]/10 border border-[#8C4B3E]/20 text-[#8C4B3E] text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-[#8C4B3E] animate-pulse"></span>
            Verified Local Service Directory
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F1D1A] tracking-tight">
            Explore Verified <span className="text-[#8C4B3E]">Local Professionals</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5146] font-medium leading-relaxed">
            Browse top-rated electricians, plumbers, cleaners, and contractors in your area. Read authentic reviews and book instantly.
          </p>

          <form onSubmit={onSearchSubmit} className="bg-white p-2 rounded-2xl border border-[#E8DCC3] shadow-md flex flex-col sm:flex-row items-center gap-2 pt-2 sm:pt-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266]" />
              <Input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search service title or provider..."
                className="pl-10 h-10 border-0 bg-transparent text-xs focus-visible:ring-0 placeholder:text-[#7A7266]"
              />
            </div>

            <div className="h-6 w-[1px] bg-[#E8DCC3] hidden sm:block"></div>

            <div className="relative w-full sm:w-44">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266]" />
              <select
                value={heroLocation}
                onChange={(e) => setHeroLocation(e.target.value)}
                className="w-full pl-10 pr-3 h-10 border-0 bg-transparent text-xs font-semibold text-[#1F1D1A] focus:outline-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc === "All Locations" ? "all" : loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full sm:w-auto h-10 px-5 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
