import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";
import { prefersReducedMotion } from "@/utils/motion";

export function ServiceCard({ service, ctaText = "Book Now", ctaLink }) {
  if (!service) return null;

  const id = service.id;
  const title = service.name || service.title || "Local Service";
  const category = service.category || "Service";
  const providerName = service.providerName || service.name || service.provider?.fullName || "Verified Provider";
  const providerAvatar = service.providerImage || service.provider?.avatar || service.image;
  const location = service.location || "Local Area";
  const rating = service.rating ? Number(service.rating).toFixed(1) : "5.0";
  const reviewsCount = service.reviewsCount || service.reviewCount || service.reviews || 0;
  const price = service.price || 0;
  
  let priceType = service.priceType || "/hr";
  if (priceType && !priceType.startsWith("/")) {
    priceType = `/${priceType}`;
  }

  const image = service.image || service.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80";
  const description = service.description || "Professional and reliable local service provider ready to assist with your needs.";
  const badge = service.badge;

  const destination = ctaLink || (id ? `/booking?serviceId=${id}` : "/booking");

  return (
    <motion.div 
      whileHover={prefersReducedMotion ? {} : { y: -3 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-[#E8DCC3] bg-white hover:border-[#C9A46A] transition-all duration-200 flex flex-col h-full relative shadow-2xs"
    >
      
      {/* Image Thumbnail Header */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-[#F0E7D5] shrink-0 border-b border-[#E8DCC3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Primary Badge */}
        {badge && (
          <span className="absolute top-3 left-3 bg-[#C9A46A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-[#E8DCC3] uppercase tracking-wider shadow-2xs">
            {badge}
          </span>
        )}

        {/* Category Overlay */}
        <div className="absolute top-3 right-3">
          <span className="bg-[#FAF6F0] text-[#1F1D1A] border border-[#E8DCC3] text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col gap-3 flex-1 bg-white">
        
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#1F1D1A] group-hover:text-[#C9A46A] transition-colors duration-200 line-clamp-1 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#5A5146] line-clamp-2 leading-relaxed font-normal">
          {description}
        </p>

        {/* Metadata Bar (Location & Rating) */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#7A7266] mt-0.5">
          <div className="flex items-center gap-1.5 truncate font-medium text-[#7A7266]">
            <MapPin className="h-3.5 w-3.5 text-[#8C4B3E] shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#F0E7D5] border border-[#E8DCC3] text-[#1F1D1A] px-2 py-0.5 rounded-md shrink-0">
            <Star className="h-3.5 w-3.5 fill-[#C9A46A] text-[#C9A46A]" />
            <span className="font-bold text-xs">{rating}</span>
            {reviewsCount > 0 && (
              <span className="text-[10px] text-[#7A7266] font-medium">({reviewsCount})</span>
            )}
          </div>
        </div>

        {/* Provider Profile Snippet & Verified Badge */}
        <div className="flex items-center gap-2 pt-2.5 border-t border-[#E8DCC3] mt-1">
          <img
            src={providerAvatar}
            alt={providerName}
            className="h-6 w-6 rounded-full object-cover border border-[#E8DCC3] shrink-0"
          />
          <span className="text-xs font-bold text-[#1F1D1A] truncate">{providerName}</span>
          <ShieldCheck className="h-3.5 w-3.5 text-[#7DAB7D] shrink-0 ml-auto" title="Verified Provider" />
        </div>

        {/* Price & CTA Button Footer */}
        <div className="border-t border-[#E8DCC3] pt-3.5 mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-[#1F1D1A]">${price}</span>
              <span className="text-xs font-medium text-[#7A7266]">{priceType}</span>
            </div>
          </div>

          <NavLink to={destination} className="shrink-0">
            <Button className="h-[38px] px-4 bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold rounded-xl text-xs border border-[#E8DCC3] shadow-2xs flex items-center gap-1.5">
              <span>{ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 duration-200" />
            </Button>
          </NavLink>
        </div>

      </div>
    </motion.div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8DCC3] bg-white flex flex-col h-full shadow-2xs">
      <Skeleton className="aspect-16/9 w-full rounded-t-2xl rounded-b-none bg-[#F0E7D5]" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Skeleton className="h-5 w-3/4 rounded-md bg-[#F0E7D5]" />
        <Skeleton className="h-4 w-full rounded-md bg-[#F0E7D5]" />
        <Skeleton className="h-4 w-5/6 rounded-md bg-[#F0E7D5]" />
        <div className="flex items-center justify-between gap-2 pt-1">
          <Skeleton className="h-4 w-24 rounded-md bg-[#F0E7D5]" />
          <Skeleton className="h-5 w-14 rounded-md bg-[#F0E7D5]" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-[#E8DCC3]">
          <Skeleton className="h-6 w-6 rounded-full bg-[#F0E7D5]" />
          <Skeleton className="h-4 w-28 rounded-md bg-[#F0E7D5]" />
        </div>
        <div className="border-t border-[#E8DCC3] pt-3.5 mt-auto flex items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="h-3 w-10 rounded-md bg-[#F0E7D5]" />
            <Skeleton className="h-6 w-16 rounded-md bg-[#F0E7D5]" />
          </div>
          <Skeleton className="h-[38px] w-24 rounded-xl bg-[#F0E7D5]" />
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
