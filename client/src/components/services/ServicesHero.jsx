import React from "react";
import { Search, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedBadge from "@/components/ui/AnimatedBadge";

const locations = [
  "All locations",
  "Kolkata, WB",
  "Delhi NCR",
  "Mumbai, MH",
  "Bengaluru, KA",
  "Hyderabad, TS",
  "Chennai, TN",
  "Pune, MH",
  "Jaipur, RJ",
  "Siliguri, WB",
  "Jalpaiguri, WB",
];

export function ServicesHero({
  heroSearch,
  setHeroSearch,
  heroLocation,
  setHeroLocation,
  onSearchSubmit,
}) {
  return (
    <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl space-y-4">
          <AnimatedBadge>
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Verified service directory</span>
          </AnimatedBadge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
            Explore verified local professionals
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            Browse top-rated electricians, plumbers, home cleaners, and appliance technicians with{" "}
            <span className="highlight">guaranteed upfront pricing</span>.
          </p>

          <form
            onSubmit={onSearchSubmit}
            className="card-chai p-2 flex flex-col sm:flex-row items-stretch gap-2 mt-4 max-w-2xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search service title or provider..."
                aria-label="Search service title or provider"
                className="pl-9 h-10 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none"
              />
            </div>

            <div className="hidden sm:block w-px bg-border/80 my-1.5" />

            <div className="relative w-full sm:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <select
                value={heroLocation}
                onChange={(e) => setHeroLocation(e.target.value)}
                aria-label="Filter by location"
                className="w-full pl-9 pr-4 h-10 border-0 bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option
                    key={loc}
                    value={loc === "All locations" ? "all" : loc}
                    className="bg-card text-foreground"
                  >
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="default"
              size="default"
              className="h-10 px-5 shrink-0"
            >
              Search
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
