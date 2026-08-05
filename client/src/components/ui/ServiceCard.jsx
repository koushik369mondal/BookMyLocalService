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
import { ProviderAvatar } from "@/components/ui/avatar";
import { formatPrice } from "@/utils/currency";
import { ServiceImage } from "@/components/ui/ServiceImage";

export function ServiceCard({ service, ctaText = "Book Now", ctaLink }) {
  if (!service) return null;

  const id = service.id;
  const title = service.title || service.name || "Local Service";
  const category = typeof service.category === "object" ? (service.category?.name || "Service") : (service.category || "Service");
  const providerName = service.providerName || service.provider?.fullName || service.provider?.name || "Verified Provider";
  const providerId = service.providerId || service.provider?.id;

  const location = service.location || "Local Area";
  const rating = service.rating ? Number(service.rating).toFixed(1) : "5.0";
  const reviewsCount = service.reviewsCount || service.reviewCount || service.reviews || 0;
  const price = service.price || 0;
  
  let priceType = service.priceType || "/hr";
  if (priceType && !priceType.startsWith("/")) {
    priceType = `/${priceType}`;
  }

  const description = service.description || "Professional and reliable local service provider ready to assist with your needs.";
  const badge = service.badge;

  const destination = ctaLink || (id ? `/booking?serviceId=${id}` : "/booking");

  const providerSnippet = (
    <>
      <ProviderAvatar
        provider={service.provider || service}
        name={providerName}
        className="h-6 w-6 rounded-full border border-[#E8DCC3] shrink-0"
      />
      <span className="text-xs font-bold text-[#1F1D1A] group-hover/provider:text-[#C9A46A] transition-colors truncate">{providerName}</span>
      <ShieldCheck className="h-3.5 w-3.5 text-[#7DAB7D] shrink-0 ml-auto" title="Verified Provider" />
    </>
  );

  return (
    <motion.div 
      whileHover={prefersReducedMotion ? {} : { y: -3 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-[#E8DCC3] bg-white hover:border-[#C9A46A] transition-all duration-200 flex flex-col h-full relative shadow-2xs"
    >
      
      {/* Image Thumbnail Header */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-[#F0E7D5] shrink-0 border-b border-[#E8DCC3]">
        <ServiceImage
          service={service}
          alt={title}
          width={600}
          height={350}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Primary Badge */}
        {badge && (
          <span className="absolute top-3 left-3 z-10 bg-[#C9A46A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-[#E8DCC3] uppercase tracking-wider shadow-2xs">
            {badge}
          </span>
        )}

        {/* Category Overlay */}
        <div className="absolute top-3 right-3 z-10">
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
        <div className="flex items-center justify-between gap-2 text-xs border-y border-[#E8DCC3] py-2 my-0.5 font-medium text-[#7A7266]">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-[#C9A46A] shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#E8DCC3]">
            <Star className="h-3.5 w-3.5 fill-[#C9A46A] text-[#C9A46A]" />
            <span className="font-bold text-[#1F1D1A]">{rating}</span>
            {reviewsCount > 0 && (
              <span className="text-[11px] text-[#7A7266]">({reviewsCount})</span>
            )}
          </div>
        </div>

        {/* Provider Profile Info Header */}
        <div className="pt-0.5">
          {providerId ? (
            <NavLink
              to={`/providers/${providerId}`}
              className="inline-flex items-center gap-2 max-w-full p-1.5 -ml-1.5 rounded-lg hover:bg-[#FAF6F0] transition-colors group/provider"
              title={`View ${providerName}'s full profile`}
            >
              {providerSnippet}
            </NavLink>
          ) : (
            <div className="flex items-center gap-2 max-w-full p-1.5 -ml-1.5">
              {providerSnippet}
            </div>
          )}
        </div>

        {/* Pricing & Call to Action Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 mt-auto border-t border-[#E8DCC3]">
          <div>
            <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Starts at</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#1F1D1A] tracking-tight">{formatPrice(price, { decimals: true })}</span>
              <span className="text-[11px] text-[#7A7266] font-medium">{priceType}</span>
            </div>
          </div>

          <NavLink to={destination} className="shrink-0">
            <Button 
              size="sm"
              className="bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs px-4 h-9 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {ctaText}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </NavLink>
        </div>

      </div>

    </motion.div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E8DCC3] bg-white overflow-hidden flex flex-col h-full shadow-2xs">
      <Skeleton className="aspect-16/9 w-full bg-[#FAF6F0]" />
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 bg-[#FAF6F0]" />
          <Skeleton className="h-3 w-full bg-[#FAF6F0]" />
          <Skeleton className="h-3 w-2/3 bg-[#FAF6F0]" />
        </div>
        <div className="space-y-3 pt-4 border-t border-[#E8DCC3]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3 bg-[#FAF6F0]" />
            <Skeleton className="h-4 w-1/4 bg-[#FAF6F0]" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3 bg-[#FAF6F0]" />
            <Skeleton className="h-9 w-24 bg-[#FAF6F0] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
