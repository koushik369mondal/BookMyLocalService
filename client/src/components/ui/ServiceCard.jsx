import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Zap, 
  ArrowRight
} from "lucide-react";
import { prefersReducedMotion } from "@/utils/motion";

export function ServiceCard({ service, ctaText = "Book Now", ctaLink }) {
  if (!service) return null;

  // Standardize property names from backend or mock schemas
  const id = service.id;
  const title = service.name || service.title || "Local Service";
  const category = service.category || "Service";
  const providerName = service.providerName || service.name || service.provider?.fullName || "Verified Provider";
  const providerAvatar = service.providerImage || service.provider?.avatar || service.image;
  const location = service.location || "Local Area";
  const rating = service.rating ? Number(service.rating).toFixed(1) : "5.0";
  const reviewsCount = service.reviewsCount || service.reviewCount || service.reviews || 0;
  const price = service.price || 0;
  
  // Format price type nicely
  let priceType = service.priceType || "/hr";
  if (priceType && !priceType.startsWith("/")) {
    priceType = `/${priceType}`;
  }

  const image = service.image || service.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80";
  const description = service.description || "Professional and reliable local service provider ready to assist with your needs.";
  const availability = service.availability || "all";
  const badge = service.badge;

  // Determine link destination
  const destination = ctaLink || (id ? `/booking?serviceId=${id}` : "/booking");

  return (
    <motion.div 
      whileHover={prefersReducedMotion ? {} : { y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
    >
      
      {/* Image Thumbnail Header */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Primary Badge (e.g. Top Rated / Featured) */}
        {badge && (
          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
            {badge}
          </span>
        )}

        {/* Status Chips Overlay */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {availability === "today" && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs flex items-center gap-1">
              <Zap className="h-3 w-3 fill-current" /> Available Today
            </span>
          )}
          <span className="bg-slate-900/85 text-slate-100 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs border border-white/10 uppercase tracking-wider">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors duration-200 line-clamp-1 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
          {description}
        </p>

        {/* Metadata Bar (Location & Rating) */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mt-0.5">
          <div className="flex items-center gap-1 truncate text-slate-500 font-medium">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-slate-900 px-2 py-0.5 rounded-md shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-xs">{rating}</span>
            {reviewsCount > 0 && (
              <span className="text-[10px] text-slate-500 font-medium">({reviewsCount})</span>
            )}
          </div>
        </div>

        {/* Provider Profile Snippet & Verified Badge */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
          <img
            src={providerAvatar}
            alt={providerName}
            className="h-6 w-6 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <span className="text-xs font-semibold text-slate-700 truncate">{providerName}</span>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 ml-auto" title="Verified Provider" />
        </div>

        {/* Price & CTA Button Footer */}
        <div className="border-t border-slate-100 pt-3.5 mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">${price}</span>
              <span className="text-xs font-medium text-slate-500">{priceType}</span>
            </div>
          </div>

          <NavLink to={destination} className="shrink-0">
            <Button className="h-[44px] px-4.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 flex items-center gap-1.5">
              <span>{ctaText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 duration-200" />
            </Button>
          </NavLink>
        </div>

      </div>
    </motion.div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white flex flex-col h-full shadow-xs">
      <Skeleton className="aspect-16/9 w-full rounded-t-2xl rounded-b-none" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <div className="flex items-center justify-between gap-2 pt-1">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        <div className="border-t border-slate-100 pt-3.5 mt-auto flex items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="h-3 w-10 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <Skeleton className="h-[44px] w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
