import React from "react";
import { NavLink } from "react-router-dom";
import { ShieldCheck, Star } from "lucide-react";
import { ProviderAvatar } from "@/components/ui/avatar";

export default function ProviderSummaryCard({ provider, serviceTitle, className = "" }) {
  const name = typeof provider === "object"
    ? (provider?.fullName || provider?.name || "Assigned Specialist")
    : (typeof provider === "string" ? provider : "Assigned Specialist");

  const providerId = typeof provider === "object"
    ? (provider?.id || provider?._id || provider?.providerId)
    : null;

  const rating = typeof provider === "object" && provider?.rating ? provider.rating : "4.9";
  const jobsCount = typeof provider === "object" && provider?.totalJobs ? provider.totalJobs : "120+";

  const cardContent = (
    <div className={`flex items-center gap-3 p-3 card-chai hover:border-foreground/30 transition-colors ${className}`}>
      <ProviderAvatar
        provider={provider}
        name={name}
        className="size-10 rounded-full border border-border/80 shrink-0"
      />

      <div className="space-y-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h4 className="font-heading font-medium text-xs text-foreground truncate hover:text-brand transition-colors">{name}</h4>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground border border-border/80 bg-card px-1.5 py-0.5 rounded-md">
            <Star className="h-2.5 w-2.5 fill-brand text-brand" />
            {rating} ({jobsCount} jobs)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
          <ShieldCheck className="h-3 w-3 shrink-0" />
          <span>Verified local specialist</span>
        </div>
      </div>
    </div>
  );

  if (providerId) {
    return (
      <NavLink to={`/providers/${providerId}`} className="block">
        {cardContent}
      </NavLink>
    );
  }

  return cardContent;
}
