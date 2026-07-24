import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const mockFavorites = [
  {
    id: 1,
    name: "Sarah Jenkins",
    category: "Home Cleaning",
    rating: 4.9,
    reviews: 142,
    location: "Brooklyn, NY",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    phone: "+1 (555) 019-2834"
  },
  {
    id: 2,
    name: "David Miller",
    category: "Plumbing Services",
    rating: 4.8,
    reviews: 98,
    location: "Queens, NY",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone: "+1 (555) 019-5839"
  }
];

export default function Favorites() {
  return (
    <DashboardLayout>
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-violet-950 via-violet-800 to-violet-950 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">My Favorites</h1>
          <p className="text-[#7A7266] text-xs mt-1.5 font-medium">Quickly rebook your preferred local experts and providers</p>
        </div>
      </section>

      {/* FAVORITES GRID */}
      <div className="space-y-6">
        <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-stone-50">
            <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Saved Professionals</CardTitle>
            <CardDescription className="text-xs">Your curated list of reliable local experts</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            {mockFavorites.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-[#7A7266]">No favorites saved yet</p>
                <p className="text-xs text-[#7A7266] mt-1">Bookmark providers to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockFavorites.map((provider) => (
                  <div key={provider.id} className="border border-[#5A5146]/20 p-5 rounded-2xl bg-white relative flex flex-col justify-between hover:border-stone-300 hover:shadow-sm transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14 border border-[#5A5146]/15 shadow-xs">
                        <AvatarImage src={provider.avatar} className="object-cover" />
                        <AvatarFallback>{provider.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-[#1F1D1A]">{provider.name}</h4>
                        <span className="inline-block text-[10px] font-bold text-[#1F1D1A] bg-[#8C4B3E]/5 px-2 py-0.5 rounded-lg">
                          {provider.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[#7A7266] font-semibold mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#C9A46A] font-bold mt-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-[#C9A46A]" />
                          <span>{provider.rating} ({provider.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-stone-50 pt-4 mt-5 flex items-center justify-between flex-wrap gap-2.5">
                      <Link to="/booking">
                        <Button size="xs" className="bg-[#8C4B3E] hover:bg-black text-white rounded-xl h-8.5 text-[10px] font-bold flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Rebook Now
                        </Button>
                      </Link>
                      <Button variant="ghost" size="xs" className="text-rose-600 hover:bg-rose-50 rounded-xl h-8.5 text-[10px] font-bold flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
