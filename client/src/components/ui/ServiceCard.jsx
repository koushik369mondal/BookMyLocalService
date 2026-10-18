import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { ProviderAvatar } from "@/components/ui/avatar";
import { formatPrice } from "@/utils/currency";
import { ServiceImage } from "@/components/common/ServiceImage";

export function ServiceCard({ service, ctaText = "Book now", ctaLink }) {
  if (!service) return null;

  const id = service.id;
  const title = service.title || service.name || "Local service";
  const category =
    typeof service.category === "object"
      ? service.category?.name || "Service"
      : service.category || "Service";
  const providerName =
    service.providerName ||
    service.provider?.fullName ||
    service.provider?.name ||
    "Verified provider";
  const providerId = service.providerId || service.provider?.id;

  const location = service.location || "Local area";
  const rating = service.rating ? Number(service.rating).toFixed(1) : "5.0";
  const reviewsCount =
    service.reviewsCount || service.reviewCount || service.reviews || 0;
  const price = service.price || 0;

  let priceType = service.priceType || "/hr";
  if (priceType && !priceType.startsWith("/")) {
    priceType = `/${priceType}`;
  }

  const description =
    service.description ||
    "Professional and reliable local service ready to assist.";
  const badge = service.badge;
  const destination = ctaLink || (id ? `/booking?serviceId=${id}` : "/booking");

  const providerSnippet = (
    <>
      <ProviderAvatar
        provider={service.provider || service}
        name={providerName}
        className="size-5 rounded-full border border-border/80 shrink-0"
      />
      <span className="text-xs font-medium text-foreground group-hover/provider:text-brand transition-colors truncate">
        {providerName}
      </span>
      <ShieldCheck
        className="size-3.5 text-emerald-500 shrink-0 ml-auto"
        title="Verified provider"
      />
    </>
  );

  return (
    <article className="card-chai group flex flex-col overflow-hidden sm:opacity-90 sm:hover:opacity-100 h-full">
      {/* Image Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-card/60 shrink-0 border-b border-border/60">
        <ServiceImage
          service={service}
          alt={title}
          width={600}
          height={350}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Primary Badge */}
        {badge && (
          <span className="absolute top-2.5 left-2.5 z-10 rounded border border-border/70 bg-card/90 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md">
            {badge}
          </span>
        )}

        {/* Category Overlay */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="rounded border border-border/70 bg-card/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-md">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Title */}
        <h3 className="font-display text-base leading-snug font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Metadata Bar (Location & Rating) */}
        <div className="flex items-center justify-between gap-2 text-xs border-y border-border/60 py-2 my-0.5 text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 font-display">
            <Star className="size-3 fill-amber-500 text-amber-500" />
            <span className="font-semibold text-foreground text-xs">{rating}</span>
            {reviewsCount > 0 && (
              <span className="text-[11px] text-muted-foreground">({reviewsCount})</span>
            )}
          </div>
        </div>

        {/* Provider Profile Info */}
        <div className="pt-0.5">
          {providerId ? (
            <NavLink
              to={`/providers/${providerId}`}
              className="inline-flex items-center gap-2 max-w-full rounded-md hover:bg-card/60 transition-colors group/provider p-1 -ml-1"
              title={`View ${providerName}'s profile`}
            >
              {providerSnippet}
            </NavLink>
          ) : (
            <div className="flex items-center gap-2 max-w-full p-1 -ml-1">
              {providerSnippet}
            </div>
          )}
        </div>

        {/* Pricing & Soft Button Action */}
        <div className="flex items-end justify-between gap-3 pt-3 mt-auto border-t border-border/60">
          <div>
            <span className="text-[10px] text-muted-foreground block">
              From
            </span>
            <div className="flex items-baseline gap-1 font-display">
              <span className="text-base font-semibold text-foreground tracking-tight">
                {formatPrice(price, { decimals: true })}
              </span>
              <span className="text-xs text-muted-foreground">{priceType}</span>
            </div>
          </div>

          <NavLink to={destination} className="shrink-0">
            <Button
              variant="default"
              size="sm"
              className="font-display font-semibold text-xs h-8 px-3.5"
            >
              {ctaText}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </NavLink>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="card-chai overflow-hidden flex flex-col h-full">
      <Skeleton className="aspect-video w-full bg-card/60" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 bg-card/60" />
          <Skeleton className="h-3 w-full bg-card/60" />
          <Skeleton className="h-3 w-2/3 bg-card/60" />
        </div>
        <div className="space-y-3 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-1/3 bg-card/60" />
            <Skeleton className="h-3 w-1/4 bg-card/60" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3 bg-card/60" />
            <Skeleton className="h-8 w-20 bg-card/60 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
