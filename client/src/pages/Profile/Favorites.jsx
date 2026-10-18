import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ProviderAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Trash2, Calendar, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const mockFavorites = [];

export default function Favorites() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Favorites</h1>
            <p className="text-neutral-400 text-xs mt-1">
              Quickly rebook your preferred local experts and providers
            </p>
          </div>
        </div>

        {/* FAVORITES GRID */}
        <div className="card-chai p-6 space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h2 className="text-base font-bold text-white">Saved professionals</h2>
            <p className="text-xs text-neutral-400">Your curated list of reliable local experts</p>
          </div>

          {mockFavorites.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No favorites saved yet</p>
              <p className="text-xs text-neutral-400 mt-1">Bookmark providers while browsing to view them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockFavorites.map((provider) => (
                <div key={provider.id} className="card-chai p-5 relative flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <ProviderAvatar
                      provider={provider}
                      className="w-14 h-14 border border-white/10"
                      size={120}
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white">{provider.name}</h4>
                      <span className="inline-block text-[10px] font-medium text-neutral-300 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/10">
                        {typeof provider.category === "object" ? (provider.category?.name || "General") : (provider.category || "General")}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mt-1">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mt-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{provider.rating} ({provider.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-5 flex items-center justify-between flex-wrap gap-2.5">
                    <Link to="/booking">
                      <Button variant="solid" size="xs" className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Rebook now
                      </Button>
                    </Link>
                    <Button variant="ghost" size="xs" className="text-red-400 hover:bg-red-500/10 flex items-center gap-1">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
