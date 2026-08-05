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
    <div className={`flex items-center gap-3 p-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl hover:border-[#C9A46A] transition-colors ${className}`}>
      <ProviderAvatar
        provider={provider}
        name={name}
        className="w-11 h-11 rounded-full border border-[#E8DCC3] shrink-0 shadow-2xs"
      />

      <div className="space-y-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h4 className="font-extrabold text-xs text-[#1F1D1A] truncate hover:text-[#C9A46A] transition-colors">{name}</h4>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded-md">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
            {rating} ({jobsCount} jobs)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#2B522B] font-semibold">
          <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
          <span>Verified Local Specialist</span>
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
